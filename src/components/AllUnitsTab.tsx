import React from 'react';

interface Unit {
  unit_id: string;
  Residence?: string;
  unit?: string;
  beds?: number;
  baths?: number;
  den?: string;
  bonus_room?: string;
  interior_sqft?: number | string;
  exterior_sqft?: number | string;
  total_sqft?: number | string;
  price?: string;
  floorplan_thumbnail?: string;
}

interface AllUnitsTabProps {
  filteredUnits: Unit[];
  selectedBedrooms: number | null;
  setSelectedBedrooms: (value: number | null) => void;
  selectedPriceStatus: string | null;
  setSelectedPriceStatus: (value: string | null) => void;
  availableBedroomCounts: number[];
  handleUnitClick: (unitId: string) => void;
  formatSquareFootage: (value: string | number) => string;
}

const AllUnitsTab: React.FC<AllUnitsTabProps> = ({
  filteredUnits,
  selectedBedrooms,
  setSelectedBedrooms,
  selectedPriceStatus,
  setSelectedPriceStatus,
  availableBedroomCounts,
  handleUnitClick,
  formatSquareFootage
}) => {
  return (
    <div className="bg-gray-100 px-4 py-6 rounded-md">
      {/* Bedroom Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1 text-sm rounded border ${
            selectedBedrooms === null ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedBedrooms(null)}
        >
          All
        </button>
        {availableBedroomCounts.map((count) => (
          <button
            key={count}
            className={`px-3 py-1 text-sm rounded border ${
              selectedBedrooms === count ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
            onClick={() => setSelectedBedrooms(count)}
          >
            {count} Bed{count > 1 ? 's' : ''}
          </button>
        ))}
      </div>

      {/* Price Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1 text-sm rounded border ${
            selectedPriceStatus === null ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedPriceStatus(null)}
        >
          All
        </button>
        <button
          className={`px-3 py-1 text-sm rounded border ${
            selectedPriceStatus === 'listed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedPriceStatus('listed')}
        >
          Listed
        </button>
        <button
          className={`px-3 py-1 text-sm rounded border ${
            selectedPriceStatus === 'unreleased' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedPriceStatus('unreleased')}
        >
          Unreleased
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredUnits.map((unit) => (
          <div
            key={unit.unit_id}
            onClick={() => handleUnitClick(unit.unit_id)}
            className="cursor-pointer border rounded-lg shadow-sm p-4 hover:shadow-md transition bg-white flex flex-col justify-between h-full"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-900">{unit.Residence || 'Unit Information'}</span>
                  {unit.unit && <span className="text-sm text-gray-600">| {unit.unit}</span>}
                </div>
                {unit.price && unit.price !== 'null' && (
                  <div className={`font-bold mt-1 ${
                    unit.price.trim().toLowerCase() === 'sold'
                      ? 'text-red-600'
                      : unit.price.trim().startsWith('$')
                      ? 'text-green-700 text-base'
                      : 'text-blue-700 text-base'
                  }`}>
                    {unit.price}
                  </div>
                )}
              </div>

              {/* Unit Details */}
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex flex-wrap gap-1 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-700">
                  {[
                    unit.beds ? `${unit.beds} Beds` : null,
                    unit.baths ? `${unit.baths} Baths` : null,
                    unit.den ? 'Den' : null,
                    unit.bonus_room ? 'Bonus Room' : null
                  ]
                    .filter(Boolean)
                    .map((label, index, array) => (
                      <span key={index}>
                        {label}
                        {index < array.length - 1 && <span className="mx-1 text-gray-400">|</span>}
                      </span>
                    ))}
                </div>
                <div className="flex flex-wrap gap-1 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-700">
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
              </div>
            </div>

            {/* Thumbnail */}
            {unit.floorplan_thumbnail && (
              <div className="mt-4">
                <img
                  src={unit.floorplan_thumbnail}
                  alt={`Floorplan for ${unit.Residence} Unit ${unit.unit}`}
                  className="w-full h-32 object-contain rounded border border-gray-200"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUnitsTab;