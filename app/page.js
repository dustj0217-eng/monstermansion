// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// app/page.js
// 루트 페이지 컴포넌트
//
// 역할:
//   1. 현재 활성 화면(screen) 상태 관리
//   2. 화면 이동 히스토리 스택 관리 (뒤로가기)
//   3. 캐릭터 패널 열림/닫힘 상태 관리
//   4. 모든 화면 컴포넌트를 동시에 렌더링하고
//      active 클래스로 현재 화면만 보이게 함
//
// 화면 전환 방식:
//   HTML 원본처럼 position:fixed + opacity 토글 방식을 유지합니다.
//   Next.js App Router의 라우팅(/characters, /episodes 등)으로
//   변환하려면 각 폴더에 page.js를 만들면 됩니다.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client'; // useState, 이벤트 핸들러 등 클라이언트 사이드 렌더링 필요

import { useState, useCallback } from 'react';

// 화면 컴포넌트들
import ScreenMain     from '../components/Screenmain';
import ScreenChars    from '../components/Screenchars';
import ScreenEpisodes from '../components/Screenepisodes';
import ScreenMap      from '../components/Screenmap';
import ScreenFollow   from '../components/Screenfollow';
import CharPanel      from '../components/Charpanel';

// ── 화면 ID 상수 ──
// 오타 방지를 위해 문자열 대신 상수로 관리
const SCREENS = {
  MAIN:     'screen-main',
  CHARS:    'screen-chars',
  EPISODES: 'screen-episodes',
  MAP:      'screen-map',
  FOLLOW:   'screen-follow',
};

export default function Page() {
  // ── 화면 히스토리 스택 ──
  // 배열의 마지막 요소가 현재 화면
  // 예: ['screen-main', 'screen-chars'] → 현재 화면: screen-chars
  const [screenHistory, setScreenHistory] = useState([SCREENS.MAIN]);

  // ── 캐릭터 패널 상태 ──
  // null: 닫힘 / 'ghosty' | 'dra' | 'may': 해당 캐릭터 패널 열림
  const [activeChar, setActiveChar] = useState(null);

  // 현재 화면 = 스택 맨 위
  const currentScreen = screenHistory[screenHistory.length - 1];

  // ── 화면 이동 함수 ──
  const goTo = useCallback((screenId) => {
    setScreenHistory((prev) => [...prev, screenId]);
  }, []);

  // ── 뒤로가기 함수 ──
  const goBack = useCallback(() => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) return prev;   // 메인에서는 뒤로가기 없음
      return prev.slice(0, -1);            // 스택에서 마지막 제거
    });
  }, []);

  // ── 캐릭터 패널 열기 ──
  const openChar = useCallback((charId) => {
    setActiveChar(charId);
  }, []);

  // ── 캐릭터 패널 닫기 ──
  const closeChar = useCallback(() => {
    setActiveChar(null);
  }, []);

  return (
    /*
      모든 화면을 동시에 렌더링합니다.
      currentScreen과 일치하는 화면만 isActive=true → opacity:1
      나머지는 opacity:0 + pointer-events:none 으로 숨겨짐
    */
    <>
      {/* 화면 1: 메인 */}
      <ScreenMain
        isActive={currentScreen === SCREENS.MAIN}
        onNavigate={goTo}
      />

      {/* 화면 2: 캐릭터 */}
      <ScreenChars
        isActive={currentScreen === SCREENS.CHARS}
        onBack={goBack}
        onCharClick={openChar}
      />

      {/* 화면 3: 에피소드 */}
      <ScreenEpisodes
        isActive={currentScreen === SCREENS.EPISODES}
        onBack={goBack}
      />

      {/* 화면 4: 지도 */}
      <ScreenMap
        isActive={currentScreen === SCREENS.MAP}
        onBack={goBack}
      />

      {/* 화면 5: 팔로우 */}
      <ScreenFollow
        isActive={currentScreen === SCREENS.FOLLOW}
        onBack={goBack}
      />

      {/* 캐릭터 상세 패널 (모든 화면 위에 레이어) */}
      <CharPanel
        charId={activeChar}
        onClose={closeChar}
      />
    </>
  );
}