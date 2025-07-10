import React from 'react';
import { getSafeImageSrc } from '../lib/fallbackImage';

interface UnitHoverCardProps {
  unit: any;
  x: number;
  y: number;
  hoverCardRef: React.RefObject<HTMLDivElement>;
  formatSquareFootage: (value: string | number) => string;
}

const UnitHoverCard: React.FC<UnitHoverCardProps> = ({ unit, x, y, hoverCardRef, formatSquareFootage }) => {
  if (!unit) return null;

  return (
    <div
      ref={hoverCardRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm pointer-events-none"
      style={{ left: x, top: y }}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="border-b border-gray-100 pb-2">
          <h3 className="font-bold text-lg text-gray-900">
            {unit.residence || 'Unit Information'}
          </h3>
          {unit.unit && (
            <p className="text-sm text-gray-600">Unit {unit.unit}</p>
          )}
        </div>

        {/* Unit Details */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-4">
            {unit.beds && <span>{unit.beds} Beds</span>}
            {unit.baths && <span>{unit.baths} Baths</span>}
          </div>

          {(unit.den || unit.bonus_room) && (
            <div className="flex items-center gap-4">
              {unit.den && <span>{unit.den}</span>}
              {unit.bonus_room && <span>{unit.bonus_room}</span>}
            </div>
          )}

          <div className="space-y-1">
            {unit.interior_sqft && (
              <div className="flex justify-between">
                <span className="text-gray-600">Interior:</span>
                <span>{formatSquareFootage(unit.interior_sqft)}</span>
              </div>
            )}
            {unit.exterior_sqft && (
              <div className="flex justify-between">
                <span className="text-gray-600">Exterior:</span>
                <span>{formatSquareFootage(unit.exterior_sqft)}</span>
              </div>
            )}
            {unit.total_sqft && (
              <div className="flex justify-between font-medium">
                <span className="text-gray-600">Total:</span>
                <span>{formatSquareFootage(unit.total_sqft)}</span>
              </div>
            )}
          </div>

          {unit.price && unit.price !== 'null' && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Price:</span>
                <span className={`font-bold ${
                  unit.price.startsWith('$')
                    ? 'text-green-700 text-base'
                    : unit.price === 'Contact us for price'
                    ? 'text-blue-700 text-sm'
                    : 'text-gray-700 text-base'
                }`}>
                  {unit.price}
                </span>
              </div>
            </div>
          )}

          {unit.floorplan_thumbnail && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">Floorplan</div>
              <img
                src={getSafeImageSrc(unit.floorplan_thumbnail)}
                alt={`Floorplan for ${unit.residence || 'Residence'} Unit ${unit.unit || ''}`}
                className="w-full max-h-32 object-contain rounded border border-gray-200"
                onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitHoverCard;