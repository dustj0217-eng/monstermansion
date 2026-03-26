// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ScreenChars.js
// 화면2: 캐릭터 화면
// - 맨션 실내 배경 위에 3개 캐릭터 스탠딩
// - 캐릭터 클릭 시 하단 패널 오픈
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import TopBar from './TopBar';
import styles from './ScreenChars.module.css';

// ── 캐릭터 배치 데이터 ──
// imgSrc: 나중에 public/images/char-ghosty.png 등으로 교체
const CHARACTERS = [
  {
    id: 'ghosty',
    name: '고스티',
    colorClass: 'dot-ghosty',          // globals.css의 유틸 클래스
    imgPlaceholder: '[고스티\nPNG]',
    position: { bottom: '100px', left: '8%' },
    imgSize: { width: '90px', height: '130px' },
    imgSrc: null,                        // 예: '/images/char-ghosty.png'
  },
  {
    id: 'dra',
    name: '드라',
    colorClass: 'dot-dra',
    imgPlaceholder: '[드라\nPNG]',
    position: { bottom: '90px', left: '50%', transform: 'translateX(-50%)' },
    imgSize: { width: '100px', height: '150px' },
    imgSrc: null,
  },
  {
    id: 'may',
    name: '메이',
    colorClass: 'dot-may',
    imgPlaceholder: '[메이\nPNG]',
    position: { bottom: '100px', right: '8%' },
    imgSize: { width: '90px', height: '130px' },
    imgSrc: null,
  },
];

export default function ScreenChars({ isActive, onBack, onCharClick }) {
  return (
    <div className={`screen ${isActive ? 'active' : ''}`} id="screen-chars">
      {/* 배경: public/images/mansion-interior.jpg 등으로 교체 */}
      <div className={styles.bg} />

      <TopBar
        enTitle="CHARACTER"
        krTitle="캐릭터"
        onBack={onBack}
      />

      {/* 배경 힌트 (임시) */}
      <p className={styles.pageHint}>[맨션 실내 배경 이미지 — 캐릭터들이 서 있는 공간]</p>

      {/* 캐릭터 스탠딩 이미지들 */}
      {CHARACTERS.map((char) => (
        <button
          key={char.id}
          className={styles.charStanding}
          style={char.position}
          onClick={() => onCharClick(char.id)}  // CharPanel 열기 요청
        >
          {/* 이미지 영역 */}
          <div
            className={`${styles.charStandingImg} ${char.colorClass}`}
            style={char.imgSize}
          >
            {char.imgSrc ? (
              // 실제 이미지가 있으면 <img> 태그로 표시
              // Next.js Image 컴포넌트로 교체하면 최적화됩니다:
              // import Image from 'next/image';
              // <Image src={char.imgSrc} alt={char.name} fill />
              <img src={char.imgSrc} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              // 이미지 없을 때 플레이스홀더 텍스트
              <span dangerouslySetInnerHTML={{ __html: char.imgPlaceholder.replace(/\n/g, '<br>') }} />
            )}
          </div>

          {/* 캐릭터 이름 */}
          <span className={`${styles.charStandingName} ${char.colorClass}`}>
            {char.name}
          </span>
        </button>
      ))}
    </div>
  );
}