import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Shape {
  id: string;
  type: 'polygon' | 'path';
  points?: string;
  d?: string;
}

interface FloorplateViewerProps {
  selectedFloor: string;
  propertyMetadata: any;
  propertySVGData: { [key: string]: Shape[] };
  getFloorplanImage: (floor: string) => string;
  getUnitClass: (unitId: string) => string;
  handleUnitMouseEnter: (unitId: string, e: React.MouseEvent<SVGElement>) => void;
  handleUnitMouseLeave: () => void;
  handleUnitClick: (unitId: string) => void;
}

const FloorplateViewer: React.FC<FloorplateViewerProps> = ({
  selectedFloor,
  propertyMetadata,
  propertySVGData,
  getFloorplanImage,
  getUnitClass,
  handleUnitMouseEnter,
  handleUnitMouseLeave,
  handleUnitClick,
}) => {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={3}
      centerOnInit
      wheel={{ disabled: false }}
      panning={{ disabled: false }}
      doubleClick={{ disabled: true }}
      zoomAnimation={{ size: 0.25 }}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <Button variant="secondary" size="icon" onClick={() => zoomIn(0.25)} className="h-8 w-8">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Zoom In</span>
            </Button>
            <Button variant="secondary" size="icon" onClick={() => zoomOut(0.25)} className="h-8 w-8">
              <Minus className="h-4 w-4" />
              <span className="sr-only">Zoom Out</span>
            </Button>
            <Button variant="secondary" size="icon" onClick={() => resetTransform()} className="h-8 w-8">
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset Zoom</span>
            </Button>
          </div>

          {/* Key/Legend */}
          <div className="absolute top-4 left-4 z-20 flex flex-row gap-4 bg-white bg-opacity-80 rounded p-2 shadow">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-sm bg-blue-500 border border-gray-300" />
              <span className="text-xs text-gray-700">Unreleased</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-sm bg-emerald-400 border border-gray-300" />
              <span className="text-xs text-gray-700">For Sale</span>
            </div>
          </div>

          {/* Image + SVG Overlay */}
          <TransformComponent wrapperClass="w-full h-full">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                <img
                  src={getFloorplanImage(selectedFloor)}
                  alt={`${propertyMetadata?.name || 'Property'} Floor ${selectedFloor} Floorplate`}
                  className="w-full h-full object-contain"
                />
                {selectedFloor &&
                  propertySVGData?.[`floor-${selectedFloor.padStart(2, '0')}`] && (
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 10 4200 3600"
                      preserveAspectRatio="none"
                    >
                      {propertySVGData[`floor-${selectedFloor.padStart(2, '0')}`].map((shape, index) => {
                        if (shape.type === 'polygon') {
                          return (
                            <polygon
                              key={index}
                              id={shape.id}
                              points={shape.points}
                              className={getUnitClass(shape.id)}
                              onMouseEnter={(e) => handleUnitMouseEnter(shape.id, e)}
                              onMouseLeave={handleUnitMouseLeave}
                              onClick={() => handleUnitClick(shape.id)}
                            />
                          );
                        } else if (shape.type === 'path') {
                          return (
                            <path
                              key={index}
                              id={shape.id}
                              d={shape.d}
                              className={getUnitClass(shape.id)}
                              onMouseEnter={(e) => handleUnitMouseEnter(shape.id, e)}
                              onMouseLeave={handleUnitMouseLeave}
                              onClick={() => handleUnitClick(shape.id)}
                            />
                          );
                        }
                        return null;
                      })}
                    </svg>
                  )}
              </div>
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default FloorplateViewer;