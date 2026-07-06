"use client";

import { useEffect } from "react";

const HERO_VIDEO_SRC = "/hero-scroll.mp4";
const HERO_POSTER_SRC = "/hero-poster.jpg";

function preloadAsset(href: string, as: string, type?: string) {
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
    preloadAsset(HERO_POSTER_SRC, "image");
    preloadAsset(HERO_VIDEO_SRC, "video", "video/mp4");
  }, []);

  return null;
}
