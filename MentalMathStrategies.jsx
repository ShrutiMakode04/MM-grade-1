import { useState, useEffect, useCallback, useRef } from "react";

// ─── CONSTANTS & DATA ────────────────────────────────────────────────────────
const STRATEGIES = [
  {
    id: "countingOn",
    title: "Counting On",
    emoji: "🐸",
    color: "#10b981",
    bg: "#d1fae5",
    dark: "#065f46",
    description: "Start from the bigger number and count on!",
    tip: "Always start from the BIGGER number and count on the smaller one!",
    mascotMood: "jumping",
    storyTitle: "Milo's Banana Hunt",
    storyLines: [
      "Milo the monkey found 8 bananas on the tree! 🍌",
      "Then he spotted 3 more on the ground!",
      "Instead of counting ALL bananas again...",
      "Milo started at 8 and counted on 3 more! → 9, 10, 11!",
    ],
    learnSteps: [
      "Find the BIGGER number first",
      "Put it in your head 🧠",
      "Count on with your fingers",
      "Say the answer out loud!",
    ],
  },
  {
    id: "makingTen",
    title: "Making 10",
    emoji: "⭐",
    color: "#f59e0b",
    bg: "#fef3c7",
    dark: "#92400e",
    description: "Break a number to make a friendly 10!",
    tip: "10 is your best friend! Break numbers to reach 10 first!",
    mascotMood: "thinking",
    storyTitle: "Starfish Rock Pool",
    storyLines: [
      "Lily found 7 starfish in the rock pool! ⭐",
      "She found 6 more behind a rock!",
      "She thought: 7 needs 3 more to make 10!",
      "So 6 = 3 + 3 → 10 + 3 = 13! Magic!",
    ],
    learnSteps: [
      "Look at the bigger number",
      "How much does it need to reach 10?",
      "Break the smaller number: part fills to 10, rest stays",
      "Add 10 + leftover = answer!",
    ],
  },
  {
    id: "doubles",
    title: "Doubles",
    emoji: "🐰",
    color: "#8b5cf6",
    bg: "#ede9fe",
    dark: "#4c1d95",
    description: "Same number + same number = double fun!",
    tip: "Doubles are easy to remember! 6+6=12, 7+7=14!",
    mascotMood: "celebrate",
    storyTitle: "Twin Rabbit Carrots",
    storyLines: [
      "Bella and Ella are twin rabbits! 🐰🐰",
      "Each rabbit got the SAME number of carrots!",
      "When twins share equally, we use DOUBLES!",
      "6 carrots + 6 carrots = 12 carrots total!",
    ],
    learnSteps: [
      "Notice both numbers are the SAME",
      "This is a DOUBLES fact!",
      "Double it: add the number to itself",
      "Remember it — doubles never change!",
    ],
  },
  {
    id: "nearDoubles",
    title: "Near Doubles",
    emoji: "🦋",
    color: "#ec4899",
    bg: "#fce7f3",
    dark: "#831843",
    description: "Almost doubles? Use what you know!",
    tip: "If you know 6+6=12, then 6+7 is just one more = 13!",
    mascotMood: "thinking",
    storyTitle: "Almost-Twin Butterflies",
    storyLines: [
      "Two butterflies had ALMOST the same spots!",
      "One had 6 spots, the other had 7! 🦋",
      "We know doubles: 6+6=12!",
      "So 6+7 = 12+1 = 13! Easy!",
    ],
    learnSteps: [
      "Spot the numbers — are they close?",
      "Find the doubles fact you know",
      "Is the answer one more or one less?",
      "Adjust your doubles answer!",
    ],
  },
  {
    id: "bridging",
    title: "Bridging Through 10",
    emoji: "🚀",
    color: "#3b82f6",
    bg: "#dbeafe",
    dark: "#1e3a8a",
    description: "Jump to 10 first, then keep going!",
    tip: "Use 10 or 20 or 30 as stepping stones to the answer!",
    mascotMood: "celebrate",
    storyTitle: "Rocket to Planet Ten",
    storyLines: [
      "Captain Milo's rocket needed to reach Planet 30! 🚀",
      "He was at 27 and had 6 fuel cells.",
      "First he flew 3 steps to land on Planet 30!",
      "Then flew 3 more to reach 33! Bridged through 30!",
    ],
    learnSteps: [
      "Find the nearest ten above your number",
      "How many steps to get there?",
      "Use that many from the second number",
      "Add the remaining steps to the ten!",
    ],
  },
];

