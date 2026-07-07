"use client";

import { useEffect } from "react";

const HERO_POSTER_SRC = "/hero-poster.jpg";

function preload(href: string, as: string, type?: string) {
  if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
}

export default function HeroPreload() {
  useEffect(() => {
    preload(HERO_POSTER_SRC, "image", "image/jpeg");

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const firstFrame = isMobile
      ? "/hero-frames-mobile/frame_0001.webp"
      : "/hero-frames/frame_0001.webp";
    preload(firstFrame, "image", "image/webp");
  }, []);

  return null;
}
