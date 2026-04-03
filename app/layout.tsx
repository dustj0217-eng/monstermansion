import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://monstermansion.site"),

  title: {
    default: "Monster Mansion",
    template: "%s | Monster Mansion",
  },

  description: "몬스터들이 살아가는 기묘한 맨션의 이야기",

  applicationName: "Monster Mansion",

  keywords: [
    "몬스터맨션",
    "Monster Mansion",
    "인디게임",
    "스토리 게임",
    "캐릭터",
  ],

  authors: [{ name: "Studio Forge" }],
  creator: "Studio Forge",

  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/*
          모바일 최적화 컨테이너.
          max-width 430px 로 중앙 정렬 — 데스크탑에서도 앱처럼 보임.
        */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "var(--mobile-max-width)",
            minHeight: "100dvh",
            margin: "0 auto",
            background: "var(--color-bg)",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}