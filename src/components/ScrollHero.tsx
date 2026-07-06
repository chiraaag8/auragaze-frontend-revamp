"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface ScrollHeroProps {
  videoSrc: string;
  mobileVideoSrc?: string;
  posterSrc: string;
  children?: React.ReactNode;
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

export default function ScrollHero({
  videoSrc,
  mobileVideoSrc,
  posterSrc,
  children,
}: ScrollHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoVisible, setVideoVisible] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const video = videoRef.current;
    if (!section || !sticky || !video) return;

    const resolvedSrc =
      mobileVideoSrc && window.matchMedia("(max-width: 768px)").matches
        ? mobileVideoSrc
        : videoSrc;
    video.src = resolvedSrc;
    video.load();

    let duration = 0;
    let ready = false;
    let rafId = 0;
    let scrollRange = getViewportHeight();
    let sectionTop = 0;
    let lastTargetTime = -1;

    const syncLayout = () => {
      const vh = getViewportHeight();
      scrollRange = vh;
      sectionTop = section.offsetTop;
      sticky.style.height = `${vh}px`;
      section.style.height = `${vh * 2}px`;
    };

    const scrub = () => {
      if (!ready || duration <= 0 || scrollRange <= 0) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

      const scrolled = window.scrollY - sectionTop;
      const progress = Math.min(1, Math.max(0, scrolled / scrollRange));
      const targetTime = progress * duration;

      if (Math.abs(targetTime - lastTargetTime) < 0.04) return;
      lastTargetTime = targetTime;

      if (typeof video.fastSeek === "function") {
        video.fastSeek(targetTime);
      } else {
        video.currentTime = targetTime;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(scrub);
    };

    const onReady = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      duration = video.duration;
      video.pause();
      ready = true;
      lastTargetTime = -1;
      setVideoVisible(true);
      scrub();
    };

    const onResize = () => {
      syncLayout();
      lastTargetTime = -1;
      scrub();
    };

    syncLayout();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplay", onReady);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onReady();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, [videoSrc, mobileVideoSrc]);

  return (
    <section ref={sectionRef} className="relative min-h-[200dvh]">
      <div
        ref={stickyRef}
        className="sticky top-0 relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden will-change-transform"
      >
        <img
          src={posterSrc}
          alt=""
          decoding="sync"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />

        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            videoVisible ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />

        {/* Two-sided vignette — contained inside hero, never reaches category */}
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
