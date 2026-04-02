"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import NavBar from "../components/NavBar";
import { CHARACTERS, Character, ROOMS, ROOM_COLORS } from "../lib/characters";

type Filter = "all" | "1" | "2" | "3" | "4";

const silhouetteSVG = (
  <svg viewBox="0 0 60 80" width="65%" style={{ opacity: 0.13 }}>
    <ellipse cx="30" cy="20" rx="13" ry="13" fill="white" />
    <path d="M6 80 Q6 48 30 48 Q54 48 54 80Z" fill="white" />
  </svg>
);

export default function CharactersPage() {
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const selectedChar = selected ? CHARACTERS[selected] : null;
  const visibleRooms = ROOMS.filter(
    (r) => filter === "all" || String(r.floor) === filter
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .mm-root {
          font-family: 'DM Sans', sans-serif;
        }
        .mm-card-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .mm-card-btn:hover {
          transform: translateY(-3px);
        }
        .mm-modal-card {
          animation: modalIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mm-fade-up {
          opacity: 0;
          animation: fadeUp 0.45s ease forwards;
        }
        .mm-filter-btn {
          transition: all 0.18s ease;
        }
      `}</style>

      <div
        className="mm-root"
        style={{
          minHeight: "100vh",
          background: "#08050f",
          overflowX: "hidden",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Mesh background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: `
              radial-gradient(ellipse 55% 45% at 15% 8%, rgba(110,50,200,0.22) 0%, transparent 60%),
              radial-gradient(ellipse 45% 35% at 85% 65%, rgba(50,100,200,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 40% 30% at 50% 100%, rgba(80,30,160,0.15) 0%, transparent 60%)
            `,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Noise texture */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 430,
            margin: "0 auto",
            paddingBottom: 64,
          }}
        >
          <NavBar variant="back" backHref="/lobby" backLabel="LOBBY" />

          {/* Header */}
          <div
            className="mm-fade-up"
            style={{
              paddingTop: 72,
              paddingLeft: 22,
              paddingRight: 22,
              paddingBottom: 28,
              animationDelay: "0.05s",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "3px",
                color: "rgba(160,120,255,0.5)",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              Monster Mansion
            </div>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 38,
                lineHeight: 1.05,
                color: "#fff",
                letterSpacing: "-0.5px",
                margin: 0,
                fontWeight: 400,
              }}
            >
              <em style={{ color: "rgba(180,140,255,0.92)", fontStyle: "italic" }}>
                Residents
              </em>
            </h1>
          </div>

          {/* Floor filter */}
          <div
            className="mm-fade-up"
            style={{
              paddingLeft: 22,
              paddingRight: 22,
              marginBottom: 32,
              display: "flex",
              gap: 8,
              animationDelay: "0.12s",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {(["all", "1", "2", "3", "4"] as Filter[]).map((f) => (
              <button
                key={f}
                className="mm-filter-btn"
                onClick={() => setFilter(f)}
                style={{
                  flexShrink: 0,
                  fontSize: 11,
                  letterSpacing: "1.5px",
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: `1px solid ${
                    filter === f
                      ? "rgba(160,120,255,0.6)"
                      : "rgba(255,255,255,0.1)"
                  }`,
                  background:
                    filter === f
                      ? "rgba(160,120,255,0.14)"
                      : "transparent",
                  color:
                    filter === f
                      ? "rgba(200,170,255,1)"
                      : "rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                }}
              >
                {f === "all" ? "ALL" : `${f}F`}
              </button>
            ))}
          </div>

          {/* Room sections */}
          <div style={{ paddingLeft: 22, paddingRight: 22, display: "flex", flexDirection: "column", gap: 36 }}>
            {visibleRooms.map((room, ri) => {
              const colors =
                ROOM_COLORS[room.number] ?? {
                  accent: "#ffffff",
                  glow: "rgba(255,255,255,0.1)",
                };

              return (
                <div
                  key={room.number}
                  className="mm-fade-up"
                  style={{ animationDelay: `${0.1 + ri * 0.05}s` }}
                >
                  {/* Room label row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "2px",
                        padding: "3px 9px",
                        borderRadius: 4,
                        background: colors.glow,
                        border: `1px solid ${colors.accent}44`,
                        color: colors.accent,
                        flexShrink: 0,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {room.number}호
                    </div>
                    <div
                      style={{
                        height: 1,
                        flex: 1,
                        background: `linear-gradient(to right, ${colors.accent}33, transparent)`,
                      }}
                    />
                  </div>

                  {/* Vacant */}
                  {room.vacant ? (
                    <VacantCard colors={colors} label={room.vacantLabel} />
                  ) : room.characters.length === 0 ? (
                    <VacantCard colors={colors} label="입주 예정" />
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 12,
                      }}
                    >
                      {room.characters.map((charId) => {
                        const char = CHARACTERS[charId];
                        if (!char) return null;
                        return (
                          <CharacterCard
                            key={charId}
                            char={char}
                            colors={colors}
                            isSelected={selected === charId}
                            onClick={() =>
                              setSelected(
                                selected === charId ? null : charId
                              )
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal overlay */}
        {selectedChar && (
          <CharacterModal
            char={selectedChar}
            colors={
              ROOM_COLORS[selectedChar.room] ?? {
                accent: "#fff",
                glow: "rgba(255,255,255,0.08)",
              }
            }
            onClose={handleClose}
          />
        )}
      </div>
    </>
  );
}

// ── Character Card ────────────────────────────────

function CharacterCard({
  char,
  colors,
  isSelected,
  onClick,
}: {
  char: Character;
  colors: { accent: string; glow: string };
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="mm-card-btn"
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${
          isSelected ? colors.accent + "66" : "rgba(255,255,255,0.07)"
        }`,
        background: isSelected
          ? colors.glow
          : "rgba(255,255,255,0.03)",
        boxShadow: isSelected
          ? `0 8px 28px ${colors.glow}, 0 0 0 1px ${colors.accent}22`
          : "none",
        cursor: "pointer",
        textAlign: "left",
        padding: 0,
        outline: "none",
      }}
    >
      {/* Image area */}
      <div
        style={{
          width: "100%",
          aspectRatio: "3/4",
          position: "relative",
          background: `linear-gradient(160deg, ${colors.glow}, rgba(8,5,15,0.7))`,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {char.image ? (
          <Image
            src={char.image}
            alt={char.name}
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        ) : (
          <div style={{ marginBottom: 12 }}>
            <svg viewBox="0 0 60 80" width="68%" style={{ opacity: 0.13 }}>
              <ellipse cx="30" cy="20" rx="13" ry="13" fill="white" />
              <path d="M6 80 Q6 48 30 48 Q54 48 54 80Z" fill="white" />
            </svg>
          </div>
        )}
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            bottom: 0,
            height: "55%",
            background: "linear-gradient(to top, #08050f, transparent)",
            top: "auto",
          }}
        />
      </div>

      {/* Text */}
      <div style={{ padding: "10px 13px 14px" }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 3,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {char.name}
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: colors.accent,
            opacity: 0.85,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {char.species}
        </div>
      </div>

      {/* Selected dot */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: colors.accent,
          }}
        />
      )}
    </button>
  );
}

