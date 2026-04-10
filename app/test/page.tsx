"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import NavBar from "../components/NavBar";
import Link from "next/link";

// ── 색상 토큰 ─────────────────────────────────────────────
const C = {
  bg:      "#0a0418",
  card:    "#130830",
  cardAlt: "#1e0d45",
  border:  "#4c1d95",
  borderL: "#6d28d9",
  accent:  "#c4b5fd",
  accentB: "#a78bfa",
  text:    "#f0ebff",
  textSub: "#ddd0ff",
  textDim: "#9d7fea",
  textMut: "#5b3ea6",
  cta:     "#7c3aed",
  ctaHov:  "#6d28d9",
} as const;

// ── 타입 정의 ─────────────────────────────────────────────
type CharacterId =
  | "vampire" | "zombie" | "mummy" | "ghost"
  | "frankenstein" | "mermaid" | "witch" | "werewolf";

interface ScoreEntry  { character: CharacterId; value: number; }
interface ResidentType {
  id: CharacterId; monster: string; image: string;
  desc: string; strength: string; weakness: string; tip: string;
  compatibleWith: CharacterId; incompatibleWith: CharacterId;
}
interface Choice   { text: string; scores: ScoreEntry[]; }
interface Question { text: string; sub?: string; choices: Choice[]; }

