import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monster Mansion",
  description: "몬스터들이 사는 맨션",
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