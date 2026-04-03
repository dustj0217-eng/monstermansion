"use client";

import { useState, useEffect, useRef, useMemo } from "react";

// ── 타입 정의 ─────────────────────────────────────────────
type Axis = "EI" | "SN" | "TF" | "JP";
interface ScoreEntry { axis: Axis; value: number; }

interface ResidentType {
  id: number;
  monster: string;
  image: string;
  title: string;
  tagline: string;
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
    title: "밤의 집주인",
    tagline: "초대받지 않으면 들어올 수 없어.",
    desc: "낮엔 커튼 치고 혼자 있다가, 밤이 되면 누구보다 날카롭게 돌아가는 사람이야. 루틴이 무너지면 눈빛부터 달라지고, 공간에 대한 애착이 남달라. 먼저 다가오는 타입은 아닌데, 한 번 신뢰를 얻으면 그 사람 평생 기억해.",
    strength: "한번 꽂히면 깊이가 남달라. 신뢰한 사람에겐 조용하지만 완벽하게 챙겨.",
    weakness: "문턱이 너무 높아서 사람들이 지레 포기하고 떠나. 사실 너도 그게 좀 서운하잖아.",
    tip: "먼저 문 한 번만 열어봐. 상대도 초대 기다리고 있을 수 있어.",
    match: { EI: "I", SN: "N", TF: "F" },
    compatibleWith: [5, 6],
    incompatibleWith: [3, 7],
  },
  {
    id: 2,
    monster: "마녀",
    image: "/images/characters/마녀.png",
    title: "3층의 연금술사",
    tagline: "다 내 계획대로 되고 있어.",
    desc: "항상 뭔가를 만들고 있어 — 요리든, 프로젝트든, 사람 사이의 판이든. 주변을 자기 페이스로 자연스럽게 끌어당기는 힘이 있고, 규칙엔 관심 없지만 자기만의 원칙은 확실해. 겉으론 쿨해 보이는데 사실 누구보다 섬세하게 신경 쓰고 있어.",
    strength: "기획력과 실행력이 동시에 돼. 분위기 읽는 눈도 있어서 사람들이 자기도 모르게 따라가.",
    weakness: "내 방식이 최고라는 확신이 가끔 관계를 삐걱거리게 해. 맞는 말이어도 타이밍이 중요해.",
    tip: "가끔은 레시피 없이 요리해봐. 의외로 더 잘 풀릴 수도 있어.",
    match: { EI: "E", SN: "N", JP: "J" },
    compatibleWith: [4, 8],
    incompatibleWith: [3, 7],
  },
  {
    id: 3,
    monster: "늑대인간",
    image: "/images/characters/늑대인간.png",
    title: "보름달의 입주민",
    tagline: "억누를수록 더 강하게 터져.",
    desc: "평소엔 제일 무난해 보이는데 어느 순간 완전히 다른 사람이 나타나. 흐름 타는 걸 잘하고, 새로운 것 앞에선 누구보다 먼저 달려가. 루틴이나 규칙으로 가두려 하면 제일 먼저 질식해.",
    strength: "에너지 자체가 달라. 분위기 침체됐을 때 이 사람 한 명이면 충분히 뒤집혀.",
    weakness: "폭발 이후 수습을 잘 못해. 충동적으로 저지른 것들이 나중에 발목 잡을 때가 있어.",
    tip: "에너지 쓸 방향만 정해두면 진짜 무서운 사람 돼. 방향 없는 전력질주는 그냥 소진이야.",
    match: { EI: "E", SN: "S", JP: "P" },
    compatibleWith: [7, 8],
    incompatibleWith: [1, 2],
  },
  {
    id: 4,
    monster: "프랑켄슈타인",
    image: "/images/characters/프랑켄슈타인.png",
    title: "새벽의 제작자",
    tagline: "완성되기 전까진 아무한테도 안 보여줘.",
    desc: "혼자 뭔가를 끊임없이 조립하고 만들고 있어. 공간에 대한 애착이 강하고 루틴이 확실한 편인데, 감정을 말로 꺼내는 데 시간이 좀 걸려. 근데 일단 나오면 그게 진심이야. 신뢰 쌓는 데 오래 걸리고, 그만큼 오래가.",
    strength: "한 번 시작한 건 끝을 봐. 디테일에 강하고 결과물로 증명하는 타입.",
    weakness: "완벽주의가 발목을 잡아. 보여주기 전에 혼자 지쳐버리는 경우가 너무 많아.",
    tip: "미완성인 채로 꺼내도 괜찮아. 같이 만드는 것도 나쁘지 않아.",
    match: { EI: "I", SN: "S", JP: "J" },
    compatibleWith: [2, 6],
    incompatibleWith: [3, 8],
  },
  {
    id: 5,
    monster: "유령",
    image: "/images/characters/유령.png",
    title: "아무도 모르는 관찰자",
    tagline: "다 보고 있었어. 처음부터.",
    desc: "존재감은 옅은데 정보력은 맨션에서 제일 강해. 여기서 일어나는 일을 다 알고 있지만 먼저 말하지 않아. 필요한 순간에 딱 나타나서 정확한 한마디 던지고 사라지는 타입. 없어지고 나서야 얼마나 중요했는지 알아.",
    strength: "말 한마디의 무게가 달라. 자주 말 안 하는 만큼, 할 때는 정확해.",
    weakness: "존재감이 너무 없어서 관계에서 자꾸 후순위가 돼. 억울한 거 알아, 근데 네가 더 드러내야 해.",
    tip: "알고 있다는 거 가끔은 티 내도 돼. 침묵이 항상 미덕은 아니야.",
    match: { EI: "I", SN: "N", JP: "J" },
    compatibleWith: [1, 4],
    incompatibleWith: [3, 7],
  },
  {
    id: 6,
    monster: "좀비",
    image: "/images/characters/좀비.png",
    title: "루틴의 수호자",
    tagline: "일정 바꾸지 마. 진심으로.",
    desc: "매일 같은 시간에 일어나고, 같은 동선으로 움직여. 효율 최고, 에너지 낭비 없음. 감정보다 논리, 관계보다 목표. 피곤할 때 건드리면 진짜 좀비가 돼.",
    strength: "꾸준함이 무기야. 남들이 작심삼일 할 때 혼자 3개월째 유지하고 있어.",
    weakness: "변수에 약해. 계획이 틀어지면 필요 이상으로 흔들리고, 그게 주변까지 긴장시켜.",
    tip: "플랜 B를 미리 짜두는 것도 루틴으로 만들어봐. 대비가 되면 변수가 덜 무서워.",
    match: { EI: "I", SN: "S", JP: "P" },
    compatibleWith: [4, 5],
    incompatibleWith: [3, 7],
  },
  {
    id: 7,
    monster: "인어",
    image: "/images/characters/인어.png",
    title: "열린 문의 이웃",
    tagline: "여기 앉아. 내가 다 들어줄게.",
    desc: "사람이 오는 걸 좋아하고, 집에 부르는 걸 더 좋아해. 감정 온도 읽는 게 기가 막히고, 갈등 생기면 제일 먼저 중간에 서. 에너지를 사람한테서 얻는 타입이라, 혼자 있는 시간이 길어지면 눈에 띄게 시들어.",
    strength: "사람 사이 온도를 올리는 능력. 이 사람 한 명이 공간 전체 분위기를 바꿔.",
    weakness: "남 챙기다가 정작 자기 감정은 쌓아두는 타입. 나중에 한꺼번에 터질 수 있어.",
    tip: "들어주는 것만큼 네 얘기도 해. 관계는 일방통행이 아니야.",
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
    text: "맨션을 고를 때 가장 중요하게 보는 환경은?",
    choices: [
      { text: "카페, 식당, 편의시설이 가까운 번화가", scores: [{ axis: "EI", value: 1.5 }, { axis: "SN", value: 1 }] },
      { text: "조용하고 한적한, 사람이 많지 않은 곳", scores: [{ axis: "EI", value: -2 }, { axis: "SN", value: -1 }] },
      { text: "학교나 직장까지 가깝고 이동이 편한 곳", scores: [{ axis: "JP", value: 1.5 }, { axis: "SN", value: 1 }] },
      { text: "가족과 함께 있을 수 있는 곳", scores: [{ axis: "TF", value: -1.5 }, { axis: "EI", value: -0.5 }] },
    ],
  },
  {
    text: "집에서 주로 가는 곳까지 어느 정도 거리면 괜찮아요?",
    choices: [
      { text: "걸어서 갈 수 있으면 좋겠어", scores: [{ axis: "JP", value: 1 }, { axis: "SN", value: 1 }] },
      { text: "30분 이내면 충분해", scores: [{ axis: "JP", value: 0.5 }, { axis: "EI", value: 0.5 }] },
      { text: "1시간 정도는 감수할 수 있어", scores: [{ axis: "JP", value: -1 }, { axis: "TF", value: 1 }] },
      { text: "거리보다 환경이 더 중요해", scores: [{ axis: "SN", value: -1.5 }, { axis: "TF", value: -1 }] },
    ],
  },
  {
    text: "입주민이 어떤 분야에서 활동하는지 궁금하네요. 지금 하는 일이나 공부, 본인이랑 얼마나 맞는 것 같아요?",
    choices: [
      { text: "딱 내 길 같아, 잘 맞아", scores: [{ axis: "TF", value: 1.5 }, { axis: "JP", value: 1 }] },
      { text: "관련은 있는데 조금씩 다른 방향으로 가고 있어", scores: [{ axis: "SN", value: -1 }, { axis: "JP", value: -0.5 }] },
      { text: "하고 싶은 걸 찾아가는 중이야", scores: [{ axis: "SN", value: -2 }, { axis: "JP", value: -1.5 }] },
      { text: "지금 하는 것과 원래 원했던 것이 좀 달라", scores: [{ axis: "TF", value: -1 }, { axis: "SN", value: -1.5 }] },
    ],
  },
  {
    text: "집주인 입장에서 여쭤볼게요. 하루 중 집에 있는 시간이 어느 정도예요?",
    choices: [
      { text: "거의 집에 있어, 집이 베이스야", scores: [{ axis: "EI", value: -2 }, { axis: "JP", value: 1 }] },
      { text: "낮엔 나가고 저녁엔 들어오는 편", scores: [{ axis: "EI", value: 0.5 }, { axis: "SN", value: 1 }] },
      { text: "집엔 자러만 와, 거의 밖에 있어", scores: [{ axis: "EI", value: 2.5 }, { axis: "JP", value: -1 }] },
      { text: "날마다 달라, 딱 정해진 패턴이 없어", scores: [{ axis: "JP", value: -2 }, { axis: "SN", value: -1 }] },
    ],
  },
  {
    text: "가까운 시일 내에 집을 오래 비워야 할 상황이 생길 것 같아요?",
    choices: [
      { text: "여행이나 해외 일정이 있어서 비울 수도 있어", scores: [{ axis: "SN", value: -1.5 }, { axis: "EI", value: 1 }] },
      { text: "시험이나 프로젝트로 바빠지긴 해도 집은 지킬 것 같아", scores: [{ axis: "JP", value: 1.5 }, { axis: "TF", value: 1 }] },
      { text: "군대나 복무 관련 일정이 있어", scores: [{ axis: "JP", value: 0.5 }, { axis: "TF", value: 0.5 }] },
      { text: "딱히 없어, 당분간은 여기 머물 것 같아", scores: [{ axis: "SN", value: 1 }, { axis: "JP", value: 0.5 }] },
    ],
  },
  {
    text: "친구들이 집에 오는 편이에요?",
    choices: [
      { text: "자주 불러, 집에서 노는 걸 좋아해", scores: [{ axis: "EI", value: 2 }, { axis: "TF", value: -1.5 }] },
      { text: "가끔은 오지만 주로 밖에서 만나", scores: [{ axis: "EI", value: 1 }, { axis: "SN", value: 0.5 }] },
      { text: "거의 안 불러, 집은 혼자만의 공간이야", scores: [{ axis: "EI", value: -2.5 }, { axis: "JP", value: 1 }] },
      { text: "오고 싶다면 오는데, 내가 먼저 부르진 않아", scores: [{ axis: "EI", value: -1 }, { axis: "TF", value: 0.5 }] },
    ],
  },
  {
    text: "집에 있을 때 가장 불편한 상황은?",
    choices: [
      { text: "소음이나 냄새 등 환경적인 문제", scores: [{ axis: "SN", value: 1.5 }, { axis: "TF", value: 1 }] },
      { text: "공간을 공유하거나 타인과 부딪힐 때", scores: [{ axis: "EI", value: -1.5 }, { axis: "TF", value: -1 }] },
      { text: "혼자 있는 시간이 너무 길어질 때", scores: [{ axis: "EI", value: 1.5 }, { axis: "TF", value: -1.5 }] },
      { text: "계획이 틀어지거나 예상 못 한 일이 생길 때", scores: [{ axis: "JP", value: 2 }, { axis: "TF", value: 1 }] },
    ],
  },
  {
    text: "집에서 쉴 때 주로 뭘 하면서 시간을 보내요?",
    choices: [
      { text: "유튜브, 넷플릭스 등 콘텐츠 보기", scores: [{ axis: "EI", value: -0.5 }, { axis: "SN", value: -0.5 }] },
      { text: "게임, 독서, 그림 등 혼자 즐기는 취미", scores: [{ axis: "EI", value: -1.5 }, { axis: "SN", value: -1 }] },
      { text: "운동이나 산책 등 몸 쓰는 것", scores: [{ axis: "SN", value: 1 }, { axis: "TF", value: 1 }] },
      { text: "친구 만나거나 연락하면서 보내", scores: [{ axis: "EI", value: 2 }, { axis: "TF", value: -1 }] },
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
const STAR_COLORS = ["#989898", "#585858", "#ffffff", "#e79f9f", "#d4b455", "#9b6dff"];
const MONSTER_NAMES = RESIDENT_TYPES.map(t => t.monster);

// ── 포션병 SVG ────────────────────────────────────────────
function BottleSVG({ filled, color }: { filled: boolean; color: string }) {
  const id = `clip${color.replace(/[^a-z0-9]/gi, "")}${Math.random().toString(36).slice(2, 5)}`;
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
      <rect x="24" y="24" width="12" height="18" rx="2" fill={filled ? color : "#403a54"} opacity={filled ? 0.55 : 1} />
      <rect x="25" y="24" width="4" height="18" rx="1" fill="white" opacity="0.04" />
      <path
        d="M10,40 Q8,44 8,52 Q8,73 30,75 Q52,73 52,52 Q52,44 50,40 Z"
        fill="#0c0818" stroke={filled ? color : "#675a90"} strokeWidth="1.3"
        opacity={filled ? 0.95 : 0.85}
      />
      {filled && (
        <>
          <path
            d="M10,54 Q20,51 30,54 Q40,57 50,54 L52,52 Q52,73 30,75 Q8,73 8,52 Z"
            fill={color} opacity="0.78" clipPath={`url(#${id})`}
          />
          <circle cx="18" cy="60" r="2.5" fill={color} opacity="0.4" />
          <circle cx="38" cy="65" r="1.8" fill={color} opacity="0.3" />
        </>
      )}
    </svg>
  );
}

// ── 별 캔버스 ─────────────────────────────────────────────
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({ length: 28 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      on: Math.random() > 0.4,
      onMs: 200 + Math.random() * 3000, offMs: 80 + Math.random() * 4500,
      timer: Math.random() * 1800,
    }));
    let last = performance.now(); let raf: number;
    const tick = (now: number) => {
      const dt = now - last; last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.timer -= dt;
        if (s.timer <= 0) { s.on = !s.on; s.timer = s.on ? s.onMs : s.offMs; }
        if (s.on) { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = s.color; ctx.fill(); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
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

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) { alert("이름과 전화번호를 입력해주세요."); return; }
    alert(`[${result.monster} — ${result.title}] ${name}님 응모 완료!`);
  };

  // 잘 맞는/안 맞는 유형 이름 찾기
  const compatibleNames = result.compatibleWith.map(id => RESIDENT_TYPES.find(r => r.id === id)?.monster ?? "");
  const incompatibleNames = result.incompatibleWith.map(id => RESIDENT_TYPES.find(r => r.id === id)?.monster ?? "");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Noto+Sans+KR:wght@300;400;500&display=swap');

        :root {
          --bg:       #07050e;
          --fg:       #e2d9f3;
          --purple:   #c4b5fd;
          --purple-m: #8b51ff;
          --purple-d: #6d28d9;
          --muted:    #7454ba;
          --dim:      #5b4d7a;
          --surface:  #0d0919;
          --border:   #3d2c6d;
          --f-sans:   'Noto Sans KR', sans-serif;
          --f-hand:   'Gaegu', cursive;
        }

        @keyframes fadeIn  { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes popIn   { from { opacity:0; transform:scale(0.88) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes blink   { 0%,49%{opacity:1} 50%,100%{opacity:0.2} }
        @keyframes shimmer { 0%{opacity:0.4} 50%{opacity:1} 100%{opacity:0.4} }
        @keyframes slideUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { background: var(--bg); }

        .root {
          background: var(--bg); min-height: 100vh; color: var(--fg);
          position: relative; display: flex; flex-direction: column; align-items: center;
          opacity: 0; transition: opacity 0.9s ease;
        }
        .root.visible { opacity: 1; }
        .screen { display:flex; flex-direction:column; align-items:center; width:100%; position:relative; z-index:1; }

        .btn-reset { background:none; border:none; cursor:pointer; font-family:var(--f-sans); }
        .btn-primary {
          font-family: var(--f-hand); font-weight: 700;
          background: var(--purple-d); color: #f0ebff;
          border: none; border-radius: 12px; cursor: pointer;
          letter-spacing: 0.04em;
          transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
        }
        .btn-primary:hover  { transform:scale(1.03); box-shadow: 0 0 20px rgba(109,40,217,0.5); }
        .btn-primary:active { transform:scale(0.97); opacity:0.85; }

        /* ── 메인 ── */
        .main-wrap { padding: 3.5rem 1.5rem 3rem; }
        .main-title {
          font-family:var(--f-hand); font-size:38px; font-weight:700;
          color:var(--purple); text-align:center; margin-bottom:0.4rem;
        }
        .main-subtitle {
          font-family:var(--f-sans); font-size:13px; font-weight:300;
          color:#7a60c0; text-align:center; letter-spacing:0.2em; margin-bottom:2.8rem;
        }

        .bottles-grid {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:36px 8px; max-width:380px; width:100%;
        }
        @media(max-width:340px){ .bottles-grid{ grid-template-columns:repeat(2,1fr); } }

        .bottle-slot {
          display:flex; flex-direction:column; align-items:center; gap:4px;
          cursor:pointer; animation:popIn 0.45s ease both;
          transition: opacity 0.2s;
        }
        .bottle-slot.filled { cursor:default; }
        .bottle-slot:not(.filled):active { opacity:0.65; }

        .bottle-num {
          font-family:var(--f-hand); font-size:15px;
          color:var(--purple-m); min-height:22px;
        }
        .bottle-done {
          font-family:var(--f-sans); font-size:10px; font-weight:300;
          color:#4a3d6b; letter-spacing:0.1em; min-height:22px;
        }

        .progress-bar-wrap { width:100%; max-width:320px; margin:1.6rem auto 0; }
        .progress-bar-bg { background:#1a1030; border-radius:4px; height:3px; }
        .progress-bar-fill {
          height:3px; border-radius:4px; background:var(--purple-m);
          transition:width 0.5s ease;
        }
        .progress-text {
          font-family:var(--f-sans); font-size:10px; font-weight:300;
          color:#4a3d6b; letter-spacing:0.15em; text-align:right; margin-top:6px;
        }

        .brew-btn {
          font-size:18px; padding:0.65rem 2.6rem; border-radius:14px;
          letter-spacing:0.05em; margin-top:2rem;
          opacity:0; pointer-events:none;
          transition:opacity 0.7s ease, transform 0.15s;
        }
        .brew-btn.show { opacity:1; pointer-events:all; }

        /* ── 질문 ── */
        .question-wrap {
          padding:2.5rem 1.4rem 3rem; max-width:480px; width:100%;
          animation:fadeIn 0.35s ease;
        }
        .q-back {
          font-size:11px; color:#3a2d52; letter-spacing:0.06em;
          margin-bottom:1.8rem; display:block; font-weight:300;
        }
        .q-back:hover { color:#7a6b96; }
        .q-num {
          font-family:var(--f-sans); font-size:10px; font-weight:300;
          color:var(--dim); letter-spacing:0.22em; margin:1.4rem 0 0.8rem; text-align:center;
        }
        .q-text {
          font-family:var(--f-hand); font-size:22px;
          color:#ddd5f5; line-height:1.8; text-align:center; margin-bottom:2rem;
        }
        .choices { display:flex; flex-direction:column; gap:8px; }
        .choice {
          font-family:var(--f-sans); font-size:14px; font-weight:300;
          background:var(--surface); border:1px solid var(--border); border-radius:10px;
          padding:0.85rem 1.1rem; color:#8a70c4; cursor:pointer;
          text-align:left; line-height:1.7; width:100%;
          transition:border-color 0.15s, color 0.15s, background 0.15s;
        }
        .choice:hover, .choice.picked {
          border-color:#7c3aed; color:var(--purple); background:#0f0b1e;
        }

        /* ── 제조/결과 ── */
        .brew-wrap {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; min-height:100vh; width:100%;
        }
        .brew-label {
          font-family:var(--f-sans); font-size:11px; font-weight:300;
          color:#4a3d6b; letter-spacing:0.18em; margin-bottom:1.2rem; min-height:1em;
          animation:shimmer 1.2s ease infinite;
        }
        .slot-name {
          font-family:var(--f-hand); font-size:52px; font-weight:700;
          color:var(--purple); min-height:64px; text-align:center;
        }
        .slot-name.running { animation:blink 0.16s steps(1) infinite; }

        /* ── 결과 카드 ── */
        .result-wrap {
          display:flex; flex-direction:column; align-items:center; text-align:center;
          animation:fadeIn 0.65s ease; max-width:400px; width:100%; padding:0 1.4rem 4rem;
        }

        /* 이미지 */
        .result-image-wrap {
          width:300px; height:300px;
          overflow:hidden; margin-bottom:1.4rem;
          background:transparent;
          animation:slideUp 0.5s ease 0.1s both;
        }
        .result-image-wrap img {
          width:100%; height:100%; object-fit:cover;
        }
        .result-image-placeholder {
          width:100%; height:100%; display:flex; align-items:center; justify-content:center;
          font-size:52px;
        }

        .result-monster {
          font-family:var(--f-hand); font-size:48px; font-weight:700; color:var(--purple);
          margin-bottom:0.15rem;
          animation:slideUp 0.5s ease 0.15s both;
        }
        .result-title {
          font-family:var(--f-sans); font-size:11px; font-weight:300;
          color:#5a4880; letter-spacing:0.2em; margin-bottom:0.6rem;
          animation:slideUp 0.5s ease 0.2s both;
        }
        .result-divider { width:24px; height:1px; background:#573c99; margin:0.4rem auto 0.8rem; }
        .result-tagline {
          font-family:var(--f-sans); font-size:16px; font-weight:400;
          color:#8c5fee; margin-bottom:1.4rem;
          animation:slideUp 0.5s ease 0.25s both;
        }

        /* 분석 카드들 */
        .result-cards {
          display:flex; flex-direction:column; gap:10px;
          width:100%; margin-bottom:1.6rem;
          animation:slideUp 0.5s ease 0.3s both;
        }
        .result-card {
          background:#0d0919; border:1px solid #2a1f4a; border-radius:12px;
          padding:1rem 1.2rem; text-align:left;
        }
        .result-card-label {
          font-family:var(--f-sans); font-size:9px; font-weight:500;
          color:#4a3a72; letter-spacing:0.25em; margin-bottom:0.5rem;
          text-transform:uppercase;
        }
        .result-card-text {
          font-family:var(--f-sans); font-size:13px; font-weight:300;
          color:var(--muted); line-height:1.9;
        }
        .result-card.desc  { border-color:#2d1f55; }
        .result-card.strength .result-card-label { color:#3d6b3d; }
        .result-card.strength { border-color:#1a3d1a; }
        .result-card.strength .result-card-text { color:#6aab6a; }
        .result-card.weakness .result-card-label { color:#6b3d3d; }
        .result-card.weakness { border-color:#3d1a1a; }
        .result-card.weakness .result-card-text { color:#ab6a6a; }
        .result-card.tip .result-card-label { color:#4a6b6b; }
        .result-card.tip { border-color:#1a3d3d; }
        .result-card.tip .result-card-text { color:#6aabab; }

        /* 궁합 */
        .compat-wrap {
          width:100%; display:flex; gap:10px; margin-bottom:1.8rem;
          animation:slideUp 0.5s ease 0.35s both;
        }
        .compat-box {
          flex:1; background:#0d0919; border-radius:12px; padding:0.9rem 1rem;
          text-align:center;
        }
        .compat-box.good  { border:1px solid #1a3d1a; }
        .compat-box.bad   { border:1px solid #3d1a1a; }
        .compat-box-label {
          font-family:var(--f-sans); font-size:9px; font-weight:500;
          letter-spacing:0.2em; margin-bottom:0.5rem; text-transform:uppercase;
        }
        .compat-box.good .compat-box-label { color:#3d6b3d; }
        .compat-box.bad  .compat-box-label { color:#6b3d3d; }
        .compat-names {
          font-family:var(--f-hand); font-size:15px; font-weight:700;
          line-height:1.7;
        }
        .compat-box.good .compat-names { color:#6aab6a; }
        .compat-box.bad  .compat-names { color:#ab6a6a; }

        /* 축 */
        .axis-row {
          display:flex; gap:8px; margin-bottom:1.8rem; flex-wrap:wrap; justify-content:center;
          animation:slideUp 0.5s ease 0.4s both;
        }
        .axis-chip {
          font-family:var(--f-sans); font-size:11px; font-weight:500;
          background:#1a1030; border:1px solid #3d2c6d; border-radius:20px;
          padding:3px 10px; color:#7c5fee; letter-spacing:0.08em;
        }

        /* 폼 */
        .result-form {
          display:flex; flex-direction:column; gap:8px; width:100%; margin-bottom:0.8rem;
          animation:slideUp 0.5s ease 0.45s both;
        }
        .result-input {
          font-family:var(--f-sans); font-size:13px; font-weight:300;
          background:var(--surface); border:1px solid #5939b0; border-radius:8px;
          padding:0.75rem 1rem; color:var(--fg); outline:none;
          transition:border-color 0.15s; width:100%;
        }
        .result-input::placeholder { color:#7c5fc2; }
        .result-input:focus { border-color:#7c3aed; }

        .submit-btn  { font-size:22px; padding:0.75rem; width:100%; border-radius:12px; }
        .restart-btn {
          font-size:11px; color:#2e2245; text-decoration:underline;
          letter-spacing:0.05em; margin-top:0.6rem; font-weight:300;
        }
        .restart-btn:hover { color:#6b5d8a; }
      `}</style>

      <div className={`root ${mounted ? "visible" : ""}`}>
        <StarCanvas />

        {/* ── 메인 ── */}
        {screen === "main" && (
          <div className="screen main-wrap">
            <h3 className="main-title">입주민 유형 테스트</h3>
            <p className="main-subtitle">당신은 어떤 입주민인가요?</p>
            <div className="bottles-grid">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`bottle-slot ${filled[i] ? "filled" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => openQuestion(i)}
                >
                  <BottleSVG filled={filled[i]} color={BOTTLE_COLORS[i % BOTTLE_COLORS.length]} />
                  {filled[i]
                    ? <span className="bottle-done">완료</span>
                    : <span className="bottle-num">{i + 1}</span>
                  }
                </div>
              ))}
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${(filled.filter(Boolean).length / QUESTIONS.length) * 100}%` }} />
              </div>
              <p className="progress-text">{filled.filter(Boolean).length} / {QUESTIONS.length}</p>
            </div>
            <button className={`btn-primary brew-btn ${allFilled ? "show" : ""}`} onClick={startBrew}>
              물약 제조하기
            </button>
          </div>
        )}

        {/* ── 질문 ── */}
        {screen === "question" && activeQ !== -1 && (
          <div className="screen">
            <div className="question-wrap">
              <button className="btn-reset q-back" onClick={() => setScreen("main")}>← 돌아가기</button>
              <BottleSVG filled={false} color={BOTTLE_COLORS[activeQ % BOTTLE_COLORS.length]} />
              <p className="q-num">질문 {activeQ + 1} / {QUESTIONS.length}</p>
              <p className="q-text">{QUESTIONS[activeQ].text}</p>
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

        {/* ── 제조/결과 ── */}
        {screen === "brew" && (
          <div className="screen brew-wrap">
            {!resultReady ? (
              <>
                <p className="brew-label">{slotRunning ? "유형을 감별하는 중..." : ""}</p>
                <p className={`slot-name ${slotRunning ? "running" : ""}`}>{slotName}</p>
              </>
            ) : (
              <div className="result-wrap">

                <p className="result-monster">{result.monster}</p>
                <p className="result-title">{result.title}</p>
                {/* 이미지 */}
                <div className="result-image-wrap">
                  {result.image
                    ? <img src={result.image} alt={result.monster} />
                    : <div className="result-image-placeholder">🌙</div>
                  }
                </div>
                <div className="result-divider" />

                {/* 분석 카드 */}
                <div className="result-cards">
                  <div className="result-card desc">
                    <p className="result-card-label">유형 분석</p>
                    <p className="result-card-text">{result.desc}</p>
                  </div>
                  <div className="result-card strength">
                    <p className="result-card-label">✦ 강점</p>
                    <p className="result-card-text">{result.strength}</p>
                  </div>
                  <div className="result-card weakness">
                    <p className="result-card-label">▲ 주의</p>
                    <p className="result-card-text">{result.weakness}</p>
                  </div>
                  <div className="result-card tip">
                    <p className="result-card-label">◎ 한마디</p>
                    <p className="result-card-text">{result.tip}</p>
                  </div>
                </div>

                {/* 궁합 */}
                <div className="compat-wrap">
                  <div className="compat-box good">
                    <p className="compat-box-label">잘 맞는 이웃</p>
                    <p className="compat-names">{compatibleNames.join("\n")}</p>
                  </div>
                  <div className="compat-box bad">
                    <p className="compat-box-label">조심할 이웃</p>
                    <p className="compat-names">{incompatibleNames.join("\n")}</p>
                  </div>
                </div>

                {/* 폼 */}
                <div className="result-form">
                  <input className="result-input" type="text" placeholder="이름"
                    value={name} onChange={e => setName(e.target.value)} />
                  <input className="result-input" type="tel" placeholder="전화번호"
                    value={phone} onChange={e => setPhone(e.target.value)} />
                  <button className="btn-primary submit-btn" onClick={handleSubmit}>응모하기</button>
                </div>
                <button className="btn-reset restart-btn" onClick={restartAll}>처음부터 다시하기</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}