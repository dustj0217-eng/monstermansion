"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────
type Phase = "day" | "closing" | "opening" | "night";

// PageId는 PAGES 키에서 자동 추론 — 새 페이지 추가 시 PAGES에만 추가하면 됩니다
type PageId = keyof typeof PAGES;

// ─────────────────────────────────────────────
// 페이지 데이터 — 페이지 추가 시 여기에만 추가
// ─────────────────────────────────────────────
const PAGES = {
  "301": {
    title: "301호",
    emoji: "👾",
    content: (
      <div className="page-body">
        <h2>301호의 주민들</h2>
        <div className="char-card">
          <div className="char-avatar">🧛</div>
          <div>
            <h3>드라큘라 백작</h3>
            <p>맨션에서 가장 오래된 입주자. 낮에는 잠들고 밤에만 활동합니다. 유독 빨간 과일주스를 즐겨 마신다는 소문이 있어요.</p>
          </div>
        </div>
        <div className="char-card">
          <div className="char-avatar">🐺</div>
          <div>
            <h3>울프맨</h3>
            <p>보름달이 뜨는 날이면 301호에서 피아노 소리가 들려옵니다. 알고 보니 엄청난 음악 천재.</p>
          </div>
        </div>
        <div className="char-card">
          <div className="char-avatar">🧟</div>
          <div>
            <h3>좀비 씨</h3>
            <p>말수는 적지만 요리 실력은 맨션 최고. 매주 화요일마다 층간 음식 나눔을 합니다.</p>
          </div>
        </div>
      </div>
    ),
  },
  map: {
    title: "도시 지도",
    emoji: "🗺",
    content: (
      <div className="page-body">
        <h2>몬스터시티 지도</h2>
        <p className="page-desc">맨션이 위치한 이 도시에는 몬스터들만 삽니다. 해가 지면 가게들이 문을 열고, 해가 뜨면 다들 집으로 들어가죠.</p>
        <div className="map-grid">
          {[
            { emoji: "☕", name: "뱀파이어 카페",  desc: "밤 12시 오픈" },
            { emoji: "🍞", name: "좀비 빵집",      desc: "뇌빵 전문점" },
            { emoji: "🧪", name: "마녀의 약재상",  desc: "24시간 영업" },
            { emoji: "🏚", name: "유령의 집",      desc: "관광 명소" },
            { emoji: "🎪", name: "몬스터 서커스",  desc: "매월 보름" },
            { emoji: "🌙", name: "달빛 공원",      desc: "늑대 모임 장소" },
          ].map((p) => (
            <div key={p.name} className="map-card">
              <span className="map-emoji">{p.emoji}</span>
              <span className="map-name">{p.name}</span>
              <span className="map-desc">{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  sns: {
    title: "SNS 팔로우",
    emoji: "🐦",
    content: (
      <div className="page-body">
        <h2>맨션 대표 인플루언서 — 삐약</h2>
        <p className="page-desc">맨션 담장에 앉아 모든 것을 지켜보는 새. 몬스터들의 일상을 중계합니다.</p>
        <div className="sns-list">
          {[
            { icon: "📸", name: "Instagram", handle: "@monstermansion", color: "rgba(255,110,180,0.15)" },
            { icon: "🎵", name: "TikTok",    handle: "@monstermansion", color: "rgba(167,244,196,0.15)" },
            { icon: "🐦", name: "X / Twitter",handle: "@monstermansion",color: "rgba(167,212,245,0.15)" },
            { icon: "▶️", name: "YouTube",   handle: "몬스터맨션",       color: "rgba(245,110,110,0.15)" },
          ].map((s) => (
            <div key={s.name} className="sns-item" style={{ background: s.color }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div>
                <div className="sns-name">{s.name}</div>
                <div className="sns-handle">{s.handle}</div>
              </div>
              <button className="follow-btn">팔로우</button>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  about: {
    title: "소개",
    emoji: "✨",
    content: (
      <div className="page-body">
        <h2>몬스터맨션이란?</h2>
        <p className="page-desc">겉으로는 평범한 3층 맨션. 하지만 거기 사는 주민들은 조금 특별합니다.</p>
        <p className="page-desc">드라큘라, 늑대인간, 마녀, 슬라임... 평범하지 않은 그들의 아주 평범한 일상 이야기입니다.</p>
        <div className="badge-row">
          <span className="badge">🎨 오리지널 캐릭터 IP</span>
          <span className="badge">🌙 다크 판타지</span>
          <span className="badge">💜 힐링 호러</span>
        </div>
      </div>
    ),
  },
  door: {
    title: "맨션 입장",
    emoji: "🚪",
    content: (
      <div className="page-body">
        <h2>어서오세요, 투숙객님</h2>
        <p className="page-desc">한번 들어오면 나가기 싫어지는 맨션입니다. 입주 신청은 매달 보름달이 뜨는 날 받습니다.</p>
        <div className="room-list">
          {[
            { num: "302호", available: true },
            { num: "401호", available: true },
            { num: "301호", available: false },
            { num: "201호", available: false },
          ].map((r) => (
            <div key={r.num} className={`room-card ${r.available ? "available" : "taken"}`}>
              <span className="room-num">{r.num}</span>
              <span className="room-status">{r.available ? "입주 가능" : "입주 중"}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  story: {
    title: "스토리",
    emoji: "📖",
    content: (
      <div className="page-body">
        <h2>몬스터맨션 에피소드</h2>
        <p className="page-desc">매주 업데이트되는 에피소드. 평범하지 않은 주민들의 아주 평범한 일상.</p>
        {[
          { ep: "EP.01", title: "첫 번째 보름달",  desc: "울프맨이 이사 온 날, 맨션 전체가 피아노 소리로 가득 찼다." },
          { ep: "EP.02", title: "과일주스 대란",    desc: "드라큘라 백작의 냉장고가 고장났다. 긴급 주민 회의 소집." },
          { ep: "EP.03", title: "마녀의 실수",      desc: "헤이젤의 약초 실험이 폭발하며 건물 전체가 보라색으로 물들었다." },
        ].map((ep) => (
          <div key={ep.ep} className="ep-card">
            <span className="ep-num">{ep.ep}</span>
            <div>
              <div className="ep-title">{ep.title}</div>
              <div className="ep-desc">{ep.desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  shop: {
    title: "굿즈샵",
    emoji: "🛍",
    content: (
      <div className="page-body">
        <h2>몬스터맨션 공식 굿즈</h2>
        <p className="page-desc">곧 오픈 예정입니다. 알림 신청하고 오픈 소식 받아보세요!</p>
        <div className="goods-grid">
          {[
            { emoji: "🔑", name: "아크릴 키링" },
            { emoji: "✉️", name: "엽서 세트" },
            { emoji: "🩷", name: "스티커팩" },
            { emoji: "👕", name: "티셔츠" },
          ].map((g) => (
            <div key={g.name} className="goods-card">
              <span style={{ fontSize: 36 }}>{g.emoji}</span>
              <span className="goods-name">{g.name}</span>
              <span className="goods-price">준비 중</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
} as const;

// ─────────────────────────────────────────────
// 핫스팟 — 추가 시 SPOTS 배열에만 추가
// ─────────────────────────────────────────────
const SPOTS: { id: PageId; emoji: string; label: string; style: React.CSSProperties }[] = [
  { id: "301",   emoji: "👾", label: "301호 캐릭터", style: { left: "38%", top: "42%" } },
  { id: "map",   emoji: "🗺", label: "도시 지도",    style: { left: "13%", top: "78%" } },
  { id: "sns",   emoji: "🐦", label: "SNS 팔로우",   style: { right: "18%", top: "83%" } },
  { id: "about", emoji: "💡", label: "맨션 소개",    style: { left: "14%", top: "68%" } },
  { id: "door",  emoji: "🚪", label: "맨션 입장",    style: { left: "42%", top: "76%" } },
];

// ─────────────────────────────────────────────
// 메뉴 아이템 — 추가 시 MENU_ITEMS 배열에만 추가
// href 있으면 Link, 없으면 페이지 오버레이
// ─────────────────────────────────────────────
const MENU_ITEMS: { id: PageId | "characters"; emoji: string; label: string; href?: string }[] = [
  { id: "characters", emoji: "👾", label: "캐릭터", href: "/characters" },
  { id: "story",      emoji: "📖", label: "스토리" },
  { id: "shop",       emoji: "🛍", label: "굿즈샵" },
  { id: "sns",        emoji: "🐦", label: "SNS" },
  { id: "about",      emoji: "ℹ️",  label: "소개" },
];

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
export default function MonsterMansionPage() {
  const [phase, setPhase]           = useState<Phase>("day");
  const [currentPage, setCurrentPage] = useState<PageId | null>(null);
  const [menuOpen, setMenuOpen]     = useState(false);

  // 커튼이 완전히 올라간 night 단계에서만 UI 표시
  const showUI = phase === "night";

  // 낮 → 밤 전환 시퀀스
  // day(2s 대기) → closing(커튼 내려옴 0.7s) → opening(배경 교체 + 커튼 올라감 0.7s) → night
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("closing"), 2000);
    const t2 = setTimeout(() => setPhase("opening"), 2700);
    const t3 = setTimeout(() => setPhase("night"),   3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }

        @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp   { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideInLeft { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3) }
          50%       { box-shadow: 0 0 0 7px rgba(255,255,255,0) }
        }
        @keyframes curtainDown { from { transform: translateY(-100%) } to { transform: translateY(0) } }
        @keyframes curtainUp   { from { transform: translateY(0) }     to { transform: translateY(-100%) } }

        /* ── 루트 ── */
        .root {
          width: 100%; max-width: 420px; height: 100dvh;
          margin: 0 auto; position: relative; overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        /* ── 배경 ── */
        .bg-day, .bg-night {
          position: absolute; inset: 0;
          background-size: cover; background-position: center; background-repeat: no-repeat;
        }
        .bg-day   { background-image: url('/images/맨션.jpg');    z-index: 0; }
        .bg-night { background-image: url('/images/맨션-밤.jpg'); z-index: 1; opacity: 0; transition: opacity 1.4s ease-in-out; }
        .bg-night.visible { opacity: 1; }

        /* ── 커튼 ── */
        .curtain {
          position: absolute; inset: 0; z-index: 50;
          background: #050210; transform: translateY(-100%); pointer-events: none;
        }
        .curtain.closing { animation: curtainDown 0.7s cubic-bezier(.4,0,.2,1) forwards; }
        .curtain.opening { animation: curtainUp   0.7s cubic-bezier(.4,0,.2,1) forwards; }

        /* ── 네비게이션 ── */
        .nav {
          position: absolute; top: 0; left: 0; right: 0; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(5,2,16,0.5); backdrop-filter: blur(8px);
          animation: fadeIn 0.5s ease forwards;
        }
        .nav-logo {
          font-family: 'Fredoka One', cursive;
          font-size: 13px; color: #c9a7f5; letter-spacing: 1.5px;
        }
        .hamburger {
          display: flex; flex-direction: column; gap: 5px;
          cursor: pointer; background: none; border: none; padding: 4px;
        }
        .hamburger span { display: block; width: 22px; height: 2px; background: #c9a7f5; border-radius: 2px; }

        /* ── 핫스팟 ── */
        .spot {
          position: absolute; z-index: 5; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          animation: fadeIn 0.4s ease forwards;
          -webkit-tap-highlight-color: transparent;
        }
        .spot-ring {
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);
          font-size: 17px;
          animation: pulse 2.5s ease-in-out infinite;
          transition: background 0.2s, transform 0.15s;
        }
        .spot:active .spot-ring { background: rgba(255,255,255,0.25); transform: scale(1.12); }
        .spot-label {
          background: rgba(5,2,16,0.9);
          border: 1px solid rgba(200,160,255,0.3);
          border-radius: 8px; padding: 4px 9px;
          white-space: nowrap; font-size: 10px;
          color: #c9a7f5; font-weight: 800;
          pointer-events: none;
        }

        /* ── 페이지 오버레이 ── */
        .page {
          position: absolute; inset: 0; z-index: 20;
          background: #0d0620;
          display: flex; flex-direction: column; overflow-y: auto;
          animation: slideUp 0.4s cubic-bezier(.22,1,.36,1);
        }
        .page-header {
          position: sticky; top: 0;
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px;
          background: rgba(13,6,32,0.96); backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(200,160,255,0.1); z-index: 10;
        }
        .back-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1.5px solid rgba(200,160,255,0.3);
          background: transparent; cursor: pointer;
          color: #c9a7f5; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; -webkit-tap-highlight-color: transparent;
        }
        .back-btn:active { background: rgba(200,160,255,0.15); }
        .page-title { font-family: 'Fredoka One', cursive; font-size: 20px; color: white; }

        /* ── 사이드 메뉴 ── */
        .menu {
          position: absolute; inset: 0; z-index: 30;
          background: rgba(5,2,16,0.97);
          display: flex; flex-direction: column;
          padding: 64px 28px 28px; gap: 4px;
          animation: slideInLeft 0.35s cubic-bezier(.22,1,.36,1);
        }
        .menu-close {
          position: absolute; top: 16px; right: 20px;
          font-size: 24px; color: #c9a7f5; cursor: pointer;
          background: none; border: none; -webkit-tap-highlight-color: transparent;
        }
        .menu-item {
          padding: 15px 0;
          border-bottom: 1px solid rgba(200,160,255,0.1);
          font-family: 'Fredoka One', cursive; font-size: 19px; color: #c9a7f5;
          cursor: pointer; display: flex; align-items: center; gap: 10px;
          text-decoration: none; -webkit-tap-highlight-color: transparent;
        }
        .menu-item:active { color: white; }

        /* ── 페이지 콘텐츠 공통 ── */
        .page-body { padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; }
        .page-body h2 { font-family: 'Fredoka One', cursive; font-size: 24px; color: white; }
        .page-body h3 { font-family: 'Fredoka One', cursive; font-size: 16px; color: #c9a7f5; margin-bottom: 4px; }
        .page-desc { font-size: 14px; line-height: 1.75; color: rgba(200,180,240,0.8); }

        /* 캐릭터 카드 */
        .char-card {
          display: flex; gap: 14px; align-items: flex-start;
          background: rgba(255,255,255,0.04); border-radius: 14px; padding: 16px;
          border: 1px solid rgba(200,160,255,0.1);
        }
        .char-avatar {
          width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 26px;
          background: rgba(201,167,245,0.1); border: 1px solid rgba(201,167,245,0.2);
        }
        .char-card p { font-size: 13px; line-height: 1.6; color: rgba(200,180,240,0.75); }

        /* 지도 그리드 */
        .map-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .map-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(200,160,255,0.1);
          border-radius: 12px; padding: 14px 12px; display: flex; flex-direction: column; gap: 4px;
        }
        .map-emoji { font-size: 22px; }
        .map-name  { font-size: 13px; font-weight: 800; color: #c9a7f5; }
        .map-desc  { font-size: 11px; color: rgba(200,180,240,0.6); }

        /* SNS */
        .sns-list { display: flex; flex-direction: column; gap: 10px; }
        .sns-item {
          display: flex; align-items: center; gap: 14px;
          border-radius: 14px; padding: 14px 16px; border: 1px solid rgba(200,160,255,0.1);
        }
        .sns-name   { font-size: 14px; font-weight: 800; color: white; }
        .sns-handle { font-size: 12px; color: rgba(200,180,240,0.6); }
        .follow-btn {
          margin-left: auto;
          background: rgba(201,167,245,0.15); border: 1px solid rgba(201,167,245,0.35);
          border-radius: 20px; padding: 6px 14px;
          font-size: 12px; font-weight: 800; color: #c9a7f5;
          cursor: pointer; font-family: 'Nunito', sans-serif; -webkit-tap-highlight-color: transparent;
        }

        /* 배지 */
        .badge-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .badge {
          background: rgba(201,167,245,0.12); border: 1px solid rgba(201,167,245,0.25);
          border-radius: 20px; padding: 6px 14px; font-size: 12px; color: #c9a7f5; font-weight: 700;
        }

        /* 방 목록 */
        .room-list { display: flex; flex-direction: column; gap: 8px; }
        .room-card {
          display: flex; align-items: center; justify-content: space-between;
          border-radius: 12px; padding: 14px 16px;
          border: 1px solid rgba(200,160,255,0.1); background: rgba(255,255,255,0.03);
        }
        .room-card.available { background: rgba(167,245,196,0.07); border-color: rgba(167,245,196,0.2); }
        .room-num { font-family: 'Fredoka One', cursive; font-size: 18px; color: white; }
        .room-card.available .room-status { font-size: 12px; color: #a7f5c4; font-weight: 800; }
        .room-card.taken     .room-status { font-size: 12px; color: rgba(200,180,240,0.4); font-weight: 700; }

        /* 에피소드 */
        .ep-card {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 14px 0; border-bottom: 1px solid rgba(200,160,255,0.08);
        }
        .ep-num   { font-family: 'Fredoka One', cursive; font-size: 13px; color: #c9a7f5; opacity: 0.6; flex-shrink: 0; padding-top: 2px; }
        .ep-title { font-size: 15px; font-weight: 800; color: white; margin-bottom: 4px; }
        .ep-desc  { font-size: 13px; color: rgba(200,180,240,0.7); line-height: 1.6; }

        /* 굿즈 */
        .goods-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .goods-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(200,160,255,0.1);
          border-radius: 14px; padding: 18px 14px;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        }
        .goods-name  { font-size: 13px; font-weight: 800; color: #c9a7f5; }
        .goods-price { font-size: 11px; color: rgba(200,180,240,0.5); }
      `}</style>

      <div className="root">
        {/* 배경 레이어 */}
        <div className="bg-day" />
        <div className={`bg-night${phase === "opening" || phase === "night" ? " visible" : ""}`} />

        {/* 커튼 */}
        <div className={`curtain${phase === "closing" || phase === "opening" ? ` ${phase}` : ""}`} />

        {/* ── night 이후에만 렌더 ── */}
        {showUI && (
          <>
            {/* 네비게이션 */}
            <nav className="nav">
              <div className="nav-logo">✦ MONSTER MANSION ✦</div>
              <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="메뉴">
                <span /><span /><span />
              </button>
            </nav>

            {/* 핫스팟 */}
            {SPOTS.map((spot, i) => (
              <div
                key={spot.id}
                className="spot"
                style={{ ...spot.style, animationDelay: `${i * 0.08}s` }}
                onClick={() => setCurrentPage(spot.id)}
              >
                <div className="spot-ring">{spot.emoji}</div>
                <div className="spot-label">{spot.label}</div>
              </div>
            ))}
          </>
        )}

        {/* 페이지 오버레이 */}
        {currentPage && (
          <div className="page">
            <div className="page-header">
              <button className="back-btn" onClick={() => setCurrentPage(null)}>←</button>
              <div className="page-title">
                {PAGES[currentPage].emoji} {PAGES[currentPage].title}
              </div>
            </div>
            {PAGES[currentPage].content}
          </div>
        )}

        {/* 사이드 메뉴 */}
        {menuOpen && (
          <div className="menu">
            <button className="menu-close" onClick={() => setMenuOpen(false)}>✕</button>
            {MENU_ITEMS.map((item) =>
              item.href ? (
                <Link key={item.id} href={item.href} className="menu-item" onClick={() => setMenuOpen(false)}>
                  <span>{item.emoji}</span> {item.label}
                </Link>
              ) : (
                <div
                  key={item.id}
                  className="menu-item"
                  onClick={() => {
                    if (item.id in PAGES) setCurrentPage(item.id as PageId);
                    setMenuOpen(false);
                  }}
                >
                  <span>{item.emoji}</span> {item.label}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}