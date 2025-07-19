import React from 'react';
import PropertyLocationMap from './PropertyLocationMap'; // adjust path if needed

interface PropertyDetailsTabProps {
  unitData: any[];
  propertyMetadata: any;
  getPriceRange: (units: any[]) => string;
  getBedroomRange: (units: any[]) => string;
  getSqftRange: (units: any[]) => string;
}

const PropertyDetailsTab: React.FC<PropertyDetailsTabProps> = ({
  unitData,
  propertyMetadata,
  getPriceRange,
  getBedroomRange,
  getSqftRange,
}) => (
  <div>
    {/* Desktop Layout: Quick Facts + Map */}
    <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Quick Facts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 flex flex-col transition-colors duration-200">
            <span className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Price Range</span>
            <span className="text-lg text-gray-900 dark:text-white transition-colors duration-200">{getPriceRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 flex flex-col transition-colors duration-200">
            <span className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Bedrooms</span>
            <span className="text-lg text-gray-900 dark:text-white transition-colors duration-200">{getBedroomRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 flex flex-col transition-colors duration-200">
            <span className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">SQFT Range</span>
            <span className="text-lg text-gray-900 dark:text-white transition-colors duration-200">{getSqftRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 flex flex-col transition-colors duration-200">
            <span className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Developer</span>
            <span className="text-lg text-gray-900 dark:text-white transition-colors duration-200">{propertyMetadata?.developer || 'N/A'}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 flex flex-col transition-colors duration-200">
            <span className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Unit Total</span>
            <span className="text-lg text-gray-900 dark:text-white transition-colors duration-200">{unitData.length}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 flex flex-col transition-colors duration-200">
            <span className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Estimated Completion Date</span>
            <span className="text-lg text-gray-900 dark:text-white transition-colors duration-200">{propertyMetadata?.estimated_completion_date || 'N/A'}</span>
          </div>
        </div>
      </div>
      {propertyMetadata?.property_coordinates && (
        <PropertyLocationMap coordinates={propertyMetadata.property_coordinates} />
      )}
    </div>

    {/* Mobile Layout: Quick Facts + Map */}
    <div className="lg:hidden">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-200">Quick Facts</h2>
        <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-2 flex flex-col transition-colors duration-200">
            <span className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-0.5 transition-colors duration-200">Price Range</span>
            <span className="text-xs text-gray-900 dark:text-white transition-colors duration-200">{getPriceRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-2 flex flex-col transition-colors duration-200">
            <span className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-0.5 transition-colors duration-200">Bedrooms</span>
            <span className="text-xs text-gray-900 dark:text-white transition-colors duration-200">{getBedroomRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-2 flex flex-col transition-colors duration-200">
            <span className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-0.5 transition-colors duration-200">SQFT Range</span>
            <span className="text-xs text-gray-900 dark:text-white transition-colors duration-200">{getSqftRange(unitData)}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-2 flex flex-col transition-colors duration-200">
            <span className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-0.5 transition-colors duration-200">Developer</span>
            <span className="text-xs text-gray-900 dark:text-white transition-colors duration-200">{propertyMetadata?.developer || 'N/A'}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-2 flex flex-col transition-colors duration-200">
            <span className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-0.5 transition-colors duration-200">Unit Total</span>
            <span className="text-xs text-gray-900 dark:text-white transition-colors duration-200">{unitData.length}</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-2 flex flex-col transition-colors duration-200">
            <span className="font-bold text-xs text-gray-700 dark:text-gray-300 mb-0.5 transition-colors duration-200">Completion Date</span>
            <span className="text-xs text-gray-900 dark:text-white transition-colors duration-200">{propertyMetadata?.estimated_completion_date || 'N/A'}</span>
          </div>
        </div>
      </div>
      {propertyMetadata?.property_coordinates && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-200">Location</h2>
          <PropertyLocationMap coordinates={propertyMetadata.property_coordinates} />
        </div>
      )}
    </div>
    {/* Details sections below */}
    {propertyMetadata && (
      <div className="mt-10 space-y-6">
        {[
          { title: "Property Details", items: propertyMetadata.property_details },
          { title: "Amenity Details", items: propertyMetadata.amenity_details },
          { title: "Developer Details", items: propertyMetadata.developer_details },
          { title: "Architect Details", items: propertyMetadata.architect_details },
          { title: "Builder Details", items: propertyMetadata.builder_details },
          { title: "Designer Details", items: propertyMetadata.designer_details },
        ].map(({ title, items }) => (
          Array.isArray(items) && items.length > 0 ? (
            <div key={title} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 transition-colors duration-200">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">{title}</h3>
              <div className="space-y-2">
                {items.map((item: string, index: number) => (
                  <div key={index} className="text-gray-800 dark:text-gray-200 transition-colors duration-200">{item}</div>
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    )}
  </div>
);

export default PropertyDetailsTab;
