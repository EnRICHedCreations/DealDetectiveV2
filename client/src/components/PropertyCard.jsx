import './PropertyCard.css';

function PropertyCard({ property, answers, onInputChange, onSubmit, currentScore }) {
  const getGoogleStreetViewUrl = (property) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // Using Google Maps Embed API - Street View mode with coordinates
    if (property.lat && property.lng) {
      return `https://www.google.com/maps/embed/v1/streetview?location=${property.lat},${property.lng}&key=${apiKey}&heading=0&pitch=0&fov=90`;
    }
    // Fallback to Street View Static API with address
    const encodedAddress = encodeURIComponent(property.address);
    return `https://www.google.com/maps/embed/v1/streetview?location=${encodedAddress}&key=${apiKey}&heading=0&pitch=0&fov=90`;
  };

  const getScoreColor = (field) => {
    if (!currentScore) return '';
    return currentScore[field]?.color || '';
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return '$' + parseFloat(value).toLocaleString();
  };

  return (
    <div className="property-card">
      <h2 className="property-address">📍 {property.address}</h2>

      <div className="property-main">
        <div className="map-section">
          <div className="street-view">
            <iframe
              src={getGoogleStreetViewUrl(property)}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Street view of ${property.address}`}
            />
          </div>
        </div>

        <div className="info-section">
          <div className="property-info">
            <h3>⚓ Property Details</h3>
            <div className="info-item">
              <strong>Contract Price:</strong> {formatCurrency(property.contractPrice)}
            </div>
            <div className="info-item">
              <strong>Notes:</strong> {property.notes || 'No notes'}
            </div>
            {property.pictures && (
              <div className="info-item">
                <strong>Pictures:</strong>{' '}
                <a href={property.pictures} target="_blank" rel="noopener noreferrer" className="treasure-link">
                  View Photos
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="input-section">
        <h3>🏴‍☠️ Make Your Estimates, Matey!</h3>
        <div className="input-grid">
          <div className={`input-group ${getScoreColor('arv')}`}>
            <label>After Repair Value (ARV)</label>
            <input
              type="number"
              value={answers.arv}
              onChange={(e) => onInputChange('arv', e.target.value)}
              placeholder="$0"
              disabled={currentScore !== null}
            />
            {currentScore && (
              <div className="score-badge">
                Score: {currentScore.arv.score}/10
              </div>
            )}
          </div>

          <div className={`input-group ${getScoreColor('repairs')}`}>
            <label>Estimated Repairs</label>
            <input
              type="number"
              value={answers.repairs}
              onChange={(e) => onInputChange('repairs', e.target.value)}
              placeholder="$0"
              disabled={currentScore !== null}
            />
            {currentScore && (
              <div className="score-badge">
                Score: {currentScore.repairs.score}/10
              </div>
            )}
          </div>

          <div className={`input-group ${getScoreColor('mao')}`}>
            <label>Max Allowable Offer (MAO)</label>
            <input
              type="number"
              value={answers.mao}
              onChange={(e) => onInputChange('mao', e.target.value)}
              placeholder="$0"
              disabled={currentScore !== null}
            />
            {currentScore && (
              <div className="score-badge">
                Score: {currentScore.mao.score}/10
              </div>
            )}
          </div>

          <div className={`input-group ${getScoreColor('lao')}`}>
            <label>Lowest Allowable Offer (LAO)</label>
            <input
              type="number"
              value={answers.lao}
              onChange={(e) => onInputChange('lao', e.target.value)}
              placeholder="$0"
              disabled={currentScore !== null}
            />
            {currentScore && (
              <div className="score-badge">
                Score: {currentScore.lao.score}/10
              </div>
            )}
          </div>
        </div>

        {!currentScore && (
          <button className="submit-btn" onClick={onSubmit}>
            Submit Estimate
          </button>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;
