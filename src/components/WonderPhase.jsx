import { useState, useEffect, useCallback, useRef } from 'react';
import { narrateText, stopNarration } from '../utils/audio';

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);

  const wonder = {
    question: "Look at these magic stones! 19 blue stones and 6 red stones. How can we add them super fast without counting one by one?",
    subtext: "Use the 'Make a 20' Strategy! Take 1 from the 6 to make 20, leaving 5. 20 plus 5 is 25!",
    emoji: "💎",
    bgEmojis: ["💎", "🔴", "✨", "🔢", "🌟"],
  };

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narrateText('wonder_question.mp3');
    }
  }, [stage, audioEnabled]);

  const handleDiscover = useCallback(() => {
    stopNarration();
    onComplete();
  }, [onComplete]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking">🧠</div>
          <div className="speech-bubble wonder-bubble">Hmm... I wonder... 🤔</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>
        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
