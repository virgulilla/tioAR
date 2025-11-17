import React from "react";

/**
 * angle: grados (0 = norte)
 */
export default function BigArrow({ angle = 0 }) {
  // Convertimos bearing a rotación CSS (0deg apunta arriba)
  const rot = angle;
  return (
    <div className="arrow-wrap" style={{ transform: `rotate(${rot}deg)` }}>
      {/* Flecha cartoon SVG */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <g transform="translate(60,60)">
          <path
            d="M0,-44 L18,8 L6,8 L6,44 L-6,44 L-6,8 L-18,8 Z"
            fill="url(#g1)"
            stroke="#fff"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle r="10" fill="#fff" stroke="#06b6d4" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}
