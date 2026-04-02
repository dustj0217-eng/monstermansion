"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const MAP_IMAGE = "/images/map.png";
const MAP_W = 1000;
const MAP_H = 1000;

const INITIAL_CENTER = { x: 500, y: 500 };

const MIN_SCALE = 1;
const MAX_SCALE = 2.5;

const SPOTS = [
  { label: "몬스터 맨션", x: 500, y: 500, href: "/" },
  { label: "고등학교", x: 845, y: 720, href: "/school" },
  { label: "대학교", x: 120, y: 840, href: "/university" },
  { label: "회사", x: 750, y: 180, href: "/company" },
];

export default function MapPage() {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startOX: 0,
    startOY: 0,
  });

  const pinch = useRef({
    active: false,
    startDist: 0,
    startScale: 1,
  });

  // clamp
  const clamp = (x: number, y: number, s = scale) => {
    const el = viewportRef.current;
    if (!el) return { x, y };

    const { width, height } = el.getBoundingClientRect();

    const mapW = MAP_W * s;
    const mapH = MAP_H * s;

    const minX = width - mapW;
    const minY = height - mapH;

    return {
      x: mapW < width ? (width - mapW) / 2 : Math.min(0, Math.max(minX, x)),
      y: mapH < height ? (height - mapH) / 2 : Math.min(0, Math.max(minY, y)),
    };
  };

  // 초기 위치
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const { width, height } = el.getBoundingClientRect();

    const initial = {
      x: width / 2 - INITIAL_CENTER.x,
      y: height / 2 - INITIAL_CENTER.y,
    };

    setOffset(clamp(initial.x, initial.y, 1));
  }, []);

  // 거리 계산 (핀치)
  const getDist = (t1: any, t2: any) => {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      drag.current = {
        active: true,
        startX: t.clientX,
        startY: t.clientY,
        startOX: offset.x,
        startOY: offset.y,
      };
    }

    if (e.touches.length === 2) {
      pinch.current = {
        active: true,
        startDist: getDist(e.touches[0], e.touches[1]),
        startScale: scale,
      };
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (pinch.current.active && e.touches.length === 2) {
      const dist = getDist(e.touches[0], e.touches[1]);

      let nextScale =
        pinch.current.startScale * (dist / pinch.current.startDist);

      nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));

      setScale(nextScale);
      setOffset((prev) => clamp(prev.x, prev.y, nextScale));
      return;
    }

    if (drag.current.active && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = t.clientX - drag.current.startX;
      const dy = t.clientY - drag.current.startY;

      setOffset(
        clamp(
          drag.current.startOX + dx,
          drag.current.startOY + dy
        )
      );
    }
  };

  const onTouchEnd = () => {
    drag.current.active = false;
    pinch.current.active = false;
  };

  useEffect(() => {
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [scale]);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          display: flex;
          justify-content: center;
          background: #000;
        }

        .viewport {
          width: 100%;
          max-width: 430px;
          height: 100dvh;
          overflow: hidden;
          touch-action: none;
          position: relative;
          background: #000;
        }

        .map {
          position: absolute;
          width: ${MAP_W}px;
          height: ${MAP_H}px;
          background-image: url(${MAP_IMAGE});
          background-size: cover;
          background-position: center;
          transform-origin: top left;
        }

        .spot {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }

        .label {
          background: rgba(0,0,0,0.75);
          color: white;
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }

        .dot {
          width: 10px;
          height: 10px;
          background: #c9a7f5;
          border-radius: 50%;
          position: relative;
        }

        .dot::before,
        .dot::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(201,167,245,0.8);
          animation: ripple 2s infinite;
        }

        .dot::after {
          animation-delay: 1s;
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>

      <div
        ref={viewportRef}
        className="viewport"
        onTouchStart={onTouchStart}
      >
        <div
          className="map"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          {SPOTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="spot"
              style={{ left: s.x, top: s.y }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="label">{s.label}</div>
              <div className="dot" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}