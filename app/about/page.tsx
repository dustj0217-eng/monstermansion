"use client";

import { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const DEV_LOG = [
  { date: "2026.01", label: "기획 시작", desc: "몬스터 맨션 설정 구상, 코어 루프 설계" },
  { date: "2026.03", label: "프로토타입", desc: "맨션 경영 시스템 첫 빌드, 입주민 캐릭터 빌딩 초안" },
  { date: "2026.04", label: "알파 테스트", desc: "조합 충돌 밸런싱, 엔딩 분기 설계 완료" },
];

/* ─────────────────────────────────────────────
   UTIL HOOKS
───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function Particles() {
  const items = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="particles-wrap" aria-hidden>
      {items.map((i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${(i * 37 + 7) % 100}%`,
            top: `${(i * 53 + 11) % 100}%`,
            animationDelay: `${(i * 0.4) % 6}s`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            opacity: 0.18 + (i % 4) * 0.06,
          }}
        />
      ))}
    </div>
  );
}

function TimelineItem({ item, idx, visible }: { item: typeof DEV_LOG[0]; idx: number; visible: boolean }) {
  return (
    <div
      className="timeline-item"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${idx * 0.12}s, transform 0.6s ease ${idx * 0.12}s`,
      }}
    >
      <div className="timeline-date">{item.date}</div>
      <div className="timeline-dot" />
      <div className="timeline-body">
        <div className="timeline-label">{item.label}</div>
        <div className="timeline-desc">{item.desc}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function MonsterMansionPage() {
  const [worldExpanded, setWorldExpanded] = useState(false);
  const worldSection = useInView();
  const gameSection  = useInView();
  const devSection   = useInView();

  return (
    <>
      <style>{CSS}</style>

      <main className="root">
        <NavBar variant="back" backHref="/lobby" backLabel="LOBBY" />

        {/* ── HERO ── */}
        <section className="hero">
          <Particles />
          <div className="hero-content">
            <p className="hero-eyebrow">Monster Council Decree — Year 312</p>
            <h1 className="hero-title">
              Monster<br />
              <span className="hero-accent">Mansion</span>
            </h1>
            <div className="hero-ctas">
              <a href="#game" className="btn-primary">게임 안내 보기</a>
              <a href="#dev"  className="btn-ghost">개발 로그</a>
            </div>
          </div>
          <div className="hero-mansion" aria-hidden>
            <div className="mansion-glow" />
            <div className="mansion-silhouette">🏚️</div>
            <div className="mansion-fog" />
          </div>
          <div className="hero-scroll-hint" aria-hidden>↓</div>
        </section>

        {/* ── GAME ── */}
        <section id="game" className="section section-game" ref={gameSection.ref}>
          <div
            className="section-inner"
            style={{
              opacity: gameSection.visible ? 1 : 0,
              transform: gameSection.visible ? "none" : "translateY(32px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <span className="section-tag">게임 스토리</span>

            <img
              src="/images/일러스트.jpg"
              alt="게임 스토리 이미지"
              className="w-full h-auto"
            />

            <p className="section-lead">
              <br />
              어느 날, 당신은 웬 수상한 맨션을 떠안게 되었습니다.<br />
              그 정체는 바로, 인간 세계에 나가 사는 몬스터들이 지내는 곳 중 하나인, 몬스터 맨션?!<br />
              <br />
              입주민을 누굴 받을지, 건물을 어떻게 청소하고 수리할지, 누구를 어느 층 어느 방에 배정할지는 집주인인 당신의 권한입니다.<br />
              <br />
              그러나 주의하세요! 만약 불만도가 높아지거나 안 좋은 소문이 돌기라도 한다면...<br />
              새로운 입주민 신청이 하나도 없어, 텅 빈 맨션이 되어버릴지도 몰라요.<br />
              <br />
              입주민들의 건의를 듣고, 불만을 해결하고, 다양한 엔딩을 수집해 보세요!<br />
              기묘한 맨션의 이야기, 지금 시작됩니다.
            </p>

            <div className="game-pillars">
              <div className="pillar">
                <div className="pillar-num">01</div>
                <h3>맨션 경영</h3>
                <p>방을 배정하고, 시설을 관리하고, 불만을 해소하세요! 방치하면 맨션이 무너질지도?</p>
              </div>
              <div className="pillar">
                <div className="pillar-num">02</div>
                <h3>결점 관리</h3>
                <p>입주민 각자의 결점을 파악하고 적절한 선에서 통제해야 합니다. 세상에 완벽한 몬스터는 없어요.</p>
              </div>
              <div className="pillar">
                <div className="pillar-num">04</div>
                <h3>다양한 엔딩</h3>
                <p>선택에 따라 결말은 달라진다. 좋은 맨션주인이 될 수도, 쫓겨날 수도 있다.</p>
              </div>
            </div>

            <div className="conflict-hint">
              <span className="conflict-hint-badge">조합 예시</span>
              <span>뱀파이어 + 늑대인간을 같은 층에 두면… 말리기 힘들어질 수 있어요...
                <br />
                * 더 자세한 입주민 정보는 캐릭터 페이지에서 확인해 주세요!
              </span>
            </div>
          </div>
        </section>

        {/* ── WORLD ── */}
        <section id="world" className="section section-world" ref={worldSection.ref}>
          <div
            className="section-inner"
            style={{
              opacity: worldSection.visible ? 1 : 0,
              transform: worldSection.visible ? "none" : "translateY(32px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <span className="section-tag">세계관</span>
            <p className="section-lead">
              수백 년 전, <strong>몬스터 의회</strong>의 결정으로 몬스터들은 인간 세계에서
              모습을 감추었습니다.<br />
              많은 몬스터들이 자신들만의 터전을 꾸려 꼭꼭 숨어들었습니다. 하지만...<br />
              인간 세계에 나가 사는 몬스터들도 있는 만큼, 그들을 위한 거주 공간이 필요했습니다.<br />
            </p>
            
            <img
              src="/images/일러스트2.png"
              alt="게임 스토리 이미지"
              className="w-full h-auto"
            />

            <p className="section-lead">
              <br />
              그 중 하나가 바로 이 몬스터 맨션입니다.<br />
              만약 당신이 이 맨션을 잘 운영한다면, 다른 거점들에 대해서도 알 수 있게 될지도 모르고요.
            </p>

            <button
              className="expand-btn"
              onClick={() => setWorldExpanded(!worldExpanded)}
            >
              {worldExpanded ? "세계관 접기 ↑" : "세계관 더 보기 ↓"}
            </button>

            {worldExpanded && (
              <div className="world-extra">
                <p>
                  많은 인간들의 오해와는 달리, 몬스터들은 딱히 인간에게 해를 끼친 적이 별로 없습니다.<br />
                  그저 지나다니는 몬스터들을 보고 인간들이 무서워하고 도망치곤 했던 것이죠.<br />
                  <br />
                  그러나 점점 인간들은 위협적이 되어 갔습니다.<br />
                  날카로운 쇠붙이를 들던 인간들은, 이제는 불과 뇌성을 뿜으며 몬스터들을 위협했습니다.<br />
                  <br />
                  이에, 가장 현명한 몬스터들로 구성된 몬스터 의회는, 몬스터들의 정체를 철저히 숨기기로 결의했습니다.<br />
                  몬스터들은 인간들이 잘 모르는 마법과 주술 등을 이용해 자신만의 거점을 만들어 숨어들었습니다.<br />
                  <br />
                  최근에는 더 이상 답답하게 살지 말자고 주장하는 과격한 몬스터들도 종종 있긴 합니다만...<br />
                  몬스터들은 대체로 이 체제 아래에서, 가끔 인간인 척 인간들과 교류하며 평범하게 살아가는 중입니다.<br />
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── DEV LOG ── */}
        <section id="dev" className="section section-dev" ref={devSection.ref}>
          <div
            className="section-inner"
            style={{
              opacity: devSection.visible ? 1 : 0,
              transform: devSection.visible ? "none" : "translateY(32px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <span className="section-tag">개발 과정</span>
            <div className="timeline">
              <div className="timeline-line" />
              {DEV_LOG.map((item, idx) => (
                <TimelineItem
                  key={item.date}
                  item={item}
                  idx={idx}
                  visible={devSection.visible}
                />
              ))}
            </div>

            <div className="dev-note">
              <p>현재 캐릭터 아트&빌딩 작업 중 · 개발 블로그 준비 중</p>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-title">Monster Mansion</div>
            <p className="footer-copy">© 2025 Monster Mansion. All rights reserved.</p>
          </div>
        </footer>

      </main>
    </>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Noto+Serif+KR:wght@300;400;600&display=swap');

  :root {
    --bg:        #0a0708;
    --bg2:       #120d10;
    --bg3:       #1a1118;
    --accent:    #b546ff;
    --accent2:   #c9933a;
    --text:      #e1d0e8;
    --text-muted:#8a7a6e;
    --border:    rgba(201,147,58,0.18);
    --radius:    12px;
    --ff-display:'Cinzel', serif;
    --ff-body:   'Noto Serif KR', serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: var(--bg); color: var(--text); font-family: var(--ff-body); }

  .root { overflow-x: hidden; }

  /* ── HERO ── */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background:
      radial-gradient(ellipse 60% 50% at 70% 55%, rgba(122,63,160,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 30% 40%, rgba(201,147,58,0.10) 0%, transparent 60%),
      var(--bg);
  }

  .particles-wrap { position: absolute; inset: 0; pointer-events: none; }
  .particle {
    position: absolute;
    border-radius: 50%;
    background: var(--accent);
    animation: float 8s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
    50%       { transform: translateY(-20px) scale(1.2); opacity: 0.5; }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 560px;
    padding: 0 24px;
  }
  .hero-eyebrow {
    font-family: var(--ff-display);
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
  }
  .hero-title {
    font-family: var(--ff-display);
    font-size: clamp(56px, 12vw, 96px);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 8px;
  }
  .hero-accent {
    color: var(--accent);
    -webkit-text-stroke: 1px var(--accent);
  }
  .hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

  .hero-mansion {
    position: absolute;
    right: -40px;
    bottom: 0;
    width: 420px;
    height: 420px;
    z-index: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    pointer-events: none;
  }
  .mansion-silhouette {
    font-size: 280px;
    line-height: 1;
    filter: brightness(0.15) sepia(1) saturate(0.4);
    animation: sway 6s ease-in-out infinite;
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-1deg); }
    50%       { transform: rotate(1deg); }
  }
  .mansion-glow {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,147,58,0.25) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.6; }
    50%       { transform: translateX(-50%) scale(1.3); opacity: 1; }
  }
  .mansion-fog {
    position: absolute;
    bottom: 0;
    left: 0; right: 0;
    height: 80px;
    background: linear-gradient(to top, var(--bg), transparent);
  }

  .hero-scroll-hint {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--text-muted);
    font-size: 20px;
    animation: bounce 2s ease-in-out infinite;
  }
  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(8px); }
  }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    background: var(--accent);
    color: #0a0708;
    font-family: var(--ff-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-primary:hover { background: #dba84c; transform: translateY(-2px); }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    background: transparent;
    color: var(--text);
    font-family: var(--ff-display);
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  /* ── SECTIONS ── */
  .section { padding: 100px 24px; }
  .section-inner { max-width: 900px; margin: 0 auto; }
  .section-tag {
    display: inline-block;
    font-family: var(--ff-display);
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
    border-bottom: 1px solid var(--accent);
    padding-bottom: 4px;
  }
  .section-lead {
    font-size: 17px;
    line-height: 1.9;
    color: var(--text-muted);
    max-width: 600px;
    margin-bottom: 56px;
    font-weight: 300;
  }

  /* WORLD */
  .section-world { background: var(--bg2); }

  .expand-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-family: var(--ff-body);
    font-size: 13px;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .expand-btn:hover { border-color: var(--accent); color: var(--accent); }

  .world-extra {
    margin-top: 24px;
    padding: 24px;
    background: rgba(201,147,58,0.04);
    border-left: 2px solid var(--accent);
    border-radius: 0 var(--radius) var(--radius) 0;
  }
  .world-extra p {
    font-size: 15px;
    line-height: 1.9;
    color: var(--text-muted);
    margin-bottom: 12px;
  }
  .world-extra p:last-child { margin-bottom: 0; }

  /* GAME */
  .section-game {
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }
  .section-game::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--accent), transparent);
  }

  .game-pillars {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 32px;
  }
  .pillar {
    background: var(--bg2);
    padding: 32px 24px;
    transition: background 0.2s;
  }
  .pillar:hover { background: var(--bg3); }
  .pillar-num {
    font-family: var(--ff-display);
    font-size: 11px;
    letter-spacing: 0.15em;
    color: var(--accent);
    margin-bottom: 12px;
    opacity: 0.7;
  }
  .pillar h3 {
    font-family: var(--ff-display);
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 10px;
  }
  .pillar p { font-size: 13px; line-height: 1.8; color: var(--text-muted); }

  .conflict-hint {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: rgba(122,63,160,0.12);
    border: 1px solid rgba(122,63,160,0.3);
    border-radius: var(--radius);
    font-size: 14px;
    color: var(--text-muted);
    flex-wrap: wrap;
  }
  .conflict-hint-badge {
    background: rgba(122,63,160,0.25);
    color: #c084e0;
    font-family: var(--ff-display);
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
    letter-spacing: 0.05em;
  }

  /* DEV LOG */
  .section-dev { background: var(--bg); }

  .timeline {
    position: relative;
    padding-left: 32px;
    margin-bottom: 40px;
  }
  .timeline-line {
    position: absolute;
    left: 6px; top: 8px; bottom: 8px;
    width: 1px;
    background: linear-gradient(to bottom, var(--accent), transparent);
  }
  .timeline-item {
    display: flex;
    gap: 20px;
    margin-bottom: 36px;
    align-items: flex-start;
  }
  .timeline-date {
    font-family: var(--ff-display);
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--accent);
    min-width: 60px;
    padding-top: 2px;
  }
  .timeline-dot {
    position: absolute;
    left: 2px;
    width: 9px; height: 9px;
    border-radius: 50%;
    background: var(--accent);
    margin-top: 4px;
    box-shadow: 0 0 10px rgba(201,147,58,0.5);
  }
  .timeline-label {
    font-family: var(--ff-display);
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }
  .timeline-desc {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.7;
  }

  .dev-note {
    padding: 20px 24px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.7;
  }

  /* FOOTER */
  .footer {
    background: var(--bg2);
    border-top: 1px solid var(--border);
    padding: 64px 24px;
    text-align: center;
  }
  .footer-inner { max-width: 480px; margin: 0 auto; }
  .footer-title {
    font-family: var(--ff-display);
    font-size: 24px;
    font-weight: 900;
    color: var(--accent);
    margin-bottom: 8px;
    letter-spacing: 0.05em;
  }
  .footer-copy { font-size: 12px; color: rgba(138,122,110,0.5); }
`;