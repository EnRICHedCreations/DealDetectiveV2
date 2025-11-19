import { useState } from 'react';
import './PropertyCard.css';

function PropertyCard({ property, answers, onInputChange, onSubmit, currentScore }) {
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'streetview'

  const getGoogleMapUrl = (property) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // Using Google Maps Embed API - Map mode with marker
    if (property.lat && property.lng) {
      return `https://www.google.com/maps/embed/v1/place?q=${property.lat},${property.lng}&key=${apiKey}&zoom=18&maptype=satellite`;
    }
    // Fallback with address
    const encodedAddress = encodeURIComponent(property.address);
    return `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}&key=${apiKey}&zoom=18&maptype=satellite`;
  };

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
          <div className="map-view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              🗺️ Map View
            </button>
            <button
              className={`toggle-btn ${viewMode === 'streetview' ? 'active' : ''}`}
              onClick={() => setViewMode('streetview')}
            >
              👁️ Street View
            </button>
          </div>
          <div className="map-container">
            <iframe
              key={viewMode} // Force reload on view change
              src={viewMode === 'map' ? getGoogleMapUrl(property) : getGoogleStreetViewUrl(property)}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={viewMode === 'map' ? `Map of ${property.address}` : `Street view of ${property.address}`}
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
            <label>
              After Repair Value (ARV)
              <span className="info-icon" title="Amount a property is worth after all repairs, renovations, and improvements have been completed and the home is brought up to its full market value">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <text x="8" y="12" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">i</text>
                </svg>
                <span className="tooltip">Amount a property is worth after all repairs, renovations, and improvements have been completed and the home is brought up to its full market value</span>
              </span>
            </label>
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
            <label>
              Estimated Repairs
              <span className="info-icon" title="The full cost of repairs necessary to bring the property to its ARV">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <text x="8" y="12" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">i</text>
                </svg>
                <span className="tooltip">The full cost of repairs necessary to bring the property to its ARV</span>
              </span>
            </label>
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
            <label>
              Max Allowable Offer (MAO)
              <span className="info-icon" title="What an investor will pay for the property">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <text x="8" y="12" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">i</text>
                </svg>
                <span className="tooltip">What an investor will pay for the property</span>
              </span>
            </label>
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
            <label>
              Lowest Allowable Offer (LAO)
              <span className="info-icon" title="Your LowballOffer.ai offer">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <text x="8" y="12" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">i</text>
                </svg>
                <span className="tooltip">Your LowballOffer.ai offer</span>
              </span>
            </label>
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

          <div className={`input-group ${getScoreColor('deal')}`}>
            <label>Deal Quality</label>
            <select
              value={answers.deal || ''}
              onChange={(e) => onInputChange('deal', e.target.value)}
              disabled={currentScore !== null}
              className="deal-select"
            >
              <option value="">Select...</option>
              <option value="Good">Good</option>
              <option value="Okay">Okay</option>
              <option value="Bad">Bad</option>
            </select>
            {currentScore && (
              <div className="score-badge">
                Score: {currentScore.deal.score}/10
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
