const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.use(cors());
app.use(express.json());

// Store properties in memory
let properties = [];

// Read CSV file on server start
const loadProperties = () => {
  properties = [];
  fs.createReadStream(path.join(__dirname, 'sample_properties.csv'))
    .pipe(csv())
    .on('data', (row) => {
      properties.push({
        address: row.Address,
        notes: row.Notes,
        pictures: row.Pictures,
        contractPrice: parseFloat(row.ContractPrice) || 0,
        arv: parseFloat(row.ARV),
        repairs: parseFloat(row.Repairs),
        mao: parseFloat(row.MAO),
        lao: parseFloat(row.LAO),
      });
    })
    .on('end', () => {
      console.log(`Loaded ${properties.length} properties from CSV`);
    });
};

loadProperties();

// Geocode address to get coordinates
async function geocodeAddress(address) {
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

// Get all properties (without answers)
app.get('/api/properties', async (req, res) => {
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
  res.json(publicProperties);
});

// Submit answers and get score
app.post('/api/submit', (req, res) => {
  const { propertyId, answers } = req.body;

  if (propertyId >= properties.length || propertyId < 0) {
    return res.status(404).json({ error: 'Property not found' });
  }

  const property = properties[propertyId];

  // Calculate scores (1-10 scale)
  const calculateScore = (userValue, trueValue) => {
    const percentDiff = Math.abs((userValue - trueValue) / trueValue) * 100;

    // Score mapping:
    // 0-5% difference = 10
    // 5-10% difference = 9
    // 10-15% difference = 8
    // 15-20% difference = 7
    // 20-25% difference = 6
    // 25-30% difference = 5
    // 30-40% difference = 4
    // 40-50% difference = 3
    // 50-75% difference = 2
    // 75-100% difference = 1
    // >100% difference = 0

    if (percentDiff <= 5) return 10;
    if (percentDiff <= 10) return 9;
    if (percentDiff <= 15) return 8;
    if (percentDiff <= 20) return 7;
    if (percentDiff <= 25) return 6;
    if (percentDiff <= 30) return 5;
    if (percentDiff <= 40) return 4;
    if (percentDiff <= 50) return 3;
    if (percentDiff <= 75) return 2;
    if (percentDiff <= 100) return 1;
    return 0;
  };

  const getColorFromScore = (score) => {
    if (score >= 8) return 'green';
    if (score >= 5) return 'orange';
    return 'red';
  };

  const arvScore = calculateScore(answers.arv, property.arv);
  const repairsScore = calculateScore(answers.repairs, property.repairs);
  const maoScore = calculateScore(answers.mao, property.mao);
  const laoScore = calculateScore(answers.lao, property.lao);

  const averageScore = ((arvScore + repairsScore + maoScore + laoScore) / 4).toFixed(1);

  const results = {
    arv: {
      score: arvScore,
      color: getColorFromScore(arvScore),
      percentDiff: Math.abs((answers.arv - property.arv) / property.arv * 100).toFixed(1)
    },
    repairs: {
      score: repairsScore,
      color: getColorFromScore(repairsScore),
      percentDiff: Math.abs((answers.repairs - property.repairs) / property.repairs * 100).toFixed(1)
    },
    mao: {
      score: maoScore,
      color: getColorFromScore(maoScore),
      percentDiff: Math.abs((answers.mao - property.mao) / property.mao * 100).toFixed(1)
    },
    lao: {
      score: laoScore,
      color: getColorFromScore(laoScore),
      percentDiff: Math.abs((answers.lao - property.lao) / property.lao * 100).toFixed(1)
    },
    averageScore: parseFloat(averageScore)
  };

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
