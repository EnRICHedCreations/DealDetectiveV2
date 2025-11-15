import { useState, useEffect } from 'react';
import './App.css';
import PropertyCard from './components/PropertyCard';
import ScoreCard from './components/ScoreCard';
import FinalScore from './components/FinalScore';

function App() {
  const [properties, setProperties] = useState([]);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [answers, setAnswers] = useState({ arv: '', repairs: '', mao: '', lao: '' });
  const [scores, setScores] = useState([]);
  const [currentScore, setCurrentScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/properties');
      const data = await response.json();
      setProperties(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!answers.arv || !answers.repairs || !answers.mao || !answers.lao) {
      alert('Ahoy! Fill in all fields before submitting, ye scurvy dog!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: properties[currentPropertyIndex].id,
          answers: {
            arv: parseFloat(answers.arv),
            repairs: parseFloat(answers.repairs),
            mao: parseFloat(answers.mao),
            lao: parseFloat(answers.lao),
          },
        }),
      });

      const result = await response.json();
      setCurrentScore(result);
      setScores([...scores, { propertyId: properties[currentPropertyIndex].id, ...result }]);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const handleNextProperty = () => {
    if (currentPropertyIndex < properties.length - 1) {
      setCurrentPropertyIndex(currentPropertyIndex + 1);
      setAnswers({ arv: '', repairs: '', mao: '', lao: '' });
      setCurrentScore(null);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentPropertyIndex(0);
    setAnswers({ arv: '', repairs: '', mao: '', lao: '' });
    setScores([]);
    setCurrentScore(null);
    setGameComplete(false);
  };

  if (loading) {
    return <div className="loading">Loading treasure map...</div>;
  }

  if (properties.length === 0) {
    return <div className="loading">No properties found in the database!</div>;
  }

  if (gameComplete) {
    return <FinalScore scores={scores} onRestart={handleRestart} />;
  }

  const currentProperty = properties[currentPropertyIndex];

  return (
    <div className="App">
      <header className="pirate-header">
        <h1>⚓ Deal Detective ⚓</h1>
        <p className="subtitle">Pirate's Guide to Real Estate Treasure</p>
        <div className="progress">
          Property {currentPropertyIndex + 1} of {properties.length}
        </div>
      </header>

      <div className="game-container">
        <PropertyCard
          property={currentProperty}
          answers={answers}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          currentScore={currentScore}
        />

        {currentScore && (
          <ScoreCard
            score={currentScore}
            onNext={handleNextProperty}
            isLastProperty={currentPropertyIndex === properties.length - 1}
          />
        )}
      </div>
    </div>
  );
}

export default App;
