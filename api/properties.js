// Vercel Serverless Function for getting properties
const axios = require('axios');

// Sample properties data (in production, this could come from a database)
const properties = [
  {
    address: "274 Kenwood Ave, Delmar, NY, 12054",
    notes: "No notes",
    pictures: "https://google.com",
    contractPrice: 105000,
    arv: 150000,
    repairs: 15000,
    mao: 105000,
    lao: 73500
  }
];

// Geocode address to get coordinates
async function geocodeAddress(address) {
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  if (!GOOGLE_API_KEY) {
    console.error('Google Maps API key not configured');
    return null;
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: GOOGLE_API_KEY
      }
    });

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const publicProperties = await Promise.all(properties.map(async (prop, index) => {
      const coords = await geocodeAddress(prop.address);
      return {
        id: index,
        address: prop.address,
        notes: prop.notes,
        pictures: prop.pictures,
        contractPrice: prop.contractPrice,
        lat: coords?.lat,
        lng: coords?.lng,
      };
    }));

    res.status(200).json(publicProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
