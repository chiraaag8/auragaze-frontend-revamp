"use client";

import { useLayoutEffect, useRef } from "react";
import heroManifest from "../../public/hero-frames-manifest.json";

interface ScrollHeroProps {
  posterSrc: string;
  children?: React.ReactNode;
}

interface FrameSet {
  id: string;
  count: number;
  width: number;
  fps: number;
  duration: number;
  ext: string;
  basePath: string;
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function getFrameSet(): FrameSet {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const set = heroManifest.sets.find((entry) => entry.id === (isMobile ? "mobile" : "desktop"));
  return (set ?? heroManifest.sets[0]) as FrameSet;
}

function frameUrl(set: FrameSet, index: number) {
  return `${set.basePath}/frame_${String(index + 1).padStart(4, "0")}.${set.ext}`;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  const sourceRatio = sourceWidth / sourceHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  let drawWidth: number;
  let drawHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (sourceRatio > canvasRatio) {
    drawHeight = canvasHeight;
    drawWidth = sourceWidth * (canvasHeight / sourceHeight);
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = canvasWidth;
    drawHeight = sourceHeight * (canvasWidth / sourceWidth);
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);
}

export default function ScrollHero({ posterSrc, children }: ScrollHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    const poster = posterRef.current;
    if (!section || !sticky || !canvas) return;

    const frameSet = getFrameSet();
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let cancelled = false;
    let scrollRange = getViewportHeight();
    let sectionTop = 0;
    let scrolling = false;
    let scrollEndTimer = 0;
    let tickId = 0;
    let frameCount = frameSet.count;
    let frameWidth = frameSet.width;
    let frameHeight = 0;
    let frames: (HTMLImageElement | null)[] = Array(frameCount).fill(null);
    let canvasReady = false;

    const syncLayout = () => {
      const vh = getViewportHeight();
      scrollRange = vh;
      sectionTop = section.offsetTop;
      sticky.style.height = `${vh}px`;
      section.style.height = `${vh * 2}px`;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(sticky.clientWidth * dpr);
      canvas.height = Math.round(sticky.clientHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };

    const getProgress = () => {
      if (scrollRange <= 0) return 0;
      const scrolled = window.scrollY - sectionTop;
      return Math.min(1, Math.max(0, scrolled / scrollRange));
    };

    const resolveFrame = (index: number) => {
      if (frames[index]) return frames[index];
      for (let i = index; i >= 0; i--) if (frames[i]) return frames[i];
      for (let i = index + 1; i < frameCount; i++) if (frames[i]) return frames[i];
      return null;
    };

    const drawAtProgress = (progress: number) => {
      if (!canvasReady) return;

      const exact = progress * (frameCount - 1);
      const low = Math.floor(exact);
      const high = Math.min(frameCount - 1, low + 1);
      const blend = exact - low;

      const imgLow = resolveFrame(low);
      if (!imgLow) return;

      if (!frameHeight) {
        frameHeight = imgLow.naturalHeight;
      }

      const imgHigh = high === low ? null : resolveFrame(high);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!imgHigh || blend < 0.001) {
        drawCover(ctx, imgLow, frameWidth, frameHeight, canvas.width, canvas.height);
        return;
      }

      ctx.globalAlpha = 1 - blend;
      drawCover(ctx, imgLow, frameWidth, frameHeight, canvas.width, canvas.height);
      ctx.globalAlpha = blend;
      drawCover(ctx, imgHigh, frameWidth, frameHeight, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    };

    const scrub = () => {
      drawAtProgress(getProgress());
    };

    const tick = () => {
      scrub();
      if (scrolling) tickId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!scrolling) {
        scrolling = true;
        tickId = requestAnimationFrame(tick);
      }
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => {
        scrolling = false;
        cancelAnimationFrame(tickId);
        scrub();
      }, 80);
    };

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            frames[index] = img;
            if (index === 0) {
              frameHeight = img.naturalHeight;
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(frameSet, index);
      });

    const loadFrames = async () => {
      await loadFrame(0);
      if (cancelled) return;

      canvasReady = true;
      canvas.style.visibility = "visible";
      if (poster) poster.style.opacity = "0";
      scrub();

      const rest = Array.from({ length: frameCount - 1 }, (_, i) => i + 1);
      const batchSize = 10;

      for (let i = 0; i < rest.length; i += batchSize) {
        if (cancelled) return;
        await Promise.all(rest.slice(i, i + batchSize).map(loadFrame));
      }
    };

    const onResize = () => {
      syncLayout();
      scrub();
    };

    syncLayout();
    void loadFrames();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(tickId);
      window.clearTimeout(scrollEndTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[200dvh]">
      <div
        ref={stickyRef}
        className="sticky top-0 relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden will-change-transform"
      >
        <img
          ref={posterRef}
          src={posterSrc}
          alt=""
          decoding="sync"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          aria-hidden
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full [transform:translateZ(0)]"
          style={{ visibility: "hidden" }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[30%]"
          aria-hidden
          style={{
            background: `linear-gradient(
              to bottom,
              color-mix(in srgb, var(--background) 42%, transparent) 0%,
              color-mix(in srgb, var(--background) 14%, transparent) 55%,
              transparent 100%
            )`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[34%]"
          aria-hidden
          style={{
            background: `linear-gradient(
              to top,
              color-mix(in srgb, var(--background) 48%, transparent) 0%,
              color-mix(in srgb, var(--background) 16%, transparent) 55%,
              transparent 100%
            )`,
          }}
        />

        {children}
      </div>
    </section>
  );
}
