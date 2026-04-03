"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import NavBar from "../components/NavBar";

// ── 타입 정의 ─────────────────────────────────────────────
type Axis = "EI" | "SN" | "TF" | "JP";
interface ScoreEntry { axis: Axis; value: number; }

interface ResidentType {
  id: number;
  monster: string;
  image: string;
  desc: string;
  strength: string;
  weakness: string;
  tip: string;
  match: { EI?: "E" | "I"; SN?: "S" | "N"; TF?: "T" | "F"; JP?: "J" | "P" };
  compatibleWith: number[];
  incompatibleWith: number[];
}

const RESIDENT_TYPES: ResidentType[] = [
  {
    id: 1,
    monster: "드라큘라",
    image: "/images/characters/드라큘라.png",
    desc: "커튼 친 방에서 사색을 즐기는 당신은 혹시 드라큘라? 먼저 다가가는 타입은 아니지만, 한 번 가까워지면 그 사람을 잘 챙겨주는 선 확실한 입주민.",
    strength: "한번 무언가에 꽂힐 때마다 깊이가 남다르다.",
    weakness: "문턱이 너무 높아서 사람들이 지레 포기하고 떠나는 일이 종종 생긴다.",
    tip: "먼저 문을 한 번만 열어봐. 상대도 초대를 기다리고 있을 수 있어.",
    match: { EI: "I", SN: "N", TF: "F" },
    compatibleWith: [5, 6],
    incompatibleWith: [3, 7],
  },
  {
    id: 2,
    monster: "마녀",
    image: "/images/characters/마녀.png",
    desc: "요리든, 프로젝트든, 사람 사이의 판이든, 항상 뭔가를 만드는 당신은 혹시 마녀? 주변을 자기 페이스로 자연스럽게 끌어당기는 힘이 있고, 규칙엔 관심 없지만 자기만의 원칙은 확실한 입주민. 겉으론 쿨해 보이는데 사실 누구보다 섬세하게 주변을 신경 쓰고 있을지도.",
    strength: "기획력과 실행력 확실! 분위기 읽는 눈도 있어서 사람들이 자기도 모르게 따라가는 타입.",
    weakness: "내 방식이 최고라는 확신이 가끔 관계를 삐걱거리게 해. 맞는 말이어도 타이밍이 중요할 수 있어.",
    tip: "가끔은 레시피 없이 요리해봐. 의외로 더 잘 풀릴 수도 있어.",
    match: { EI: "E", SN: "N", JP: "J" },
    compatibleWith: [4, 8],
    incompatibleWith: [3, 7],
  },
  {
    id: 3,
    monster: "늑대인간",
    image: "/images/characters/늑대인간.png",
    desc: "평소엔 무난한데 어느 순간 완전히 다른 사람이 되는 당신은 혹시 늑대인간? 흐름 타는 걸 잘하고, 새로운 것 앞에선 누구보다 먼저 달려가는 입주민. 제일 싫어하는 거? 루틴이나 규칙!",
    strength: "최고의 에너자이저, 분위기 메이커.",
    weakness: "폭발 이후 수습을 잘 못한다. 충동적으로 저지른 것들이 나중에 발목 잡을 때가 있다.",
    tip: "에너지를 쓰기 전, 한 번씩 방향을 점검해 보면 좋아.",
    match: { EI: "E", SN: "S", JP: "P" },
    compatibleWith: [7, 8],
    incompatibleWith: [1, 2],
  },
  {
    id: 4,
    monster: "프랑켄슈타인",
    image: "/images/characters/프랑켄슈타인.png",
    desc: "혼자 뭔가를 끊임없이 조립하고 만들고 있는 당신은 혹시 프랑켄슈타인? 공간에 대한 애착이 강하고 자신의 루틴이 확실한 편인 입주민. 감정을 말로 꺼내는 데에는 조금 시간이 걸린다.",
    strength: "한 번 시작한 건 끝을 본다. 디테일에 강하고, 끈질김과 꼼꼼함이 있다.",
    weakness: "보여주기 전에 혼자 지쳐버리는 경우가 너무 많다. 한 마디로, 완벽주의가 있다.",
    tip: "미완성인 채로 꺼내도 괜찮아. 보여주고 같이 만드는 것도 나쁘지 않아.",
    match: { EI: "I", SN: "S", JP: "J" },
    compatibleWith: [2, 6],
    incompatibleWith: [3, 8],
  },
  {
    id: 5,
    monster: "유령",
    image: "/images/characters/유령.png",
    desc: "사람들의 시야에서 종종 사라지고, 말 한 마디 꺼내기가 무서운 당신은 혹시 유령? 돌다리도 두들겨보고 건너는 신중한 입주민.",
    strength: "꼼꼼함과 신중함 덕에 어지간하면 실수가 적다.",
    weakness: "존재감이 너무 없어서 관계에서 자꾸 후순위가 된다.",
    tip: "가끔씩은 먼저 말을 꺼내보는 건 어떨까? 침묵이 항상 미덕은 아니야.",
    match: { EI: "I", SN: "N", JP: "J" },
    compatibleWith: [1, 4],
    incompatibleWith: [3, 7],
  },
  {
    id: 6,
    monster: "좀비",
    image: "/images/characters/좀비.png",
    desc: "매일 같은 시간에 일어나고, 같은 동선으로 움직이는 당신은 혹시 좀비? 에너지 낭비는 줄이는 쪽으로, 감정보다는 논리, 관계보다는 목표 지향적인 입주민.",
    strength: "꾸준함이 무기다. 남들이 작심삼일 할 때 혼자 3개월째 유지하고 있을 때도 있다.",
    weakness: "변수에 약하다. 계획이 틀어지면 필요 이상으로 흔들리곤 한다.",
    tip: "플랜 B를 미리 짜두는 것도 루틴으로 만들어봐. 대비가 되면 변수가 덜 무서워져.",
    match: { EI: "I", SN: "S", JP: "P" },
    compatibleWith: [4, 5],
    incompatibleWith: [3, 7],
  },
  {
    id: 7,
    monster: "인어",
    image: "/images/characters/인어.png",
    desc: "사람이 오는 걸 좋아하고, 집에 부르는 걸 더 좋아하고, 항상 파티인 당신은 혹시 인어? 상대의 감정을 기가 막히개 캐치하는 쾌활한 입주민. 에너지를 사람한테서 얻는 타입이라, 혼자 있는 시간이 길어지면 눈에 띄게 시들어 버린다.",
    strength: "사람을 좋아해서 사람을 잘 알고, 관계와 소통에 능숙하다.",
    weakness: "남 챙기다가 정작 자기 감정은 쌓아둘 수 있다.",
    tip: "들어주는 것만큼 네 얘기도 해 보자. 관계는 일방통행이 아니야.",
    match: { EI: "E", SN: "S", TF: "F" },
    compatibleWith: [3, 8],
    incompatibleWith: [1, 5],
  },
];