// ─── QUESTION GENERATORS ──────────────────────────────────────────────────────
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeDist(ans, ...excl) {
  const bad = new Set(excl.map(Number));
  bad.add(ans);
  const opts = [ans];
  const tries = [ans - 2, ans + 2, ans - 1, ans + 1, ans - 3, ans + 3, ans + 10, ans - 10];
  for (const t of tries) {
    if (t > 0 && !bad.has(t)) { opts.push(t); bad.add(t); }
    if (opts.length === 4) break;
  }
  return shuffle(opts);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const emojis = ["🍎","🌟","🎈","🍊","🎁","🍬","🏀","🌸","🍇","🦄"];
function pickEmoji() { return emojis[rand(0, emojis.length - 1)]; }

function genCountingOn() {
  const b = rand(1, 4), a = rand(5, 16), ans = a + b;
  const e = pickEmoji();
  return { q: `${a} + ${b} = ?`, a, b, ans, choices: makeDist(ans), emoji: e, strategy: "countingOn", hint: `Start at ${a} and count on ${b}: ${Array.from({length:b},(_,i)=>a+i+1).join(", ")}` };
}
function genMakingTen() {
  let a, b;
  do { a = rand(6, 9); b = rand(3, 9); } while (a + b < 11 || a + b > 18);
  const ans = a + b, need = 10 - a, left = b - need;
  return { q: `${a} + ${b} = ?`, a, b, ans, choices: makeDist(ans), emoji: pickEmoji(), strategy: "makingTen", hint: `${a} + ${need} = 10, then 10 + ${left} = ${ans}` };
}
function genDoubles() {
  const a = rand(1, 9), ans = a * 2;
  return { q: `${a} + ${a} = ?`, a, b: a, ans, choices: makeDist(ans), emoji: pickEmoji(), strategy: "doubles", hint: `${a} doubled = ${ans}` };
}
function genNearDoubles() {
  const a = rand(2, 9), diff = rand(1, 2) * (Math.random() < 0.5 ? 1 : -1);
  const b = a + diff;
  if (b < 1 || b > 10) return genNearDoubles();
  const ans = a + b, dbl = a * 2;
  const sign = diff > 0 ? "+" : "-";
  return { q: `${a} + ${b} = ?`, a, b, ans, choices: makeDist(ans), emoji: pickEmoji(), strategy: "nearDoubles", hint: `${a}+${a}=${dbl}, then ${dbl}${sign}${Math.abs(diff)}=${ans}` };
}
function genBridging() {
  const a = rand(15, 27), b = rand(3, 9), ans = a + b;
  const ten = Math.ceil(a / 10) * 10, step1 = ten - a, step2 = b - step1;
  if (step2 <= 0) return genBridging();
  return { q: `${a} + ${b} = ?`, a, b, ans, choices: makeDist(ans), emoji: pickEmoji(), strategy: "bridging", hint: `${a}+${step1}=${ten}, then ${ten}+${step2}=${ans}` };
}

const GENERATORS = { countingOn: genCountingOn, makingTen: genMakingTen, doubles: genDoubles, nearDoubles: genNearDoubles, bridging: genBridging };

function generateQuestions(stratId, count = 20) {
  const gen = GENERATORS[stratId];
  const seen = new Set();
  const qs = [];
  let attempts = 0;
  while (qs.length < count && attempts < 300) {
    const q = gen();
    const key = `${q.a}-${q.b}`;
    if (!seen.has(key)) { seen.add(key); qs.push({ ...q, id: qs.length }); }
    attempts++;
  }
  return shuffle(qs);
}

// ─── ANIMATED MASCOT ──────────────────────────────────────────────────────────
function Mascot({ mood = "happy", size = 80 }) {
  const colors = { happy: "#f59e0b", thinking: "#8b5cf6", celebrate: "#ec4899", jumping: "#10b981" };
  const c = colors[mood] || colors.happy;
  const bounce = mood === "jumping" || mood === "celebrate";
  return (
    <div style={{ display: "inline-block", animation: bounce ? "bounce 0.6s infinite alternate" : mood === "thinking" ? "wiggle 2s infinite" : "none", fontSize: size }}>
      🐒
    </div>
  );
}

// ─── NUMBER LINE (Counting On) ────────────────────────────────────────────────
function NumberLine({ a, b, step }) {
  const nums = Array.from({ length: 21 }, (_, i) => i);
  return (
    <div style={{ overflowX: "auto", padding: "12px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, minWidth: 480 }}>
        {nums.map(n => {
          const isStart = n === a;
          const isActive = n > a && n <= a + step;
          const isFrog = n === a + step;
          return (
            <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 28 }}>
              {isFrog && <div style={{ fontSize: 22, animation: "bounce 0.4s ease" }}>🐸</div>}
              {!isFrog && <div style={{ height: 28 }} />}
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: isStart ? "#10b981" : isActive ? "#fbbf24" : "#e5e7eb",
                border: `2px solid ${isStart ? "#065f46" : isActive ? "#92400e" : "#d1d5db"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: "bold", color: isStart || isActive ? "#fff" : "#6b7280",
                transition: "all 0.4s ease"
              }}>{n}</div>
              {n > 0 && n <= a + step && <div style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>{isStart ? "start" : isActive ? `+${n - a}` : ""}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TEN FRAME ────────────────────────────────────────────────────────────────
function TenFrame({ a, filled, total }) {
  const cells = Array.from({ length: 10 }, (_, i) => {
    const isA = i < a;
    const isFilled = i < filled;
    return { isA, isFilled };
  });
  const overflow = total > 10 ? total - 10 : 0;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 48px)", gap: 4, justifyContent: "center" }}>
        {cells.map((c, i) => (
          <div key={i} style={{
            width: 48, height: 48, borderRadius: 8,
            border: "3px solid #d97706",
            background: c.isA ? "#10b981" : c.isFilled ? "#f59e0b" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, transition: "all 0.3s ease",
            animation: c.isFilled ? "popIn 0.3s ease" : "none"
          }}>
            {c.isFilled ? "⭐" : ""}
          </div>
        ))}
      </div>
      {overflow > 0 && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <div style={{ fontSize: 14, color: "#92400e", marginBottom: 6 }}>+ leftover:</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {Array.from({ length: overflow }, (_, i) => (
              <div key={i} style={{ fontSize: 28, animation: "popIn 0.3s ease" }}>⭐</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DOUBLES VISUAL ──────────────────────────────────────────────────────────
function DoublesVisual({ a, b }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
      <div style={{ background: "#ede9fe", borderRadius: 16, padding: "16px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#7c3aed", fontWeight: 700, marginBottom: 8 }}>First group</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", maxWidth: 120 }}>
          {Array.from({ length: a }, (_, i) => <span key={i} style={{ fontSize: 28 }}>🐰</span>)}
        </div>
        <div style={{ marginTop: 8, fontSize: 20, fontWeight: 900, color: "#7c3aed" }}>{a}</div>
      </div>
      <div style={{ fontSize: 36, fontWeight: 900, color: "#4b5563" }}>+</div>
      <div style={{ background: "#fce7f3", borderRadius: 16, padding: "16px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#db2777", fontWeight: 700, marginBottom: 8 }}>Second group</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", maxWidth: 120 }}>
          {Array.from({ length: b }, (_, i) => <span key={i} style={{ fontSize: 28 }}>🐰</span>)}
        </div>
        <div style={{ marginTop: 8, fontSize: 20, fontWeight: 900, color: "#db2777" }}>{b}</div>
      </div>
      <div style={{ fontSize: 36, fontWeight: 900, color: "#4b5563" }}>=</div>
      <div style={{ background: "#fef3c7", borderRadius: 16, padding: "16px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#92400e", fontWeight: 700, marginBottom: 8 }}>Total</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#b45309" }}>{a + b}</div>
      </div>
    </div>
  );
}

// ─── BRIDGING VISUAL ─────────────────────────────────────────────────────────
function BridgingVisual({ a, b, rocketPos }) {
  const ten = Math.ceil(a / 10) * 10;
  const ans = a + b;
  const step1 = ten - a, step2 = b - step1;
  const points = [a, ten, ans];
  return (
    <div style={{ padding: "12px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: i === 0 ? "#3b82f6" : i === 1 ? "#f59e0b" : "#10b981",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 900, color: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}>{p}</div>
            {i < 2 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>🚀</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>+{i === 0 ? step1 : step2}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#6b7280" }}>
        {a} → bridge to {ten} (add {step1}) → then add {step2} more = <strong>{ans}</strong>
      </div>
    </div>
  );
}

// ─── STARS ───────────────────────────────────────────────────────────────────
function Stars({ count, animate }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          fontSize: 40,
          filter: i <= count ? "none" : "grayscale(1)",
          animation: animate && i <= count ? `starPop 0.4s ${i * 0.15}s both` : "none",
          opacity: i <= count ? 1 : 0.3,
        }}>⭐</div>
      ))}
    </div>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ current, total, color = "#6c63ff" }) {
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div style={{ background: "#e5e7eb", borderRadius: 999, height: 10, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.4s ease" }} />
    </div>
  );
}

// ─── PHASE: HOME / STRATEGY SELECTOR ─────────────────────────────────────────
function HomeScreen({ progress, onSelect }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 12, animation: "bounce 1s infinite alternate" }}>🧠</div>
        <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, color: "#fff", margin: 0, fontFamily: "'Fredoka One', cursive, sans-serif", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>Think Smart!</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, marginTop: 8, fontFamily: "Nunito, sans-serif" }}>Mental Math Strategies · Singapore Grade 1 🇸🇬</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 900, width: "100%" }}>
        {STRATEGIES.map((s, idx) => {
          const prog = progress[s.id] || { stars: 0 };
          return (
            <button key={s.id} onClick={() => onSelect(s.id)} style={{
              background: "#fff", borderRadius: 20, padding: "24px 20px", border: `3px solid ${s.color}`,
              cursor: "pointer", textAlign: "left", boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              transition: "transform 0.2s, box-shadow 0.2s", animation: `fadeSlideIn 0.5s ${idx * 0.1}s both`
            }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)"; }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 40 }}>{s.emoji}</div>
                <Stars count={prog.stars} animate={false} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.dark, fontFamily: "'Fredoka One', cursive", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: "#6b7280", fontFamily: "Nunito, sans-serif" }}>{s.description}</div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12, color: "#9ca3af" }}>
                  <span>Progress</span>
                  <span>{prog.bestScore || 0}/20</span>
                </div>
                <ProgressBar current={prog.bestScore || 0} total={20} color={s.color} />
              </div>
              <div style={{ marginTop: 14, background: s.bg, color: s.dark, borderRadius: 10, padding: "8px 16px", textAlign: "center", fontWeight: 700, fontSize: 15, fontFamily: "Nunito, sans-serif" }}>
                {prog.stars > 0 ? "Play Again! 🔄" : "Start! →"}
              </div>
            </button>
          );
        })}
      </div>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 32, fontFamily: "Nunito" }}>Aligned with Singapore MOE Primary 1 Mathematics Syllabus • Intellia SG</p>
    </div>
  );
}

// ─── PHASE: STORY ─────────────────────────────────────────────────────────────
function StoryPhase({ strategy, onNext }) {
  const s = STRATEGIES.find(x => x.id === strategy);
  const [line, setLine] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (line < s.storyLines.length - 1) {
      const t = setTimeout(() => setLine(l => l + 1), 2200);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDone(true), 2200);
      return () => clearTimeout(t);
    }
  }, [line, s.storyLines.length]);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${s.bg} 0%, #fff 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, fontFamily: "Nunito" }}>📖 Story Time</div>
        <h2 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, color: s.dark, fontFamily: "'Fredoka One', cursive", marginBottom: 32 }}>{s.storyTitle}</h2>
        <div style={{ fontSize: 100, marginBottom: 24, animation: "bounce 1.5s infinite alternate" }}>{s.emoji}</div>
        <div style={{ background: "#fff", borderRadius: 24, padding: "28px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {s.storyLines.map((l, i) => (
            <p key={i} style={{
              fontSize: 20, color: "#374151", fontFamily: "Nunito, sans-serif", margin: "6px 0", fontWeight: 600,
              opacity: i <= line ? 1 : 0.1, transform: i === line ? "scale(1.05)" : "scale(1)",
              transition: "all 0.5s ease", color: i === line ? s.dark : "#9ca3af"
            }}>{l}</p>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
          {s.storyLines.map((_, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i <= line ? s.color : "#e5e7eb", transition: "background 0.3s" }} />
          ))}
        </div>
        {done && (
          <button onClick={onNext} style={{ marginTop: 28, background: s.color, color: "#fff", border: "none", borderRadius: 16, padding: "16px 40px", fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "Nunito", animation: "fadeSlideIn 0.4s ease", boxShadow: `0 6px 20px ${s.color}66` }}>
            Let's Learn! →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PHASE: LEARN (simulation) ────────────────────────────────────────────────
function LearnPhase({ strategy, onNext }) {
  const s = STRATEGIES.find(x => x.id === strategy);
  const [step, setStep] = useState(0);
  const [simStep, setSimStep] = useState(0);
  const [exampleQ] = useState(() => GENERATORS[strategy]());
  const { a, b } = exampleQ;

  const isLastStep = step === s.learnSteps.length - 1;

  useEffect(() => {
    if (strategy === "countingOn") {
      const t = setInterval(() => setSimStep(s => s < b ? s + 1 : s), 700);
      return () => clearInterval(t);
    }
  }, [strategy, b]);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${s.bg} 0%, #fff 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, fontFamily: "Nunito" }}>🎯 Learn the Strategy</div>
        <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, color: s.dark, fontFamily: "'Fredoka One', cursive", marginBottom: 24 }}>{s.title}</h2>

        {/* Example problem */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 8, fontFamily: "Nunito" }}>Example:</div>
          <div style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, color: s.dark, fontFamily: "'Fredoka One', cursive" }}>{a} + {b} = ?</div>
        </div>

        {/* Simulation */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          {strategy === "countingOn" && <NumberLine a={a} b={b} step={simStep} />}
          {strategy === "makingTen" && <TenFrame a={a} filled={Math.min(a + simStep, 10)} total={simStep > b ? a + b : a + simStep} />}
          {strategy === "doubles" && <DoublesVisual a={a} b={b} />}
          {strategy === "nearDoubles" && <DoublesVisual a={a} b={b} />}
          {strategy === "bridging" && <BridgingVisual a={a} b={b} rocketPos={simStep} />}
        </div>

        {/* Tip card */}
        <div style={{ background: s.bg, border: `2px solid ${s.color}`, borderRadius: 16, padding: "16px 24px", marginBottom: 24, textAlign: "left" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>💡</div>
            <div>
              <div style={{ fontWeight: 800, color: s.dark, fontFamily: "Nunito", marginBottom: 4 }}>Strategy Tip</div>
              <div style={{ color: s.dark, fontFamily: "Nunito", fontSize: 15 }}>{s.tip}</div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 12, fontFamily: "Nunito" }}>Steps to remember:</div>
          {s.learnSteps.map((st, i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", borderRadius: 12,
              marginBottom: 6, cursor: "pointer",
              background: step === i ? s.bg : "transparent",
              border: `2px solid ${step === i ? s.color : "transparent"}`,
              transition: "all 0.2s"
            }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= i ? s.color : "#e5e7eb", color: step >= i ? "#fff" : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontFamily: "Nunito", fontWeight: 600, color: step === i ? s.dark : "#6b7280", fontSize: 15, paddingTop: 3 }}>{st}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 14, padding: "14px 28px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito" }}>← Back</button>}
          {!isLastStep
            ? <button onClick={() => setStep(s => s + 1)} style={{ background: s.color, color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito", boxShadow: `0 4px 16px ${s.color}66` }}>Next Step →</button>
            : <button onClick={onNext} style={{ background: s.color, color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito", boxShadow: `0 4px 16px ${s.color}66`, animation: "pulse 1s infinite" }}>Practice Now! 🎮</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── PHASE: PRACTICE ──────────────────────────────────────────────────────────
function PracticePhase({ strategy, questions, onComplete }) {
  const s = STRATEGIES.find(x => x.id === strategy);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shake, setShake] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const q = questions[qi];
  const total = questions.length;

  const handleAnswer = (choice) => {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
    if (choice === q.ans) {
      setScore(sc => sc + 1);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1200);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    if (qi + 1 >= total) {
      onComplete({ correct: score + (selected === q.ans ? 0 : 0), total, hintsUsed, finalScore: score });
    } else {
      setQi(i => i + 1);
      setSelected(null);
      setRevealed(false);
      setShowHint(false);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setHintsUsed(h => h + 1);
  };

  const getChoiceStyle = (choice) => {
    const base = { border: "3px solid", borderRadius: 16, padding: "16px 12px", fontSize: 22, fontWeight: 900, cursor: "pointer", fontFamily: "'Fredoka One', cursive", transition: "all 0.2s", width: "100%" };
    if (!revealed) return { ...base, background: "#fff", borderColor: "#e5e7eb", color: "#374151" };
    if (choice === q.ans) return { ...base, background: "#d1fae5", borderColor: "#10b981", color: "#065f46" };
    if (choice === selected) return { ...base, background: "#fee2e2", borderColor: "#ef4444", color: "#991b1b" };
    return { ...base, background: "#f9fafb", borderColor: "#e5e7eb", color: "#9ca3af" };
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${s.bg} 0%, #fff 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ maxWidth: 520, width: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "Nunito", fontWeight: 800, color: s.dark, fontSize: 16 }}>{s.emoji} {s.title}</div>
          <div style={{ background: s.color, color: "#fff", borderRadius: 999, padding: "6px 16px", fontWeight: 800, fontFamily: "Nunito", fontSize: 14 }}>
            {score}/{qi} ⭐
          </div>
        </div>
        <ProgressBar current={qi} total={total} color={s.color} />
        <div style={{ textAlign: "right", fontFamily: "Nunito", fontSize: 13, color: "#9ca3af", marginBottom: 20, marginTop: 4 }}>Question {qi + 1} of {total}</div>

        {/* Mascot */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <Mascot mood={celebrate ? "celebrate" : revealed && selected !== q.ans ? "thinking" : "happy"} size={56} />
          {celebrate && <div style={{ fontSize: 14, color: s.dark, fontWeight: 700, fontFamily: "Nunito", animation: "popIn 0.3s ease" }}>🎉 Brilliant!</div>}
          {revealed && selected !== q.ans && <div style={{ fontSize: 14, color: "#ef4444", fontWeight: 700, fontFamily: "Nunito" }}>Keep trying! 💪</div>}
        </div>

        {/* Question card */}
        <div style={{
          background: "#fff", borderRadius: 24, padding: "32px 24px", textAlign: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.1)", marginBottom: 20,
          animation: shake ? "shake 0.4s ease" : "none",
          border: `3px solid ${revealed ? (selected === q.ans ? "#10b981" : "#ef4444") : s.color}`
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            {Array.from({ length: Math.min(q.a, 8) }, () => q.emoji).join("")}
            {q.a > 8 ? `... (${q.a})` : ""}
          </div>
          <div style={{ fontSize: "clamp(32px,7vw,54px)", fontWeight: 900, color: s.dark, fontFamily: "'Fredoka One', cursive" }}>
            {q.q}
          </div>
        </div>

        {/* Hint */}
        {!revealed && (
          <div style={{ textAlign: "right", marginBottom: 12 }}>
            {!showHint
              ? <button onClick={handleHint} style={{ background: "transparent", border: `2px solid ${s.color}`, color: s.color, borderRadius: 10, padding: "6px 16px", fontWeight: 700, fontFamily: "Nunito", cursor: "pointer", fontSize: 13 }}>💡 Hint</button>
              : <div style={{ background: s.bg, border: `2px solid ${s.color}`, borderRadius: 12, padding: "10px 16px", textAlign: "left" }}>
                  <span style={{ fontFamily: "Nunito", fontWeight: 700, color: s.dark, fontSize: 14 }}>💡 {q.hint}</span>
                </div>
            }
          </div>
        )}

        {/* Choices */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {q.choices.map((c, i) => (
            <button key={i} onClick={() => handleAnswer(c)} style={getChoiceStyle(c)} disabled={revealed}>
              {revealed && c === q.ans && "✅ "}
              {revealed && c === selected && c !== q.ans && "❌ "}
              {c}
            </button>
          ))}
        </div>

        {/* Next */}
        {revealed && (
          <div style={{ textAlign: "center" }}>
            {revealed && <div style={{ background: selected === q.ans ? "#d1fae5" : "#fee2e2", borderRadius: 14, padding: "12px 20px", marginBottom: 16, fontFamily: "Nunito", fontWeight: 700, color: selected === q.ans ? "#065f46" : "#991b1b", fontSize: 15 }}>
              {selected === q.ans ? `🎉 Correct! ${q.hint}` : `💡 The answer is ${q.ans}. ${q.hint}`}
            </div>}
            <button onClick={handleNext} style={{ background: s.color, color: "#fff", border: "none", borderRadius: 16, padding: "16px 48px", fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "Nunito", boxShadow: `0 6px 20px ${s.color}66` }}>
              {qi + 1 >= total ? "See My Score! 🌟" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PHASE: SCORE SCREEN ──────────────────────────────────────────────────────
function ScoreScreen({ strategy, score, total, hintsUsed, onReplay, onHome }) {
  const s = STRATEGIES.find(x => x.id === strategy);
  const pct = Math.round((score / total) * 100);
  const stars = pct === 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;
  const msg = stars === 3 ? "Perfect! You're a Math Star! 🌟" : stars === 2 ? "Awesome work! Almost perfect!" : stars === 1 ? "Good try! Practice makes perfect!" : "Keep practising — you can do it!";

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${s.color} 0%, ${s.dark} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div style={{ fontSize: 80, animation: "bounce 1s infinite alternate", marginBottom: 16 }}>{stars === 3 ? "🏆" : stars >= 2 ? "🎉" : "💪"}</div>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", fontFamily: "'Fredoka One', cursive", marginBottom: 8 }}>Well Done!</h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Nunito", fontSize: 18, marginBottom: 24 }}>{msg}</p>

        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "24px 32px", marginBottom: 24, backdropFilter: "blur(10px)" }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: "#fff", fontFamily: "'Fredoka One', cursive" }}>{pct}%</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Nunito", fontSize: 16, marginBottom: 16 }}>{score} out of {total} correct</div>
          <Stars count={stars} animate={true} />
          {hintsUsed > 0 && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 12, fontFamily: "Nunito" }}>💡 {hintsUsed} hints used</div>}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onReplay} style={{ background: "#fff", color: s.dark, border: "none", borderRadius: 16, padding: "14px 28px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "Nunito" }}>
            🔄 Play Again
          </button>
          <button onClick={onHome} style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 16, padding: "14px 28px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "Nunito" }}>
            🏠 All Strategies
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("home");
  const [strategy, setStrategy] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [lastScore, setLastScore] = useState(null);
  const [progress, setProgress] = useState({});

  const startStrategy = (stratId) => {
    setStrategy(stratId);
    setPhase("story");
  };

  const startPractice = () => {
    const qs = generateQuestions(strategy, 20);
    setQuestions(qs);
    setPhase("practice");
  };

  const handlePracticeComplete = (result) => {
    setLastScore(result);
    const pct = Math.round((result.finalScore / result.total) * 100);
    const stars = pct === 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;
    setProgress(p => ({
      ...p,
      [strategy]: { stars: Math.max(stars, (p[strategy]?.stars || 0)), bestScore: Math.max(result.finalScore, (p[strategy]?.bestScore || 0)) }
    }));
    setPhase("score");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; }
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }
        @keyframes wiggle { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 50% { box-shadow: 0 0 0 12px rgba(139,92,246,0); } }
        @keyframes starPop { from { transform: scale(0) rotate(-30deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
        button:hover { opacity: 0.92; }
        button:active { transform: scale(0.97); }
      `}</style>

      {phase === "home" && <HomeScreen progress={progress} onSelect={startStrategy} />}
      {phase === "story" && <StoryPhase strategy={strategy} onNext={() => setPhase("learn")} />}
      {phase === "learn" && <LearnPhase strategy={strategy} onNext={startPractice} />}
      {phase === "practice" && <PracticePhase strategy={strategy} questions={questions} onComplete={handlePracticeComplete} />}
      {phase === "score" && lastScore && (
        <ScoreScreen strategy={strategy} score={lastScore.finalScore} total={lastScore.total} hintsUsed={lastScore.hintsUsed} onReplay={() => { startStrategy(strategy); }} onHome={() => setPhase("home")} />
      )}
    </>
  );
}
