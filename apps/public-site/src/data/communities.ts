import { EnhancedLocation } from '@shared-types';

export const locationDetails: Record<string, { price: string; bedrooms: string; sqft: string }> = {
  '1': { // Ritz Carlton Sarasota Bay
    price: '$3.99M - $8.99M',
    bedrooms: '3 - 4 Bedrooms',
    sqft: '3,556 - 4,360 SqFt'
  },
  '2': { // One Park Residences
    price: '$2.7M - $5.65M',
    bedrooms: '3 - 4 Bedrooms',
    sqft: '2,569 - 3,996 SqFt'
  },
  '3': { // Amara on Sarasota Bay
    price: '$4.25M - $7.95M',
    bedrooms: '2 - 4 Bedrooms',
    sqft: '2,615 - 3,429 SqFt'
  },
  '4': { // Evolution Sarasota
    price: '$2.49M - $5.79M',
    bedrooms: '3 - 5 Bedrooms',
    sqft: '2,050 - 3,527 SqFt'
  },
  '5': { // The Owen Golden Gate Point
    price: '$2.74M - $3.97M',
    bedrooms: '3 Bedrooms',
    sqft: '2,263 - 3,065 SqFt'
  },
  '6': { // Sota Sarasota
    price: '$1.825M - $4.195M',
    bedrooms: '2 - 3 Bedrooms',
    sqft: '1,708 - 2,408 SqFt'
  },
  '7': { // Rosewood Residences
    price: '$6.8M - $14.15M',
    bedrooms: '3 - 4 Bedrooms',
    sqft: '3,350 - 4,952 SqFt'
  },
  '8': { // The Edge Sarasota
    price: '$2.5M - $4.5M',
    bedrooms: '2 - 3 Bedrooms',
    sqft: '3,272 - 3,532 SqFt'
  },
  '9': { // Peninsula Sarasota
    price: '$4.5M - $6.9M',
    bedrooms: '3 Bedrooms',
    sqft: '2,400 - 3,068 SqFt'
  },
  '11': { // Villa Ballada
    price: '$1.03M - $2.264M',
    bedrooms: '2 - 4 Bedrooms',
    sqft: '1,057 - 2,322 SqFt'
  },
  '12': { // The Gallery
    price: '$1.3M - $1.99M',
    bedrooms: '2 - 3 Bedrooms',
    sqft: '1,357 - 1,873 SqFt'
  },
  '13': { // Azure Siesta Key
    price: '$3.2M - $6.2M',
    bedrooms: '4 - 5 Bedrooms',
    sqft: '2,332 - 4,042 SqFt'
  },
  '14': { // Six88
    price: '$2.99M',
    bedrooms: '2 Bedrooms',
    sqft: '2,088 SqFt'
  },
  '15': { // Sunset Beach
    price: '$5.9M - $7.2M',
    bedrooms: '3 Bedrooms',
    sqft: '3,550 - 4,154 SqFt'
  },
  '16': { // Orange One
    price: '$2.4M - $2.99M',
    bedrooms: '4 - 5 Bedrooms',
    sqft: '2,556 - 3,360 SqFt'
  },
  '17': { // 1000 Blvd of the Arts
    price: '$1.5M - $4M',
    bedrooms: '1 - 3 Bedrooms',
    sqft: '1,285 - 3,105 SqFt'
  }
};

