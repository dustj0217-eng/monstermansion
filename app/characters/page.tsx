"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import NavBar from "../components/NavBar";
import { CHARACTERS, Character } from "../lib/characters";

const ALL_CHARS = Object.values(CHARACTERS);

export default function CharactersPage() {
  const [slideIndex, setSlideIndex] = useState<number | null>(null);

  const openSlide = useCallback((idx: number) => setSlideIndex(idx), []);
  const closeSlide = useCallback(() => setSlideIndex(null), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .mm-root {
          font-family: 'DM Sans', sans-serif;
          background: #07040e;
          min-height: 100vh;
        }

        /* ── Grid ── */
        .grid-item {
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 3/4;
          background: #0d0818;
          border: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.2s, transform 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .grid-item:active {
          transform: scale(0.96);
          border-color: rgba(255,255,255,0.18);
        }
        .grid-item-name {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 32px 12px 14px;
          background: linear-gradient(to top, rgba(4,2,10,0.95) 0%, transparent 100%);
        }

        /* ── Slide view ── */
        .slide-root {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: #07040e;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .slide-track {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .slide-panel {
          min-width: 100%;
          height: 100%;
          overflow-y: auto;
          scroll-snap-align: start;
          scrollbar-width: none;
        }
        .slide-panel::-webkit-scrollbar { display: none; }

        /* slide-in animation */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-root {
          animation: slideUp 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* ── Fade in grid items ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .grid-item {
          opacity: 0;
          animation: fadeUp 0.4s ease forwards;
        }

        /* ── Slide nav arrows ── */
        .slide-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px 20px;
          gap: 12px;
          flex-shrink: 0;
        }
        .nav-arrow {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }
        .nav-arrow:active { background: rgba(255,255,255,0.12); }
        .nav-arrow:disabled { opacity: 0.2; cursor: default; }
        .nav-counter {
          font-size: 12px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="mm-root">
        {slideIndex === null ? (
          <GridView onOpen={openSlide} />
        ) : (
          <SlideView
            initialIndex={slideIndex}
            onClose={closeSlide}
          />
        )}
      </div>
    </>
  );
}

/* ════════════════════════════════════════
   GRID VIEW
════════════════════════════════════════ */
function GridView({ onOpen }: { onOpen: (idx: number) => void }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: 60 }}>
      <NavBar variant="back" backHref="/lobby" backLabel="LOBBY" />

      {/* Header */}
      <div style={{ padding: "72px 22px 28px" }}>
        <div style={{
          fontSize: 10, letterSpacing: "3px",
          color: "rgba(160,120,255,0.45)", marginBottom: 8,
          textTransform: "uppercase",
        }}>
          Monster Mansion
        </div>
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 34, fontWeight: 400,
          color: "#fff", letterSpacing: "1px", lineHeight: 1.1,
        }}>
          Residents
        </h1>
        <div style={{
          marginTop: 10, fontSize: 12,
          color: "rgba(255,255,255,0.25)", letterSpacing: "0.5px",
        }}>
          {ALL_CHARS.length}명의 입주민
        </div>
      </div>

      {/* Grid */}
      <div style={{
        padding: "0 16px",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 12,
      }}>
        {ALL_CHARS.map((char, idx) => (
          <GridCard
            key={char.id}
            char={char}
            idx={idx}
            onClick={() => onOpen(idx)}
          />
        ))}
      </div>
    </div>
  );
}

