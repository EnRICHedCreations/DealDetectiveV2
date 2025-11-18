import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './FinalScore.css';

function FinalScore({ scores, onRestart }) {
  const reportRef = useRef(null);

  const calculateOverallAverage = () => {
    const sum = scores.reduce((acc, score) => acc + score.averageScore, 0);
    return (sum / scores.length).toFixed(1);
  };

  const downloadReport = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#1a1a2e',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`deal-detective-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
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
      <div className="final-score-container" ref={reportRef}>
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
