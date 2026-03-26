// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ScreenMain.js
// 화면1: 메인 화면
// - 맨션 외관 배경 이미지 영역
// - 4개의 노드(버튼)로 각 섹션 진입
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import TopBar from './TopBar';
import styles from './ScreenMain.module.css';

// ── 노드 버튼 데이터 ──
// 추후 노드 추가/수정 시 이 배열만 편집하면 됩니다
const NODES = [
  {
    id: 'characters',
    label: '캐릭터',
    circleText: '캐릭터\n소개',
    screen: 'screen-chars',
    style: { top: '30%', left: '10%' },   // 배경 이미지에 맞게 위치 조정 가능
  },
  {
    id: 'episodes',
    label: '에피소드',
    circleText: '에피소드',
    screen: 'screen-episodes',
    style: { top: '55%', left: '58%' },
  },
  {
    id: 'map',
    label: '지도',
    circleText: '맨션\n지도',
    screen: 'screen-map',
    style: { top: '38%', left: '42%' },
  },
  {
    id: 'follow',
    label: '팔로우',
    circleText: 'SNS',
    screen: 'screen-follow',
    style: { bottom: '100px', right: '10%' },
  },
];

export default function ScreenMain({ isActive, onNavigate }) {
  return (
    <div className={`screen ${isActive ? 'active' : ''}`} id="screen-main">
      {/* 배경 이미지 영역 — public/images/mansion-exterior.jpg 등으로 교체 */}
      <div className={styles.bg} />

      {/* 상단 로고 (뒤로가기 없음) */}
      <TopBar
        enTitle="MONSTER MANSION · 301"
        krTitle="몬스터<br>맨션"
      />

      {/* 배경 이미지 힌트 (실제 이미지 추가 후 삭제) */}
      <p className={styles.bgHint}>[맨션 외관 배경 이미지]</p>

      {/* 노드 버튼들 */}
      {NODES.map((node) => (
        <button
          key={node.id}
          className={styles.node}
          style={node.style}
          onClick={() => onNavigate(node.screen)}   // 부모(page.js)에 화면 전환 요청
        >
          {/* 원형 버튼 — 줄바꿈(\n)을 <br>로 변환 */}
          <div
            className={styles.nodeCircle}
            dangerouslySetInnerHTML={{
              __html: node.circleText.replace(/\n/g, '<br>'),
            }}
          />
          {/* 버튼 아래 레이블 */}
          <span className={styles.nodeLabel}>{node.label}</span>
        </button>
      ))}
    </div>
  );
}