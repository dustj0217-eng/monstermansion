// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// app/layout.js
// 루트 레이아웃: 모든 페이지를 감싸는 최상위 컴포넌트
// - 구글 폰트 (Next.js next/font 방식으로 최적화 로드)
// - 전역 메타태그 설정
// - globals.css 적용
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Noto_Sans_KR, Noto_Serif_KR, Cinzel } from 'next/font/google';
import './globals.css';

// ── Google Fonts 설정 ──
// next/font를 쓰면 빌드 시점에 폰트를 다운로드해서 최적화합니다
// (기존 HTML의 <link rel="preconnect"> 방식보다 빠름)

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400'],             // 가벼운 웨이트만 로드
  variable: '--font-noto-sans',       // CSS 변수로 사용
  display: 'swap',                    // 폰트 로드 전 fallback 표시
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-noto-serif',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-cinzel',
  display: 'swap',
});

// ── 메타태그 설정 ──
// Next.js App Router에서는 metadata 객체로 <head> 내용을 관리합니다
export const metadata = {
  title: '몬스터 맨션 · Monster Mansion 301',
  description: '고스티, 드라, 메이가 함께 사는 몬스터 맨션 301호 웹툰',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
};

// ── 루트 레이아웃 컴포넌트 ──
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      {/*
        className에 폰트 variable들을 전달합니다.
        → CSS에서 var(--font-cinzel) 등으로 사용 가능
      */}
      <body className={`${notoSansKR.variable} ${notoSerifKR.variable} ${cinzel.variable}`}
            style={{ fontFamily: 'var(--font-noto-sans), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}