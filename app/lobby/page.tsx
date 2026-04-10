"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";

const SPOTS = [
  { label: "캐릭터",     sub: "입주민 정보",  style: { left: "32%",  top: "25%" }, href: "/characters?room=301" },
  { label: "스토리",    sub: "맨션 에피소드",     style: { left: "10%",  top: "37%" }, href: "/story" },
  { label: "맨션 소개", sub: "입주 정보",         style: { left: "70%",  top: "40%" }, href: "/about" },
] as const;

type DoorPhase = "opening" | "done";

export default function LobbyPage() {
  const [ready, setReady] = useState(false);
  const [doorPhase, setDoorPhase] = useState<DoorPhase>("opening");

  useEffect(() => {
    // 문 열림 완료(650ms 애니 + 100ms 딜레이 + 여유) 후 UI 등장
    const t1 = setTimeout(() => setDoorPhase("done"), 800);
    const t2 = setTimeout(() => setReady(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="mm-root">
      {/* 배경 — /images/로비.jpg */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/로비.jpg')" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(5,2,16,0.15) 0%, transparent 40%, rgba(5,2,16,0.55) 100%)",
        }}
      />

      {/* 문 오버레이 — opening 상태일 때만 렌더 */}
      {doorPhase === "opening" && (
        <div className="mm-door-overlay opening">
          <div className="mm-door-left" />
          <div className="mm-door-right" />
        </div>
      )}

      <NavBar variant="back" backHref="/" backLabel="MAIN" />

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

      <div
        className="absolute bottom-6 left-5 z-[5]"
        style={{ opacity: 0, animation: ready ? "fadeIn 0.6s 0.3s ease forwards" : "none" }}
      >
        <div
          className="text-[26px] text-white leading-tight"
          style={{ fontFamily: "var(--font-body)", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
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