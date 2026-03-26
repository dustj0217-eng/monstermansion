// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ScreenFollow.js
// 화면5: 팔로우 / SNS 링크
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import styles from './ScreenFollow.module.css';

// ── SNS 링크 데이터 ──
// href에 실제 URL 입력하세요
const FOLLOW_LINKS = [
  { name: 'Instagram',    href: 'https://instagram.com/' },
  { name: '네이버 웹툰',  href: 'https://comic.naver.com/' },
  { name: '문의 · Contact', href: 'mailto:your@email.com' },
];

export default function ScreenFollow({ isActive, onBack }) {
  return (
    <div className={`screen ${isActive ? 'active' : ''}`} id="screen-follow">
      {/* ── 헤더 ── */}
      <div className={styles.header}>
        <p className={styles.followTag}>FOLLOW</p>
        <div className={styles.titleRow}>
          <h2 className={styles.followTitle}>팔로우</h2>
          <button className="back-btn" onClick={onBack}>← 뒤로</button>
        </div>
      </div>

      {/* ── 링크 목록 ── */}
      <div className={styles.linkList}>
        {FOLLOW_LINKS.map((link) => (
          <a
            key={link.name}
            className={styles.followRow}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"   /* 보안: 새 탭에서 열릴 때 referrer 차단 */
          >
            <span className={styles.followName}>{link.name}</span>
            <span className={styles.followArr}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}