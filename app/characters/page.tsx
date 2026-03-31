"use client";

import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────
// 섹션 배경색 팔레트
// ─────────────────────────────────────────
const SECTION_COLORS = [
  "#160a2e",
  "#0a1628",
  "#1f0a1a",
  "#0d1a2e",
  "#18082a",
  "#1a0a14",
];

// ─────────────────────────────────────────
// 호실별 캐릭터 데이터
// ─────────────────────────────────────────
const ROOMS = [
  {
    id: "301",
    label: "301호",
    groupImage: "/images/몬스터맨션.jpg", // 예: "/images/characters/301/group.png"
    characters: [
      {
        id: "dra",
        name: "드라",
        nameEn: "뱀파이어",
        desc: "혈액 대신 카페인 중독 뱀파이어?\n새벽 출근, 밤 퇴근을 반복하는\n햇빛 싫어 직장인.",
        image: "/images/characters/dra.png", // 예: "/images/characters/301/dra.png"
      },
      {
        id: "may",
        name: "메이",
        nameEn: "마녀",
        desc: "인간 나이로는 대학 신입생,\n마녀 나이로는 초보 마녀.\n포션 가게의 꿈을 꾸는 화학과 마녀.",
        image: "/images/characters/may.png", // 예: "/images/characters/301/wolfman.png"
      },
      {
        id: "gosti",
        name: "고스티",
        nameEn: "유령",
        desc: "학교에선 제일 존재감 없는 학생,\n집에서는 식탁보를 뒤집어쓰고 다니는\n고3 유령",
        image: "", // 예: "/images/characters/301/zombie.png"
      },
    ],
  },
] as const;

type Room = (typeof ROOMS)[number];
type Character = Room["characters"][number];

// ─────────────────────────────────────────
// 스크롤 감지 훅
// ─────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─────────────────────────────────────────
// 개인 캐릭터 섹션
// ─────────────────────────────────────────
function CharacterSection({ char, index }: { char: Character; index: number }) {
  const { ref, inView } = useInView();
  const isEven = index % 2 === 0;
  const bgColor = SECTION_COLORS[index % SECTION_COLORS.length];
  const bgGradient = isEven
    ? `radial-gradient(ellipse 70% 90% at 20% 70%, rgba(255,255,255,0.03) 0%, transparent 65%)`
    : `radial-gradient(ellipse 70% 90% at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 65%)`;

  return (
    <div
      ref={ref}
      className="char-section"
      style={{ background: `${bgGradient}, ${bgColor}` }}
    >
      <div className={"char-inner " + (isEven ? "even" : "odd")}>

        <div className={"char-img-col slide-" + (isEven ? "left" : "right") + (inView ? " in" : "")}>
          {char.image ? (
            <img src={char.image} alt={char.name} className="char-img" />
          ) : (
            <div className="img-placeholder">
              <div className="placeholder-text">
                {char.name}<br />
                <span>image 경로 미설정</span>
              </div>
            </div>
          )}
        </div>

        <div className={"char-text-col slide-" + (isEven ? "right" : "left") + (inView ? " in" : "")}>
          <h3 className="char-name">{char.name}</h3>
          <div className="char-name-en">{char.nameEn}</div>
          <p className="char-desc">{char.desc}</p>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .characters-page {
          width: 100%;
          max-width: 430px;
          min-height: 100dvh;
          margin: 0 auto;
          background: #0d0620;
          font-family: 'Nunito', sans-serif;
          color: white;
          overflow-x: hidden;
        }

        /* 상단 탭 */
        .room-nav {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          background: rgba(13,6,32,0.97);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(200,160,255,0.1);
        }

        .room-tab {
          flex: 1;
          padding: 14px 0;
          font-family: 'Fredoka One', cursive;
          font-size: 15px;
          color: rgba(201,167,245,0.4);
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }

        .room-tab.active {
          color: #c9a7f5;
        }

        .room-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20%;
          right: 20%;
          height: 2px;
          background: #c9a7f5;
          border-radius: 2px;
        }

        /* 페이드 */
        .room-content {
          transition: opacity 0.22s ease;
        }
        .room-content.fading {
          opacity: 0;
        }

        /* 단체 이미지 */
        .group-section {
          width: 100%;
          background: #0d0620;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .group-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .group-section img {
          width: 100%;
          display: block;
        }

        /* 캐릭터 카드 */
        .char-section {
          padding: 16px 24px 0px 24px;
        }

        /* 배경 교차 (선택 요소지만 추천) */
        .char-section:nth-child(odd) {
          background: #1a0f2e;
        }
        .char-section:nth-child(even) {
          background: #140a26;
        }

        /* 내부 레이아웃 */
        .char-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 140px;
        }

        .char-inner.even {
          flex-direction: row;
        }

        .char-inner.odd {
          flex-direction: row-reverse;
        }

        /* 이미지 */
        .char-img-col {
          width: 45%;
          flex-shrink: 0;
        }

        .char-img {
          width: 100%;
          display: block;
          filter: drop-shadow(0 10px 24px rgba(0,0,0,0.5));
        }

        /* 텍스트 */
        .char-text-col {
          align-items: center;
          text-align: center;
        }

        /* 이름 한 줄 정렬 */
        .char-name-row {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 8px;
        }

        .char-name {
          font-family: 'Jua', sans-serif;
          font-size: 22px;
          line-height: 1.2;
        }

        .char-name-en {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 1.2px;
        }

        /* 설명 */
        .char-desc {
          font-size: 12.5px;
          line-height: 1.8;
          color: rgba(255,255,255,0.55);
          white-space: pre-line;

          display: -webkit-box;
          -webkit-line-clamp: 3;   /* ← 최대 줄 */
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* 애니메이션 (부드럽게 조정) */
        .slide-left {
          opacity: 0;
          transform: translateX(-28px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .slide-right {
          opacity: 0;
          transform: translateX(28px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .slide-left.in,
        .slide-right.in {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <div className="characters-page">
        <nav className="room-nav">
          {ROOMS.map((room) => (
            <button
              key={room.id}
              className={"room-tab" + (activeRoomId === room.id ? " active" : "")}
              onClick={() => handleRoomChange(room.id)}
            >
              {room.label}
            </button>
          ))}
        </nav>

        <div className={"room-content" + (animating ? " fading" : "")}>

          <div ref={groupRef} className={"group-section" + (groupInView ? " visible" : "")}>
            {displayRoom.groupImage ? (
              <img src={displayRoom.groupImage} alt={displayRoom.label + " 단체 일러스트"} />
            ) : (
              <div className="group-placeholder">
                <div className="group-placeholder-text">
                  {displayRoom.label} 단체 일러스트<br />
                  groupImage 경로를 설정해주세요
                </div>
              </div>
            )}
          </div>

          {displayRoom.characters.map((char, i) => (
            <CharacterSection key={char.id} char={char} index={i} />
          ))}

        </div>
      </div>
    </>
  );
}