// ── 질문 데이터 ───────────────────────────────────────────
interface Choice {
  text: string;
  scores: ScoreEntry[];
}
interface Question {
  text: string;
  sub?: string;
  choices: Choice[];
}

const QUESTIONS: Question[] = [
  {
    text: "이번에 새롭게 몬스터 맨션에 입주를 하게 되었다. 문을 열고 들어선 순간 펼쳐진 공간은 ..",
    choices: [
      { text: "힙하고 트렌디한 무드의 공간", scores: [{ axis: "EI", value: 0 }, { axis: "SN", value: 0 }] },
      { text: "조용하고 한적한, 사람이 많지 않은 공간", scores: [{ axis: "EI", value: 0 }, { axis: "SN", value: 0 }] },
      { text: "학교나 직장까지 가까운 공간", scores: [{ axis: "JP", value: 0 }, { axis: "SN", value: 0 }] },
      { text: "가족, 친구와 함께 있을 수 있는 공간", scores: [{ axis: "TF", value: 0 }, { axis: "EI", value: 0 }] },
    ],
  },
  {
    text: "당신의 일상에서, 어느 정도 거리까지는 ‘괜찮다’고 느껴지나요?",
    choices: [
      { text: "가볍게 걸어서 닿을 수 있는 거리여야해!", scores: [{ axis: "JP", value: 0 }, { axis: "SN", value: 0 }] },
      { text: "30분 정도 이동이라면 충분해 !", scores: [{ axis: "JP", value: 0 }, { axis: "EI", value: 0 }] },
      { text: "1시간 정도 거리도 감수할 수 있어 !", scores: [{ axis: "JP", value: 0 }, { axis: "TF", value: 0 }] },
      { text: "거리보다는 그곳의 분위기와 가치가 더 중요해 !", scores: [{ axis: "SN", value: 0 }, { axis: "TF", value: 0 }] },
    ],
  },
  {
    text: "맨션 밖을 나갈때 한가지 능력만 챙겨갈 수 있는 당신, 어떤 능력을 가지고 나가고 싶나요?",
    choices: [
      { text: "성실하고 규칙을 잘 지켜서 인정받는 능력", scores: [{ axis: "TF", value: 0 }, { axis: "JP", value: 0 }] },
      { text: "분석하고 계산하며 이웃들의 문제를 해결하는 능력", scores: [{ axis: "SN", value: 0 }, { axis: "JP", value: 0 }] },
      { text: "더 멋진 맨션을 위해 새로운 걸 만들고 표현하는 창의적인 능력", scores: [{ axis: "SN", value: 0 }, { axis: "JP", value: 0 }] },
      { text: "이웃을 돕고 필요한 것을 챙겨주는 따뜻한 능력", scores: [{ axis: "TF", value: 0 }, { axis: "SN", value: 0 }] },
    ],
  },
  {
    text: "이 맨션에서 당신은 보통 어디서 일상을 즐기나요?",
    choices: [
      { text: "하루 대부분을 집에서 ..", scores: [{ axis: "EI", value: 0 }, { axis: "JP", value: 0 }] },
      { text: "낮에는 바쁘게 움직이고, 밤이 되면 돌아와요", scores: [{ axis: "EI", value: 0 }, { axis: "SN", value: 0 }] },
      { text: "집은 잠시 쉬어가는 곳, 대부분의 시간은 바깥에서 보내요", scores: [{ axis: "EI", value: 0 }, { axis: "JP", value: 0 }] },
      { text: "정해진 패턴 없이, 날마다 흐름이 달라요", scores: [{ axis: "JP", value: 0 }, { axis: "SN", value: 0 }] },
    ],
  },
  {
    text: "당신의 활동 시간은 언제에 가까운가요?",
    choices: [
      { text: "이른 시간부터 움직여요", scores: [{ axis: "JP", value: 0 }, { axis: "SN", value: 0 }] },
      { text: "낮 시간대가 가장 활발해요", scores: [{ axis: "EI", value: 0 }, { axis: "SN", value: 0 }] },
      { text: "해가 지고 나서 본격적으로 활동해요", scores: [{ axis: "EI", value: 0 }, { axis: "TF", value: 0 }] },
      { text: "집가면 새벽이에요", scores: [{ axis: "EI", value: 0 }, { axis: "JP", value: 0 }] },
    ],
  },
  {
    text: "어느 날, 맨션에 들어온 새로운 입주민. 왠지 모르게 당신과 잘 맞을 것 같은 느낌이 듭니다. 그와 함께 시간을 보내게 된다면, 당신은 어떤 이야기를 나눌건가요 ?",
    choices: [
      { text: "사람들과의 관계 속에서 느끼는 감정들", scores: [{ axis: "TF", value: 0 }, { axis: "EI", value: 0 }] },
      { text: "앞으로의 방향과 선택에 대한 고민", scores: [{ axis: "SN", value: 0 }, { axis: "JP", value: 0 }] },
      { text: "누군가와의 감정, 설렘과 관계에 대한 이야기", scores: [{ axis: "TF", value: 0 }, { axis: "EI", value: 0 }] },
      { text: "더 나은 나를 만들어가는 과정에 대한 이야기", scores: [{ axis: "JP", value: 0 }, { axis: "SN", value: 0 }] },
    ],
  },
  {
    text: "하루를 마무리하던 순간, 유독 신경을 긁은 입주민이 생각이 납니다. 이때 내가 하는 행동은?",
    choices: [
      { text: "잠이 오지 않아서 수면제를 먹고 다시 잔다", scores: [{ axis: "JP", value: 0 }, { axis: "TF", value: 0 }] },
      { text: "이불킥 및 벽을 차거나 저주인형을 찌른다", scores: [{ axis: "EI", value: 0 }, { axis: "TF", value: 0 }] },
      { text: "손톱을 물어뜯거나 키캣키링을 만지작거린다", scores: [{ axis: "SN", value: 0 }, { axis: "EI", value: 0 }] },
      { text: "일기를 쓰면서 나의 감정을 돌아본다", scores: [{ axis: "TF", value: 0 }, { axis: "JP", value: 0 }] },
    ],
  },
  {
    text: "맨션에서 이웃들과 오래 어울리다가 방에 들어왔을 때 드는 첫 느낌은?",
    choices: [
      { text: "아직 아쉬워, 더 있을걸", scores: [{ axis: "EI", value: 3 }] },
      { text: "좋았는데 이제 좀 쉬어야겠다", scores: [{ axis: "EI", value: -1.5 }, { axis: "TF", value: -0.5 }] },
      { text: "솔직히 좀 지쳤어, 혼자가 편해", scores: [{ axis: "EI", value: -3 }] },
      { text: "그때그때 달라, 사람이나 분위기에 따라", scores: [{ axis: "EI", value: -0.5 }, { axis: "SN", value: -0.5 }] },
    ],
  },
  {
    text: "새 입주민이 이사를 왔어요. 가장 먼저 뭐가 궁금해요?",
    choices: [
      { text: "이름이랑 어디서 왔는지 같은 기본적인 것", scores: [{ axis: "SN", value: 3 }, { axis: "TF", value: 0.5 }] },
      { text: "무슨 일 하는지, 어떻게 지내는 사람인지", scores: [{ axis: "SN", value: 1.5 }, { axis: "TF", value: 1 }] },
      { text: "어떤 사람인지, 무슨 생각을 하며 사는지", scores: [{ axis: "SN", value: -2.5 }, { axis: "TF", value: -1 }] },
      { text: "왜 이 맨션을 골랐는지, 어떤 계기였는지", scores: [{ axis: "SN", value: -3 }, { axis: "EI", value: -0.5 }] },
    ],
  },
  {
    text: "같은 층 이웃이 복도에서 고민을 털어놨어요. 나는 주로?",
    choices: [
      { text: "상황을 파악하고 뭘 어떻게 하면 될지 같이 생각해줘", scores: [{ axis: "TF", value: 3 }, { axis: "SN", value: -0.5 }] },
      { text: "일단 다 들어주고 맞장구부터 쳐", scores: [{ axis: "TF", value: -2.5 }, { axis: "EI", value: 0.5 }] },
      { text: "솔직하게 내 생각을 말해줘, 그게 도움이 될 것 같아서", scores: [{ axis: "TF", value: 2 }, { axis: "EI", value: -0.5 }] },
      { text: "그 사람이 뭘 원하는지부터 먼저 물어봐", scores: [{ axis: "TF", value: -1.5 }, { axis: "SN", value: -1 }] },
    ],
  },
  {
    text: "이번 주말에 맨션에서 하루가 통째로 비었어요. 나는?",
    choices: [
      { text: "뭘 할지 바로 정하고 준비해", scores: [{ axis: "JP", value: 3 }, { axis: "TF", value: 0.5 }] },
      { text: "하고 싶은 것들을 머릿속으로 쭉 떠올려봐", scores: [{ axis: "JP", value: 1 }, { axis: "SN", value: -1 }] },
      { text: "일어나봐야 알아, 그냥 흘러가는 대로", scores: [{ axis: "JP", value: -3 }] },
      { text: "이웃한테 연락해서 같이 뭔가 하자고 해", scores: [{ axis: "JP", value: -1.5 }, { axis: "EI", value: 2 }] },
    ],
  },
];

