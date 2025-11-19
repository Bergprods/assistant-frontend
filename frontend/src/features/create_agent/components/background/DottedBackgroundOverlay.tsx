import React, { useRef, useLayoutEffect, useState } from "react";

// Props: zoom, x (panX), y (panY), opacity, baseSpacing
// Default: zoom=1, x=0, y=0, opacity=0.12, baseSpacing=24
// Fyller workspace med prickar, transparent bakgrund, ingen logik

type Props = {
  zoom: number;
  x?: number;
  y?: number;
  opacity?: number;
  baseSpacing?: number;
  containerWidth?: number;
  containerHeight?: number;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function DottedBackgroundOverlay({
  zoom,
  x = 0,
  y = 0,
  opacity = 0.12,
  baseSpacing = 24,
  containerWidth,
  containerHeight,
}: Props) {
  // spacing = px mellan prickar vid aktuell zoom
  const spacing = Math.max(1, baseSpacing * zoom);
  // positionera prickarna så att pan (x/y) flyttar mönstret
  const posX = mod(x * zoom, spacing);
  const posY = mod(y * zoom, spacing);

  // Om containerWidth/containerHeight ges, använd dem, annars 100%
  return (
    <div
      className="absolute left-0 top-0 pointer-events-none"
      style={{
        width: containerWidth ? `${containerWidth}px` : "100%",
        height: containerHeight ? `${containerHeight}px` : "100%",
        backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        backgroundPosition: `${posX}px ${posY}px`,
        color: "rgba(255,255,255,1)",
        opacity,
        zIndex: 0,
      }}
    />
  );
}