import React from 'react';
import { getSafeImageSrc } from '@shared-lib/fallbackImage';
import { getPriceColorClass } from '@shared-lib/utils';

interface UnitListProps {
  units: any[];
  onUnitClick: (unit: any) => void;
  formatSquareFootage: (value: string | number) => string;
}

const FloorplateUnitList: React.FC<UnitListProps> = ({ units, onUnitClick, formatSquareFootage }) => {
  if (!units || units.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4 transition-colors duration-200">
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
          className="cursor-pointer border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm dark:shadow-gray-900/50 p-4 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200 bg-white dark:bg-gray-700 flex flex-col justify-between h-full"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-white transition-colors duration-200">
                  {unit.residence}
                </span>
                {unit.unit && <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">| {unit.unit}</span>}
              </div>
              {unit.price && unit.price !== 'null' && (
                <div className={`font-bold mt-1 ${getPriceColorClass(unit.price)}`}>
                  {unit.price}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 transition-colors duration-200">
              <div className="flex flex-wrap gap-1 text-xs sm:text-sm">
                {[
                  unit.beds ? `${unit.beds} Beds` : null,
                  unit.baths ? `${unit.baths} Baths` : null,
                  unit.den ? 'Den' : null,
                  unit.bonus_room ? 'Bonus Room' : null,
                ]
                  .filter(Boolean)
                  .map((label, index, array) => (
                    <span key={index} className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
                      {label}
                      {index < array.length - 1 && <span className="mx-1 text-gray-400 dark:text-gray-500 transition-colors duration-200">|</span>}
                    </span>
                  ))}
              </div>

              <div className="flex gap-1 text-xs sm:text-xs whitespace-nowrap overflow-hidden min-w-0">
                {[
                  unit.interior_sqft ? `Interior: ${formatSquareFootage(unit.interior_sqft)} sqft` : null,
                  unit.exterior_sqft ? `Exterior: ${formatSquareFootage(unit.exterior_sqft)} sqft` : null,
                ]
                  .filter(Boolean)
                  .map((label, index, array) => (
                    <span key={index} className="truncate text-gray-700 dark:text-gray-300 transition-colors duration-200">
                      {label}
                      {index < array.length - 1 && <span className="mx-1 text-gray-400 dark:text-gray-500 transition-colors duration-200">|</span>}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          {unit.floorplan_thumbnail && (
            <div className="mt-4">
              <img
                src={getSafeImageSrc(unit.floorplan_thumbnail)}
                alt={`Floorplan for ${unit.residence} Unit ${unit.unit}`}
                className="w-full h-32 object-contain rounded border border-gray-200 dark:border-gray-600 transition-colors duration-200"
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