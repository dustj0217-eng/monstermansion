"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Phase = "day" | "closing" | "opening" | "night";

// ─────────────────────────────────────────────
// 핫스팟 — 추가/수정 시 여기만
// ─────────────────────────────────────────────
const SPOTS: { label: string; style: React.CSSProperties; href: string }[] = [
  { label: "도시 지도",  style: { left: "13%", top: "80%" },   href: "/map" },
  { label: "SNS 팔로우", style: { right: "15%", top: "25%" },  href: "/follow" },
  { label: "맨션 입장",  style: { left: "45%", top: "68%" },   href: "/lobby" },
];

// ─────────────────────────────────────────────
// 메뉴 아이템 — 추가/수정 시 여기만
// ─────────────────────────────────────────────
const MENU_ITEMS: { label: string; href: string }[] = [
  { label: "캐릭터", href: "/characters" },
  { label: "스토리", href: "/story" },
  { label: "굿즈샵", href: "/shop" },
  { label: "SNS",    href: "/follow" },
  { label: "소개",   href: "/about" },
];

export default function MonsterMansionPage() {
  const [phase, setPhase]       = useState<Phase>("day");
  const [menuOpen, setMenuOpen] = useState(false);

  const showUI = phase === "night";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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

        @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInLeft { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3) }
          50%       { box-shadow: 0 0 0 7px rgba(255,255,255,0) }
        }
        @keyframes curtainDown { from { transform: translateY(-100%) } to { transform: translateY(0) } }
        @keyframes curtainUp   { from { transform: translateY(0) }     to { transform: translateY(-100%) } }

        .root {
          width: 100%; max-width: 420px; height: 100dvh;
          margin: 0 auto; position: relative; overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        /* 배경 */
        .bg-day, .bg-night {
          position: absolute; inset: 0;
          background-size: cover; background-position: center; background-repeat: no-repeat;
        }
        .bg-day   { background-image: url('/images/맨션.jpg');    z-index: 0; }
        .bg-night { background-image: url('/images/맨션-밤.jpg'); z-index: 1; opacity: 0; transition: opacity 1.4s ease-in-out; }
        .bg-night.visible { opacity: 1; }

        /* 커튼 */
        .curtain {
          position: absolute; inset: 0; z-index: 50;
          background: #050210; transform: translateY(-100%); pointer-events: none;
        }
        .curtain.closing { animation: curtainDown 0.7s cubic-bezier(.4,0,.2,1) forwards; }
        .curtain.opening { animation: curtainUp   0.7s cubic-bezier(.4,0,.2,1) forwards; }

        /* 네비게이션 */
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

        /* 핫스팟 */
        .spot {
          position: absolute; z-index: 5;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          animation: fadeIn 0.4s ease forwards;
          text-decoration: none; -webkit-tap-highlight-color: transparent;
        }
        .spot-ring {
          width: 38px; height: 38px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);
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
        }

        /* 사이드 메뉴 */
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
          text-decoration: none; display: block;
          -webkit-tap-highlight-color: transparent;
        }
        .menu-item:active { color: white; }
      `}</style>

      <div className="root">
        <div className="bg-day" />
        <div className={`bg-night${phase === "opening" || phase === "night" ? " visible" : ""}`} />
        <div className={`curtain${phase === "closing" || phase === "opening" ? ` ${phase}` : ""}`} />

        {showUI && (
          <>
            <nav className="nav">
              <div className="nav-logo">✦ MONSTER MANSION ✦</div>
              <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="메뉴">
                <span /><span /><span />
              </button>
            </nav>

            {SPOTS.map((spot, i) => (
              <Link
                key={spot.href}
                href={spot.href}
                className="spot"
                style={{ ...spot.style, animationDelay: `${i * 0.08}s` }}
              >
                <div className="spot-ring" />
                <div className="spot-label">{spot.label}</div>
              </Link>
            ))}
          </>
        )}

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