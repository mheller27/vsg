import { Button } from '@shared-ui/button';
import { Phone, Video, Bell, Bed, Ruler } from 'lucide-react';

interface PropertyHeaderProps {
  propertyMetadata: any;
  unitData: any[];
  getPriceRange: (units: any[]) => string;
  getBedroomRange: (units: any[]) => string;
  getSqftRange: (units: any[]) => string;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  propertyMetadata,
  unitData,
  getPriceRange,
  getBedroomRange,
  getSqftRange,
}) => {
  return (
    <div className="mb-8">

    {/* Mobile Layout */}
    <div className="block sm:hidden">
      {/* Shared container to control layout width */}
      <div className="flex flex-col w-full">

        {/* Section 1: Image + 3 rows */}
        <div className="flex items-center gap-4 w-full">
          {propertyMetadata.profile_image && (
            <img
              src={propertyMetadata.profile_image}
              alt={propertyMetadata.property_name}
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}

          <div className="flex flex-col h-20 flex-1 gap-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight truncate transition-colors duration-200">
              {propertyMetadata.property_name}
            </h1>
            <p className="text-base font-medium text-blue-600 dark:text-blue-400 leading-tight truncate transition-colors duration-200">
              {getPriceRange(unitData)}
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-tight truncate transition-colors duration-200">
              <Bed className="inline-block mr-1 mb-0.5 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              {getBedroomRange(unitData)}
              <Ruler className="inline-block ml-2 mr-1 mb-0.5 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              {getSqftRange(unitData)}
            </p>
          </div>
        </div>

        {/* Section 2: Button Row */}
        <div className="flex gap-1 mt-3 w-full px-4">
          <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-[11px] px-3 py-1 rounded-md flex items-center justify-center gap-1 min-h-0 h-7 transition-colors duration-200">
            <Phone className="h-3 w-3" />
            Contact
          </Button>
          <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-[11px] px-3 py-1 rounded-md flex items-center justify-center gap-1 min-h-0 h-7 transition-colors duration-200">
            <Video className="h-3 w-3" />
            Tour
          </Button>
          <Button className="flex-1 bg-white dark:bg-neutral-800 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-[11px] px-3 py-1 rounded-md flex items-center justify-center gap-1 min-h-0 h-7 transition-colors duration-200">
            <Bell className="h-3 w-3" />
            Follow
          </Button>
        </div>
      </div>
    </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="flex flex-row items-stretch gap-6 h-40">
          {/* Profile Image */}
          {propertyMetadata.profile_image && (
            <img
              src={propertyMetadata.profile_image}
              alt={propertyMetadata.property_name}
              className="w-40 h-40 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}

          {/* Details/Rows */}
          <div className="flex flex-col justify-between w-full">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white leading-tight truncate transition-colors duration-200">
              {propertyMetadata.property_name}
            </h1>
            <p className="text-xl font-medium text-blue-600 dark:text-blue-400 leading-tight truncate transition-colors duration-200">
              {getPriceRange(unitData)}
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-tight truncate transition-colors duration-200">
              <Bed className="inline-block mr-1 mb-0.5 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              {getBedroomRange(unitData)}
              <Ruler className="inline-block ml-2 mr-1 mb-0.5 w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              {getSqftRange(unitData)} Sqft
            </p>
            <div className="flex gap-2">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                <Phone className="h-4 w-4" />
                Contact
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                <Video className="h-4 w-4" />
                Tour
              </Button>
              <Button className="bg-white dark:bg-neutral-800 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                <Bell className="h-4 w-4" />
                Follow
              </Button>
            </div>
          </div>

          {/* Logo Image (Desktop Only) */}
          {propertyMetadata.profile_logo && (
            <div className="hidden sm:flex items-center h-40">
              <img
                src={propertyMetadata.profile_logo}
                alt={`${propertyMetadata.property_name} logo`}
                className="h-40 w-auto object-contain filter dark:invert transition-all duration-200"
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default PropertyHeader;