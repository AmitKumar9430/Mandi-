import React from 'react';

export default function AshokaStambhaEmblem({ width = 52, height = 68, className = "" }) {
  return (
    <div className={`flex items-center justify-center select-none flex-shrink-0 ${className}`}>
      <img
        src="/emblem.png"
        alt="State Emblem of India - Ashoka Lion Capital"
        style={{ width: `${width}px`, height: 'auto', maxHeight: `${height + 15}px` }}
        className="object-contain filter contrast-125 hover:opacity-95 transition"
      />
    </div>
  );
}
