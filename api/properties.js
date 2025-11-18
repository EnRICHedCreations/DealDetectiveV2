// Vercel Serverless Function for getting properties
const fs = require('fs');
const path = require('path');

// Load properties from CSV file
function loadPropertiesFromCSV() {
  try {
    const csvPath = path.join(process.cwd(), 'server', 'sample_properties.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvData.split('\n').slice(1); // Skip header

    return lines
      .filter(line => line.trim())
      .map((line, index) => {
        // Parse CSV line (handle quoted fields)
        const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 8) return null;

        const [address, notes, pictures, contractPrice, arv, repairs, mao, lao] = matches.map(
          field => field.replace(/^"|"$/g, '').trim()
        );

        return {
          id: index,
          address,
          notes,
          pictures,
          contractPrice: parseFloat(contractPrice) || 0,
          arv: parseFloat(arv) || 0,
          repairs: parseFloat(repairs) || 0,
          mao: parseFloat(mao) || 0,
          lao: parseFloat(lao) || 0
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Error loading CSV:', error);
    // Fallback to sample data
    return [
      {
        id: 0,
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
  }
}

const properties = loadPropertiesFromCSV();

// Geocode address to get coordinates
async function geocodeAddress(address) {
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  if (!GOOGLE_API_KEY) {
    console.error('Google Maps API key not configured');
    return null;
  }

  try {
    const https = require('https');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;

    return new Promise((resolve) => {
      https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.results && json.results.length > 0) {
              const location = json.results[0].geometry.location;
              resolve({ lat: location.lat, lng: location.lng });
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      }).on('error', () => resolve(null));
    });
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}

module.exports = async function handler(req, res) {
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
};
