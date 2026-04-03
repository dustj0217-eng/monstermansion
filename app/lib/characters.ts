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
  // 101호
  // 102호
  horus: {
    id: "horus",
    name: "호루스",
    nameEn: "Horus",
    room: "102",
    species: "mummy",
    age: "3200",
    flaw: "신분제가 더는 아니라는 걸 잘 이해하지 못한다. 다른 입주민과 마주치면 싸울지도...?",
    bio: "고대 이집트의 파라오였다고 주장하는 붕대 차림의 미라. 옛 권력과 부를 되찾고 싶어하지만, 일단은 맨션 입주민으로 지내는 중.",
  },
  // 201호
  demon: {
    id: "horus",
    name: "호루스",
    nameEn: "Horus",
    room: "201",
    species: "mummy",
    age: "3200",
    flaw: "신분제가 더는 아니라는 걸 잘 이해하지 못한다. 다른 입주민과 마주치면 싸울지도...?",
    bio: "고대 이집트의 파라오였다고 주장하는 붕대 차림의 미라. 옛 권력과 부를 되찾고 싶어하지만, 일단은 맨션 입주민으로 지내는 중.",
  },
  // 202호
  // 301호
  dra: {
    id: "dra",
    name: "드라",
    nameEn: "Dra",
    room: "301",
    species: "뱀파이어",
    age: "35",
    flaw: "새벽에 나가서 밤에 들어와, 얼굴 보기가 힘들다.",
    bio: "카페인 중독 직장인 뱀파이어. 햇빛과 마늘에 약하고, 과로로 항상 피로하다. 맨션에서 10분 거리인 웰컴 컴퍼니에서 일하고 있기에, 맨션에 입주하게 되었다.",
    image: "/images/characters/dra.png",
  },
  may: {
    id: "may",
    name: "메이",
    nameEn: "May",
    room: "301",
    species: "마녀",
    age: "20",
    flaw: "마법약 실험 도중 폭발 사고를 일으킬 수 있음.",
    bio: "올해 갓 대학교에 입학하는 새내기 견습마녀! 꿈은 언니처럼 나만의 포션공방 차리기! 잘 부탁드려요!",
    image: "/images/characters/may.png",
  },
  gosti: {
    id: "gosti",
    name: "고스티",
    nameEn: "Gosti",
    room: "301",
    species: "유령",
    age: "19",
    flaw: "어디든 통과해 다닐 수 있다. 잘못하면 사생활 침해가 될지도...?",
    bio: "학교에서는 존재감 제일 없는 뒷자리 남학생, 집에서는 식탁보 뒤집어쓰고 사는 고3 수험생 유령.",
  },
};

// ── 호실 목록 ─────────────────────────────────────
export const ROOMS: Room[] = [
  { number: "101", floor: 1, characters: [], vacant: true, vacantLabel: "입주 협의 중" },
  { number: "102", floor: 1, characters: ["horus"] },
  { number: "201", floor: 2, characters: [], vacant: true, vacantLabel: "곧 누군가 이사 옵니다" },
  { number: "202", floor: 2, characters: [] },
  { number: "301", floor: 3, characters: ["dra", "may", "gosti"] },
  { number: "302", floor: 3, characters: [] },
  { number: "401", floor: 4, characters: [], vacant: true },
  { number: "402", floor: 4, characters: [] },
];