// ── 유형 매핑 로직 ────────────────────────────────────────
function getResidentType(axisScores: Record<Axis, number>): ResidentType {
  const ei = axisScores["EI"] >= 0 ? "E" : "I";
  const sn = axisScores["SN"] >= 0 ? "S" : "N";
  const tf = axisScores["TF"] >= 0 ? "T" : "F";
  const jp = axisScores["JP"] >= 0 ? "J" : "P";

  let best = RESIDENT_TYPES[0];
  let bestScore = -Infinity;

  for (const type of RESIDENT_TYPES) {
    let score = 0;
    const { match } = type;

    if (match.EI) score += match.EI === ei ? Math.abs(axisScores["EI"]) : -Math.abs(axisScores["EI"]);
    if (match.SN) score += match.SN === sn ? Math.abs(axisScores["SN"]) : -Math.abs(axisScores["SN"]);
    if (match.TF) score += match.TF === tf ? Math.abs(axisScores["TF"]) * 0.8 : -Math.abs(axisScores["TF"]) * 0.8;
    if (match.JP) score += match.JP === jp ? Math.abs(axisScores["JP"]) * 0.8 : -Math.abs(axisScores["JP"]) * 0.8;

    if (score > bestScore) { bestScore = score; best = type; }
  }

  return best;
}