// ── 유형 데이터 ───────────────────────────────────────────
const RESIDENT_TYPES: ResidentType[] = [
  {
    id: "vampire", monster: "뱀파이어",
    image: "/images/characters/뱀파이어.png",
    desc: "바깥에서 다 쏟아붓고 들어오는 당신은 혹시 뱀파이어? 사회생활은 나름 잘 하는데, 퇴근하면 말 걸지 마세요 모드로 전환되는 입주민. 집은 오직 회복을 위한 공간. 겉으로는 멀쩡해 보이지만 속은 늘 번아웃 직전이다.",
    strength: "일 앞에서는 누구보다 빠르고 유능하게 움직인다. 해야 할 건 한다.",
    weakness: "충전이 안 된 상태에서 뭔가를 요구받으면 감당이 안 된다. 에너지 관리가 안 되면 급격히 무너진다.",
    tip: "집에 들어오기 전에 딱 10분만 혼자만의 디컴프레션 루틴을 만들어봐. 전환이 훨씬 부드러워져.",
    compatibleWith: "ghost", incompatibleWith: "werewolf",
  },
  {
    id: "zombie", monster: "좀비",
    image: "/images/characters/좀비.png",
    desc: "매일 같은 시간에 일어나고, 정해진 동선대로 움직이는 당신은 혹시 좀비? 스케줄이 흔들리면 하루가 무너지는 것 같고, 루틴 안에 있을 때만 비로소 안심이 되는 입주민. 감정보다 효율, 즉흥보다 계획.",
    strength: "꾸준함이 최강 무기. 남들이 작심삼일 할 때 혼자 한 달째 유지하고 있다.",
    weakness: "계획이 틀어지면 필요 이상으로 흔들린다. 변수가 생기면 대처가 느리다.",
    tip: "플랜 B도 루틴으로 만들어봐. 예외 상황까지 미리 정해두면 변수가 훨씬 덜 무서워져.",
    compatibleWith: "mummy", incompatibleWith: "witch",
  },
  {
    id: "mummy", monster: "미라",
    image: "/images/characters/미라.png",
    desc: "오래된 방식, 자기만의 기준, 한번 자리 잡으면 잘 안 움직이는 당신은 혹시 미라? 새로운 것보다 익숙한 것이 편하고, 신뢰를 쌓는 데 시간이 걸리지만 한번 쌓이면 의리는 최고인 입주민.",
    strength: "흔들리지 않는 자기 페이스. 남들 시선에 크게 휘둘리지 않는다.",
    weakness: "변화 자체를 거부하다 보면 기회를 놓칠 때가 있다. 새로운 것에 대한 진입장벽이 너무 높다.",
    tip: "아주 작은 것 하나만 바꿔봐. 바꾼다고 네가 흔들리는 게 아니야.",
    compatibleWith: "zombie", incompatibleWith: "werewolf",
  },
  {
    id: "ghost", monster: "유령",
    image: "/images/characters/유령.png",
    desc: "사람들 눈에 잘 띄지 않고, 먼저 나서는 일이 거의 없는 당신은 혹시 유령? 구석에 조용히 있는데 사실 다 보고 있고, 다 느끼고 있는 입주민. 가까워지면 누구보다 섬세하게 챙겨준다.",
    strength: "관찰력과 신중함 덕에 실수가 적다. 한번 믿은 사람은 끝까지 간다.",
    weakness: "존재감이 너무 희미해서 관계에서 자꾸 뒷전이 된다. 말을 안 하면 상대는 모른다.",
    tip: "침묵이 항상 미덕은 아니야. 한 마디만 먼저 꺼내봐.",
    compatibleWith: "vampire", incompatibleWith: "werewolf",
  },
  {
    id: "frankenstein", monster: "프랑켄슈타인",
    image: "/images/characters/프랑켄슈타인.png",
    desc: "혼자 뭔가를 끊임없이 만들고 조립하는 당신은 혹시 프랑켄슈타인? 작업실 안에 있을 때 가장 행복하고, 완성되지 않은 것들로 가득 찬 공간을 좋아하는 입주민. 감정을 말보다 만든 것으로 표현하는 타입.",
    strength: "한번 시작한 건 끝을 본다. 디테일에 강하고 끈질기다.",
    weakness: "보여주기 전에 혼자 지쳐버리는 경우가 너무 많다. 완벽주의가 발목을 잡는다.",
    tip: "미완성인 채로 꺼내도 괜찮아. 같이 만드는 것도 나쁘지 않아.",
    compatibleWith: "witch", incompatibleWith: "mermaid",
  },
  {
    id: "mermaid", monster: "인어",
    image: "/images/characters/인어.png",
    desc: "사람이 좋아서 사람한테서 에너지를 얻는 당신은 혹시 인어? 집에 사람 부르는 걸 좋아하고, 관계망이 넓으며, 감정 공감 능력이 높은 입주민.",
    strength: "사람을 좋아해서 사람을 잘 안다. 관계와 소통에 탁월하다.",
    weakness: "남 챙기다가 정작 자기 감정은 쌓아둔다. 혼자 있는 시간이 길어지면 눈에 띄게 시든다.",
    tip: "들어주는 만큼 네 이야기도 해봐. 관계는 일방통행이 아니야.",
    compatibleWith: "werewolf", incompatibleWith: "frankenstein",
  },
  {
    id: "witch", monster: "마녀",
    image: "/images/characters/마녀.png",
    desc: "아이디어가 넘치고 크고 작은 사고를 치는 당신은 혹시 마녀? 계획보다 즉흥, 규칙보다 자기만의 원칙이 있는 입주민. 분위기를 주도하는 걸 좋아하고 실행력은 있지만 마무리가 가끔 약하다.",
    strength: "기획력과 실행력, 분위기 파악까지. 사람들이 자기도 모르게 따라가는 타입.",
    weakness: "내 방식이 맞다는 확신이 관계를 삐걱거리게 할 때가 있다. 마무리보다 시작이 많다.",
    tip: "레시피 없이 요리해도 될 때가 있어. 의외로 더 잘 풀릴 수도 있어.",
    compatibleWith: "frankenstein", incompatibleWith: "zombie",
  },
  {
    id: "werewolf", monster: "늑대인간",
    image: "/images/characters/늑대인간.png",
    desc: "평소엔 무난한데 어느 순간 완전히 다른 사람이 되는 당신은 혹시 늑대인간? 감정이 날씨처럼 바뀌고, 에너지가 폭발했다가 급격히 꺼지는 사이클이 뚜렷한 입주민.",
    strength: "최고의 에너자이저. 타오를 때는 누구보다 뜨겁고 추진력이 넘친다.",
    weakness: "폭발 이후 수습이 약하다. 충동적으로 저지른 것들이 나중에 발목을 잡는다.",
    tip: "에너지를 쓰기 전에 방향을 한 번만 점검해봐. 그게 전부야.",
    compatibleWith: "mermaid", incompatibleWith: "ghost",
  },
];

