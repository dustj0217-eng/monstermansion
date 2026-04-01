"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";
import { useInView } from "../lib/hooks";

// ─────────────────────────────────────────────
// 섹션 배경색
// ─────────────────────────────────────────────
const SECTION_COLORS = [
  "#160a2e", "#0a1628", "#1f0a1a",
  "#0d1a2e", "#18082a", "#1a0a14",
];

// ─────────────────────────────────────────────
// 데이터
// ─────────────────────────────────────────────
const ROOMS = [
  {
    id: "301",
    label: "301호",
    groupImage: "/images/몬스터맨션.jpg",
    characters: [
      {
        id: "dra",
        name: "드라",
        nameEn: "뱀파이어",
        desc: "혈액 대신 카페인 중독 뱀파이어?\n새벽 출근, 밤 퇴근을 반복하는\n햇빛 싫어 직장인.",
        image: "/images/characters/dra.png",
      },
      {
        id: "may",
        name: "메이",
        nameEn: "마녀",
        desc: "인간 나이로는 대학 신입생,\n마녀 나이로는 초보 마녀.\n포션 가게의 꿈을 꾸는 화학과 마녀.",
        image: "/images/characters/may.png",
      },
      {
        id: "gosti",
        name: "고스티",
        nameEn: "유령",
        desc: "학교에선 제일 존재감 없는 학생,\n집에서는 식탁보를 뒤집어쓰고 다니는\n고3 유령",
        image: "",
      },
    ],
  },
] as const;

type Room = (typeof ROOMS)[number];
type Character = Room["characters"][number];

// ─────────────────────────────────────────────
// 캐릭터 섹션
// ─────────────────────────────────────────────
function CharacterSection({ char, index }: { char: Character; index: number }) {
  const { ref, inView } = useInView();
  const isEven = index % 2 === 0;
  const bg = SECTION_COLORS[index % SECTION_COLORS.length];

  return (
    <div
      ref={ref}
      className="px-6 pt-4"
      style={{ background: bg }}
    >
      <div
        className="flex items-center gap-3 min-h-[140px]"
        style={{ flexDirection: isEven ? "row" : "row-reverse" }}
      >
        <NavBar variant="back" backHref="/" backLabel="MAIN" />
        
        {/* 이미지 */}
        <div
          className="w-[45%] shrink-0 transition-all duration-500"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : `translateX(${isEven ? "-28px" : "28px"})`,
          }}
        >
          {char.image ? (
            <img
              src={char.image}
              alt={char.name}
              className="w-full block drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <div
              className="w-full aspect-[3/4] rounded-xl flex items-center justify-center text-center text-xs leading-relaxed"
              style={{ background: "rgba(255,255,255,0.05)", color: "var(--color-text-muted)" }}
            >
              {char.name}<br /><span className="text-[10px]">image 미설정</span>
            </div>
          )}
        </div>

        {/* 텍스트 */}
        <div
          className="flex-1 text-center transition-all duration-500"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : `translateX(${isEven ? "28px" : "-28px"})`,
          }}
        >
          <h3
            className="text-[22px] leading-tight"
            style={{ fontFamily: "var(--font-korean)" }}
          >
            {char.name}
          </h3>
          <div className="text-[11px] tracking-[1.2px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {char.nameEn}
          </div>
          <p
            className="text-[12.5px] leading-[1.8] mt-2 whitespace-pre-line overflow-hidden"
            style={{
              color: "rgba(255,255,255,0.55)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {char.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인
// ─────────────────────────────────────────────
export default function CharactersPage() {
  const [activeRoomId, setActiveRoomId] = useState<string>(ROOMS[0].id);
  const [animating, setAnimating]       = useState(false);
  const [displayRoom, setDisplayRoom]   = useState<Room>(ROOMS[0]);
  const { ref: groupRef, inView: groupInView } = useInView(0.05);

  function handleRoomChange(roomId: string) {
    if (roomId === activeRoomId || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setDisplayRoom(ROOMS.find((r) => r.id === roomId) as Room);
      setActiveRoomId(roomId);
      setAnimating(false);
    }, 220);
  }

  return (
    <div
      className="w-full max-w-[430px] min-h-dvh mx-auto overflow-x-hidden"
      style={{ background: "var(--color-bg)", color: "var(--color-text-primary)" }}
    >
      {/* 탭 */}
      <nav
        className="sticky top-0 z-10 flex"
        style={{
          background: "rgba(13,6,32,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {ROOMS.map((room) => (
          <button
            key={room.id}
            className="flex-1 py-3.5 text-[15px] relative transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              color: activeRoomId === room.id ? "var(--color-purple)" : "rgba(201,167,245,0.4)",
            }}
            onClick={() => handleRoomChange(room.id)}
          >
            {room.label}
            {activeRoomId === room.id && (
              <span
                className="absolute bottom-0 left-[20%] right-[20%] h-[2px] rounded"
                style={{ background: "var(--color-purple)" }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* 콘텐츠 */}
      <div
        className="transition-opacity duration-[220ms]"
        style={{ opacity: animating ? 0 : 1 }}
      >
        {/* 단체 이미지 */}
        <div
          ref={groupRef}
          className="w-full transition-all duration-[600ms]"
          style={{
            opacity: groupInView ? 1 : 0,
            transform: groupInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {displayRoom.groupImage
            ? <img src={displayRoom.groupImage} alt={displayRoom.label} className="w-full block" />
            : (
              <div
                className="w-full h-48 flex items-center justify-center text-sm text-center"
                style={{ color: "var(--color-text-muted)" }}
              >
                {displayRoom.label} 단체 일러스트<br />groupImage 경로를 설정해주세요
              </div>
            )
          }
        </div>

        {displayRoom.characters.map((char, i) => (
          <CharacterSection key={char.id} char={char} index={i} />
        ))}
      </div>
    </div>
  );
}