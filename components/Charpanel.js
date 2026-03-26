// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/CharPanel.js
// 캐릭터 상세 패널 (하단에서 슬라이드 업)
// - 오버레이(배경 딤) + 패널 본체
// - 스와이프 다운으로 닫기 지원
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client'; // useRef, 터치 이벤트 등 클라이언트 전용 훅 사용

import { useRef, useEffect } from 'react';
import styles from './CharPanel.module.css';

// ── 캐릭터 데이터 ──
// 캐릭터 추가 시 이 객체에 추가하세요
export const CHAR_DATA = {
  ghosty: {
    tag: 'GHOST · 고등학생',
    tagClass: styles.tagGhost,            // CSS Module 클래스
    name: '고스티',
    desc: '이미 죽었는데 왜 학교를 다니냐면,\n그냥… 습관이다.',
    day: '반투명 상태로 등교, 결석 위기 만성',
    night: '완전 실체화, 둥둥 뜨며 제일 신남',
  },
  dra: {
    tag: 'VAMPIRE · 직장인',
    tagClass: styles.tagDra,
    name: '드라',
    desc: '야근이 일상이라 밤에 강한 건\n오히려 장점이라고 생각한다.',
    day: 'UV 자켓 풀무장, 토마토 주스로 버팀',
    night: '완전 각성, 칼퇴 후 우아하게 야식',
  },
  may: {
    tag: 'WITCH · 대학생',
    tagClass: styles.tagMay,
    name: '메이',
    desc: '화학과 전공.\n마법 재료랑 겹치는 게 많아서.',
    day: '후드티 입고 카페에서 과제',
    night: '마법 연습, 냄새 나는 재료로 룸메 원성',
  },
};

// ── CharPanel 컴포넌트 ──
// charId: 'ghosty' | 'dra' | 'may' | null (null이면 닫힘)
// onClose: 패널 닫기 콜백
export default function CharPanel({ charId, onClose }) {
  const panelRef = useRef(null);
  const startYRef = useRef(0);       // 터치 시작 Y 좌표 저장용

  // charId가 있으면 패널 열림, 없으면 닫힘
  const isOpen = !!charId;
  const char = charId ? CHAR_DATA[charId] : null;

  // ── 스와이프 다운으로 닫기 ──
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const handleTouchStart = (e) => {
      startYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      // 60px 이상 아래로 스와이프하면 닫기
      if (e.changedTouches[0].clientY - startYRef.current > 60) {
        onClose();
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onClose]);

  return (
    <>
      {/* ── 배경 딤 오버레이 ── */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOn : ''}`}
        onClick={onClose}   // 오버레이 클릭으로도 닫기
      />

      {/* ── 패널 본체 ── */}
      <div
        ref={panelRef}
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
      >
        {/* 상단 핸들 바 (스와이프 힌트) */}
        <div className={styles.panelHandle} />

        {/* 닫기 버튼 */}
        <button className={styles.panelClose} onClick={onClose}>✕</button>

        {/* 패널 내용 (char가 없으면 빈 상태) */}
        {char && (
          <div className={styles.panelBody}>
            {/* 태그 (종족·직업) */}
            <p className={`${styles.panelTag} ${char.tagClass}`}>{char.tag}</p>

            {/* 캐릭터 이름 */}
            <h3 className={styles.panelName}>{char.name}</h3>

            {/* 소개글 — \n을 <br>로 렌더링 */}
            <p
              className={styles.panelDesc}
              dangerouslySetInnerHTML={{ __html: char.desc.replace(/\n/g, '<br>') }}
            />

            {/* 낮/밤 행동 패턴 */}
            <div className={styles.dnPair}>
              <div className={styles.dnLine}>
                <span className={styles.dnK}>낮</span>
                <span className={styles.dnV}>{char.day}</span>
              </div>
              <div className={styles.dnLine}>
                <span className={styles.dnK}>밤</span>
                <span className={styles.dnV}>{char.night}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}