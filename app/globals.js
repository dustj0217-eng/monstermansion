/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   globals.css
   전역 CSS: 리셋 + CSS 변수 + 공통 유틸 클래스
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── 박스 모델 리셋 ── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── 색상 & 폰트 CSS 변수 ── */
:root {
  --bg:      #0e0e12;   /* 전체 배경 */
  --surface: #13131a;   /* 패널/카드 배경 */
  --border:  #2a2a35;   /* 구분선 */
  --text:    #f0ede8;   /* 기본 텍스트 */
  --dim:     #55535a;   /* 흐린 텍스트 */

  /* 캐릭터별 색상 */
  --ghost: #d4d0e0;     /* 고스티 */
  --dra:   #c0392b;     /* 드라 (뱀파이어 레드) */
  --may:   #7c5cbf;     /* 메이 (마녀 퍼플) */
}

/* ── html / body 기본 설정 ── */
html, body {
  width: 100%;
  height: 100%;
  background: var(--bg);
  color: var(--text);
  /* 폰트는 layout.js에서 Next.js Google Fonts로 주입됩니다 */
  font-weight: 300;
  overflow: hidden; /* 스크롤은 각 화면 컴포넌트에서 개별 관리 */
}

/* ── 링크 기본 스타일 제거 ── */
a {
  color: inherit;
  text-decoration: none;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   화면 전환 시스템
   각 <screen> 컴포넌트에 공통 적용되는 클래스
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.screen {
  position: fixed;
  inset: 0;                /* top/right/bottom/left = 0 (전체 화면) */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;    /* 비활성 화면은 클릭 차단 */
  transition: opacity 0.25s ease;
}

/* 활성화된 화면만 보임 */
.screen.active {
  opacity: 1;
  pointer-events: all;
}

/* 에피소드 화면처럼 스크롤이 필요한 화면용 */
.screen-scrollable {
  overflow-y: auto;
  padding-bottom: 40px;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   공통: 상단 바 레이아웃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.top-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 44px 24px 0;
  z-index: 30;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

/* 영문 서브 타이틀 */
.logo-en {
  font-family: var(--font-cinzel), serif;
  font-size: 10px;
  letter-spacing: 0.22em;
  color: var(--dim);
  margin-bottom: 5px;
}

/* 한글 메인 타이틀 */
.logo-kr {
  font-family: var(--font-noto-serif), serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* 뒤로가기 버튼 */
.back-btn {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--dim);
  cursor: pointer;
  padding: 4px 0;
  -webkit-tap-highlight-color: transparent;
  background: none;
  border: none;
  font-family: inherit;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   캐릭터 컬러 포인트 유틸 클래스
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.dot-ghosty { color: var(--ghost); }
.dot-dra    { color: var(--dra); }
.dot-may    { color: var(--may); }