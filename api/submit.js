// Vercel Serverless Function for submitting answers and calculating scores

// Sample properties data (must match properties.js)
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

const calculateScore = (userValue, trueValue) => {
  const percentDiff = Math.abs((userValue - trueValue) / trueValue) * 100;

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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { propertyId, answers } = req.body;

    if (propertyId >= properties.length || propertyId < 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = properties[propertyId];

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

    res.status(200).json(results);
  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