// ── 질문 데이터 ───────────────────────────────────────────
const QUESTIONS: Question[] = [
  {
    text: "이번에 새롭게 몬스터 맨션에 입주를 하게 되었다. 문을 열고 들어선 순간 펼쳐진 공간은 ..",
    choices: [
      { text: "힙하고 트렌디한 무드의 공간", scores: [{ character: "witch", value: 2 }, { character: "werewolf", value: 1 }] },
      { text: "조용하고 사람이 많지 않은 공간", scores: [{ character: "vampire", value: 2 }, { character: "ghost", value: 1 }] },
      { text: "학교나 직장까지 가까운 공간", scores: [{ character: "zombie", value: 2 }, { character: "mummy", value: 1 }] },
      { text: "가족, 친구와 함께 있을 수 있는 공간", scores: [{ character: "mermaid", value: 2 }, { character: "werewolf", value: 1 }] },
    ],
  },
  {
    text: "당신의 일상에서, 어느 정도 거리까지는 '괜찮다'고 느껴지나요?",
    choices: [
      { text: "가볍게 걸어서 닿을 수 있는 거리여야 해!", scores: [{ character: "zombie", value: 2 }, { character: "mummy", value: 1 }] },
      { text: "30분 정도 이동이라면 충분해!", scores: [{ character: "vampire", value: 2 }, { character: "mermaid", value: 1 }] },
      { text: "1시간 거리도 감수할 수 있어!", scores: [{ character: "frankenstein", value: 2 }, { character: "witch", value: 1 }] },
      { text: "거리보다 분위기와 가치가 더 중요해!", scores: [{ character: "ghost", value: 2 }, { character: "witch", value: 1 }] },
    ],
  },
  {
    text: "맨션 밖을 나갈 때 한 가지 능력만 챙겨갈 수 있는 당신, 어떤 능력을 가지고 나가고 싶나요?",
    choices: [
      { text: "성실하고 규칙을 잘 지켜서 인정받는 능력", scores: [{ character: "zombie", value: 2 }, { character: "mummy", value: 1 }] },
      { text: "분석하고 계산하며 이웃들의 문제를 해결하는 능력", scores: [{ character: "vampire", value: 2 }, { character: "frankenstein", value: 1 }] },
      { text: "새로운 걸 만들고 표현하는 창의적인 능력", scores: [{ character: "frankenstein", value: 2 }, { character: "witch", value: 1 }] },
      { text: "이웃을 돕고 필요한 것을 챙겨주는 따뜻한 능력", scores: [{ character: "mermaid", value: 2 }, { character: "ghost", value: 1 }] },
    ],
  },
  {
    text: "이 맨션에서 당신은 보통 어디서 일상을 즐기나요?",
    choices: [
      { text: "하루 대부분을 집에서..", scores: [{ character: "frankenstein", value: 2 }, { character: "ghost", value: 1 }] },
      { text: "낮에는 바쁘게 움직이고, 밤이 되면 돌아와요", scores: [{ character: "vampire", value: 2 }, { character: "zombie", value: 1 }] },
      { text: "집은 잠시 쉬어가는 곳, 대부분은 바깥에서.", scores: [{ character: "mermaid", value: 2 }, { character: "werewolf", value: 1 }] },
      { text: "정해진 패턴 없이, 날마다 흐름이 달라요", scores: [{ character: "witch", value: 2 }, { character: "werewolf", value: 1 }] },
    ],
  },
  {
    text: "당신의 활동 시간은 언제에 가까운가요?",
    choices: [
      { text: "이른 시간부터 움직여요", scores: [{ character: "zombie", value: 2 }, { character: "mummy", value: 1 }] },
      { text: "낮 시간대가 가장 활발해요", scores: [{ character: "mermaid", value: 2 }, { character: "witch", value: 1 }] },
      { text: "해가 지고 나서 본격적으로 활동해요", scores: [{ character: "vampire", value: 2 }, { character: "ghost", value: 1 }] },
      { text: "집 가면 새벽이에요", scores: [{ character: "werewolf", value: 2 }, { character: "witch", value: 1 }] },
    ],
  },
  {
    text: "당신은 잘 맞을 것 같은 입주민을 발견했습니다. 그와 함께 시간을 보내게 된다면, 어떤 이야기를 나눌 건가요?",
    choices: [
      { text: "사람들과의 관계 속에서 느끼는 감정들", scores: [{ character: "mermaid", value: 2 }, { character: "ghost", value: 1 }] },
      { text: "앞으로의 방향과 선택에 대한 고민", scores: [{ character: "vampire", value: 2 }, { character: "mummy", value: 1 }] },
      { text: "누군가와의 감정과 관계에 대한 이야기", scores: [{ character: "werewolf", value: 2 }, { character: "mermaid", value: 1 }] },
      { text: "더 나은 나를 만들어가는 이야기", scores: [{ character: "frankenstein", value: 2 }, { character: "witch", value: 1 }] },
    ],
  },
  {
    text: "하루를 마무리하던 순간, 유독 짜증나던 입주민이 생각이 납니다. 이때 내가 하는 행동은?",
    choices: [
      { text: "잠이 오지 않아서 수면제를 먹고 다시 잔다", scores: [{ character: "vampire", value: 2 }, { character: "mummy", value: 1 }] },
      { text: "이불킥 및 벽을 차거나 저주인형을 찌른다", scores: [{ character: "werewolf", value: 2 }, { character: "witch", value: 1 }] },
      { text: "손톱을 물어뜯거나 키캡키링을 만지작거린다", scores: [{ character: "ghost", value: 2 }, { character: "zombie", value: 1 }] },
      { text: "일기를 쓰면서 나의 감정을 돌아본다", scores: [{ character: "frankenstein", value: 2 }, { character: "mummy", value: 1 }] },
    ],
  },
  {
    text: "맨션에 새로운 규칙이 생겼습니다. 이때 나의 반응은?",
    choices: [
      { text: "일단 따르긴 하는데, 루틴에 맞출 수 있을 때만", scores: [{ character: "zombie", value: 2 }, { character: "vampire", value: 1 }] },
      { text: "왜 바꿔? 원래 방식이 더 좋은데", scores: [{ character: "mummy", value: 2 }, { character: "ghost", value: 1 }] },
      { text: "어차피 내 방 안에서는 내 맘대로 살 거야", scores: [{ character: "frankenstein", value: 2 }, { character: "witch", value: 1 }] },
      { text: "오히려 좋아! 같이 하면 재밌겠는데?", scores: [{ character: "mermaid", value: 2 }, { character: "werewolf", value: 1 }] },
    ],
  },
];

