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
  rilly: {
    id: "murmaid",
    name: "릴라니아",
    nameEn: "Rillania",
    room: "102",
    species: "Murmaid",
    age: "30",
    flaw: "맨션 안에서는 항상 이동식 욕조를 타고 다닌다. 습기, 물기, 곰팡이의 원인이 될 수 있다...",
    bio: "인류학을 전공했다는 인어. 지상에서 살기 어려운 신체에도 불구하고, 빛나는 열정으로 모두 극복! 낮 시간동안 인간 형태로 회사에 다니기 위해, 근처에 있는 몬스터 맨션에 입주 신청을 했다. 인간 너무 좋아! 재밌어! 박사 논문을 쓰는 중!",
    image: "/images/characters/인어.png"
  },
  // 201호
  horus: {
    id: "horus",
    name: "호루스",
    nameEn: "Horus",
    room: "201",
    species: "mummy",
    age: "3200",
    flaw: "신분제가 더는 아니라는 걸 잘 이해하지 못한다. 다른 입주민과 마주치면 싸울지도...?",
    bio: "고대 이집트의 파라오였다고 주장하는 붕대 차림의 미라. 옛 권력과 부를 되찾고 싶어하지만, 일단은 맨션 입주민으로 지내는 중.",
    image: "/images/characters/미라.png"
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
    image: "/images/characters/마녀.png",
  },
  gosti: {
    id: "gosti",
    name: "고스티",
    nameEn: "Gosti",
    room: "301",
    species: "유령",
    age: "19",
    flaw: "어디든 통과해 다닐 수 있다. 잘못하면 사생활 침해가 될지도...?",
    bio: "학교에서는 존재감 제일 없는 뒷자리 학생, 집에서는 식탁보 뒤집어쓰고 사는 고3 수험생 유령.",
    image: "/images/characters/유령.png"
  },
  // 302호
  bia: {
    id: "bia",
    name: "비아",
    nameEn: "Bia",
    room: "302",
    species: "좀비",
    age: "17",
    flaw: "자기의 기준을 다른 입주민에게 강요하게 될지도 모른다. 원리원칙을 싫어하는 사람과는 안 맞을 타입.",
    bio: "일어날 때부터 잠잘 때까지, 1분도 허투루 쓰지 않는 성실한 고등학생. 매일 안색이 안 좋고 다크서클이 내려와 있다.",
    image: "/images/characters/좀비.png"
  },
  victor: {
    id: "victor",
    name: "빅터",
    nameEn: "Victor",
    room: "302",
    species: "프랑켄슈타인",
    age: "34",
    flaw: "겉보기엔 상당히 무뚝뚝하고 대화가 잘 통하지 않는 인상이다. 방 밖으로도 잘 안 나오지만, 특정 상황에선 약간 걸림이 될지도.",
    bio: "뭔가를 만드는 걸 좋아하는 맨션 최고의 엔지니어. 피부색이 비슷하긴 하다만 비아와 친척은 아니다. 듣기로는 누군가가 만들어낸 존재라는데...",
    image: "/images/characters/프랑켄슈타인.png"
  },
};

// ── 호실 목록 ─────────────────────────────────────
export const ROOMS: Room[] = [
  { number: "101", floor: 1, characters: [], vacant: true, vacantLabel: "입주 협의 중" },
  { number: "102", floor: 1, characters: ["rilly"] },
  { number: "201", floor: 2, characters: [], vacant: true, vacantLabel: "곧 누군가 이사 옵니다" },
  { number: "202", floor: 2, characters: ["horus"] },
  { number: "301", floor: 3, characters: ["dra", "may", "gosti"] },
  { number: "302", floor: 3, characters: ["bia", "victor"] },
  { number: "401", floor: 4, characters: [], vacant: true },
  { number: "402", floor: 4, characters: [] },
];