function GridCard({
  char, idx, onClick,
}: {
  char: Character; idx: number; onClick: () => void;
}) {
  return (
    <div
      className="grid-item"
      style={{ animationDelay: `${idx * 0.04}s` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {char.image ? (
        <Image
          src={char.image}
          alt={char.name}
          fill
          style={{ objectFit: "cover", objectPosition: "top center" }}
          sizes="50vw"
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg viewBox="0 0 60 80" width="55%" style={{ opacity: 0.1 }}>
            <ellipse cx="30" cy="20" rx="13" ry="13" fill="white" />
            <path d="M6 80 Q6 48 30 48 Q54 48 54 80Z" fill="white" />
          </svg>
        </div>
      )}
      <div className="grid-item-name">
        <div style={{
          fontSize: 14, fontWeight: 500,
          color: "#fff", lineHeight: 1.2, marginBottom: 3,
        }}>
          {char.name}
        </div>
        <div style={{
          fontSize: 10, textTransform: "uppercase",
          color: "rgba(200,170,255,0.7)", letterSpacing: "1px",
        }}>
          {char.species}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SLIDE VIEW
════════════════════════════════════════ */
function SlideView({
  initialIndex,
  onClose,
}: {
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const trackRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const goTo = useCallback((idx: number) => {
    if (isAnimating.current) return;
    if (idx < 0 || idx >= ALL_CHARS.length) return;
    isAnimating.current = true;
    setCurrent(idx);
    setTimeout(() => { isAnimating.current = false; }, 350);
  }, []);

  // swipe handling
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dy > 60) return; // vertical scroll — ignore
    if (dx < -50) goTo(current + 1);
    else if (dx > 50) goTo(current - 1);
  };

  const char = ALL_CHARS[current];

  return (
    <div className="slide-root">
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "56px 20px 16px",
        gap: 12, flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.55)", fontSize: 13,
            letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "8px 0",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          목록
        </button>
      </div>

      {/* Slide content */}
      <div
        ref={trackRef}
        className="slide-track"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ flex: 1, overflow: "hidden" }}
      >
        <SlidePanel char={char} key={char.id} />
      </div>

      {/* Bottom nav */}
      <div className="slide-nav">
        <button
          className="nav-arrow"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          aria-label="이전"
        >
          ←
        </button>
        <span className="nav-counter">
          {current + 1} / {ALL_CHARS.length}
        </span>
        <button
          className="nav-arrow"
          onClick={() => goTo(current + 1)}
          disabled={current === ALL_CHARS.length - 1}
          aria-label="다음"
        >
          →
        </button>
      </div>
    </div>
  );
}

/* ── Single slide panel ── */
function SlidePanel({ char }: { char: Character }) {
  return (
    <div
      className="slide-panel"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Portrait image — tall */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        maxHeight: "55vh",
        flexShrink: 0,
        background: "#ffffff",
        overflow: "hidden",
      }}>
        {char.image ? (
          <Image
            src={char.image}
            alt={char.name}
            fill
            style={{ objectFit: "contain", objectPosition: "bottom center" }}
            sizes="100vw"
            priority
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 60 80" width="160px" style={{ opacity: 0.1 }}>
              <ellipse cx="30" cy="20" rx="13" ry="13" fill="white" />
              <path d="M6 80 Q6 48 30 48 Q54 48 54 80Z" fill="white" />
            </svg>
          </div>
        )}

        {/* bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(to top, #07040e, transparent)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Info section */}
      <div style={{ padding: "4px 24px 48px", flex: 1 }}>
        {/* Name + species */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 30, fontWeight: 400,
            color: "#fff", letterSpacing: "0.5px",
            lineHeight: 1.1, marginBottom: 6,
          }}>
            {char.name}
          </h2>
          {char.nameEn && (
            <div style={{
              fontSize: 11, letterSpacing: "2px",
              color: "rgba(180,140,255,0.55)",
              textTransform: "uppercase", marginBottom: 4,
            }}>
              {char.nameEn}
            </div>
          )}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginTop: 6,
          }}>
            <span style={{
              fontSize: 11, textTransform: "uppercase", letterSpacing: "1.5px",
              color: "rgba(200,170,255,0.8)",
              background: "rgba(180,140,255,0.08)",
              border: "1px solid rgba(180,140,255,0.15)",
              borderRadius: 20, padding: "3px 12px",
            }}>
              {char.species}
            </span>
            <span style={{
              fontSize: 11, color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.5px",
            }}>
              {char.age}세
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20,
        }} />

        {/* Bio */}
        <p style={{
          fontSize: 14, lineHeight: 1.75,
          color: "rgba(255,255,255,0.72)",
          marginBottom: 20,
        }}>
          {char.bio}
        </p>

        {/* Fatal flaw */}
        <div style={{
          borderRadius: 12, padding: "14px 16px",
          background: "rgba(255,100,100,0.05)",
          border: "1px solid rgba(255,100,100,0.12)",
        }}>
          <div style={{
            fontSize: 9, letterSpacing: "2px", textTransform: "uppercase",
            color: "rgba(255,140,140,0.6)", marginBottom: 6,
          }}>
            ⚠ Fatal Flaw
          </div>
          <p style={{
            fontSize: 13, lineHeight: 1.7,
            color: "rgba(255,255,255,0.65)", fontWeight: 300,
          }}>
            {char.flaw}
          </p>
        </div>
      </div>
    </div>
  );
}