// ── 상수 ─────────────────────────────────────────────────
const BOTTLE_COLORS = ["#9b6dff","#00c4e8","#ff6b35","#2ecc71","#ff2d5e","#4169e1","#ff3ab8","#ffd700","#a8e063","#ff8c42","#7b68ee","#20b2aa"];
const BREW_INTERVALS = [60,60,70,80,95,115,140,175,220,280,360,460,590];
const MONSTER_NAMES = RESIDENT_TYPES.map(t => t.monster);

// ── 유틸 ─────────────────────────────────────────────────
function getResidentType(scores: Partial<Record<CharacterId, number>>): ResidentType {
  let bestId: CharacterId = "vampire";
  let bestScore = -Infinity;
  for (const type of RESIDENT_TYPES) {
    const score = scores[type.id] ?? 0;
    if (score > bestScore) { bestScore = score; bestId = type.id; }
  }
  return RESIDENT_TYPES.find(t => t.id === bestId)!;
}

// ── 별 배경 ───────────────────────────────────────────────
function StarField() {
  const stars = useMemo(() => (
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.5,
      delay: Math.random() * 10,
      duration: Math.random() * 3 + 2,
    }))
  ), []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.3); }
        }
      `}</style>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute",
          left: `${s.x}%`, top: `${s.y}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: "50%",
          background: "#e0d4ff",
          animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ── 포션병 SVG ────────────────────────────────────────────
