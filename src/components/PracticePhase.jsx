import React, { useState, useEffect } from 'react';
import { narrateText, stopNarration } from '../utils/audio';

export default function PracticePhase({ onComplete, audioEnabled }) {
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);

  // 30 Patterned Questions
  const questions = [
    { q: "What is 7 + 7?", options: [13, 14, 15, 12], answer: 14 },
    { q: "Solve using make a ten: 8 + 5", options: [11, 12, 13, 14], answer: 13 },
    { q: "Near doubles: If 6 + 6 is 12, what is 6 + 7?", options: [13, 11, 14, 12], answer: 13 },
    { q: "Counting on: 42 + 3", options: [44, 45, 46, 43], answer: 45 },
    { q: "Fast tens: 10 + 9", options: [19, 18, 90, 29], answer: 19 },
    { q: "What is 8 + 8?", options: [15, 16, 17, 18], answer: 16 },
    { q: "Zero power: 25 + 0", options: [0, 25, 26, 24], answer: 25 },
    { q: "Switcheroo: 4 + 9 is the same as 9 + ?", options: [3, 5, 4, 13], answer: 4 },
    { q: "Make a twenty: 19 + 4", options: [22, 23, 24, 25], answer: 23 },
    { q: "Near doubles: 8 + 9", options: [15, 16, 17, 18], answer: 17 },
    { q: "Make a ten: 7 + 4", options: [10, 11, 12, 13], answer: 11 },
    { q: "Counting on: 55 + 4", options: [57, 58, 59, 60], answer: 59 },
    { q: "What is 5 + 5?", options: [9, 10, 11, 15], answer: 10 },
    { q: "Fast tens: 10 + 7", options: [17, 70, 71, 16], answer: 17 },
    { q: "Make a twenty: 18 + 5", options: [22, 23, 24, 25], answer: 23 },
    { q: "Zero power: 0 + 13", options: [130, 0, 13, 1], answer: 13 },
    { q: "Switcheroo: 2 + 8 is the same as 8 + ?", options: [2, 10, 8, 4], answer: 2 },
    { q: "Near doubles: 7 + 8", options: [14, 15, 16, 17], answer: 15 },
    { q: "Make a ten: 9 + 6", options: [13, 14, 15, 16], answer: 15 },
    { q: "What is 9 + 9?", options: [17, 18, 19, 20], answer: 18 },
    { q: "Counting on: 31 + 2", options: [32, 33, 34, 35], answer: 33 },
    { q: "Fast tens: 10 + 4", options: [13, 14, 15, 40], answer: 14 },
    { q: "Make a twenty: 19 + 6", options: [23, 24, 25, 26], answer: 25 },
    { q: "Near doubles: 5 + 6", options: [10, 11, 12, 13], answer: 11 },
    { q: "Make a ten: 8 + 7", options: [14, 15, 16, 17], answer: 15 },
    { q: "Zero power: 100 + 0", options: [1000, 10, 100, 0], answer: 100 },
    { q: "Switcheroo: 5 + 7 is the same as 7 + ?", options: [5, 12, 7, 2], answer: 5 },
    { q: "What is 4 + 4?", options: [6, 7, 8, 9], answer: 8 },
    { q: "Counting on: 88 + 3", options: [90, 91, 92, 93], answer: 91 },
    { q: "Fast tens: 10 + 2", options: [11, 12, 13, 20], answer: 12 }
  ];

  const currentQ = questions[qIndex];

  useEffect(() => {
    if (audioEnabled) {
      narrateText(`prac_${qIndex}.mp3`);
    }
  }, [qIndex, audioEnabled]);

  const handleSelect = (opt) => {
    stopNarration();
    if (opt === currentQ.answer) {
      setScore(s => s + 1);
      if (audioEnabled) narrateText('very_good.mp3');
    } else {
      if (audioEnabled) narrateText('not_correct.mp3');
    }
    
    setTimeout(() => {
      if (qIndex < questions.length - 1) {
        setQIndex(i => i + 1);
      } else {
        onComplete({ score: score + (opt === currentQ.answer ? 1 : 0), total: questions.length });
      }
    }, 1500);
  };

  return (
    <div className="practice-phase" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '800px', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center' }}>
          {currentQ.q}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%' }}>
          {currentQ.options.map((opt, i) => (
            <button 
              key={i} 
              className="btn btn-outline" 
              onClick={() => handleSelect(opt)}
              style={{ fontSize: '2rem', padding: '1.5rem', borderRadius: '16px' }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <p style={{ marginTop: '3rem', color: 'rgba(255,255,255,0.8)', fontSize: '1.5rem' }}>
        Question {qIndex + 1} of {questions.length}
      </p>
    </div>
  );
}
