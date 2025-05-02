import React from 'react';

interface AbdullahiLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function AbdullahiLogo({ width = 200, height = 200, className = '' }: AbdullahiLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle with gradient */}
      <circle cx="100" cy="100" r="100" fill="url(#abdullahi-gradient)" />
      
      {/* Inner black circle */}
      <circle cx="100" cy="100" r="70" fill="black" />
      
      {/* "A" letter */}
      <path
        d="M84.5 64H115.5L133 136H117L113 120H87L83 136H67L84.5 64ZM100 80L91 104H109L100 80Z"
        fill="white"
      />
      
      {/* Define the gradient */}
      <defs>
        <linearGradient id="abdullahi-gradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5B21B6" />
          <stop offset="0.5" stopColor="#DB2777" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
      </defs>
    </svg>
  );
} 