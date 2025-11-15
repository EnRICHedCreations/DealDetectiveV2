import './FinalScore.css';

function FinalScore({ scores, onRestart }) {
  const calculateOverallAverage = () => {
    const sum = scores.reduce((acc, score) => acc + score.averageScore, 0);
    return (sum / scores.length).toFixed(1);
  };

  const downloadReport = () => {
    const overallAvg = calculateOverallAverage();
    let reportContent = `Deal Detective V2 - Score Report\n`;
    reportContent += `${'='.repeat(50)}\n\n`;
    reportContent += `Overall Average Score: ${overallAvg}/10\n\n`;
    reportContent += `Property Breakdown:\n`;
    reportContent += `${'-'.repeat(50)}\n\n`;

    scores.forEach((score, index) => {
      reportContent += `Property ${index + 1}:\n`;
      reportContent += `  ARV Score: ${score.arv.score}/10 (${score.arv.percentDiff}% off)\n`;
      reportContent += `  Repairs Score: ${score.repairs.score}/10 (${score.repairs.percentDiff}% off)\n`;
      reportContent += `  MAO Score: ${score.mao.score}/10 (${score.mao.percentDiff}% off)\n`;
      reportContent += `  LAO Score: ${score.lao.score}/10 (${score.lao.percentDiff}% off)\n`;
      reportContent += `  Average: ${score.averageScore.toFixed(1)}/10\n\n`;
    });

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deal-detective-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const overallAvg = calculateOverallAverage();

  const getMessage = () => {
    if (overallAvg >= 9) return 'Ye be a master of the seven seas! 🏴‍☠️';
    if (overallAvg >= 7) return 'A fine pirate ye are! Keep it up! ⚓';
    if (overallAvg >= 5) return 'Ye be improving, sailor! Practice makes perfect! 🌊';
    return 'Back to pirate school with ye! 🦜';
  };

  return (
    <div className="final-score">
      <div className="final-score-container">
        <h1 className="final-title">🏴‍☠️ Final Results 🏴‍☠️</h1>

        <div className="overall-score">
          <div className="big-score-circle">
            {overallAvg}
            <span className="score-max">/10</span>
          </div>
          <h2 className="final-message">{getMessage()}</h2>
        </div>

        <div className="property-scores">
          <h3>Property Breakdown</h3>
          {scores.map((score, index) => (
            <div key={index} className="property-score-row">
              <span className="property-number">Property {index + 1}:</span>
              <div className="mini-scores">
                <span className={`mini-score ${score.arv.color}`}>ARV: {score.arv.score}</span>
                <span className={`mini-score ${score.repairs.color}`}>REP: {score.repairs.score}</span>
                <span className={`mini-score ${score.mao.color}`}>MAO: {score.mao.score}</span>
                <span className={`mini-score ${score.lao.color}`}>LAO: {score.lao.score}</span>
                <span className="avg-badge">Avg: {score.averageScore.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="final-actions">
          <button className="download-btn" onClick={downloadReport}>
            📥 Download Report
          </button>
          <button className="restart-btn" onClick={onRestart}>
            🔄 Start New Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinalScore;
