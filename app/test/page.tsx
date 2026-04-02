"use client";

import { useState, useEffect, useRef } from "react";

// ── 데이터 ────────────────────────────────────────────────
const QUESTIONS = [
  {
    text: "맨션에 처음 도착한 밤, 엘리베이터가 멈췄다. 당신은?",
    color: "#8b5cf6",
    choices: [
      { text: "비상 버튼을 눌러 관리자를 호출한다", types: [1, 3] },
      { text: "옆 사람에게 말을 걸며 상황을 파악한다", types: [2, 7] },
      { text: "조용히 기다리며 혼자 해결책을 생각한다", types: [5, 4] },
      { text: "이미 예상했다는 듯 여분의 손전등을 꺼낸다", types: [6, 1] },
    ],
  },
  {
    text: "복도에서 낯선 입주민이 내 택배를 들고 있다. 어떻게 하나?",
    color: "#06b6d4",
    choices: [
      { text: "정중하지만 단호하게 내 거라고 말한다", types: [1, 8] },
      { text: "웃으며 말을 걸어 자연스럽게 되찾는다", types: [2, 3] },
      { text: "그냥 두고 관리자에게 신고한다", types: [6, 1] },
      { text: "상대방의 표정을 읽으며 상황을 먼저 판단한다", types: [4, 5] },
    ],
  },
  {
    text: "매달 열리는 입주민 회의, 당신의 자리는?",
    color: "#f59e0b",
    choices: [
      { text: "앞자리에서 의제를 직접 제안하고 진행한다", types: [3, 8] },
      { text: "옆 사람과 자유롭게 의견을 나눈다", types: [7, 2] },
      { text: "뒷자리에서 조용히 듣고 노트에 메모한다", types: [5, 1] },
      { text: "갈지 말지 문 앞에서 5분 고민한다", types: [9, 4] },
    ],
  },
  {
    text: "한밤중에 위층에서 이상한 소리가 들린다.",
    color: "#10b981",
    choices: [
      { text: "직접 올라가 정중하게 항의한다", types: [1, 8] },
      { text: "관리자에게 바로 연락한다", types: [6, 3] },
      { text: "이어폰을 끼고 내 할 일을 계속한다", types: [5, 9] },
      { text: "혹시 무슨 일인지 걱정되어 잠을 못 이룬다", types: [2, 6] },
    ],
  },
  {
    text: "맨션 파티에 초대받았다. 오늘 당신의 기분은?",
    color: "#f43f5e",
    choices: [
      { text: "좋아, 새로운 사람들을 만날 절호의 기회", types: [3, 7] },
      { text: "설레지만 무슨 옷을 입을지 고민이 태산", types: [4, 2] },
      { text: "갈 생각이지만 조용히 구석에 있을 것 같다", types: [5, 9] },
      { text: "혹시 몰라 미리 퇴로를 계획해 둔다", types: [6, 1] },
    ],
  },
  {
    text: "맨션 지하에 비밀 공간이 있다는 소문이 돌고 있다.",
    color: "#6366f1",
    choices: [
      { text: "직접 확인하러 바로 내려간다", types: [7, 8] },
      { text: "소문의 진원지를 추적해 사실을 확인한다", types: [1, 5] },
      { text: "알면서도 모른 척 지켜본다", types: [9, 4] },
      { text: "관련자들을 모아 공식 조사를 제안한다", types: [3, 6] },
    ],
  },
  {
    text: "같은 층 이웃이 갑자기 이사를 간다. 당신은?",
    color: "#a855f7",
    choices: [
      { text: "아쉽지만 담담하게 인사만 한다", types: [9, 5] },
      { text: "작별 파티를 열어주거나 선물을 준비한다", types: [2, 7] },
      { text: "혹시 내가 뭔가 불편하게 한 건 아닌지 생각한다", types: [4, 6] },
      { text: "새 이웃이 어떤 사람일지 기대된다", types: [3, 7] },
    ],
  },
  {
    text: "맨션에서 갑자기 정전이 발생했다. 당신의 첫 번째 행동은?",
    color: "#3b82f6",
    choices: [
      { text: "손전등과 보조배터리를 꺼내 주변 사람을 돕는다", types: [2, 6] },
      { text: "관리실로 가서 상황을 파악하고 공유한다", types: [3, 1] },
      { text: "촛불을 켜고 혼자만의 시간을 즐긴다", types: [4, 5] },
      { text: "이 기회에 평소 못 했던 일을 한다", types: [7, 8] },
    ],
  },
];

