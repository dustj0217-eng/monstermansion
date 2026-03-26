// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ScreenMap.js
// 화면4: 맨션 지도 (준비 중)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import TopBar from './TopBar';

export default function ScreenMap({ isActive, onBack }) {
  return (
    <div className={`screen ${isActive ? 'active' : ''}`} id="screen-map">
      <TopBar
        enTitle="MAP"
        krTitle="맨션 지도"
        onBack={onBack}
      />

      {/* 지도 준비 중 메시지 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: 'var(--dim)',
        }}>
          준비 중
        </p>
      </div>
    </div>
  );
}