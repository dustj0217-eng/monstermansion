"use client";

import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// 📌 이미지 경로 설정 가이드
//
// 모든 이미지는 /public/images/ 폴더 기준으로 경로를 작성합니다.
//
//   BANNER_IMAGE     → "/images/characters/banner.jpg"
//   groupImage       → "/images/characters/301/group.png"
//   image (개인 PNG) → "/images/characters/301/dracula.png"
//
// 경로를 채워 넣으면 placeholder가 자동으로 이미지로 교체됩니다.
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────
// 배너 이미지 경로
// ─────────────────────────────────────────
const BANNER_IMAGE = ""; // 예: "/images/characters/banner.jpg"

// ─────────────────────────────────────────
// 캐릭터 섹션 배경색 팔레트 (어두운 보라/파랑/분홍 계열)
// 캐릭터 index 순서대로 순환 적용됩니다.
// 색 추가/변경 시 이 배열만 수정하세요.
// ─────────────────────────────────────────
const SECTION_COLORS = [
  "#160a2e", // 딥 퍼플
  "#0a1628", // 딥 네이비
  "#1f0a1a", // 딥 마젠타
  "#0d1a2e", // 딥 블루
  "#18082a", // 딥 바이올렛
  "#1a0a14", // 딥 로즈
];

// ─────────────────────────────────────────
// 호실별 캐릭터 데이터
// 새 호실 추가 → ROOMS 배열에 객체 추가
// 새 캐릭터 추가 → 해당 호실 characters 배열에 객체 추가
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
        mbti: "INTJ",
        role: "맨션의 터줏대감",
        desc: "맨션에서 가장 오래된 입주자. 낮에는 잠들고 밤에만 활동합니다. 유독 빨간 과일주스를 즐겨 마신다는 소문이 있어요. 겉으론 무뚝뚝하지만 이웃을 은근히 챙깁니다.",
        image: "", // 예: "/images/characters/301/dracula.png"
      },
      {
        id: "wolfman",
        name: "울프맨",
        nameEn: "Wolfman",
        mbti: "ENFP",
        role: "음악 천재",
        desc: "보름달이 뜨는 날이면 301호에서 피아노 소리가 들려옵니다. 알고 보니 엄청난 음악 천재. 평소엔 수줍음이 많지만 무대 위에선 누구보다 빛납니다.",
        image: "", // 예: "/images/characters/301/wolfman.png"
      },
      {
        id: "zombie",
        name: "좀비 씨",
        nameEn: "Mr. Zombie",
        mbti: "ISFJ",
        role: "맨션 최고 셰프",
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
        mbti: "ENTP",
        role: "약초 마녀",
        desc: "302호 전체가 약초 냄새로 가득한 이유. 실험을 너무 좋아해서 가끔 폭발 사고를 냅니다. 그래도 아무도 내쫓지 못하는 건 그녀의 포션이 너무 유용하기 때문.",
        image: "", // 예: "/images/characters/302/hazel.png"
      },
      {
        id: "slime",
        name: "슬라임",
        nameEn: "Slime",
        mbti: "INFP",
        role: "맨션의 마스코트",
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

  // 이미지 쪽에서 은은하게 빛이 번지는 느낌
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

        {/* PNG 이미지 — 배경 없는 투명 PNG 권장 */}
        <div className={"char-img-col slide-" + (isEven ? "left" : "right") + (inView ? " in" : "")}>
          {char.image ? (
            <img src={char.image} alt={char.name} className="char-img" />
          ) : (
            // char.image 경로 채우면 이 placeholder 사라짐
            <div className="img-placeholder">
              <div className="placeholder-emoji">👻</div>
              <div className="placeholder-text">
                {char.name}<br />
                <span>image 경로 미설정</span>
              </div>
            </div>
          )}
        </div>

        {/* 텍스트 */}
        <div className={"char-text-col slide-" + (isEven ? "right" : "left") + (inView ? " in" : "")}>
          <div className="char-mbti">{char.mbti}</div>
          <h3 className="char-name">{char.name}</h3>
          <div className="char-name-en">{char.nameEn}</div>
          <div className="char-role">{char.role}</div>
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
  const [animating, setAnimating] = useState(false);
  const [displayRoom, setDisplayRoom] = useState<Room>(ROOMS[0]);
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
          width: 100%; max-width: 420px; margin: 0 auto;
          background: #0d0620; font-family: 'Nunito', sans-serif;
          color: white; min-height: 100dvh; overflow-x: hidden;
        }

        /* ── 배너 (풀블리드) ── */
        .banner { width: 100%; aspect-ratio: 16 / 7; overflow: hidden; background: #1a0d35; }
        .banner img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .banner-placeholder {
          width: 100%; height: 100%;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
          background: linear-gradient(135deg, #1a0d35 0%, #2d1060 100%);
        }
        .bp-title { font-family: 'Fredoka One', cursive; font-size: 22px; color: #c9a7f5; letter-spacing: 3px; }
        .bp-sub   { font-size: 10px; color: rgba(201,167,245,0.4); letter-spacing: 1px; }

        /* ── 호실 탭 ── */
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

        /* ── 콘텐츠 페이드 전환 ── */
        .room-content { transition: opacity 0.22s ease; }
        .room-content.fading { opacity: 0; }

        /* ── 단체 일러스트 (풀블리드, 좌우 여백 없음) ── */
        .group-section {
          width: 100%; background: #0d0620;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .group-section.visible { opacity: 1; transform: translateY(0); }
        .group-section img { width: 100%; display: block; }
        .group-placeholder {
          width: 100%; aspect-ratio: 2 / 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
        }
        .group-placeholder-icon { font-size: 36px; opacity: 0.3; }
        .group-placeholder-text { font-size: 11px; color: rgba(201,167,245,0.3); text-align: center; line-height: 1.8; }

        /* ── 개인 캐릭터 섹션 ── */
        /* 구분선/여백 없음 — 배경색만으로 섹션 구분 */
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

        /* 이미지 컬럼 — 화면의 절반 */
        .char-img-col { width: 50%; flex-shrink: 0; }
        .char-img {
          width: 100%; display: block;
          filter: drop-shadow(0 10px 28px rgba(0,0,0,0.6));
        }
        .img-placeholder {
          width: 100%; aspect-ratio: 3 / 4;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
          border: 1px dashed rgba(255,255,255,0.08);
        }
        .placeholder-emoji { font-size: 36px; opacity: 0.35; }
        .placeholder-text  { font-size: 10px; color: rgba(255,255,255,0.3); text-align: center; line-height: 1.7; }
        .placeholder-text span { font-size: 9px; opacity: 0.7; }

        /* 텍스트 컬럼 */
        .char-text-col {
          flex: 1; padding: 0 16px 16px 12px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .char-inner.odd .char-text-col { padding: 0 12px 16px 16px; }

        .char-mbti    { font-family: 'Fredoka One', cursive; font-size: 10px; color: rgba(201,167,245,0.55); letter-spacing: 2.5px; }
        .char-name    { font-family: 'Fredoka One', cursive; font-size: 21px; color: white; line-height: 1.15; }
        .char-name-en { font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 1.5px; margin-bottom: 2px; }
        .char-role {
          display: inline-block; width: fit-content;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.13);
          border-radius: 20px; padding: 3px 10px;
          font-size: 11px; color: rgba(255,255,255,0.65); font-weight: 800;
        }
        .char-desc { font-size: 11.5px; line-height: 1.8; color: rgba(255,255,255,0.5); margin-top: 4px; }
      `}</style>

      <div className="characters-page">

        {/* 배너 */}
        <div className="banner">
          {BANNER_IMAGE ? (
            <img src={BANNER_IMAGE} alt="캐릭터 소개 배너" />
          ) : (
            <div className="banner-placeholder">
              <div className="bp-title">✦ CHARACTERS ✦</div>
              <div className="bp-sub">BANNER_IMAGE 경로를 설정해주세요</div>
            </div>
          )}
        </div>

        {/* 호실 탭 */}
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

        {/* 호실 콘텐츠 */}
        <div className={"room-content" + (animating ? " fading" : "")}>

          {/* 단체 일러스트 — 풀블리드 */}
          <div ref={groupRef} className={"group-section" + (groupInView ? " visible" : "")}>
            {displayRoom.groupImage ? (
              <img src={displayRoom.groupImage} alt={displayRoom.label + " 단체 일러스트"} />
            ) : (
              <div className="group-placeholder">
                <div className="group-placeholder-icon">🏠</div>
                <div className="group-placeholder-text">
                  {displayRoom.label} 단체 일러스트<br />
                  groupImage 경로를 설정해주세요
                </div>
              </div>
            )}
          </div>

          {/* 개인 섹션 — 구분선 없이 배경색으로만 구분 */}
          {displayRoom.characters.map((char, i) => (
            <CharacterSection key={char.id} char={char} index={i} />
          ))}

        </div>
      </div>
    </>
  );
}