// ── 상수 ─────────────────────────────────────────────────
const BOTTLE_COLORS = ["#9b6dff", "#00c4e8", "#ff6b35", "#2ecc71", "#ff2d5e", "#4169e1", "#ff3ab8", "#ffd700", "#a8e063", "#ff8c42", "#7b68ee", "#20b2aa"];
const BREW_INTERVALS = [60, 60, 70, 80, 95, 115, 140, 175, 220, 280, 360, 460, 590];
const INIT_AXIS = (): Record<Axis, number> => ({ EI: 0, SN: 0, TF: 0, JP: 0 });
const MONSTER_NAMES = RESIDENT_TYPES.map(t => t.monster);

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
        fill={filled ? "#000000" : "#000000"}
        stroke={filled ? color : "#7c3aed"}
        strokeWidth="1.3"
        opacity="0.9"
      />
      {filled && (
        <>
          <path
            d="M10,54 Q20,51 30,54 Q40,57 50,54 L52,52 Q52,73 30,75 Q8,73 8,52 Z"
            fill={color} opacity="0.6" clipPath={`url(#${id})`}
          />
          <circle cx="18" cy="60" r="2.5" fill={color} opacity="0.35" />
          <circle cx="38" cy="65" r="1.8" fill={color} opacity="0.25" />
        </>
      )}
    </svg>
  );
}