// ── Vacant Card ───────────────────────────────────

function VacantCard({
  colors,
  label,
}: {
  colors: { accent: string; glow: string };
  label?: string;
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: "16px 18px",
        border: "1px dashed rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.015)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        style={{ opacity: 0.2, flexShrink: 0 }}
      >
        <rect
          x="3"
          y="11"
          width="18"
          height="11"
          rx="2"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M7 11V7a5 5 0 0 1 10 0v4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "2.5px",
            color: "rgba(255,255,255,0.18)",
            textTransform: "uppercase",
            marginBottom: 2,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Vacant
        </div>
        {label && (
          <div
            style={{
              fontSize: 11,
              color: colors.accent + "55",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Character Modal (centered card) ──────────────

function CharacterModal({
  char,
  colors,
  onClose,
}: {
  char: Character;
  colors: { accent: string; glow: string };
  onClose: () => void;
}) {
  return (
    <>
      {/* Dim overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(4,2,12,0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          cursor: "pointer",
        }}
      />

      {/* Centered modal card */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 51,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px",
          pointerEvents: "none",
        }}
      >
        <div
          className="mm-modal-card"
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: 340,
            maxHeight: "88vh",
            overflowY: "auto",
            borderRadius: 20,
            background: "rgba(11,6,24,0.98)",
            border: `1px solid ${colors.accent}22`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${colors.accent}11`,
            scrollbarWidth: "none",
          }}
        >
          {/* Image section — tall portrait */}
          <div
            style={{
              width: "100%",
              aspectRatio: "3/4",
              maxHeight: 280,
              position: "relative",
              background: `linear-gradient(160deg, ${colors.glow}, rgba(8,5,15,0.85))`,
              overflow: "hidden",
              borderRadius: "20px 20px 0 0",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {char.image ? (
              <Image
                src={char.image}
                alt={char.name}
                fill
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            ) : (
              <div style={{ marginBottom: 20 }}>
                <svg viewBox="0 0 60 80" width="120px" style={{ opacity: 0.15 }}>
                  <ellipse cx="30" cy="20" rx="13" ry="13" fill="white" />
                  <path d="M6 80 Q6 48 30 48 Q54 48 54 80Z" fill="white" />
                </svg>
              </div>
            )}

            {/* Gradient fade bottom */}
            <div
              style={{
                position: "absolute",
                inset: "auto 0 0 0",
                height: "50%",
                background: "linear-gradient(to top, rgba(11,6,24,1), transparent)",
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 14,
                lineHeight: 1,
                outline: "none",
                zIndex: 2,
              }}
            >
              ✕
            </button>

            {/* Room badge on image */}
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                fontSize: 10,
                letterSpacing: "2px",
                padding: "3px 9px",
                borderRadius: 4,
                background: colors.glow,
                border: `1px solid ${colors.accent}55`,
                color: colors.accent,
                fontFamily: "'DM Sans', sans-serif",
                zIndex: 2,
              }}
            >
              {char.room}호
            </div>

            {/* Name overlay at bottom of image */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "0 20px 18px",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 28,
                  lineHeight: 1.05,
                  color: "#fff",
                  fontWeight: 400,
                  letterSpacing: "-0.3px",
                  marginBottom: 2,
                }}
              >
                {char.name}
              </div>
              {char.nameEn && (
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  {char.nameEn}
                </div>
              )}
            </div>
          </div>

          {/* Info body */}
          <div style={{ padding: "20px 20px 28px" }}>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {[
                { label: "SPECIES", value: char.species },
                { label: "AGE", value: char.age },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10,
                    padding: "10px 13px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "2px",
                      color: "rgba(255,255,255,0.28)",
                      textTransform: "uppercase",
                      marginBottom: 4,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                marginBottom: 18,
              }}
            />

            {/* Bio */}
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "2.5px",
                  color: "rgba(255,255,255,0.28)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                About
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.68)",
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                }}
              >
                {char.bio}
              </p>
            </div>

            {/* Fatal flaw */}
            <div
              style={{
                borderRadius: 10,
                padding: "13px 15px",
                background: `linear-gradient(135deg, ${colors.glow}, rgba(8,5,15,0.4))`,
                border: `1px solid ${colors.accent}33`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: colors.accent,
                  opacity: 0.75,
                  marginBottom: 5,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ⚠ Fatal Flaw
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                }}
              >
                {char.flaw}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}