const TYPES: Record<number, { monster: string; tagline: string; desc: string }> = {
  1: { monster: "밴시",        tagline: "소리 없이 모든 걸 꿰뚫는 자",    desc: "원칙에서 벗어난 것을 가장 먼저 감지합니다. 당신이 조용할수록, 주변은 긴장합니다." },
  2: { monster: "셀키",        tagline: "바다처럼 품는 자",               desc: "곁에 있으면 이상하게 마음이 놓입니다. 누군가의 이름을 가장 먼저 기억하는 사람." },
  3: { monster: "픽시",        tagline: "반짝이는 걸 놓치지 않는 자",     desc: "목표가 생기면 눈이 달라집니다. 맨션에서 가장 먼저 움직이는 사람." },
  4: { monster: "뱀파이어",    tagline: "밤을 수집하는 자",               desc: "감정의 결이 남들보다 촘촘합니다. 아무도 모르는 맨션의 이면을 혼자 알고 있을지도." },
  5: { monster: "고블린",      tagline: "아무도 모르게 다 알고 있는 자",   desc: "관찰하고, 기록하고, 기억합니다. 먼저 나서진 않지만 가장 정확합니다." },
  6: { monster: "유령",        tagline: "아무도 모르게 존재하는 자",       desc: "있는 듯 없는 듯, 하지만 사라지면 가장 먼저 티가 납니다. 신뢰가 전부인 사람." },
  7: { monster: "웨어울프",    tagline: "보름달을 기다리는 자",            desc: "억누를수록 더 강해집니다. 새로운 것 앞에서 가장 먼저 달려가는 사람." },
  8: { monster: "프랑켄슈타인", tagline: "두려움을 모르는 자",             desc: "직접 부딪힙니다. 불합리한 걸 보면 가만있지 못하는, 맨션의 가장 솔직한 입주민." },
  9: { monster: "슬라임",      tagline: "어디에나 스며드는 자",            desc: "갈등이 있는 곳에서 가장 먼저 다리를 놓습니다. 없으면 균형이 무너지는 존재." },
};

const SLOT_NAMES = ["밴시","셀키","픽시","뱀파이어","고블린","유령","웨어울프","프랑켄슈타인","슬라임"];
const BOTTLE_COLORS = ["#8b5cf6","#06b6d4","#f59e0b","#10b981","#f43f5e","#6366f1","#a855f7","#3b82f6"];

// ── 포션병 SVG ────────────────────────────────────────────
function BottleSVG({ filled, color }: { filled: boolean; color: string }) {
  const id = `clip${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox="0 0 60 90" width="54" height="81" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={id}>
          <path d="M10,40 Q8,44 8,52 Q8,73 30,75 Q52,73 52,52 Q52,44 50,40 Z" />
        </clipPath>
      </defs>

      {/* 코르크 */}
      <rect x="23" y="15" width="14" height="11" rx="4" fill="#c8996a" />
      <rect x="25" y="17" width="10" height="7" rx="2" fill="#b8895a" />
      <rect x="27" y="18" width="6" height="1.5" rx="1" fill="#a07848" opacity="0.5" />

      {/* 목 */}
      <rect x="24" y="24" width="12" height="18" rx="2" fill={filled ? color : "#16102a"} opacity={filled ? 0.55 : 1} />
      <rect x="25" y="24" width="4" height="18" rx="1" fill="white" opacity="0.04" />

      {/* 바디 — 눈물방울형 */}
      <path
        d="M10,40 Q8,44 8,52 Q8,73 30,75 Q52,73 52,52 Q52,44 50,40 Z"
        fill="#0c0818"
        stroke={filled ? color : "#211640"}
        strokeWidth="1.3"
        opacity={filled ? 0.95 : 0.85}
      />

      {/* 액체 */}
      {filled && (
        <path
          d="M10,54 Q20,51 30,54 Q40,57 50,54 L52,52 Q52,73 30,75 Q8,73 8,52 Z"
          fill={color}
          opacity="0.78"
          clipPath={`url(#${id})`}
        />
      )}

      {/* 액체 표면선 */}
      {filled && (
        <path
          d="M12,54 Q21,51 30,54 Q39,57 48,54"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          opacity="0.45"
        />
      )}

      {/* 기포 */}
      {filled && (
        <>
          <circle cx="22" cy="62" r="2"   fill="white" opacity="0.1" />
          <circle cx="38" cy="66" r="1.3" fill="white" opacity="0.08" />
          <circle cx="30" cy="58" r="1.1" fill="white" opacity="0.09" />
        </>
      )}

      {/* 유리 반사 */}
      <path d="M14,46 Q13,55 14,63" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.055" fill="none" />
      <path d="M17,44 Q16,49 17,54" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.08" fill="none" />

      {/* 라벨 */}
      <rect x="17" y="52" width="26" height="14" rx="2.5" fill="none" stroke={filled ? color : "#2a1f45"} strokeWidth="0.7" opacity={filled ? 0.35 : 0.4} />
    </svg>
  );
}

