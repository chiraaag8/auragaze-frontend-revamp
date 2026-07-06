"use client";

import { useEffect } from "react";

const HERO_POSTER_SRC = "/hero-poster.jpg";

function preloadPoster() {
  if (document.querySelector(`link[rel="preload"][href="${HERO_POSTER_SRC}"]`)) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = HERO_POSTER_SRC;
  link.as = "image";
  link.type = "image/jpeg";
  document.head.appendChild(link);
}

export default function HeroPreload() {
  useEffect(() => {
    preloadPoster();
  }, []);

  return null;
}
