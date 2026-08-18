import React, { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  X,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function ImageModalViewer({ src, alt = 'Image preview', isOpen, onClose, title }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Reset transform when opened
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') handleZoomIn();
      else if (e.key === '-' || e.key === '_') handleZoomOut();
      else if (e.key === '0') handleReset();
      else if (e.key === 'r' || e.key === 'R') handleRotateRight();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !src) return null;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.25, 0.5);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md select-none transition-opacity duration-200"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-950/80 border border-amber-600/50 px-2.5 py-1 rounded-lg">
            🔍 Image Inspector
          </span>
          {title && <span className="text-sm font-semibold text-stone-200 truncate max-w-md">{title}</span>}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-stone-800/80 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold border border-stone-600 transition flex items-center space-x-1"
            title="Reset (0)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset ({Math.round(scale * 100)}%)</span>
          </button>
          
          <a
            href={src}
            download="mandi-photo"
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-stone-800/80 hover:bg-stone-700 text-stone-200 rounded-xl border border-stone-600 transition"
            title="Open Original"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl border border-red-500 transition shadow-lg"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div
        ref={containerRef}
        className={`relative w-full h-full flex items-center justify-center overflow-hidden p-4 sm:p-12 ${
          scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            maxHeight: '85vh',
            maxWidth: '90vw'
          }}
          className="object-contain rounded-xl shadow-2xl pointer-events-auto select-none"
          draggable={false}
        />
      </div>

      {/* Bottom Floating Control Bar */}
      <div
        className="absolute bottom-6 inset-x-0 flex justify-center z-20 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-auto bg-stone-900/90 backdrop-blur-md border border-stone-700 px-4 py-2 rounded-2xl shadow-2xl flex items-center space-x-3 text-stone-200">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-2 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl transition disabled:opacity-40"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold text-amber-400 min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl transition disabled:opacity-40"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="w-px h-5 bg-stone-700 mx-1" />

          <button
            onClick={handleRotateLeft}
            className="p-2 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl transition"
            title="Rotate Left"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleRotateRight}
            className="p-2 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl transition"
            title="Rotate Right (R)"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <div className="w-px h-5 bg-stone-700 mx-1" />

          <button
            onClick={handleReset}
            className="p-2 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl transition"
            title="Fit to Screen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
