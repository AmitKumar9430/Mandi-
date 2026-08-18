import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, X, Maximize2 } from 'lucide-react';

export default function ImageLightboxModal({ src, alt = 'Image preview', onClose }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!src) return null;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fadeIn">
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-xl flex items-center justify-between bg-stone-900/90 text-white px-4 py-2.5 rounded-2xl border border-stone-700 shadow-2xl z-20">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 bg-stone-800 hover:bg-stone-700 rounded-xl transition flex items-center space-x-1 text-xs font-bold"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-emerald-400" />
            <span>+ Zoom In</span>
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 bg-stone-800 hover:bg-stone-700 rounded-xl transition flex items-center space-x-1 text-xs font-bold"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-emerald-400" />
            <span>- Zoom Out</span>
          </button>

          <button
            type="button"
            onClick={handleRotate}
            className="p-2 bg-stone-800 hover:bg-stone-700 rounded-xl transition text-xs font-bold"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 bg-stone-800 hover:bg-stone-700 rounded-xl transition text-xs text-stone-300 font-bold"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold text-emerald-400">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow transition"
            title="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Image Canvas with Pan & Zoom */}
      <div className="flex-1 w-full flex items-center justify-center overflow-auto p-4 select-none">
        <img
          src={src}
          alt={alt}
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: 'transform 0.15s ease-out'
          }}
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing border border-white/10"
        />
      </div>

      {/* Bottom Hint */}
      <div className="text-stone-400 text-xs py-1">
        <span>Click anywhere outside or press Close to exit</span>
      </div>
    </div>
  );
}
