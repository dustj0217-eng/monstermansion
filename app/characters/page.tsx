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
    groupImage: "", // 예: "/images/characters/301/group.png"
    characters: [
      {
        id: "dracula",
        name: "드라큘라 백작",
        nameEn: "Count Dracula",
        desc: "맨션에서 가장 오래된 입주자. 낮에는 잠들고 밤에만 활동합니다. 유독 빨간 과일주스를 즐겨 마신다는 소문이 있어요. 겉으론 무뚝뚝하지만 이웃을 은근히 챙깁니다.",
        image: "", // 예: "/images/characters/301/dracula.png"
      },
      {
        id: "wolfman",
        name: "울프맨",
        nameEn: "Wolfman",
        desc: "보름달이 뜨는 날이면 301호에서 피아노 소리가 들려옵니다. 알고 보니 엄청난 음악 천재. 평소엔 수줍음이 많지만 무대 위에선 누구보다 빛납니다.",
        image: "", // 예: "/images/characters/301/wolfman.png"
      },
      {
        id: "zombie",
        name: "좀비 씨",
        nameEn: "Mr. Zombie",
        desc: "말수는 적지만 요리 실력은 맨션 최고. 매주 화요일마다 층간 음식 나눔을 합니다. 레시피를 절대 알려주지 않는 것이 유일한 단점.",
        image: "", // 예: "/images/characters/301/zombie.png"
      },
    ],
  },
  {
    id: "302",
    label: "302호",
    groupImage: "", // 예: "/images/characters/302/group.png"
    characters: [
      {
        id: "witch",
        name: "헤이젤",
        nameEn: "Hazel",
        desc: "302호 전체가 약초 냄새로 가득한 이유. 실험을 너무 좋아해서 가끔 폭발 사고를 냅니다. 그래도 아무도 내쫓지 못하는 건 그녀의 포션이 너무 유용하기 때문.",
        image: "", // 예: "/images/characters/302/hazel.png"
      },
      {
        id: "slime",
        name: "슬라임",
        nameEn: "Slime",
        desc: "어디서 왔는지 아무도 모릅니다. 어느 날 갑자기 302호 욕실에서 발견됐어요. 말은 못 하지만 표정이 너무 풍부해서 의사소통에 문제는 없습니다.",
        image: "", // 예: "/images/characters/302/slime.png"
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
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .characters-page {
          width: 100%; max-width: 420px; min-height: 100dvh;
          margin: 0 auto;
          background: #0d0620; font-family: 'Nunito', sans-serif;
          color: white; overflow-x: hidden;
        }

        /* 호실 탭 */
        .room-nav {
          position: sticky; top: 0; z-index: 10; display: flex;
          background: rgba(13,6,32,0.97); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(200,160,255,0.1);
        }
        .room-tab {
          flex: 1; padding: 14px 0;
          font-family: 'Fredoka One', cursive; font-size: 15px;
          color: rgba(201,167,245,0.4); background: none; border: none;
          cursor: pointer; position: relative; transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .room-tab.active { color: #c9a7f5; }
        .room-tab.active::after {
          content: ''; position: absolute; bottom: 0; left: 20%; right: 20%;
          height: 2px; background: #c9a7f5; border-radius: 2px;
        }

        /* 콘텐츠 페이드 */
        .room-content { transition: opacity 0.22s ease; }
        .room-content.fading { opacity: 0; }

        /* 단체 일러스트 */
        .group-section {
          width: 100%; background: #0d0620;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .group-section.visible { opacity: 1; transform: translateY(0); }
        .group-section img { width: 100%; display: block; }
        .group-placeholder {
          width: 100%; aspect-ratio: 2 / 1;
          display: flex; align-items: center; justify-content: center;
        }
        .group-placeholder-text {
          font-size: 11px; color: rgba(201,167,245,0.3);
          text-align: center; line-height: 1.8;
        }

        /* 개인 캐릭터 섹션 */
        .char-section { width: 100%; padding: 32px 0 20px; }
        .char-inner { display: flex; align-items: flex-end; width: 100%; }
        .char-inner.even { flex-direction: row; }
        .char-inner.odd  { flex-direction: row-reverse; }

        /* 슬라이드 인 */
        .slide-left  { opacity: 0; transform: translateX(-44px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .slide-right { opacity: 0; transform: translateX(44px);  transition: opacity 0.55s ease, transform 0.55s ease; }
        .slide-left.in, .slide-right.in { opacity: 1; transform: translateX(0); }
        .char-text-col.slide-left,
        .char-text-col.slide-right { transition-delay: 0.09s; }

        /* 이미지 컬럼 */
        .char-img-col { width: 30%; flex-shrink: 0; }
        .char-img {
          width: 100%; display: block;
          filter: drop-shadow(0 10px 28px rgba(0,0,0,0.6));
        }
        .img-placeholder {
          width: 100%; aspect-ratio: 3 / 4;
          display: flex; align-items: center; justify-content: center;
          border: 1px dashed rgba(255,255,255,0.08);
        }
        .placeholder-text  { font-size: 10px; color: rgba(255,255,255,0.3); text-align: center; line-height: 1.7; }
        .placeholder-text span { font-size: 9px; opacity: 0.7; }

        /* 텍스트 컬럼 */
        .char-text-col {
          flex: 1; padding: 0 16px 16px 12px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .char-inner.odd .char-text-col { padding: 0 12px 16px 16px; }

        .char-name    { font-family: 'Fredoka One', cursive; font-size: 21px; color: white; line-height: 1.15; }
        .char-name-en { font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 1.5px; margin-bottom: 2px; }
        .char-desc    { font-size: 11.5px; line-height: 1.8; color: rgba(255,255,255,0.5); margin-top: 4px; }
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