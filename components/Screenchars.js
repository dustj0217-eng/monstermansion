// components/ScreenChars.js

import { useState, useEffect } from 'react';
import styles from './ScreenChars.module.css';

const CHARACTERS = [
  {
    id: 'ghosty',
    name: '고스티',
    tag: 'GHOST · 고등학생',
    desc: '이미 죽었는데 왜 학교를 다니냐면,\n그냥… 습관이다.',
    day: '반투명 상태로 등교, 결석 위기 만성',
    night: '완전 실체화, 둥둥 뜨며 제일 신남',
    // 이미지가 cover일 때 고스티(유령)는 상단 중앙 우측에 위치
    tapZone: { top: '8%', left: '52%', width: '32%', height: '5%' },
    bubble: { top: '38%', left: '28%', arrowDir: 'top' },
  },
  {
    id: 'dra',
    name: '드라',
    tag: 'VAMPIRE · 직장인',
    desc: '야근이 일상이라 밤에 강한 건\n오히려 장점이라고 생각한다.',
    day: 'UV 자켓 풀무장, 토마토 주스로 버팀',
    night: '완전 각성, 칼퇴 후 우아하게 야식',
    // 드라큘라는 왼쪽 중상단 소파에 앉아 있음
    tapZone: { top: '28%', left: '4%', width: '44%', height: '38%' },
    bubble: { top: '20%', left: '4%', arrowDir: 'bottom' },
  },
  {
    id: 'may',
    name: '메이',
    tag: 'WITCH · 대학생',
    desc: '화학과 전공.\n마법 재료랑 겹치는 게 많아서.',
    day: '후드티 입고 카페에서 과제',
    night: '마법 연습, 냄새 나는 재료로 룸메 원성',
    // 메이(마녀)는 하단 중앙에서 가마솥 앞에 앉아 있음
    tapZone: { top: '60%', left: '38%', width: '60%', height: '54%' },
    bubble: { top: '34%', left: '16%', arrowDir: 'bottom' },
  },
];

export default function ScreenChars({ isActive, onBack }) {
  const [activeId, setActiveId] = useState(null);

  const handleClose = () => setActiveId(null);

  const handleTap = (id) => {
    setActiveId(prev => prev === id ? null : id);
  };

  // Escape 키로 말풍선 닫기
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const activeChar = CHARACTERS.find(c => c.id === activeId);

  return (
    <div
      className={`screen ${isActive ? 'active' : ''}`}
      id="screen-chars"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className={styles.sceneWrapper}>
        <img
          src="/images/몬스터맨션.jpg"
          alt="몬스터 맨션"
          className={styles.sceneImg}
          onClick={handleClose}
        />

        {/* 탭존 + 파동 원 */}
        {CHARACTERS.map((char) => (
          <button
            key={char.id}
            className={`${styles.tapZone} ${activeId === char.id ? styles.tapActive : ''}`}
            style={char.tapZone}
            onClick={() => handleTap(char.id)}
            aria-label={`${char.name} 캐릭터 정보 보기`}
            aria-expanded={activeId === char.id}
          >
            <span className={styles.ripple} />
            <span className={`${styles.ripple} ${styles.ripple2}`} />
            <span className={`${styles.ripple} ${styles.ripple3}`} />
            <span className={styles.dot} />
          </button>
        ))}

        {/* 말풍선 */}
        {activeChar && (
          <div
            className={`${styles.bubble} ${styles[`arrow-${activeChar.bubble.arrowDir}`]}`}
            style={{
              top: activeChar.bubble.top,
              left: activeChar.bubble.left,
            }}
            role="dialog"
            aria-modal="false"
            aria-label={`${activeChar.name} 소개`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.bubbleClose}
              onClick={handleClose}
              aria-label="닫기"
            >✕</button>
            <p className={`${styles.bubbleTag} ${styles[activeChar.id]}`}>
              {activeChar.tag}
            </p>
            <h3 className={styles.bubbleName}>{activeChar.name}</h3>
            <p className={styles.bubbleDesc}>
              {activeChar.desc.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className={styles.dnPair}>
              <div className={styles.dnLine}>
                <span className={styles.dnK}>낮</span>
                <span className={styles.dnV}>{activeChar.day}</span>
              </div>
              <div className={styles.dnLine}>
                <span className={styles.dnK}>밤</span>
                <span className={styles.dnV}>{activeChar.night}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}