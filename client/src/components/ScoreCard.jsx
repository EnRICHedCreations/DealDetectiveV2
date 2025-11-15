import './ScoreCard.css';

function ScoreCard({ score, onNext, isLastProperty }) {
  const getScoreMessage = (avgScore) => {
    if (avgScore >= 9) return 'Arrr! Ye be a legendary pirate!';
    if (avgScore >= 7) return 'Well done, ye salty sea dog!';
    if (avgScore >= 5) return 'Not bad, but ye need more practice!';
    return 'Walk the plank! Better luck next time!';
  };

  return (
    <div className="score-card">
      <h2 className="score-title">🏴‍☠️ Your Score 🏴‍☠️</h2>

      <div className="average-score">
        <div className="score-circle">
          {score.averageScore.toFixed(1)}
          <span className="score-max">/10</span>
        </div>
        <p className="score-message">{getScoreMessage(score.averageScore)}</p>
      </div>

      <div className="score-breakdown">
        <div className="score-item">
          <span className="score-label">ARV:</span>
          <span className={`score-value ${score.arv.color}`}>
            {score.arv.score}/10 ({score.arv.percentDiff}% off)
          </span>
        </div>
        <div className="score-item">
          <span className="score-label">Repairs:</span>
          <span className={`score-value ${score.repairs.color}`}>
            {score.repairs.score}/10 ({score.repairs.percentDiff}% off)
          </span>
        </div>
        <div className="score-item">
          <span className="score-label">MAO:</span>
          <span className={`score-value ${score.mao.color}`}>
            {score.mao.score}/10 ({score.mao.percentDiff}% off)
          </span>
        </div>
        <div className="score-item">
          <span className="score-label">LAO:</span>
          <span className={`score-value ${score.lao.color}`}>
            {score.lao.score}/10 ({score.lao.percentDiff}% off)
          </span>
        </div>
      </div>

      <button className="next-btn" onClick={onNext}>
        {isLastProperty ? '🏁 View Final Results' : '⚓ Next Property'}
      </button>
    </div>
  );
}

export default ScoreCard;
