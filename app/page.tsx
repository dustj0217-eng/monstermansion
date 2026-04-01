"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "./components/NavBar";

// ─────────────────────────────────────────────
// 핫스팟
// ─────────────────────────────────────────────
const SPOTS = [
  { label: "도시 지도",  style: { left: "13%", top: "80%" },  href: "/map" },
  { label: "SNS 팔로우", style: { right: "15%", top: "25%" }, href: "/follow" },
  { label: "맨션 입장",  style: { left: "47%", top: "68%" },  href: "/lobby" },
  { label: "게임사 홈페이지",  style: { left: "15%", top: "12%" },  href: "https://studiof-ten.vercel.app/" },
] as const;

type Phase = "day" | "closing" | "opening" | "night";

// ─────────────────────────────────────────────
// 메인
// ─────────────────────────────────────────────
export default function MainPage() {
  const [phase, setPhase] = useState<Phase>("day");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // 낮 → 밤 전환 시퀀스
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("closing"), 2000);
    const t2 = setTimeout(() => setPhase("opening"), 2700);
    const t3 = setTimeout(() => setPhase("night"),   3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const showUI = phase === "night";
  const nightVisible = phase === "opening" || phase === "night";
  const curtainClass = phase === "closing" || phase === "opening" ? phase : "";

  return (
    <div className="mm-root">
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/맨션.jpg')", zIndex: 0 }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms]"
        style={{
          backgroundImage: "url('/images/맨션-밤.jpg')",
          zIndex: 1,
          opacity: nightVisible ? 1 : 0,
        }}
      />

      {/* 커튼 */}
      {curtainClass && (
        <div className={`mm-curtain ${curtainClass}`} style={{ zIndex: 50 }} />
      )}

      {/* UI */}
      {showUI && (
        <>
          <NavBar variant="logo" />

          {SPOTS.map((spot, i) => (
            <Link
              key={spot.href}
              href={spot.href}
              className="mm-spot ready"
              style={{ ...spot.style, animationDelay: `${i * 0.08}s` }}
            >
              {/* 메인은 심플 링 스타일 */}
              <div
                className="w-[38px] h-[38px] rounded-full border border-white/25 bg-white/10 backdrop-blur-sm"
                style={{ animation: "pulse-ring 2.5s ease-in-out infinite" }}
              />
              <div
                className="text-[10px] font-normal px-[10px] py-1 rounded-[5px] whitespace-nowrap"
                style={{
                  background: "rgba(5,2,16,0.9)",
                  border: "4px solid rgba(5,2,16,0.9)",
                  color: "var(--color-white)",
                }}
              >
                {spot.label}
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}