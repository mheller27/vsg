import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface MapBottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  snapPoints: {
    closed: number;
    partial: number;
    full: number;
  };
  maxHeight: number;
}

const MapBottomSheet: React.FC<MapBottomSheetProps> = ({
  children,
  isOpen,
  onClose,
  snapPoints,
  maxHeight,
}) => {
  const [currentSnap, setCurrentSnap] = useState<'closed' | 'partial' | 'full'>('closed');
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const snapPointsReady = Object.values(snapPoints).every(
    (v) => typeof v === 'number' && !isNaN(v)
  );
  if (!snapPointsReady || !isOpen) return null;

  const [{ y }, api] = useSpring(() => ({
    y: snapPoints.closed,
    config: config.stiff,
  }));

  // Initialize position when the component mounts
  useEffect(() => {
    if (isOpen) {
      api.set({ y: snapPoints.closed });
    }
  }, [isOpen, snapPoints.closed, api]);

  // Snap animation
  const snapTo = useCallback(
    (snap: 'closed' | 'partial' | 'full') => {
      setCurrentSnap(snap);
      api.start({ y: snapPoints[snap] });
    },
    [api, snapPoints]
  );

  // Gesture handling
  const bind = useDrag(
    ({ last, offset: [, offsetY], event }) => {
      if (!handleRef.current?.contains(event.target as Node)) return;

      if (last) {
        const distances = {
          closed: Math.abs(offsetY - snapPoints.closed),
          partial: Math.abs(offsetY - snapPoints.partial),
          full: Math.abs(offsetY - snapPoints.full),
        };

        const nearestSnap = Object.entries(distances).reduce((a, b) =>
          a[1] < b[1] ? a : b
        )[0] as 'closed' | 'partial' | 'full';

        snapTo(nearestSnap);
      } else {
        api.start({ y: offsetY, immediate: true });
      }
    },
    {
      from: () => [0, y.get()],
      bounds: { top: snapPoints.full, bottom: snapPoints.closed },
      rubberband: true,
      pointer: { touch: true },
    }
  );

  // Scroll lock handling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Tap outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      onClick={handleBackdropClick}
    >
      <animated.div
        ref={sheetRef}
        className="pointer-events-auto absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl"
        style={{
          transform: y.to((val) => `translateY(${val}px)`),
          height: maxHeight,
          maxHeight: `${maxHeight}px`,
        }}
        {...bind()}
      >
        {/* Drag handle */}
        <div ref={handleRef} className="flex justify-center pt-3 pb-2 touch-none">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className={`h-full ${
            currentSnap === 'closed' ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </animated.div>
    </div>
  );
};

export default MapBottomSheet;