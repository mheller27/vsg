import React from 'react';
import { getSafeImageSrc } from '../lib/fallbackImage';

interface UnitListProps {
  units: any[];
  onUnitClick: (unit: any) => void;
  formatSquareFootage: (value: string | number) => string;
}

const FloorplateUnitList: React.FC<UnitListProps> = ({ units, onUnitClick, formatSquareFootage }) => {
  if (!units || units.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No units available on this floor
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {units.map((unit) => (
        <div
          key={unit.unit_id}
          onClick={() => onUnitClick(unit)}
          className="cursor-pointer border rounded-lg shadow-sm p-4 hover:shadow-md transition bg-white flex flex-col justify-between h-full"
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

            {/* Details */}
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex flex-wrap gap-1 text-xs sm:text-sm text-gray-700">
                {[
                  unit.beds ? `${unit.beds} Beds` : null,
                  unit.baths ? `${unit.baths} Baths` : null,
                  unit.den ? 'Den' : null,
                  unit.bonus_room ? 'Bonus Room' : null,
                ]
                  .filter(Boolean)
                  .map((label, index, array) => (
                    <span key={index}>
                      {label}
                      {index < array.length - 1 && <span className="mx-1 text-gray-400">|</span>}
                    </span>
                  ))}
              </div>

              <div className="flex flex-wrap gap-1 text-xs sm:text-sm text-gray-700">
                {[
                  unit.interior_sqft ? `Interior: ${formatSquareFootage(unit.interior_sqft)}` : null,
                  unit.exterior_sqft ? `Exterior: ${formatSquareFootage(unit.exterior_sqft)}` : null,
                ]
                  .filter(Boolean)
                  .map((label, index, array) => (
                    <span key={index}>
                      {label}
                      {index < array.length - 1 && <span className="mx-1 text-gray-400">|</span>}
                    </span>
                  ))}
              </div>

              {unit.availability && (
                <div className="text-xs sm:text-sm font-medium text-gray-700">
                  Availability:{' '}
                  <span className={`font-semibold ${
                    unit.availability === 'Available'
                      ? 'text-green-700'
                      : unit.availability === 'Sold'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}>
                    {unit.availability}
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
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
          </div>

          {/* Thumbnail */}
          {unit.floorplan_thumbnail && (
            <div className="mt-4">
              <img
                src={getSafeImageSrc(unit.floorplan_thumbnail)}
                alt={`Floorplan for ${unit.roundedesidence} Unit ${unit.unit}`}
                className="w-full h-32 object-contain rounded border border-gray-200"
                onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FloorplateUnitList;