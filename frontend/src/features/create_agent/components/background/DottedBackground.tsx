import React from "react";

type Props = {
  zoom: number;
  x?: number; // pan X i världens koordinater
  y?: number; // pan Y i världens koordinater
  opacity?: number;
  baseSpacing?: number; // px mellan prickar vid zoom=1
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function DottedBackgroundOverlay({
  zoom,
  x = 0,
  y = 0,
  opacity = 0.12,
  baseSpacing = 24,
}: Props) {
  const spacing = Math.max(1, baseSpacing * zoom); // undvik 0/neg
  const posX = mod(x * zoom, spacing);
  const posY = mod(y * zoom, spacing);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        // prickar som alltid fyller skärmen
        backgroundImage:
          `radial-gradient(currentColor 1px, transparent 1px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        backgroundPosition: `${posX}px ${posY}px`,
        color: "rgba(255,255,255,1)",
        opacity,
        zIndex: 0,
      }}
    />
  );
}