import { useState, useEffect } from 'react';
import { narrateText, stopNarration } from '../utils/audio';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'Spot the trick' },
  { icon: '📖', label: 'Story', desc: 'Animal Math' },
  { icon: '🧪', label: 'Simulate', desc: 'Build totals' },
  { icon: '🎮', label: 'Practice', desc: 'Test skills' },
  { icon: '📓', label: 'Reflect', desc: 'Review' },
];

export default function IntroScreen({ onStart, audioEnabled }) {
  const [started, setStarted] = useState(false);

  // We only play audio if audio is enabled AND the user has clicked Start Learning
  useEffect(() => {
    if (started && audioEnabled) {
      narrateText('intro.mp3');
    }
  }, [started, audioEnabled]);

  const handleStartLearning = () => {
    setStarted(true);
  };

  const handleStartJourney = () => {
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen">
      {/* Title */}
      <h1 className="intro-title" style={{ fontSize: '3rem', marginTop: '1.5rem' }}>
        <span style={{ color: 'var(--gold)' }}>Mental Math</span>{' '}—{' '}
        <span style={{ color: 'var(--coral)' }}>Strategies</span>
      </h1>

      {/* Mascot */}
      <div className="mascot-container" style={{ margin: '2rem 0' }}>
        <div className="mascot" style={{ fontSize: '4rem' }}>🧠</div>
        <div className="speech-bubble" style={{ fontSize: '1.2rem' }}>
          Super Fast! ✨
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc" style={{ fontSize: '1.4rem', lineHeight: '1.5', padding: '0 1.5rem' }}>
        Join the Math Animals to learn amazing <strong style={{ color: 'var(--gold)' }}>Mental Math Strategies</strong> to solve problems super fast in your head!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map" style={{ marginTop: '2rem' }}>
        <h3 className="intro-journey-title" style={{ fontSize: '1.5rem' }}>Your Learning Journey</h3>
        <div className="intro-journey-steps" style={{ gap: '1rem' }}>
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon" style={{ fontSize: '2rem', width: '50px', height: '50px' }}>{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label" style={{ fontSize: '1.2rem' }}>{p.label}</div>
                <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow" style={{ fontSize: '1.5rem' }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!started ? (
        <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStartLearning} style={{ fontSize: '1.5rem', padding: '0.8rem 2rem', marginTop: '2.5rem' }}>
          Start Learning 🚀
        </button>
      ) : (
        <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStartJourney} style={{ fontSize: '1.5rem', padding: '0.8rem 2rem', marginTop: '2.5rem', backgroundColor: 'var(--gold)' }}>
          Let's Add! →
        </button>
      )}
    </div>
  );
}
