"use client";

import { useState } from "react";
import Link from "next/link";
import { MENU_ITEMS } from "../lib/constants";

type NavBarProps =
  | { variant: "logo" }
  | { variant: "back"; backHref?: string; backLabel?: string };

export default function NavBar(props: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleOpen = () => {
    setMenuOpen(true);
  };

  const handleClose = () => {
    setClosing(true);

    setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 350); // 애니메이션 시간과 동일
  };

  return (
    <>
      <nav className="mm-nav">
        {props.variant === "logo" ? (
          <div className="mm-nav-logo">✦ MONSTER MANSION ✦</div>
        ) : (
          <Link href={props.backHref ?? "/"} className="mm-nav-back">
            <div className="mm-nav-back-arrow">←</div>
            {props.backLabel ?? "MAIN"}
          </Link>
        )}

        <button
          className="mm-hamburger"
          onClick={handleOpen}
          aria-label="메뉴"
        >
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && (
        <div className={`mm-menu ${closing ? "closing" : ""}`}>
          <button
            className="mm-menu-close"
            onClick={handleClose}
          >
            ✕
          </button>

          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mm-menu-item"
              onClick={handleClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}