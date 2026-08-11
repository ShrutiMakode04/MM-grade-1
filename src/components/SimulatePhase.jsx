import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { narrateText, stopNarration } from '../utils/audio';

const STATIONS = [
  { id: 0, title: 'Doubles Mirror', icon: '👯' },
  { id: 1, title: 'Near Doubles Machine', icon: '🐘' },
  { id: 2, title: 'Make a Ten', icon: '🐻' },
  { id: 3, title: 'Counting On Jump', icon: '🐵' },
  { id: 4, title: 'Zero Power', icon: '🦸' },
  { id: 5, title: 'Switcheroo', icon: '🔁' },
  { id: 6, title: 'Fast Tens Builder', icon: '⚡' },
  { id: 7, title: 'Make a Twenty', icon: '💎' }
];

function triggerFeedback(isCorrect, audioEnabled, onDone) {
  stopNarration();
  if (isCorrect) {
    if (audioEnabled) narrateText('very_good.mp3');
  } else {
    if (audioEnabled) narrateText('not_correct.mp3');
  }
  if (onDone) setTimeout(onDone, 1500);
}

// 1. Doubles Mirror
function Station1_Doubles({ roundIdx, onNext, audioEnabled }) {
  const target = roundIdx === 0 ? 5 : 8;
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (audioEnabled) narrateText(roundIdx === 0 ? 'sim_d_5.mp3' : 'sim_d_8.mp3');
  }, [roundIdx, audioEnabled]);

  const handleAdd = () => {
    if (count < target) {
      setCount(c => c + 1);
      if (count + 1 === target) {
        setDone(true);
        triggerFeedback(true, audioEnabled, null);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Double {target} = ?</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ border: '4px solid var(--blue)', width: '150px', height: '200px', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          {Array.from({length: count}).map((_, i) => <motion.div key={i} initial={{scale:0}} animate={{scale:1}} style={{fontSize: '2rem'}}>🍌</motion.div>)}
        </div>
        <div style={{ border: '4px solid var(--blue)', width: '150px', height: '200px', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          {Array.from({length: count}).map((_, i) => <motion.div key={i} initial={{scale:0}} animate={{scale:1}} style={{fontSize: '2rem'}}>🍌</motion.div>)}
        </div>
      </div>
      <p style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>{count} + {count} = {count * 2}</p>
      {!done ? (
        <button className="btn btn-primary" onClick={handleAdd}>+ Add to Both</button>
      ) : (
        <button className="btn btn-primary" onClick={onNext} style={{ backgroundColor: 'var(--green)' }}>Next →</button>
      )}
    </div>
  );
}

// 2. Near Doubles
function Station2_NearDoubles({ roundIdx, onNext, audioEnabled }) {
  const base = roundIdx === 0 ? 5 : 8;
  const [added, setAdded] = useState(false);
  
  useEffect(() => {
    if (audioEnabled) narrateText(roundIdx === 0 ? 'sim_nd_5.mp3' : 'sim_nd_8.mp3');
  }, [roundIdx, audioEnabled]);

  const handleAdd = () => {
    setAdded(true);
    triggerFeedback(true, audioEnabled, null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Solve {base} + {base + 1}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '150px', gap: '5px' }}>
          {Array.from({length: base}).map((_, i) => <div key={i} style={{fontSize: '2rem'}}>🍎</div>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '150px', gap: '5px' }}>
          {Array.from({length: base}).map((_, i) => <div key={i} style={{fontSize: '2rem'}}>🍎</div>)}
          {added && <motion.div initial={{y: -50, opacity: 0}} animate={{y: 0, opacity: 1}} style={{fontSize: '2rem'}}>🍏</motion.div>}
        </div>
      </div>
      <p style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1rem' }}>
        {base} + {base} = {base * 2} <br/>
        {added && <span style={{color: 'var(--gold)'}}>So, {base} + {base + 1} = {base * 2 + 1}</span>}
      </p>
      {!added ? (
        <button className="btn btn-primary" onClick={handleAdd}>+1 More</button>
      ) : (
        <button className="btn btn-primary" onClick={onNext} style={{ backgroundColor: 'var(--green)' }}>Next →</button>
      )}
    </div>
  );
}

// 3. Make a Ten
function Station3_MakeTen({ roundIdx, onNext, audioEnabled }) {
  const p1 = roundIdx === 0 ? 8 : 7;
  const p2 = roundIdx === 0 ? 5 : 5;
  const [moved, setMoved] = useState(0);
  const needed = 10 - p1;

  useEffect(() => {
    if (audioEnabled) narrateText(roundIdx === 0 ? 'sim_m10_8.mp3' : 'sim_m10_7.mp3');
  }, [roundIdx, audioEnabled]);

  const handleMove = () => {
    if (moved < needed) {
      setMoved(m => m + 1);
      if (moved + 1 === needed) {
        triggerFeedback(true, audioEnabled, null);
      }
    }
  };

  const done = moved === needed;

  return (
    <div className="sim-station">
      <h3>Make a Ten (Round {roundIdx + 1}/2)</h3>
      <div className="sim-instruction">Make a Ten: {p1} + {p2}</div>
      {moved === needed && (
        <div className="sim-instruction" style={{ color: 'var(--gold)', fontSize: '1.5rem', marginTop: '0.5rem' }}>
          10 + {p2 - needed} = {10 + (p2 - needed)}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px' }}>
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} style={{ width: '40px', height: '40px', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(i < p1) && <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'var(--blue)'}} />}
              {(i >= p1 && i < p1 + moved) && <motion.div layoutId={`stone-${i}`} style={{width:'30px', height:'30px', borderRadius:'50%', background:'var(--coral)'}} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {Array.from({length: p2 - moved}).map((_, i) => (
            <motion.div layoutId={`stone-${p1 + moved + i}`} key={i} onClick={handleMove} style={{width:'30px', height:'30px', borderRadius:'50%', background:'var(--coral)', cursor: 'pointer'}} />
          ))}
        </div>
      </div>
      <p style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '1rem' }}>
        {done ? `10 + ${p2 - needed} = ${10 + p2 - needed}` : 'Keep moving stones!'}
      </p>
      {done && <button className="btn btn-primary" onClick={onNext} style={{ backgroundColor: 'var(--green)' }}>Next →</button>}
    </div>
  );
}

// 4. Counting On
function Station4_CountingOn({ roundIdx, onNext, audioEnabled }) {
  const start = roundIdx === 0 ? 42 : 55;
  const jumps = roundIdx === 0 ? 3 : 4;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (audioEnabled) narrateText(roundIdx === 0 ? 'sim_co_42.mp3' : 'sim_co_55.mp3');
  }, [roundIdx, audioEnabled]);

  const handleJump = () => {
    if (current < jumps) {
      setCurrent(c => c + 1);
      if (current + 1 === jumps) {
        triggerFeedback(true, audioEnabled, null);
      }
    }
  };

  const done = current === jumps;

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '2rem' }}>Count on: {start} + {jumps}</h3>
      <div style={{ position: 'relative', width: '100%', height: '100px', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ width: '100%', height: '4px', background: 'white', position: 'absolute' }} />
        {Array.from({length: jumps + 1}).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${(i / jumps) * 90 + 5}%`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: i <= current ? 'var(--green)' : 'gray', zIndex: 2 }} />
            <span style={{ color: 'white', marginTop: '10px', fontSize: '1.2rem', opacity: i <= current ? 1 : 0.5 }}>{start + i}</span>
          </div>
        ))}
        <motion.div 
          animate={{ left: `${(current / jumps) * 90 + 5}%`, y: [0, -30, 0] }} 
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', top: '-40px', fontSize: '2rem', zIndex: 10, marginLeft: '-15px' }}
        >
          🐸
        </motion.div>
      </div>
      {!done ? (
        <button className="btn btn-primary" onClick={handleJump}>Jump +1</button>
      ) : (
        <button className="btn btn-primary" onClick={onNext} style={{ backgroundColor: 'var(--green)' }}>Next →</button>
      )}
    </div>
  );
}

// 5. Zero Power
function Station5_ZeroPower({ roundIdx, onNext, audioEnabled }) {
  const num = roundIdx === 0 ? 17 : 24;
  const [combined, setCombined] = useState(false);

  useEffect(() => {
    if (audioEnabled) narrateText(roundIdx === 0 ? 'sim_zp_17.mp3' : 'sim_zp_24.mp3');
  }, [roundIdx, audioEnabled]);

  const handleCombine = () => {
    setCombined(true);
    triggerFeedback(true, audioEnabled, null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '2rem' }}>Zero Power: {num} + 0</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <motion.div animate={combined ? { x: 100, opacity: 0 } : {}} style={{ width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', border: '2px solid var(--blue)', borderRadius: '10px' }}>
          📦<span style={{fontSize:'1rem'}}>{num}</span>
        </motion.div>
        <span style={{ fontSize: '3rem', color: 'white' }}>+</span>
        <motion.div animate={combined ? { x: -100, scale: 1.2 } : {}} style={{ width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', border: '2px dashed gray', borderRadius: '10px' }}>
          0
        </motion.div>
      </div>
      {combined && <p style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>It stays exactly {num}!</p>}
      {!combined ? (
        <button className="btn btn-primary" onClick={handleCombine}>Combine!</button>
      ) : (
        <button className="btn btn-primary" onClick={onNext} style={{ backgroundColor: 'var(--green)' }}>Next →</button>
      )}
    </div>
  );
}

// 6. Switcheroo
function Station6_Switcheroo({ roundIdx, onNext, audioEnabled }) {
  const p1 = roundIdx === 0 ? 3 : 2;
  const p2 = roundIdx === 0 ? 8 : 9;
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    if (audioEnabled) narrateText(roundIdx === 0 ? 'sim_sw_3.mp3' : 'sim_sw_2.mp3');
  }, [roundIdx, audioEnabled]);

  const handleSwap = () => {
    setSwapped(true);
    triggerFeedback(true, audioEnabled, null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '2rem' }}>Switcheroo: {p1} + {p2}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', position: 'relative', height: '100px' }}>
        <motion.div animate={{ x: swapped ? 150 : 0 }} style={{ position: 'absolute', left: 'calc(50% - 120px)', width: '80px', height: '80px', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', borderRadius: '10px', color: 'white' }}>
          {p1}
        </motion.div>
        <div style={{ position: 'absolute', left: 'calc(50% - 10px)', top: '20px', fontSize: '2rem', color: 'white' }}>+</div>
        <motion.div animate={{ x: swapped ? -150 : 0 }} style={{ position: 'absolute', left: 'calc(50% + 40px)', width: '80px', height: '80px', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', borderRadius: '10px', color: 'white' }}>
          {p2}
        </motion.div>
      </div>
      <p style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '1rem' }}>
        Total is still {p1 + p2}!
      </p>
      {!swapped ? (
        <button className="btn btn-primary" onClick={handleSwap}>Swap 🔁</button>
      ) : (
        <button className="btn btn-primary" onClick={onNext} style={{ backgroundColor: 'var(--green)' }}>Next →</button>
      )}
    </div>
  );
}

// 7. Fast Tens
function Station7_FastTens({ roundIdx, onNext, audioEnabled }) {
  const p2 = roundIdx === 0 ? 6 : 8;
  const [added, setAdded] = useState(0);

  useEffect(() => {
    if (audioEnabled) narrateText(roundIdx === 0 ? 'sim_ft_6.mp3' : 'sim_ft_8.mp3');
  }, [roundIdx, audioEnabled]);

  const handleAdd = () => {
    if (added < p2) {
      setAdded(a => a + 1);
      if (added + 1 === p2) {
        triggerFeedback(true, audioEnabled, null);
      }
    }
  };

  const done = added === p2;

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '2rem' }}>Fast Tens: 10 + {p2}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', height: '150px' }}>
        <div style={{ width: '40px', height: '100%', background: 'var(--gold)', borderRadius: '5px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '2px solid #b8860b' }}>
          {Array.from({length: 10}).map((_, i) => <div key={i} style={{ flex: 1, borderBottom: '1px solid rgba(0,0,0,0.2)' }} />)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100px', alignContent: 'flex-start', gap: '5px' }}>
          <AnimatePresence>
            {Array.from({length: added}).map((_, i) => (
              <motion.div key={i} initial={{opacity: 0, scale: 0}} animate={{opacity: 1, scale: 1}} style={{ width: '25px', height: '25px', background: 'var(--coral)', borderRadius: '3px', border: '1px solid #cc0000' }} />
            ))}
          </AnimatePresence>
        </div>
      </div>
      <p style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>Total: {10 + added}</p>
      {!done ? (
        <button className="btn btn-primary" onClick={handleAdd}>Add 1s Block</button>
      ) : (
        <button className="btn btn-primary" onClick={onNext} style={{ backgroundColor: 'var(--green)' }}>Next →</button>
      )}
    </div>
  );
}

// 8. Make a Twenty
function Station8_MakeTwenty({ roundIdx, onNext, audioEnabled }) {
  const p1 = roundIdx === 0 ? 19 : 18;
  const p2 = roundIdx === 0 ? 4 : 6;
  const [moved, setMoved] = useState(0);
  const needed = 20 - p1;

  useEffect(() => {
    if (audioEnabled) narrateText(roundIdx === 0 ? 'sim_m20_19.mp3' : 'sim_m20_18.mp3');
  }, [roundIdx, audioEnabled]);

  const handleMove = () => {
    if (moved < needed) {
      setMoved(m => m + 1);
      if (moved + 1 === needed) {
        triggerFeedback(true, audioEnabled, null);
      }
    }
  };

  const done = moved === needed;

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ color: 'white', marginBottom: '1rem' }}>Make a Twenty: {p1} + {p2}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {/* Full 10 frame */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px', background: 'rgba(255,255,255,0.1)', padding: '5px' }}>
          {Array.from({length: 10}).map((_, i) => <div key={i} style={{ width: '20px', height: '20px', background: 'var(--blue)', borderRadius: '50%' }} />)}
        </div>
        {/* Partial 10 frame */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px', background: 'rgba(255,255,255,0.1)', padding: '5px' }}>
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} style={{ width: '20px', height: '20px', border: '1px solid white', borderRadius: '50%', display:'flex', justifyContent:'center', alignItems:'center' }}>
              {(i < p1 - 10) && <div style={{width:'16px', height:'16px', background:'var(--blue)', borderRadius:'50%'}}/>}
              {(i >= p1 - 10 && i < p1 - 10 + moved) && <motion.div layoutId={`t20-${i}`} style={{width:'16px', height:'16px', background:'var(--coral)', borderRadius:'50%'}}/>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '1rem' }}>
        {Array.from({length: p2 - moved}).map((_, i) => (
           <motion.div layoutId={`t20-${p1 - 10 + moved + i}`} key={i} onClick={handleMove} style={{width:'20px', height:'20px', background:'var(--coral)', borderRadius:'50%', cursor: 'pointer'}} />
        ))}
      </div>
      <p style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '1rem' }}>
        {done ? `20 + ${p2 - needed} = ${20 + p2 - needed}` : `Need ${needed - moved} more to make 20!`}
      </p>
      {done && <button className="btn btn-primary" onClick={onNext} style={{ backgroundColor: 'var(--green)' }}>Next →</button>}
    </div>
  );
}

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [stationIdx, setStationIdx] = useState(0);
  const [roundIdx, setRoundIdx] = useState(0);
  
  const station = STATIONS[stationIdx];

  const handleNext = () => {
    stopNarration();
    if (roundIdx === 0) {
      setRoundIdx(1);
    } else {
      if (stationIdx < STATIONS.length - 1) {
        setStationIdx(s => s + 1);
        setRoundIdx(0);
      } else {
        onComplete();
      }
    }
  };

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Interactive Strategy Toys</p>
      </div>
      
      <div className="progress-dots" style={{ flexWrap: 'wrap' }}>
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === stationIdx ? 'active' : i < stationIdx ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ maxWidth: '800px', width: '100%', animation: 'slideUp 0.4s ease', padding: '2rem' }}>
        <div className="station-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gold)' }}>{station.icon} {station.title} (Round {roundIdx + 1}/2)</h2>
        </div>
        
        {stationIdx === 0 && <Station1_Doubles key={`0-${roundIdx}`} roundIdx={roundIdx} onNext={handleNext} audioEnabled={audioEnabled} />}
        {stationIdx === 1 && <Station2_NearDoubles key={`1-${roundIdx}`} roundIdx={roundIdx} onNext={handleNext} audioEnabled={audioEnabled} />}
        {stationIdx === 2 && <Station3_MakeTen key={`2-${roundIdx}`} roundIdx={roundIdx} onNext={handleNext} audioEnabled={audioEnabled} />}
        {stationIdx === 3 && <Station4_CountingOn key={`3-${roundIdx}`} roundIdx={roundIdx} onNext={handleNext} audioEnabled={audioEnabled} />}
        {stationIdx === 4 && <Station5_ZeroPower key={`4-${roundIdx}`} roundIdx={roundIdx} onNext={handleNext} audioEnabled={audioEnabled} />}
        {stationIdx === 5 && <Station6_Switcheroo key={`5-${roundIdx}`} roundIdx={roundIdx} onNext={handleNext} audioEnabled={audioEnabled} />}
        {stationIdx === 6 && <Station7_FastTens key={`6-${roundIdx}`} roundIdx={roundIdx} onNext={handleNext} audioEnabled={audioEnabled} />}
        {stationIdx === 7 && <Station8_MakeTwenty key={`7-${roundIdx}`} roundIdx={roundIdx} onNext={handleNext} audioEnabled={audioEnabled} />}

      </div>
    </div>
  );
}
