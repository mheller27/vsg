import { Button } from '@/components/ui/button';
import { Phone, Video, Bell } from 'lucide-react';

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
  getSqftRange
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-row sm:flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {propertyMetadata.profile_image && (
            <img
              src={propertyMetadata.profile_image}
              alt={propertyMetadata.property_name}
              className="w-20 h-20 sm:w-36 sm:h-36 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Property Information and Actions */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-3">
            <h1 className="text-base font-semibold text-gray-900 sm:text-3xl">
              {propertyMetadata.property_name}
            </h1>
          </div>

          <div className="space-y-2 mb-3">
            <p className="text-sm font-medium text-blue-600 sm:text-xl">
              {getPriceRange(unitData)}
            </p>
            <p className="text-sm text-gray-600 sm:text-lg">
              {getBedroomRange(unitData)} • {getSqftRange(unitData)} SF
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-row flex-wrap justify-start gap-2 w-full lg:mt-4 lg:flex-row lg:gap-2">
            <div className="flex min-w-full sm:hidden gap-2 mt-2">
              <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 transition px-2 py-1 text-xs flex items-center justify-center gap-1">
                <Phone className="h-4 w-4" />
                Contact
              </Button>
              <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 transition px-2 py-1 text-xs flex items-center justify-center gap-1">
                <Video className="h-4 w-4" />
                Tour
              </Button>
              <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 transition px-2 py-1 text-xs flex items-center justify-center gap-1">
                <Bell className="h-4 w-4" />
                Follow
              </Button>
            </div>

            <div className="hidden sm:flex flex-row flex-wrap gap-2">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 transition px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm flex items-center gap-1 sm:gap-2">
                <Phone className="h-4 w-4" />
                Contact
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 transition px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm flex items-center gap-1 sm:gap-2">
                <Video className="h-4 w-4" />
                Tour
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 transition px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm flex items-center gap-1 sm:gap-2">
                <Bell className="h-4 w-4" />
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;