function BottleSVG({ filled, color }: { filled: boolean; color: string }) {
  const id = `clip-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox="0 0 60 90" width="52" height="78" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={id}>
          <path d="M10,40 Q8,44 8,52 Q8,73 30,75 Q52,73 52,52 Q52,44 50,40 Z" />
        </clipPath>
      </defs>
      <rect x="23" y="15" width="14" height="11" rx="4" fill="#c8996a" />
      <rect x="25" y="17" width="10" height="7" rx="2" fill="#b8895a" />
      <rect x="27" y="18" width="6" height="1.5" rx="1" fill="#a07848" opacity="0.5" />
      <rect x="24" y="24" width="12" height="18" rx="2" fill={filled ? color : "#8b6fc2"} opacity={filled ? 0.55 : 0.4} />
      <path
        d="M10,40 Q8,44 8,52 Q8,73 30,75 Q52,73 52,52 Q52,44 50,40 Z"
        fill="#000000" stroke={filled ? color : "#7c3aed"} strokeWidth="1.3" opacity="0.9"
      />
      {filled && (
        <>
          <path d="M10,54 Q20,51 30,54 Q40,57 50,54 L52,52 Q52,73 30,75 Q8,73 8,52 Z"
            fill={color} opacity="0.6" clipPath={`url(#${id})`} />
          <circle cx="18" cy="60" r="2.5" fill={color} opacity="0.35" />
          <circle cx="38" cy="65" r="1.8" fill={color} opacity="0.25" />
        </>
      )}
    </svg>
  );
}

// ── 공통 스타일 객체 ──────────────────────────────────────
const card = (extra?: object) => ({
  background: C.card,
  border: `1.5px solid ${C.border}`,
  borderRadius: "28px",
  padding: "28px 24px",
  width: "100%",
  ...extra,
});

const label = (extra?: object) => ({
  color: C.accentB,
  fontSize: "10px",
  letterSpacing: "0.15em",
  ...extra,
});

// ── 메인 ─────────────────────────────────────────────────
type Screen = "main" | "question" | "brew";

