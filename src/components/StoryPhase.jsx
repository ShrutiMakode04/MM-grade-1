import { useState, useEffect } from 'react';
import { narrateText, stopNarration } from '../utils/audio';

const STORY_PARTS = [
  {
    title: "Strategy 1: Doubles",
    text: "Let's learn the Doubles trick with our friend, the Monkey! When you add the exact same number twice, like 6 plus 6, you just double it! So, 6 plus 6 instantly becomes 12. Easy, right?",
    image: "/images/story_doubles_1786010319083.png",
  },
  {
    title: "Strategy 2: Near Doubles",
    text: "Next up is Near Doubles, taught by the Elephant! If you see 6 plus 7, just think of it as double 6, which is 12. Since 7 is just one more than 6, add 1 extra to your 12. 12 plus 1 is 13!",
    image: "/images/story_near_doubles_1786010332372.png",
  },
  {
    title: "Strategy 3: Make a Ten",
    text: "Here is the Make a Ten trick with Bhalu the Bear! To add 8 and 5, first grab 2 from the 5 to turn that 8 into a perfect 10! Now you have a full 10, and 3 left over. 10 plus 3 makes 13. You are a math master!",
    image: "/images/story_make_ten_1786010356984.png",
  },
  {
    title: "Strategy 4: Counting On",
    text: "Finally, let's learn Counting On with the Lion! For 41 plus 3, you don't need to count all the way from one! Just start at the big number, 41, and count forward three times... 42... 43... 44!",
    image: "/images/story_counting_on_1786010388445.png",
  }
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (audioEnabled) {
      narrateText(`story_${step + 1}.mp3`);
    }
  }, [step, audioEnabled]);

  const handleNext = () => {
    if (step < STORY_PARTS.length - 1) {
      setStep(s => s + 1);
    } else {
      stopNarration();
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  return (
    <div className="story-phase" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem' }}>
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: '900px', minHeight: '400px', overflow: 'hidden', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
        
        <div style={{ flex: '1' }}>
          <img 
            src={STORY_PARTS[step].image} 
            alt={STORY_PARTS[step].title}
            style={{ width: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} 
          />
        </div>

        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            {STORY_PARTS[step].title}
          </h2>
          <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.6' }}>
            {STORY_PARTS[step].text}
          </p>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '900px', marginTop: '2rem' }}>
        <button 
          className="btn btn-outline" 
          onClick={handleBack}
          style={{ visibility: step > 0 ? 'visible' : 'hidden' }}
        >
          ← Back
        </button>

        <div className="progress-dots" style={{ margin: '0' }}>
          {STORY_PARTS.map((_, i) => (
            <div key={i} className={`progress-dot ${i === step ? 'active' : i < step ? 'completed' : ''}`} style={{ width: '12px', height: '12px', margin: '0 4px' }} />
          ))}
        </div>

        <button className="btn btn-primary" onClick={handleNext}>
          {step < STORY_PARTS.length - 1 ? 'Next →' : 'Simulate 🧪'}
        </button>
      </div>
    </div>
  );
}
