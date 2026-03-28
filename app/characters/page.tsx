// app/characters/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";

// ── 캐릭터 데이터 ──────────────────────────────
const CHARACTERS = [
  {
    id: "ghosty",
    name: "고스티",
    sub: "301호 · 유령",
    desc: "말수가 적고 표정도 별로 없지만, 사실 제일 감수성이 풍부하다. 무서운 영화를 보면 운다.",
    color: "#b8b8d4",
    // 이미지 내 위치 (%) — 중앙 기준
    cx: 58,
    cy: 28,
    w: 22,
    h: 20,
  },
  {
    id: "dra",
    name: "드라",
    sub: "301호 · 뱀파이어",
    desc: "수백 살이지만 겉모습은 20대. 항상 심각한 척하는데 사실 맨션에서 제일 소심하다.",
    color: "#e87070",
    cx: 22,
    cy: 48,
    w: 26,
    h: 36,
  },
  {
    id: "may",
    name: "메이",
    sub: "301호 · 마녀",
    desc: "핑크 머리의 꼬마 마녀. 항상 뭔가를 끓이고 있다. 만들어 놓고 본인도 뭔지 모를 때가 많다.",
    color: "#c9a7f5",
    cx: 50,
    cy: 68,
    w: 36,
    h: 30,
  },
] as const;

type CharId = (typeof CHARACTERS)[number]["id"] | null;

// ── 소개 패널 ──────────────────────────────────
function InfoPanel({
  char,
  onClose,
}: {
  char: (typeof CHARACTERS)[number];
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: `${char.cy}%`,
        // 캐릭터가 왼쪽이면 오른쪽에, 오른쪽이면 왼쪽에
        ...(char.cx < 50
          ? { left: `${char.cx + char.w + 2}%` }
          : { right: `${100 - char.cx + 2}%` }),
        transform: "translateY(-50%)",
        zIndex: 20,
        animation: "panelIn 0.2s cubic-bezier(.22,1,.36,1) both",
        maxWidth: "44%",
      }}
    >
      <div
        style={{
          background: "rgba(13, 6, 32, 0.92)",
          border: `1.5px solid ${char.color}55`,
          borderRadius: 14,
          padding: "14px 16px",
          backdropFilter: "blur(8px)",
          boxShadow: `0 4px 24px ${char.color}22`,
        }}
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            fontSize: 14,
            color: "rgba(200,180,240,0.5)",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* 이름 */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            color: char.color,
            marginBottom: 2,
          }}
        >
          {char.name}
        </p>
        <p
          style={{
            fontSize: 10,
            color: "rgba(200,180,240,0.55)",
            marginBottom: 10,
          }}
        >
          {char.sub}
        </p>
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.7,
            color: "rgba(200,180,240,0.85)",
          }}
        >
          {char.desc}
        </p>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────
export default function CharactersPage() {
  const [active, setActive] = useState<CharId>(null);

  const activeChar = CHARACTERS.find((c) => c.id === active) ?? null;

  const toggle = (id: CharId) => {
    setActive((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(calc(-50% + 8px)); }
          to   { opacity: 1; transform: translateY(-50%); }
        }
        .char-spot:active { opacity: 0.85; }
      `}</style>

      {/* 페이지 헤더 */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          padding: "14px 20px",
          background: "linear-gradient(to bottom, rgba(5,2,16,0.8) 0%, transparent 100%)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            color: "var(--color-purple)",
            textShadow: "0 0 12px rgba(168,85,247,0.4)",
          }}
        >
          캐릭터
        </p>
      </div>

      {/* 이미지 + 클릭 영역 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100dvh",
          overflow: "hidden",
        }}
        // 빈 곳 클릭하면 패널 닫기
        onClick={() => setActive(null)}
      >
        {/* 배경 이미지 — 세로 중앙 기준 */}
        <Image
          src="/images/몬스터맨션.jpg"
          alt="몬스터맨션 캐릭터들"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center center",
          }}
          priority
        />

        {/* 어두운 오버레이 (패널 뜰 때 살짝) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(5,2,16,0.15)",
            transition: "background 0.3s",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* 캐릭터 클릭 영역들 */}
        {CHARACTERS.map((char) => (
          <button
            key={char.id}
            className="char-spot"
            onClick={(e) => {
              e.stopPropagation();
              toggle(char.id);
            }}
            style={{
              position: "absolute",
              left: `${char.cx}%`,
              top: `${char.cy}%`,
              width: `${char.w}%`,
              height: `${char.h}%`,
              transform: "translate(-50%, -50%)",
              background: "transparent",
              border: active === char.id
                ? `2px solid ${char.color}88`
                : "2px solid transparent",
              borderRadius: 12,
              zIndex: 10,
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
          />
        ))}

        {/* 소개 패널 */}
        {activeChar && (
          <InfoPanel
            char={activeChar}
            onClose={() => setActive(null)}
          />
        )}
      </div>
    </>
  );
}