export type Character = {
  id: string;
  name: string;
  nameEn?: string;
  room: string;
  species: string;
  age: string;
  flaw: string;          // 치명적 단점
  bio: string;
  image?: string;        // 없으면 실루엣
};

export type Room = {
  number: string;
  floor: number;
  characters: string[];
  vacant?: true;
  vacantLabel?: string;
};

// ── 호실별 테마 컬러 ──────────────────────────────
export const ROOM_COLORS: Record<string, { accent: string; glow: string }> = {
  "101": { accent: "#7ecfb3", glow: "rgba(126,207,179,0.18)" },
  "102": { accent: "#e8a87c", glow: "rgba(232,168,124,0.18)" },
  "201": { accent: "#c9a7f5", glow: "rgba(201,167,245,0.18)" },
  "202": { accent: "#f5a7c9", glow: "rgba(245,167,201,0.18)" },
  "301": { accent: "#7ab3e8", glow: "rgba(122,179,232,0.18)" },
  "302": { accent: "#f5d07a", glow: "rgba(245,208,122,0.18)" },
  "401": { accent: "#e87a7a", glow: "rgba(232,122,122,0.18)" },
  "402": { accent: "#a7f5c9", glow: "rgba(167,245,201,0.18)" },
};

// ── 캐릭터 데이터 ─────────────────────────────────
export const CHARACTERS: Record<string, Character> = {
  // 301호
  dracula: {
    id: "dracula",
    name: "드라큘라",
    nameEn: "Dracula",
    room: "301",
    species: "뱀파이어",
    age: "587",
    flaw: "낮에는 절대 못 일어남 — 오전 약속은 존재하지 않는다",
    bio: "수백 년 된 귀족 뱀파이어. 품위 있어 보이지만 월세를 자꾸 잊는다.",
    image: "/images/characters/dracula.png",
  },
  wolf: {
    id: "wolf",
    name: "울프",
    nameEn: "Wolf",
    room: "301",
    species: "늑대인간",
    age: "28",
    flaw: "보름달이 뜨면 이성 0% — 맨션 가구 파손 주범",
    bio: "평소엔 과묵하고 신사적. 단 한 달에 한 번, 전혀 다른 존재가 된다.",
  },
  mummy: {
    id: "mummy",
    name: "미라",
    nameEn: "Mummy",
    room: "301",
    species: "미라",
    age: "3200",
    flaw: "붕대가 계속 풀림 — 복도에 흘린 붕대는 항상 미라 것",
    bio: "고대 이집트 왕족 출신. 현대 문명에 적응 중이나 진도가 느리다.",
  },
  // 302호
  hazel: {
    id: "hazel",
    name: "헤이젤",
    nameEn: "Hazel",
    room: "302",
    species: "마녀",
    age: "22",
    flaw: "실험 마법이 자꾸 폭발함 — 302호 천장은 항상 그을려 있다",
    bio: "마법학교 수석 졸업. 이론은 완벽하지만 실전에서 꼭 뭔가 터진다.",
    image: "/images/characters/hazel.png",
  },
  witch: {
    id: "witch",
    name: "모르가나",
    nameEn: "Morgana",
    room: "302",
    species: "고대 마녀",
    age: "불명",
    flaw: "저주를 너무 가볍게 씀 — 화나면 일단 저주부터",
    bio: "헤이젤의 룸메이트이자 멘토. 수천 년의 내공을 가졌지만 성격이 문제.",
  },
  // 나머지 호실 캐릭터는 추가 예정
};

// ── 호실 목록 ─────────────────────────────────────
export const ROOMS: Room[] = [
  { number: "101", floor: 1, characters: [] },
  { number: "102", floor: 1, characters: [], vacant: true, vacantLabel: "입주 협의 중" },
  { number: "201", floor: 2, characters: [], vacant: true, vacantLabel: "곧 누군가 이사 옵니다" },
  { number: "202", floor: 2, characters: [] },
  { number: "301", floor: 3, characters: ["dracula", "wolf", "mummy"] },
  { number: "302", floor: 3, characters: ["hazel", "witch"] },
  { number: "401", floor: 4, characters: [], vacant: true },
  { number: "402", floor: 4, characters: [] },
];