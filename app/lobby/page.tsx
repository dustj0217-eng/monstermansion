"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────
// 배경 이미지
// ─────────────────────────────────────────────
const BG_IMAGE = "/images/lobby.jpg"; // 맨션 1층 전경 이미지

// ─────────────────────────────────────────────
// 핫스팟 — 위치는 이미지 보고 % 조정
// ─────────────────────────────────────────────
const SPOTS: { label: string; sub: string; style: React.CSSProperties; href: string }[] = [
  {
    label: "301호",
    sub: "드라큘라 외 2인",
    style: { left: "20%", top: "38%" },
    href: "/characters?room=301",
  },
  {
    label: "302호",
    sub: "헤이젤 외 1인",
    style: { right: "22%", top: "38%" },
    href: "/characters?room=302",
  },
  {
    label: "스토리",
    sub: "맨션 에피소드",
    style: { left: "44%", top: "55%" },
    href: "/story",
  },
  {
    label: "맨션 안내",
    sub: "입주 정보",
    style: { left: "12%", top: "68%" },
    href: "/about",
  },
  {
    label: "도시 지도",
    sub: "몬스터시티",
    style: { right: "10%", top: "68%" },
    href: "/map",
  },
];

// ─────────────────────────────────────────────
// 메뉴 아이템
// ─────────────────────────────────────────────
const MENU_ITEMS: { label: string; href: string }[] = [
  { label: "캐릭터",   href: "/characters" },
  { label: "스토리",   href: "/story" },
  { label: "맨션 안내", href: "/about" },
  { label: "도시 지도", href: "/map" },
  { label: "굿즈샵",   href: "/shop" },
  { label: "SNS",      href: "/follow" },
];

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
export default function LobbyPage() {
  const [ready, setReady]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 살짝 딜레이 후 UI 페이드인 — 이미지 로드 느낌
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeIn      { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInLeft { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        @keyframes spotIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,167,245,0.35) }
          50%       { box-shadow: 0 0 0 8px rgba(201,167,245,0) }
        }

        /* ── 루트 ── */
        .lobby {
          width: 100%; max-width: 430px; height: 100dvh;
          margin: 0 auto; position: relative; overflow: hidden;
          font-family: 'Nunito', sans-serif;
          background: #050210;
        }

        /* ── 배경 ── */
        .lobby-bg {
          position: absolute; inset: 0;
          background-image: url('${BG_IMAGE}');
          background-size: cover; background-position: center;
          z-index: 0;
        }
        /* 하단 그라데이션 — 핫스팟 텍스트 가독성 */
        .lobby-bg::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5,2,16,0.15) 0%,
            rgba(5,2,16,0.0) 40%,
            rgba(5,2,16,0.55) 100%
          );
        }

        /* ── 네비게이션 ── */
        .nav {
          position: absolute; top: 0; left: 0; right: 0; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(5,2,16,0.45); backdrop-filter: blur(8px);
          opacity: 0;
        }
        .nav.ready { animation: fadeIn 0.5s ease forwards; }

        .nav-back {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Fredoka One', cursive;
          font-size: 12px; color: var(--color-purple, #c9a7f5);
          letter-spacing: 1px; text-decoration: none;
        }
        .nav-back-arrow {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1.5px solid rgba(201,167,245,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #c9a7f5;
          transition: background 0.2s;
        }
        .nav-back:active .nav-back-arrow { background: rgba(201,167,245,0.15); }

        .hamburger {
          display: flex; flex-direction: column; gap: 5px;
          background: none; border: none; padding: 4px; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .hamburger span { display: block; width: 22px; height: 2px; background: #c9a7f5; border-radius: 2px; }

        /* ── 플로어 레이블 ── */
        .floor-label {
          position: absolute; bottom: 24px; left: 20px; z-index: 5;
          opacity: 0;
        }
        .floor-label.ready { animation: fadeIn 0.6s 0.3s ease forwards; }
        .floor-label-main {
          font-family: 'Fredoka One', cursive;
          font-size: 26px; color: white;
          text-shadow: 0 2px 12px rgba(0,0,0,0.6);
          line-height: 1.1;
        }
        .floor-label-sub {
          font-size: 11px; color: rgba(201,167,245,0.7);
          letter-spacing: 2px; margin-top: 4px;
        }

        /* ── 핫스팟 ── */
        .spot {
          position: absolute; z-index: 5;
          display: flex; flex-direction: column; align-items: center; gap: 7px;
          text-decoration: none; -webkit-tap-highlight-color: transparent;
          opacity: 0;
        }
        .spot.ready { animation: spotIn 0.45s ease forwards; }

        .spot-dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: #c9a7f5;
          box-shadow: 0 0 0 4px rgba(201,167,245,0.2);
          animation: pulse 2.4s ease-in-out infinite;
          transition: transform 0.15s;
        }
        .spot:active .spot-dot { transform: scale(1.3); }

        .spot-card {
          background: rgba(5,2,16,0.82);
          border: 1px solid rgba(201,167,245,0.25);
          backdrop-filter: blur(6px);
          border-radius: 10px; padding: 7px 12px;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          pointer-events: none;
        }
        .spot-label {
          font-family: 'Fredoka One', cursive;
          font-size: 13px; color: white; white-space: nowrap;
        }
        .spot-sub {
          font-size: 10px; color: rgba(201,167,245,0.6);
          white-space: nowrap;
        }

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
          font-size: 24px; color: #c9a7f5;
          background: none; border: none; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .menu-item {
          padding: 15px 0;
          border-bottom: 1px solid rgba(200,160,255,0.1);
          font-family: 'Fredoka One', cursive; font-size: 19px; color: #c9a7f5;
          text-decoration: none; display: block;
          -webkit-tap-highlight-color: transparent;
        }
        .menu-item:active { color: white; }
      `}</style>

      <div className="lobby">
        <div className="lobby-bg" />

        {/* 네비게이션 */}
        <nav className={`nav${ready ? " ready" : ""}`}>
          <Link href="/" className="nav-back">
            <div className="nav-back-arrow">←</div>
            MAIN
          </Link>
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="메뉴">
            <span /><span /><span />
          </button>
        </nav>

        {/* 핫스팟 */}
        {SPOTS.map((spot, i) => (
          <Link
            key={spot.href}
            href={spot.href}
            className={`spot${ready ? " ready" : ""}`}
            style={{ ...spot.style, animationDelay: `${0.2 + i * 0.07}s` }}
          >
            <div className="spot-card">
              <div className="spot-label">{spot.label}</div>
              <div className="spot-sub">{spot.sub}</div>
            </div>
            <div className="spot-dot" />
          </Link>
        ))}

        {/* 플로어 레이블 */}
        <div className={`floor-label${ready ? " ready" : ""}`}>
          <div className="floor-label-main">Monster Mansion</div>
          <div className="floor-label-sub">1F LOBBY</div>
        </div>

        {/* 사이드 메뉴 */}
        {menuOpen && (
          <div className="menu">
            <button className="menu-close" onClick={() => setMenuOpen(false)}>✕</button>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="menu-item"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}