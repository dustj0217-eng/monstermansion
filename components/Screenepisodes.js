// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ScreenEpisodes.js
// 화면3: 에피소드 목록 (2열 그리드)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import TopBar from './TopBar';
import styles from './ScreenEpisodes.module.css';

// ── 에피소드 데이터 ──
// 에피소드 추가 시 이 배열에만 추가하면 됩니다
const EPISODES = [
  { num: '01', title: '우리 집에 왜 왔어',  thumb: null },
  { num: '02', title: '냉장고 분쟁',        thumb: null },
  { num: '03', title: '관리비는 누가 내',   thumb: null },
  { num: '04', title: '마늘빵 사건',        thumb: null },
  { num: '05', title: '준비 중',            thumb: null, upcoming: true },
  { num: '06', title: '준비 중',            thumb: null, upcoming: true },
];

export default function ScreenEpisodes({ isActive, onBack }) {
  return (
    /*
      에피소드 화면은 스크롤이 필요하므로 screen-scrollable 추가
      position: fixed + overflow-y: auto 조합으로 전체화면 스크롤
    */
    <div
      className={`screen screen-scrollable ${isActive ? 'active' : ''}`}
      id="screen-episodes"
    >
      {/* ── 헤더 (스크롤되어 올라가는 고정 헤더가 아닌 일반 헤더) ── */}
      <div className={styles.epHeader}>
        <div className={styles.epHeaderRow}>
          <div>
            <p className={styles.epSectionTag}>EPISODE</p>
            <h2 className={styles.epSectionTitle}>에피소드</h2>
          </div>
          {/* 뒤로가기 버튼 */}
          <button className="back-btn" onClick={onBack}>← 뒤로</button>
        </div>
      </div>

      {/* ── 2열 그리드 ── */}
      <div className={styles.epGrid}>
        {EPISODES.map((ep) => (
          <div
            key={ep.num}
            className={`${styles.epCard} ${ep.upcoming ? styles.epCardUpcoming : ''}`}
            // 준비 중이 아닌 에피소드는 클릭 가능 (향후 링크/네이버웹툰 연결)
            onClick={ep.upcoming ? undefined : () => alert(`EP.${ep.num} 클릭!`)}
          >
            {/* 썸네일 영역 — 이미지 있으면 ep.thumb로 교체 */}
            <div className={styles.epThumb}>
              {ep.thumb ? (
                <img src={ep.thumb} alt={`EP.${ep.num} 썸네일`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>EP.{ep.num} 썸네일</span>
              )}
            </div>

            {/* 에피소드 정보 */}
            <div className={styles.epInfo}>
              <p className={styles.epNum}>EP. {ep.num}</p>
              <p className={styles.epName}>{ep.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}