export default function TestPage() {
  const [mounted, setMounted]       = useState(false);
  const [screen, setScreen]         = useState<Screen>("main");
  const [charScores, setCharScores] = useState<Partial<Record<CharacterId, number>>>({});
  const [filled, setFilled]         = useState<boolean[]>(() => Array(QUESTIONS.length).fill(false));
  const [activeQ, setActiveQ]       = useState(-1);
  const [pickedChoice, setPickedChoice] = useState(-1);
  const [confirmed, setConfirmed]   = useState(false);   // ← 새로 추가: '다음' 눌렀는지
  const [slotRunning, setSlotRunning] = useState(false);
  const [slotName, setSlotName]     = useState("");
  const [resultReady, setResultReady] = useState(false);
  const [name, setName]             = useState("");
  const [phone, setPhone]           = useState("");

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const result           = useMemo(() => getResidentType(charScores), [charScores]);
  const allFilled        = filled.every(Boolean);
  const filledCount      = filled.filter(Boolean).length;
  const compatibleType   = RESIDENT_TYPES.find(r => r.id === result.compatibleWith);
  const incompatibleType = RESIDENT_TYPES.find(r => r.id === result.incompatibleWith);

  const openQuestion = (idx: number) => {
    if (filled[idx]) return;
    setActiveQ(idx); setPickedChoice(-1); setConfirmed(false); setScreen("question");
  };

  // 선택지 클릭 → 점수 누적, 하이라이트만. 이동은 '다음' 버튼이 담당
  const pickChoice = (ci: number) => {
    if (pickedChoice !== -1) return;
    setPickedChoice(ci);
    const chosen = QUESTIONS[activeQ].choices[ci];
    setCharScores(prev => {
      const next = { ...prev };
      for (const s of chosen.scores) next[s.character] = (next[s.character] || 0) + s.value;
      return next;
    });
  };

  // '다음' 버튼 → 채우기 & 메인으로
  const confirmChoice = () => {
    setConfirmed(true);
    setTimeout(() => {
      setFilled(prev => { const n = [...prev]; n[activeQ] = true; return n; });
      setScreen("main");
    }, 200);
  };

  const startBrew = () => {
    setScreen("brew"); setSlotRunning(true); setResultReady(false);
    const finalName = result.monster;
    let i = 0;
    const run = (step: number) => {
      if (step >= BREW_INTERVALS.length) {
        setSlotName(finalName); setSlotRunning(false);
        setTimeout(() => setResultReady(true), 500);
        return;
      }
      setSlotName(MONSTER_NAMES[i++ % MONSTER_NAMES.length]);
      setTimeout(() => run(step + 1), BREW_INTERVALS[step]);
    };
    run(0);
  };

  const restartAll = () => {
    setCharScores({}); setFilled(Array(QUESTIONS.length).fill(false));
    setActiveQ(-1); setPickedChoice(-1); setConfirmed(false);
    setSlotRunning(false); setSlotName(""); setResultReady(false);
    setName(""); setPhone(""); setScreen("main");
  };

  const handleSubmit = async () => {
    try {
      await fetch("https://script.google.com/macros/s/AKfycbyqK588IwhjxgJofSBWBVhVkznP0rlK8XjW4VYQVsXbBnsIXOaOE5IiXIaDg0IJLGFQ-w/exec", {
        method: "POST",
        body: JSON.stringify({ name, phone, result: result.monster }),
      });
      alert("응모 완료!");
    } catch (err) {
      console.error(err);
      alert("전송 실패 😢");
    }
  };

  return (
    <div 
      className={`mm-root transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      style={{ background: C.bg, height: "auto", minHeight: "100dvh", overflowY: "auto" }}>

      <StarField />

      {/* ── 메인 ── */}
      {screen === "main" && (
        <div className="relative z-10 flex flex-col items-center w-full">
          <NavBar variant="back" backHref="/" backLabel="MAIN" />
          <h1 className="font-jua text-4xl text-center" style={{ marginTop: 90, color: C.text }}>
            입주민 유형 테스트
          </h1>
          <p className="font-noto font-normal text-sm tracking-widest mb-10" style={{ color: C.accent }}>
            당신은 어떤 입주민인가요?
          </p>

          <div className="grid grid-cols-4 gap-y-9 max-w-xs w-full" style={{ marginTop: 30 }}>
            {QUESTIONS.map((_, i) => (
              <button key={i} onClick={() => openQuestion(i)} disabled={filled[i]}
                className="flex flex-col items-center gap-1 active:opacity-60 transition-opacity">
                <BottleSVG filled={filled[i]} color={BOTTLE_COLORS[i % BOTTLE_COLORS.length]} />
                {filled[i]
                  ? <span className="font-noto text-[10px]" style={{ color: C.accentB }}>완료</span>
                  : <span className="font-jua text-sm" style={{ color: C.textDim }}>{i + 1}</span>
                }
              </button>
            ))}
          </div>

          {/* 진행바 */}
          <div className="w-full max-w-xs" style={{ marginTop: 30, marginBottom: 4 }}>
            <div className="h-0.5 rounded-full" style={{ background: C.cardAlt }}>
              <div className="h-0.5 rounded-full transition-all duration-500"
                style={{ width: `${(filledCount / QUESTIONS.length) * 100}%`, background: C.cta }} />
            </div>
            <p className="font-noto text-[10px] text-right mt-1" style={{ color: C.textDim }}>
              {filledCount} / {QUESTIONS.length}
            </p>
          </div>

          {allFilled && (
            <button onClick={startBrew}
              className="font-jua"
              style={{
                fontSize: 18,
                padding: "16px 0", width: "100%", maxWidth: 280,
                borderRadius: 18, border: `2px solid ${C.cta}`,
                background: "transparent", color: C.accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: 24,
                cursor: "pointer", transition: "all 0.2s",
              }}>
              ✦ 물약 제조하기 ✦
            </button>
          )}
        </div>
      )}

      {/* ── 질문 ── */}
      {screen === "question" && activeQ !== -1 && (
        <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-6 pb-12"
          style={{ paddingTop: 50, paddingLeft: 30, paddingRight: 30 }}>
          <button onClick={() => setScreen("main")}
            className="self-start font-noto text-[11px] tracking-wide mb-8"
            style={{ color: C.textDim }}>
            ← 돌아가기
          </button>

          <p className="font-noto text-[10px] tracking-widest mb-3" 
            style={{ color: C.accentB, marginTop: 30 }}>
            질문 {activeQ + 1} / {QUESTIONS.length}
          </p>
          <p className="font-jua text-2xl text-center leading-relaxed" 
            style={{ color: C.text, marginTop: 10 }}>
            {QUESTIONS[activeQ].text}
          </p>

          <div className="flex flex-col gap-2 w-full" style={{ marginTop: 20 }}>
            {QUESTIONS[activeQ].choices.map((c, ci) => (
              <button key={ci} onClick={() => pickChoice(ci)}
                className="font-noto font-bold text-center transition-all leading-relaxed"
                style={{
                  backgroundColor: pickedChoice === ci ? "#4c1d95" : C.text,
                  border: `2px solid ${pickedChoice === ci ? "#4c1d95" : C.text}`,
                  color: pickedChoice === ci ? C.text : "#000000",
                  padding: "14px 24px",
                  borderRadius: 30, width: "100%",
                  fontWeight: pickedChoice === ci ? 500 : 400,
                }}>
                {c.text}
              </button>
            ))}
          </div>

          {/* 다음 버튼 — 선택 후에만 나타남 */}
          {pickedChoice !== -1 && (
            <button
              onClick={confirmChoice}
              className="font-jua"
              style={{
                fontSize: 18,
                padding: "10px 6px", width: "100%",
                borderRadius: 30, border: "none",
                background: confirmed ? "#3b1f6e" : C.cta, color: C.text,
                opacity: confirmed ? 0.6 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 10, marginTop: 16,
                transition: "all 0.2s",
                cursor: confirmed ? "default" : "pointer",
              }}
            >
              다음
              <span style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}>
                →
              </span>
            </button>
          )}
        </div>
      )}

      {/* ── 제조 / 결과 ── */}
      {screen === "brew" && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 pb-12">
          {!resultReady ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src="/images/test.png"
                alt="slot"
                className="w-50 h-50 object-contain"
              />
              <p className="font-noto tracking-widest animate-pulse" style={{ color: C.accentB }}>
                {slotRunning ? "변신 물약 제조 중..." : ""}
              </p>
              <p className={`font-jua text-5xl text-center ${slotRunning ? "animate-pulse" : ""}`}
                style={{ color: C.text }}>
                {slotName}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center w-full max-w-sm">

              {/* 결과 카드 */}
              <div style={{ ...card({ marginTop: 20, marginBottom: 20 }) }}>
                <p className="font-noto" style={label({ marginBottom: 6 })}>나는 어떤 몬스터일까?</p>
                <h2 className="font-jua" style={{ fontSize: 40, color: C.text, marginBottom: 4 }}>
                  {result.monster}
                </h2>
                <div style={{ width: 300, height: 300 }}>
                  {result.image
                    ? <img src={result.image} alt={result.monster} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>🌙</div>
                  }
                </div>
                <div style={{ borderTop: `1px solid ${C.borderL}`, margin: "16px 0" }} />
                <div className="font-noto text-left" style={{ color: C.textSub, fontSize: 15, lineHeight: 1.9 }}>
                  <p>✦ {result.desc}</p><br />
                  <p>✦ {result.strength}</p><br />
                  <p>✦ {result.weakness}</p><br />
                  <p>✦ {result.tip}</p>
                </div>
                <div style={{ borderTop: `1px solid ${C.borderL}`, margin: "16px 0" }} />

                {/* 룸메이트 궁합 */}
                <p className="font-jua" style={{ color: C.text, fontSize: 30, marginTop: 30, marginBottom: 12 }}>
                  룸메이트 궁합
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { label: "같이 살면 좋은", type: compatibleType },
                    { label: "같이 살면 힘든", type: incompatibleType },
                  ].map(({ label: lbl, type: t }) => (
                    <div key={lbl} style={{ flex: 1, background: C.cardAlt, borderRadius: 16, padding: "10px 12px" }}>
                      <p className="font-noto" style={{ color: C.accentB, fontSize: 10, letterSpacing: "0.12em", marginBottom: 8 }}>
                        {lbl}
                      </p>
                      <div style={{
                        width: 120, height: 120, margin: "0 auto 8px",
                        borderRadius: "50%", background: C.borderL,
                        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {t?.image
                          ? <img src={t.image} alt={t.monster} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          : <span style={{ fontSize: 28 }}>🌙</span>
                        }
                      </div>
                      <p className="font-jua" style={{ color: C.text, fontSize: 20 }}>{t?.monster}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 응모 섹션 */}
              <div style={card({ marginBottom: 16 })}>
                <p className="font-noto" style={label({ marginBottom: 8 })}>EVENT</p>
                <p className="font-jua" style={{ color: C.text, fontSize: 30 }}>추첨 이벤트</p>
                <p className="font-noto" style={{ color: C.textDim, fontSize: 16, marginBottom: 20 }}>
                  입주민 테스트 참여 기념
                </p>

                <div style={{ background: C.cardAlt, borderRadius: 16, padding: 16, marginBottom: 20, textAlign: "left" }}>
                  <p className="font-noto" style={{ color: C.textSub, fontSize: 13, lineHeight: 1.9 }}>
                    몬스터 맨션은 지금 입주민을 모집 중이에요.<br />
                    우리가 만들어가는 캐릭터들이 실제로 사람들 눈에<br />
                    어떻게 보이는지, 어떤 유형에 공감하는지를<br />
                    확인하고 있기도 해요.<br /><br />
                    테스트에 참여해주신 분들 중 추첨을 통해<br />
                    소소하지만 정성스러운 선물을 드립니다!
                  </p>
                </div>

                <p className="font-noto" style={label({ marginBottom: 12 })}>PRIZE</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {[
                    { tier: "1등", prize: "마우스 장패드 + 키보드", count: "각 1명" },
                    { tier: "2등", prize: "키스킨",                  count: "5명" },
                    { tier: "3등", prize: "올리브영 · 배민 상품권", count: "20명" },
                  ].map(({ tier, prize, count }) => (
                    <div key={tier} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: C.bg, border: `1px solid ${C.borderL}`,
                      borderRadius: 12, padding: "10px 14px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="font-jua" style={{ color: C.textDim, fontSize: 13, minWidth: 28 }}>{tier}</span>
                        <span className="font-noto" style={{ color: C.text, fontSize: 13 }}>{prize}</span>
                      </div>
                      <span className="font-noto" style={{ color: C.textMut, fontSize: 11 }}>{count}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { placeholder: "이름",   value: name,  setter: setName,  type: "text" },
                    { placeholder: "전화번호", value: phone, setter: setPhone, type: "tel"  },
                  ].map(({ placeholder, value, setter, type }) => (
                    <input key={placeholder}
                      className="font-noto font-normal text-sm outline-none"
                      placeholder={placeholder} value={value}
                      onChange={e => setter(e.target.value)} type={type}
                      style={{
                        background: C.bg, border: `1.5px solid ${C.border}`,
                        borderRadius: 14, padding: "14px 18px",
                        color: C.text, fontSize: 14, width: "100%",
                      }}
                    />
                  ))}
                  <button onClick={handleSubmit} className="font-jua"
                    disabled={!name || !phone}
                    style={{
                      background: name && phone ? C.cta : C.cardAlt,
                      color: name && phone ? "#fff" : C.textMut,
                      border: "none", borderRadius: 16, padding: 16,
                      fontSize: 18, cursor: name && phone ? "pointer" : "default",
                      width: "100%", transition: "background 0.2s",
                    }}>
                    응모하기
                  </button>
                  <p className="font-noto" style={{ color: C.textMut, fontSize: 11, marginTop: 2 }}>
                    수집된 정보는 추첨 목적으로만 사용되며, 이후 즉시 폐기됩니다.
                  </p>
                </div>
              </div>

              <button onClick={restartAll} className="font-noto font-normal"
                style={{ color: C.textMut, fontSize: 12, textDecoration: "underline", marginBottom: 10 }}>
                처음부터 다시하기
              </button>

              {/* 다른 유형 보기 버튼 */}
              <Link href="/test/types"
                className="font-noto text-sm tracking-widest"
                style={{
                  color: C.accentB,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "14px 0",
                  width: "100%",
                  maxWidth: 280,
                  borderRadius: 18,
                  border: `1.5px solid ${C.border}`,
                  marginBottom: 16,
                }}>
                다른 입주민 유형 보러가기
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}