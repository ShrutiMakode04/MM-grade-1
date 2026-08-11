import React, { useEffect } from 'react';
import { narrateText, stopNarration } from '../utils/audio';

export default function ReflectPhase({ stats, onRestart, audioEnabled }) {
  useEffect(() => {
    if (audioEnabled) {
      // Play "Great job! You scored " then wait and play the number, then play " out of 30..."
      narrateText('reflect_great_job.mp3');
      setTimeout(() => narrateText(`num_${stats?.score}.mp3`), 1500);
      setTimeout(() => narrateText('reflect_out_of_30.mp3'), 2500);
    }
  }, [audioEnabled, stats]);

  return (
    <div className="reflect-phase" style={{ textAlign: 'center', padding: '4rem' }}>
      <h2 style={{ color: 'var(--gold)', fontSize: '3rem', marginBottom: '1rem' }}>Reflection</h2>
      <p style={{ color: 'white', fontSize: '1.5rem', marginBottom: '3rem' }}>
        You've explored all the Mental Math Strategies!
      </p>

      <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
        <h3 style={{ color: 'var(--coral)', fontSize: '2rem', marginBottom: '1rem' }}>Your Score</h3>
        <p style={{ color: 'white', fontSize: '4rem', fontWeight: 'bold' }}>
          {stats?.score} / {stats?.total}
        </p>
        <p style={{ color: 'var(--green)', fontSize: '1.5rem', marginTop: '1rem', fontWeight: 'bold' }}>
          {stats?.score === stats?.total ? "Perfect!" : "Good effort!"}
        </p>
      </div>

      <button className="btn btn-primary btn-lg" onClick={() => { stopNarration(); onRestart(); }} style={{ marginTop: '3rem' }}>
        Play Again! 🔄
      </button>
    </div>
  );
}