export const locations: EnhancedLocation[] = [
  {
    id: '1',
    name: 'Ritz Carlton Sarasota Bay',
    coordinates: [-82.548444, 27.340194],
    description: 'Luxury hotel located on Sarasota Bay',
    imageUrls: [
      '/lovable-uploads/49721f01-3910-412f-9769-b154c069239c.png',
      '/lovable-uploads/a92adaff-7020-4336-9224-067d8e88e5ef.png',
      '/lovable-uploads/459bb982-226d-4b1f-8f64-cad7570a82d7.png',
      '/lovable-uploads/b7836ff4-301c-40e9-8595-0e50b128e381.png',
      '/lovable-uploads/b783d9cc-d0d1-4515-87c1-3785d75e7609.png',
      '/lovable-uploads/fc8523b6-b956-4503-9771-ca990ecc5e67.png'
    ]
  },
  {
    id: '2',
    name: 'One Park Residences',
    coordinates: [-82.54722, 27.34125],
    description: 'Luxury residences in downtown Sarasota',
    imageUrls: [
      '/lovable-uploads/c350a7aa-76a3-4455-90d5-e4d66db33a1f.png',
      '/lovable-uploads/7ecb9016-def1-422f-95c2-1e7c29e6dc01.png',
      '/lovable-uploads/627e1957-5725-494f-8bc6-196298af9057.png',
      '/lovable-uploads/3c60355b-4d18-493b-bf5b-7e2fb7867f7f.png',
      '/lovable-uploads/00242c0f-54fd-441b-82c0-f57437dcdfcb.png',
      '/lovable-uploads/bf505b21-ed8f-406d-8522-d61b860def1e.png'
    ]
  },
  {
    id: '3',
    name: 'Amara on Sarasota Bay',
    coordinates: [-82.54919, 27.33364],
    description: `$4.25M - $7.95M, 2 - 4 Bedrooms, 2,615 - 3,429 SqFt`,
    imageUrls: [
      '/lovable-uploads/6fd75bc0-99fb-42ac-a3ef-4b5d1378fdd4.png',
      '/lovable-uploads/88244fd3-c37c-47d5-83b4-ccd490be9631.png',
      '/lovable-uploads/2f2aa1f1-f1ef-4ebb-9730-db515ab2fa74.png',
      '/lovable-uploads/59c44d9d-8300-4e04-b42d-f809076ac9c2.png',
      '/lovable-uploads/4943b1f9-a71b-45e5-b559-6ab2123a42e2.png',
      '/lovable-uploads/e4c7d29b-1f6e-4501-9b45-39321e7fccd7.png'
    ]
  },
  {
    id: '4',
    name: 'Evolution Sarasota',
    coordinates: [-82.550251, 27.335072],
    description: 'Modern living in downtown Sarasota',
    imageUrls: [
      '/lovable-uploads/1d7c3e92-ca1a-48e5-9020-b0712dfe7711.png',
      '/lovable-uploads/2106a4b7-4665-449e-a755-e5ec35e7419f.png',
      '/lovable-uploads/f528c533-5528-49f0-a084-d21cd4746eac.png',
      '/lovable-uploads/ab6771c3-1395-4daa-bae5-41a4b81b71c5.png',
      '/lovable-uploads/a06edbb5-b701-443a-a564-602b8e9ec82a.png',
      '/lovable-uploads/7b2cc8be-7a6c-43c6-abac-a1a5aed20be8.png'
    ]
  },
  {
    id: '5',
    name: 'The Owen Golden Gate Point',
    coordinates: [-82.550224, 27.332760],
    description: 'Elegant residences on Golden Gate Point',
    imageUrls: [
      '/lovable-uploads/55274e68-c33b-4e69-9a26-e641bae68b2f.png',
      '/lovable-uploads/602072e9-9234-46dc-b3ab-509acd67e805.png',
      '/lovable-uploads/5817c930-d6da-4b7d-85e3-1446e3a5cf7c.png',
      '/lovable-uploads/c62dd409-7612-4d7c-88c9-2955464612b1.png',
      '/lovable-uploads/90a2dfdf-5841-4d98-8292-d6f01d86afe9.png',
      '/lovable-uploads/a09b51cb-5839-4d25-abcd-6bd9955a0505.png'
    ]
  },
  {
    id: '6',
    name: 'Sota Sarasota',
    coordinates: [-82.535955, 27.336876],
    description: 'Contemporary living in Sarasota',
    imageUrls: [
      '/lovable-uploads/aeef3fb0-1a8f-4a29-8ac7-bcbe06db93f9.png',
      '/lovable-uploads/ebeaf33f-ed2f-477a-a0d4-05b69e207e49.png',
      '/lovable-uploads/69c9457e-984d-4521-9d19-255d2d72edf4.png',
      '/lovable-uploads/7db51f31-9666-4e79-aeec-9ed8f22cbc18.png',
      '/lovable-uploads/7f368796-74a5-468e-a33a-420e7c2123be.png',
      '/lovable-uploads/ef5cdb1d-7fbd-49a0-93db-4bc79bdda1cb.png'
    ]
  },
  {
    id: '7',
    name: 'Rosewood Residences',
    coordinates: [-82.573160, 27.308927],
    description: 'Premium luxury residences',
    imageUrls: [
      '/lovable-uploads/ab6ebe85-38a6-4e24-9829-9550dc8d91c0.png',
      '/lovable-uploads/605d4f94-0194-42a9-8e99-1c79a284f6a1.png',
      '/lovable-uploads/c47bc5ac-9b1a-4ec2-ab57-83510c55d523.png',
      '/lovable-uploads/0a5d6155-6937-40d3-845e-792ffc8883f4.png',
      '/lovable-uploads/e0ff0985-82a3-4df3-9d23-26bad6e3885d.png',
      '/lovable-uploads/fbba2192-faaf-4721-9010-1b6d6c23101c.png'
    ]
  },
  {
    id: '8',
    name: 'The Edge Sarasota',
    coordinates: [-82.544538, 27.338902],
    description: 'Modern waterfront living',
    imageUrls: [
      '/lovable-uploads/a5ec6d4e-29fd-4dc8-90e3-422f285b232e.png',
      '/lovable-uploads/52b75832-cd5a-4562-a650-5601e105386e.png',
      '/lovable-uploads/9dbde81e-75ca-4d53-89dd-edf2f13dc90b.png',
      '/lovable-uploads/7549e698-5e4b-4767-ac1a-069cac374934.png',
      '/lovable-uploads/8d9608ff-dec2-4a6c-9878-e465ac427e58.png',
      '/lovable-uploads/0f627194-fa20-493e-b59e-e5dc248cec19.png'
    ]
  },
  {
    id: '9',
    name: 'Peninsula Sarasota',
    coordinates: [-82.550173, 27.333942],
    description: 'Exclusive waterfront condominiums',
    imageUrls: [
      '/lovable-uploads/8e938d25-f3d0-43f8-8fa3-f345db7963c0.png',
      '/lovable-uploads/f6bf0fe1-7414-4b5b-9c1f-a04895fa6dc5.png',
      '/lovable-uploads/3fcc7dbb-6da4-42d1-bc34-277ff9f68b02.png',
      '/lovable-uploads/18895963-a859-4de7-9f83-811c15cf5db5.png',
      '/lovable-uploads/056346c6-b713-496d-bbeb-885e52028add.png',
      '/lovable-uploads/ce231b3f-e02b-4d49-b77e-85494cf2c324.png'
    ]
  },
  {
    id: '11',
    name: 'Villa Ballada',
    coordinates: [-82.539413, 27.340479],
    description: 'Luxury villa community',
    imageUrls: [
      '/lovable-uploads/9c325980-ba5e-4488-95d4-df0ad2f94a56.png',
      '/lovable-uploads/ea501593-2a9f-42f4-80f3-73dd0bf42cf2.png',
      '/lovable-uploads/e8140627-a684-4403-a2c5-1e712f5b186d.png',
      '/lovable-uploads/97ca6b55-8ce7-4f7b-baeb-32200a2bdc8f.png',
      '/lovable-uploads/29dca42d-dd10-43c5-93ff-03f73ba4daa9.png',
      '/lovable-uploads/482c73d9-3314-418b-a886-db789bccf311.png'
    ]
  },
  {
    id: '12',
    name: 'The Gallery',
    coordinates: [-82.544037, 27.339923],
    description: 'Contemporary residential development',
    imageUrls: [
      '/lovable-uploads/b97fa40e-1a9a-4521-858b-67bb2cd93171.png',
      '/lovable-uploads/32b0b45b-d95c-45a6-bbc7-4a1582cfe313.png',
      '/lovable-uploads/72f89c1a-b648-44b9-b3ec-f4614af949a3.png',
      '/lovable-uploads/bd7d47b7-1cd2-4d10-97be-5144b107a83c.png',
      '/lovable-uploads/2e5f413d-621e-4357-8c4a-af827755cd08.png',
      '/lovable-uploads/86aa82d8-7b65-45bb-8fb7-0647c41b7b42.png'
    ]
  },
  {
    id: '13',
    name: 'Azure Siesta Key',
    coordinates: [-82.541749, 27.262616],
    description: 'Luxury beachfront community',
    imageUrls: [
      '/lovable-uploads/15a2e51b-bcef-4110-a10b-bfa4b5a955bb.png',
      '/lovable-uploads/f432423c-cd46-4765-8f3e-6e9382af8dab.png',
      '/lovable-uploads/db575abc-5bea-481f-bdb0-67fe5ade76e2.png',
      '/lovable-uploads/e00d1451-2185-4329-b304-222931a4869f.png',
      '/lovable-uploads/067dcf04-857a-450c-be7c-877208fac6ae.png',
      '/lovable-uploads/a769513b-8d56-466e-92e7-315dba066950.png'
    ]
  },
  {
    id: '14',
    name: 'Six88',
    coordinates: [-82.549520, 27.335575],
    description: 'Modern downtown residences',
    imageUrls: [
      '/lovable-uploads/a756b315-a34f-4b03-b2ed-22b4542f0ed1.png',
      '/lovable-uploads/a68136ea-dbf2-4e76-9afa-b492c46d77af.png',
      '/lovable-uploads/6cae7320-6781-45e3-838d-bcabc3eb140d.png',
      '/lovable-uploads/f34984a3-304f-4550-838d-bad9185e4424.png',
      '/lovable-uploads/ee256255-c6f6-4816-b9f4-59ce0acc9bbc.png',
      '/lovable-uploads/96e66603-439d-49e8-9fbc-e39873c32ac5.png'
    ]
  },
  {
    id: '15',
    name: 'Sunset Beach',
    coordinates: [-82.567439, 27.277367],
    description: 'Exclusive beachfront living',
    imageUrls: [
      '/lovable-uploads/38b6a70b-92dd-4093-ae1c-7e8b93850dce.png',
      '/lovable-uploads/ca00e462-00bb-44c1-a7d5-2e1236235363.png',
      '/lovable-uploads/84269380-d3e3-4190-a718-260c2570128f.png',
      '/lovable-uploads/04569aec-d40d-4307-99c4-71f7a43f207b.png',
      '/lovable-uploads/1e723f08-7094-498f-a069-89296076c2e4.png',
      '/lovable-uploads/081420e9-33b3-4494-9503-8804cc0beef0.png'
    ]
  },
  {
    id: '16',
    name: 'Orange One',
    coordinates: [-82.538325, 27.340146],
    description: 'Contemporary luxury residences',
    imageUrls: [
      '/lovable-uploads/54e2cd07-6390-4bc5-ad3b-05aa8ed26c26.png',
      '/lovable-uploads/cff55429-1dc9-422f-a6e6-7b7c171bec2e.png',
      '/lovable-uploads/df52ed75-71aa-453c-96a8-8a9d244b488c.png',
      '/lovable-uploads/08cb2b5b-9a13-405a-8a0d-fbbe0e6605e8.png',
      '/lovable-uploads/864f2040-4824-4a59-a431-723eab5dc335.png',
      '/lovable-uploads/ebec2a65-c5cb-4cbc-a93c-46a250b42a28.png'
    ]
  },
  {
    id: '17',
    name: '1000 Blvd of the Arts',
    coordinates: [-82.54876587116479, 27.341117133759138],
    description: 'Modern luxury residences and hotel',
    imageUrls: [
      '/lovable-uploads/1000arts_exterior.jpg',
      '/lovable-uploads/1000arts_private-resident-lobby.jpg',
      '/lovable-uploads/1000arts_casual-news-cafe.jpg',
      '/lovable-uploads/1000arts_fitness-center.jpg',
      '/lovable-uploads/1000arts_splash-lounge.jpg',
      '/lovable-uploads/1000arts_the-hub-cowork-space.jpg'
    ]
  }
];
