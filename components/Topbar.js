// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/TopBar.js
// 공통 상단 바 컴포넌트
// - 영문 서브타이틀 + 한글 타이틀 표시
// - 뒤로가기 버튼 (onBack prop이 있을 때만 표시)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function TopBar({ enTitle, krTitle, onBack }) {
  return (
    <div className="top-bar">
      {/* 왼쪽: 타이틀 영역 */}
      <div>
        <p className="logo-en">{enTitle}</p>
        {/* dangerouslySetInnerHTML: krTitle에 <br> 태그가 포함될 수 있어서 사용 */}
        <h1
          className="logo-kr"
          dangerouslySetInnerHTML={{ __html: krTitle }}
        />
      </div>

      {/* 오른쪽: 뒤로가기 버튼 (onBack이 없으면 렌더링 안 함) */}
      {onBack && (
        <button className="back-btn" onClick={onBack}>
          ← 뒤로
        </button>
      )}
    </div>
  );
}