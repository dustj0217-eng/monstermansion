"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";
import { useInView } from "../lib/hooks";

// ─────────────────────────────────────────────
// 메인
// ─────────────────────────────────────────────
export default function StoryPage() {
  return (
    <div className="w-full max-w-[430px] min-h-dvh mx-auto overflow-x-hidden">
        <NavBar variant="back" backHref="/lobby" backLabel="LOBBY" />
        {/* 텍스트 */}
        <div
          className="flex-1 text-center transition-all duration-500"
        >
          <h3
            className="text-[22px] leading-tight"
            style={{ fontFamily: "var(--font-korean)" }}
          >
            <br/><br/><br/><br/>Comming Soon
          </h3>
          <p
            className="text-[12.5px] leading-[1.8] mt-2 whitespace-pre-line overflow-hidden"
            style={{
              color: "rgba(255,255,255,0.55)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            곧 업로드될 예정입니다.
          </p>
        </div>
    </div>
  );
}