// ── 별 캔버스 ─────────────────────────────────────────────
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["#989898", "#585858", "#ffffff", "#e79f9f", "#d4b455"];
    const stars = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      on: Math.random() > 0.4,
      onMs:  180 + Math.random() * 3200,
      offMs:  60 + Math.random() * 5000,
      timer: Math.random() * 1600,
    }));

    let last = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.timer -= dt;
        if (s.timer <= 0) {
          s.on = !s.on;
          s.timer = s.on ? s.onMs : s.offMs;
        }
        if (s.on) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────
type Screen = "main" | "question" | "brew";

export default function TestPage() {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen]   = useState<Screen>("main");
  const [scores, setScores]   = useState<Record<number, number>>(
    Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, 0]))
  );
  const [filled, setFilled]         = useState<boolean[]>(new Array(8).fill(false));
  const [activeQ, setActiveQ]       = useState(-1);
  const [pickedChoice, setPickedChoice] = useState(-1);

  const [slotRunning, setSlotRunning]   = useState(false);
  const [slotName, setSlotName]         = useState("");
  const [resultReady, setResultReady]   = useState(false);

  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const topType = () =>
    Number(Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]);

  const openQuestion = (idx: number) => {
    if (filled[idx]) return;
    setActiveQ(idx);
    setPickedChoice(-1);
    setScreen("question");
  };

  const pickChoice = (ci: number) => {
    if (pickedChoice !== -1) return;
    setPickedChoice(ci);
    const types = QUESTIONS[activeQ].choices[ci].types;
    setScores((prev) => {
      const next = { ...prev };
      types.forEach((t) => { next[t] = (next[t] || 0) + 1; });
      return next;
    });
    setTimeout(() => {
      setFilled((prev) => {
        const next = [...prev];
        next[activeQ] = true;
        return next;
      });
      setScreen("main");
    }, 300);
  };

  const startBrew = () => {
    setScreen("brew");
    setSlotRunning(true);
    setResultReady(false);

    const finalName = TYPES[topType()].monster;
    let i = 0;
    // 빠르게 시작해서 점점 느려지다 탁 멈춤
    const intervals = [70, 70, 80, 90, 110, 140, 180, 230, 300, 390, 500, 640];
    const run = (step: number) => {
      if (step >= intervals.length) {
        setSlotName(finalName);
        setSlotRunning(false);
        setTimeout(() => setResultReady(true), 500);
        return;
      }
      setSlotName(SLOT_NAMES[i % SLOT_NAMES.length]);
      i++;
      setTimeout(() => run(step + 1), intervals[step]);
    };
    run(0);
  };

  const restartAll = () => {
    setScores(Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, 0])));
    setFilled(new Array(8).fill(false));
    setActiveQ(-1);
    setPickedChoice(-1);
    setSlotRunning(false);
    setSlotName("");
    setResultReady(false);
    setName("");
    setPhone("");
    setScreen("main");
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      alert("이름과 전화번호를 입력해주세요.");
      return;
    }
    // TODO: API 연동
    alert(`[${TYPES[topType()].monster}] ${name}님 응모 완료!`);
  };

  const allFilled = filled.every(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Noto+Sans+KR:wght@300;400&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.25; }
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #08060f; }

        .root {
          background: #08060f;
          min-height: 100vh;
          color: #e2d9f3;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          transition: opacity 0.9s ease;
        }
        .root.visible { opacity: 1; }

        .screen {
          display: flex; flex-direction: column; align-items: center;
          width: 100%; position: relative; z-index: 1;
        }

        /* ── MAIN ── */
        .main-wrap { padding: 3.5rem 1.5rem 3rem; }

        .main-title {
          font-family: 'Gaegu', cursive;
          font-size: 26px; font-weight: 700;
          color: #c4b5fd;
          text-align: center;
          margin-bottom: 0.3rem;
        }
        .main-sub {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 11px; font-weight: 300;
          color: #4a3d6b;
          text-align: center;
          letter-spacing: 0.18em;
          margin-bottom: 3rem;
        }

        .bottles-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px 4px;
          max-width: 360px;
          width: 100%;
          margin-bottom: 2.5rem;
        }
        @media (max-width: 340px) {
          .bottles-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .bottle-slot {
          display: flex; flex-direction: column; align-items: center;
          gap: 5px; cursor: pointer;
          animation: popIn 0.45s ease both;
        }
        .bottle-slot.filled { cursor: default; }
        .bottle-slot:not(.filled):active { opacity: 0.7; }

        .bottle-label {
          font-family: 'Gaegu', cursive;
          font-size: 13px;
          color: #3d3057;
          text-align: center;
          transition: color 0.3s;
        }
        .bottle-slot.filled .bottle-label { color: #9d7fe8; }

        .brew-btn {
          font-family: 'Gaegu', cursive;
          font-size: 19px; font-weight: 700;
          padding: 0.65rem 2.6rem;
          background: #6d28d9;
          color: #f0ebff;
          border: none; border-radius: 14px;
          cursor: pointer;
          letter-spacing: 0.05em;
          opacity: 0; pointer-events: none;
          transition: opacity 0.6s ease, transform 0.15s;
        }
        .brew-btn.show { opacity: 1; pointer-events: all; }
        .brew-btn:hover { transform: scale(1.04); }
        .brew-btn:active { transform: scale(0.98); }

        /* ── QUESTION ── */
        .q-wrap {
          padding: 2.5rem 1.5rem 3rem;
          max-width: 480px; width: 100%;
          animation: fadeIn 0.35s ease;
        }
        .q-back {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 12px; font-weight: 300;
          color: #3d3057; background: none; border: none;
          cursor: pointer; margin-bottom: 2rem;
          display: block; letter-spacing: 0.05em;
        }
        .q-back:hover { color: #7a6b96; }

        .q-bottle-center {
          display: flex; justify-content: center;
          margin-bottom: 1.5rem;
        }
        .q-num {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 10px; font-weight: 300;
          color: #5b4d7a; letter-spacing: 0.2em;
          margin-bottom: 1rem; text-align: center;
        }
        .q-text {
          font-family: 'Gaegu', cursive;
          font-size: 19px;
          color: #ddd5f5;
          line-height: 1.75;
          text-align: center;
          margin-bottom: 2.2rem;
        }
        .choices { display: flex; flex-direction: column; gap: 9px; }
        .choice {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 13px; font-weight: 300;
          background: #0d0919;
          border: 1px solid #1c1432;
          border-radius: 10px;
          padding: 0.9rem 1.1rem;
          color: #6b5d8a;
          cursor: pointer;
          text-align: left;
          line-height: 1.65;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          width: 100%;
        }
        .choice:hover  { border-color: #4a2e9e; color: #c4b5fd; background: #110e22; }
        .choice.picked { border-color: #6d28d9; color: #c4b5fd; background: #110e22; }

        /* ── BREW / RESULT ── */
        .brew-wrap {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem 1.5rem;
          width: 100%;
        }
        .slot-hint {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 11px; font-weight: 300;
          color: #4a3d6b; letter-spacing: 0.18em;
          margin-bottom: 1.4rem;
        }
        .slot-name {
          font-family: 'Gaegu', cursive;
          font-size: 48px; font-weight: 700;
          color: #c4b5fd;
          min-height: 60px;
          text-align: center;
        }
        .slot-name.running {
          animation: blink 0.18s steps(1) infinite;
        }

        .result-section {
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          animation: fadeIn 0.65s ease;
          max-width: 380px; width: 100%;
          padding: 0 1.5rem;
        }
        .result-monster {
          font-family: 'Gaegu', cursive;
          font-size: 50px; font-weight: 700;
          color: #c4b5fd;
          margin-bottom: 0.5rem;
        }
        .result-divider {
          width: 28px; height: 1px;
          background: #2a1f45;
          margin: 0.6rem auto 1rem;
        }
        .result-tagline {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 12px; font-weight: 300;
          color: #6b5d8a;
          letter-spacing: 0.14em;
          margin-bottom: 1.4rem;
        }
        .result-desc {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 13px; font-weight: 300;
          color: #5b4d7a;
          line-height: 1.95;
          margin-bottom: 2.2rem;
        }
        .result-form {
          display: flex; flex-direction: column; gap: 9px;
          width: 100%; margin-bottom: 0.9rem;
        }
        .result-input {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 13px; font-weight: 300;
          background: #0d0919;
          border: 1px solid #1c1432;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #e2d9f3;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        .result-input::placeholder { color: #32264d; }
        .result-input:focus { border-color: #5b3fa0; }

        .submit-btn {
          font-family: 'Gaegu', cursive;
          font-size: 18px; font-weight: 700;
          padding: 0.75rem;
          background: #6d28d9;
          color: #f0ebff;
          border: none; border-radius: 10px;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: transform 0.15s, opacity 0.15s;
          width: 100%;
        }
        .submit-btn:hover  { transform: scale(1.03); }
        .submit-btn:active { transform: scale(0.98); opacity: 0.85; }

        .restart-btn {
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 11px; font-weight: 300;
          color: #32264d; background: none; border: none;
          cursor: pointer; text-decoration: underline;
          letter-spacing: 0.05em; margin-top: 0.6rem;
        }
        .restart-btn:hover { color: #6b5d8a; }
      `}</style>

      <div className={`root ${mounted ? "visible" : ""}`}>
        <StarCanvas />

        {/* ── 메인 ── */}
        {screen === "main" && (
          <div className="screen main-wrap">
            <div className="main-title">입주민 유형 테스트</div>
            <div className="main-sub">포션병을 모두 채워보세요</div>

            <div className="bottles-grid">
              {QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  className={`bottle-slot ${filled[i] ? "filled" : ""}`}
                  style={{ animationDelay: `${i * 0.055}s` }}
                  onClick={() => openQuestion(i)}
                >
                  <BottleSVG filled={filled[i]} color={BOTTLE_COLORS[i]} />
                  <div className="bottle-label">{filled[i] ? "완료" : `${i + 1}`}</div>
                </div>
              ))}
            </div>

            <button
              className={`brew-btn ${allFilled ? "show" : ""}`}
              onClick={startBrew}
            >
              물약 제조하기
            </button>
          </div>
        )}

        {/* ── 질문 ── */}
        {screen === "question" && activeQ !== -1 && (
          <div className="screen">
            <div className="q-wrap">
              <button className="q-back" onClick={() => setScreen("main")}>← 돌아가기</button>
              <div className="q-bottle-center">
                <BottleSVG filled={false} color={BOTTLE_COLORS[activeQ]} />
              </div>
              <div className="q-num">질문 {activeQ + 1} / {QUESTIONS.length}</div>
              <div className="q-text">{QUESTIONS[activeQ].text}</div>
              <div className="choices">
                {QUESTIONS[activeQ].choices.map((c, ci) => (
                  <button
                    key={ci}
                    className={`choice ${pickedChoice === ci ? "picked" : ""}`}
                    onClick={() => pickChoice(ci)}
                  >
                    {c.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 제조 / 결과 ── */}
        {screen === "brew" && (
          <div className="screen brew-wrap">
            {!resultReady ? (
              <>
                <div className="slot-hint">
                  {slotRunning ? "유형을 감별하는 중..." : ""}
                </div>
                <div className={`slot-name ${slotRunning ? "running" : ""}`}>
                  {slotName}
                </div>
              </>
            ) : (
              <div className="result-section">
                <div className="result-monster">{TYPES[topType()].monster}</div>
                <div className="result-divider" />
                <div className="result-tagline">{TYPES[topType()].tagline}</div>
                <div className="result-desc">{TYPES[topType()].desc}</div>
                <div className="result-form">
                  <input
                    className="result-input"
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="result-input"
                    type="tel"
                    placeholder="전화번호"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <button className="submit-btn" onClick={handleSubmit}>응모하기</button>
                </div>
                <button className="restart-btn" onClick={restartAll}>처음부터 다시하기</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}