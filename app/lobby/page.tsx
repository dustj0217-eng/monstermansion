"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";

// ─────────────────────────────────────────────
// 핫스팟
// ─────────────────────────────────────────────
const SPOTS = [
  { label: "301호",    sub: "드라큘라 외 2인",  style: { left: "20%",  top: "38%" }, href: "/characters?room=301" },
  { label: "302호",    sub: "헤이젤 외 1인",    style: { right: "22%", top: "38%" }, href: "/characters?room=302" },
  { label: "스토리",   sub: "맨션 에피소드",    style: { left: "44%",  top: "55%" }, href: "/story" },
  { label: "맨션 안내", sub: "입주 정보",        style: { left: "12%",  top: "68%" }, href: "/about" },
  { label: "도시 지도", sub: "몬스터시티",       style: { right: "10%", top: "68%" }, href: "/map" },
] as const;

// ─────────────────────────────────────────────
// 메인
// ─────────────────────────────────────────────
export default function LobbyPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mm-root">
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/lobby.jpg')" }}
      />
      {/* 하단 그라데이션 */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(5,2,16,0.15) 0%, transparent 40%, rgba(5,2,16,0.55) 100%)",
        }}
      />

      <NavBar variant="back" backHref="/" backLabel="MAIN" />

      {/* 핫스팟 */}
      {SPOTS.map((spot, i) => (
        <Link
          key={spot.href}
          href={spot.href}
          className={`mm-spot${ready ? " ready" : ""}`}
          style={{ ...spot.style, animationDelay: `${0.2 + i * 0.07}s` }}
        >
          <div className="mm-spot-card">
            <div className="mm-spot-label">{spot.label}</div>
            <div className="mm-spot-sub">{spot.sub}</div>
          </div>
          <div className="mm-spot-dot" />
        </Link>
      ))}

      {/* 플로어 레이블 */}
      <div
        className="absolute bottom-6 left-5 z-[5]"
        style={{ opacity: 0, animation: ready ? "fadeIn 0.6s 0.3s ease forwards" : "none" }}
      >
        <div
          className="text-[26px] text-white leading-tight"
          style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          Monster Mansion
        </div>
        <div className="text-[11px] mt-1 tracking-[2px]" style={{ color: "rgba(201,167,245,0.7)" }}>
          1F LOBBY
        </div>
      </div>
    </div>
  );
}