// ── 메인 ─────────────────────────────────────────────────
type Screen = "main" | "question" | "brew";

export default function TestPage() {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<Screen>("main");
  const [axisScores, setAxisScores] = useState<Record<Axis, number>>(INIT_AXIS());
  const [filled, setFilled] = useState<boolean[]>(() => Array(QUESTIONS.length).fill(false));
  const [activeQ, setActiveQ] = useState(-1);
  const [pickedChoice, setPickedChoice] = useState(-1);
  const [slotRunning, setSlotRunning] = useState(false);
  const [slotName, setSlotName] = useState("");
  const [resultReady, setResultReady] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const result = useMemo(() => getResidentType(axisScores), [axisScores]);
  const allFilled = filled.every(Boolean);
  const filledCount = filled.filter(Boolean).length;

  const openQuestion = (idx: number) => {
    if (filled[idx]) return;
    setActiveQ(idx); setPickedChoice(-1); setScreen("question");
  };

  const pickChoice = (ci: number) => {
    if (pickedChoice !== -1) return;
    setPickedChoice(ci);
    const chosen = QUESTIONS[activeQ].choices[ci];
    setAxisScores(prev => {
      const next = { ...prev };
      for (const s of chosen.scores) next[s.axis] = (next[s.axis] || 0) + s.value;
      return next;
    });
    setTimeout(() => {
      setFilled(prev => { const n = [...prev]; n[activeQ] = true; return n; });
      setScreen("main");
    }, 320);
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
    setAxisScores(INIT_AXIS()); setFilled(Array(QUESTIONS.length).fill(false));
    setActiveQ(-1); setPickedChoice(-1); setSlotRunning(false);
    setSlotName(""); setResultReady(false); setName(""); setPhone("");
    setScreen("main");
  };

  const handleSubmit = async () => {
    try {
      await fetch("https://script.google.com/macros/s/AKfycbyqK588IwhjxgJofSBWBVhVkznP0rlK8XjW4VYQVsXbBnsIXOaOE5IiXIaDg0IJLGFQ-w/exec", {
        method: "POST",
        body: JSON.stringify({
          name,
          phone,
          result: result.monster,
        }),
      });

      alert("응모 완료!");
    } catch (err) {
      console.error(err);
      alert("전송 실패 😢");
    }
  };

  const compatibleNames = result.compatibleWith.map(id => RESIDENT_TYPES.find(r => r.id === id)?.monster ?? "");
  const incompatibleNames = result.incompatibleWith.map(id => RESIDENT_TYPES.find(r => r.id === id)?.monster ?? "");

  return (
    <div className={`min-h-screen bg-"rgba(255,255,255)" relative flex flex-col items-center transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
      {/* ── 메인 ── */}
      {screen === "main" && (
        <div className="relative flex flex-col items-center w-full">
          <NavBar variant="back" backHref="/" backLabel="MAIN" />

          <h1 className="font-jua text-4xl text-violet-100 text-center mt-16" style={{ marginTop: "90px" }}>
            입주민 유형 테스트</h1>
          <p className="font-noto font-light text-sm text-violet-200 tracking-widest mb-10">
            당신은 어떤 입주민인가요?</p>

          <div className="grid grid-cols-4 gap-y-9 max-w-xs w-full" style={{ marginTop: "30px" }}>
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => openQuestion(i)}
                disabled={filled[i]}
                className="flex flex-col items-center gap-1 active:opacity-60 transition-opacity"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <BottleSVG filled={filled[i]} color={BOTTLE_COLORS[i % BOTTLE_COLORS.length]} />
                {filled[i]
                  ? <span className="font-noto text-[10px] text-violet-300">완료</span>
                  : <span className="font-jua text-sm text-violet-600">{i + 1}</span>
                }
              </button>
            ))}
          </div>

          {/* 진행바 */}
          <div className="w-full max-w-xs mb-1" style={{ marginTop: "30px" }}>
            <div className="h-0.5 bg-violet-200 rounded-full">
              <div className="h-0.5 bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${(filledCount / QUESTIONS.length) * 100}%` }} />
            </div>
            <p className="font-noto text-[10px] text-violet-300 tracking-widest text-right mt-1">{filledCount} / {QUESTIONS.length}</p>
          </div>

          {allFilled && (
            <button onClick={startBrew} className="font-jua text-lg bg-violet-600 text-white px-10 py-3 rounded-2xl mt-6 hover:bg-violet-700 active:scale-95 transition-all">
              물약 제조하기
            </button>
          )}
        </div>
      )}

      {/* ── 질문 ── */}
      {screen === "question" && activeQ !== -1 && (
        <div className="relative z-10 flex flex-col items-center px-6 pt-10 pb-12 max-w-lg w-full"
            style={{ padding: "50px" }}>
          <button onClick={() => setScreen("main")} className="self-start font-noto text-[11px] text-violet-300 tracking-wide mb-8">← 돌아가기</button>
          <p className="font-noto text-[10px] text-violet-400 tracking-widest mt-5 mb-3" style={{ marginTop: "30px" }}>
            질문 {activeQ + 1} / {QUESTIONS.length}</p>
          <p className="font-jua text-2xl text-violet-200 text-center leading-relaxed" 
          style={{ marginTop: "10px" }}>
            {QUESTIONS[activeQ].text}</p>
          <div className="flex flex-col gap-2 w-full" style={{ marginTop: "20px" }}>
          {QUESTIONS[activeQ].choices.map((c, ci) => (
            <button
              key={ci}
              onClick={() => pickChoice(ci)}
              className="font-noto font-light text-sm text-center transition-all leading-relaxed"
              style={{
                backgroundColor: pickedChoice === ci ? "#3b1f6e" : "#1a0a3a",
                border: pickedChoice === ci ? "3px solid #a78bfa" : "3px solid #4c1d95",
                color: pickedChoice === ci ? "#ede9fe" : "#d6c9ff",
                padding: "10px 20px",
                borderRadius: "30px",
                width: "100%",
                marginBottom: "8px",
              }}
            >
              {c.text}
            </button>
          ))}
          </div>
        </div>
      )}

      {/* ── 제조 / 결과 ── */}
      {screen === "brew" && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 pb-12">
          {!resultReady ? (
            <div className="flex flex-col items-center gap-4">
              <p className="font-noto text-xs text-violet-400 tracking-widest animate-pulse">
                {slotRunning ? "유형을 감별하는 중..." : ""}
              </p>
              <p className={`font-jua text-5xl text-violet-300 text-center ${slotRunning ? "animate-pulse" : ""}`}>
                {slotName}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center w-full max-w-sm">

              {/* 결과 카드 */}
              <div style={{
                background: "#1a0a3a",
                border: "1.5px solid #4c1d95",
                borderRadius: "28px",
                padding: "28px 30px",
                marginTop: "20px",
                marginBottom: "20px",
                width: "100%",
              }}>
                {/* 서브타이틀 */}
                <p style={{ color: "#a78bfa", fontSize: "11px", letterSpacing: "0.15em", marginBottom: "6px" }}
                  className="font-noto">
                  나는 어떤 몬스터일까?
                </p>

                {/* 몬스터 이름 */}
                <h2 className="font-jua" style={{ fontSize: "40px", color: "#ede9fe", marginBottom: "4px" }}>
                  {result.monster}
                </h2>

                {/* 이미지 */}
                <div style={{ width: "300px", height: "300px", }}>
                  {result.image
                    ? <img src={result.image} alt={result.monster} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px" }}>🌙</div>
                  }
                </div>

                {/* 구분선 */}
                <div style={{ borderTop: "1px solid #3b1f6e", margin: "16px 0" }} />

                {/* 설명 텍스트 */}
                <div className="font-noto text-left" style={{ color: "#c4b5fd", fontSize: "16px", lineHeight: "1.8" }}>
                  <p>· {result.desc}</p>
                  <br />
                  <p>· {result.strength}</p>
                  <br />
                  <p>· {result.weakness}</p>
                  <br />
                  <p>· {result.tip}</p>
                </div>
              </div>

              {/* 응모 폼 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginBottom: "16px" }}>
                <input
                  className="font-noto font-light text-sm outline-none"
                  placeholder="이름"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    background: "#1a0a3a",
                    border: "1.5px solid #4c1d95",
                    borderRadius: "14px",
                    padding: "14px 18px",
                    color: "#ede9fe",
                    fontSize: "14px",
                    width: "100%",
                  }}
                />
                <input
                  className="font-noto font-light text-sm outline-none"
                  placeholder="전화번호"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{
                    background: "#1a0a3a",
                    border: "1.5px solid #4c1d95",
                    borderRadius: "14px",
                    padding: "14px 18px",
                    color: "#ede9fe",
                    fontSize: "14px",
                    width: "100%",
                  }}
                />
                <button
                  onClick={handleSubmit}
                  className="font-jua"
                  style={{
                    background: "#7c3aed",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "16px",
                    padding: "16px",
                    fontSize: "18px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  응모하기
                </button>
              </div>

              <button
                onClick={restartAll}
                className="font-noto font-light"
                style={{ color: "#6d28d9", fontSize: "12px", textDecoration: "underline" }}
              >
                처음부터 다시하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}