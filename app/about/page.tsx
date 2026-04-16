"use client";

import { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";

/* ─── DATA ─── */
const DEV_LOG = [
  { date: "2026.01", label: "기획 시작", desc: "몬스터 맨션 설정 구상, 코어 루프 설계" },
  { date: "2026.03", label: "프로토타입", desc: "맨션 경영 시스템 첫 빌드, 입주민 캐릭터 빌딩 초안" },
  { date: "2026.04", label: "알파 테스트", desc: "조합 충돌 밸런싱, 엔딩 분기 설계 완료" },
];

/* ─── HOOK ─── */
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

/* ─── PAGE ─── */
export default function MonsterMansionPage() {
  const [worldExpanded, setWorldExpanded] = useState(false);
  const featureSection = useInView();
  const worldSection   = useInView();
  const devSection     = useInView();

  return (
    <>
      <style>{CSS}</style>
      <main className="root">
        <NavBar variant="back" backHref="/lobby" backLabel="LOBBY" />

        {/* ══ HERO ══ */}
        <section className="hero">
          {/* 키아트: 첫눈에 장르 파악 */}
          <div className="hero-keyart">
            <img
              src="/images/일러스트.jpg"
              alt="Monster Mansion 키아트"
              className="keyart-img"
            />
            <div className="keyart-overlay">
              <p className="keyart-genre">맨션 경영 · 캐릭터 공략 · 엔딩 수집</p>
            </div>
          </div>

          {/* 게임 한줄 소개 */}
          <div className="hero-intro">
            <p className="intro-catch">
              어느 날, 당신은 <br />
              <em>몬스터 전용 맨션</em>의 <br />
              주인이 되었습니다.
            </p>
            <p className="intro-sub">
              낮엔 평범한 이웃, 밤엔 각자의 본모습을 숨기고 사는 입주민들 —<br />
              그들의 결점을 파악하고, 방을 배정하고, 맨션을 운영하세요.
            </p>
            <div className="intro-tags">
              <span className="tag tag-orange">맨션 경영</span>
              <span className="tag tag-purple">결점 공략</span>
              <span className="tag tag-gray">다양한 엔딩</span>
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section className="section" ref={featureSection.ref}>
          <div
            className="section-inner fade-up"
            style={{ opacity: featureSection.visible ? 1 : 0, transform: featureSection.visible ? "none" : "translateY(28px)" }}
          >
            {/* 두 번째 일러스트 — 캐릭터들 한눈에 */}
            <img
              src="/images/일러스트2.png"
              alt="Monster Mansion 입주민 캐릭터들"
              className="chars-img"
            />
            <p className="chars-caption">
              뱀파이어, 메두사, 미라, 마녀, 좀비… 개성 넘치는 입주민들이 기다리고 있어요.</p>

            <img
              src="/images/게임 화면.jpg"
              alt="Monster Mansion 게임 화면"
              className="game-img"
            />
            <p className="chars-caption">
              <br />집을 잘 꾸며서 광고하고 입주민을 받아 맨션을 경영할 수 있습니다.</p>
            <img
              src="/images/게임 화면2.jpg"
              alt="Monster Mansion 게임 화면2"
              className="game2-img"
            />
            <p className="chars-caption">
              <br />여러 캐릭터들을 만나고, 흥미로운 스토리를 탐색해 보세요.</p>

            <div className="features">
              <div className="feature">
                <div className="feature-num">01</div>
                <h3 className="feature-title">맨션 경영</h3>
                <p className="feature-desc">방 배정, 시설 관리, 입주민 불만 해소. 방치하면 맨션이 무너져요.</p>
              </div>
              <div className="feature">
                <div className="feature-num">02</div>
                <h3 className="feature-title">결점 관리</h3>
                <p className="feature-desc">각 입주민의 숨겨진 본모습과 결점을 파악하는 것이 핵심. 세상에 완벽한 몬스터는 없으니까요.</p>
              </div>
              <div className="feature">
                <div className="feature-num">03</div>
                <h3 className="feature-title">엔딩 수집</h3>
                <p className="feature-desc">경영 점수와 공략 결과를 합산해 엔딩이 결정됩니다. 좋은 집주인이 될 수도, 쫓겨날 수도.</p>
              </div>
            </div>

            <div className="combo-tip">
              <span className="combo-label">조합 예시</span>
              <span>뱀파이어 + 늑대인간을 같은 층에 두면… 말리기 힘들어질 수 있어요. 자세한 입주민 정보는 캐릭터 페이지에서 확인하세요!</span>
            </div>
          </div>
        </section>

        {/* ══ WORLD ══ */}
        <section className="section section-tinted" id="world" ref={worldSection.ref}>
          <div
            className="section-inner fade-up"
            style={{ opacity: worldSection.visible ? 1 : 0, transform: worldSection.visible ? "none" : "translateY(28px)" }}
          >
            <span className="section-label">세계관</span>
            <p className="section-body">
              수백 년 전, <strong>몬스터 의회</strong>의 결정으로 몬스터들은 인간 세계에서 모습을 감추었습니다.
              많은 몬스터들이 자신들만의 터전을 꾸려 꼭꼭 숨어들었지만,
              인간 세계에 나가 사는 몬스터들도 있는 만큼 그들을 위한 거주 공간이 필요했습니다.<br /><br />
              그 중 하나가 바로 이 몬스터 맨션입니다.
            </p>

            <button className="expand-btn" onClick={() => setWorldExpanded(!worldExpanded)}>
              {worldExpanded ? "접기" : "세계관 더 보기"}
            </button>

            {worldExpanded && (
              <div className="world-extra">
                <p>
                  많은 인간들의 오해와는 달리, 몬스터들은 딱히 인간에게 해를 끼친 적이 별로 없습니다.
                  그저 지나다니는 몬스터들을 보고 인간들이 무서워하고 도망치곤 했던 것이죠.<br /><br />
                  그러나 점점 인간들은 위협적이 되어 갔습니다.
                  날카로운 쇠붙이를 들던 인간들은, 이제는 불과 뇌성을 뿜으며 몬스터들을 위협했습니다.<br /><br />
                  이에, 가장 현명한 몬스터들로 구성된 몬스터 의회는, 몬스터들의 정체를 철저히 숨기기로 결의했습니다.
                  최근에는 더 이상 답답하게 살지 말자고 주장하는 과격한 몬스터들도 종종 있긴 합니다만…
                  몬스터들은 대체로 이 체제 아래에서, 가끔 인간인 척 인간들과 교류하며 평범하게 살아가는 중입니다.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ══ DEV LOG ══ */}
        <section className="section" id="dev" ref={devSection.ref}>
          <div
            className="section-inner fade-up"
            style={{ opacity: devSection.visible ? 1 : 0, transform: devSection.visible ? "none" : "translateY(28px)" }}
          >
            <span className="section-label">개발 과정</span>
            <div className="timeline">
              <div className="timeline-line" />
              {DEV_LOG.map((item, idx) => (
                <div
                  key={item.date}
                  className="tl-item"
                  style={{
                    opacity: devSection.visible ? 1 : 0,
                    transform: devSection.visible ? "none" : "translateY(20px)",
                    transition: `opacity 0.5s ease ${idx * 0.1}s, transform 0.5s ease ${idx * 0.1}s`,
                  }}
                >
                  <div className="tl-date">{item.date}</div>
                  <div className="tl-dot" />
                  <div>
                    <div className="tl-label">{item.label}</div>
                    <div className="tl-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="dev-note">현재 캐릭터 아트 &amp; 빌딩 작업 중 · 개발 블로그 준비 중</p>
            <img
              src="/images/초기 낙서.jpg"
              alt="초기 낙서"
              className="drawing-img"
              style={{padding: "30px 0 0 0"}}
            />
            <p className="chars-caption">
              <br />캐릭터 아트 초기 시안 예시</p>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="footer">
          <div className="footer-logo">Monster Mansion</div>
          <p className="footer-copy">© 2025 Monster Mansion. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}

/* ─── CSS ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&family=Noto+Sans+KR:wght@400;500;700&display=swap');

:root {
  --bg:      #fdf8f2;
  --bg2:     #f5efe6;
  --text:    #772892;
  --muted:   rgb(118, 118, 118);
  --orange:  #ff832a;
  --purple:  #7c3aed;
  --border:  rgba(42,31,20,0.1);
  --radius:  14px;
  --ff:      'Noto Sans KR', sans-serif;
  --ff-logo: 'Nunito', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--text); font-family: var(--ff); }
.root { overflow-x: hidden; }

/* HERO */
.hero { display: flex; flex-direction: column; }

.hero-keyart { position: relative; width: 100%; }
.keyart-img  { width: 100%; display: block; max-height: 520px; object-fit: cover; object-position: center top; }
.keyart-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 12px 20px;
  background: linear-gradient(to top, rgba(42,31,20,0.55), transparent);
}
.keyart-genre {
  font-family: var(--ff-logo);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .06em;
  color: #fff;
  text-transform: uppercase;
}

.hero-intro {
  padding: 28px 24px 32px;
  border-bottom: 1px solid var(--border);
}
.intro-catch {
  font-family: var(--ff-logo);
  font-size: clamp(20px, 5vw, 28px);
  font-weight: 900;
  line-height: 1.35;
  margin-bottom: 12px;
  color: var(--text);
}
.intro-catch em { font-style: normal; color: var(--orange); }
.intro-sub {
  font-size: 15px;
  line-height: 1.85;
  color: var(--muted);
  margin-bottom: 18px;
}
.intro-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag {
  font-size: 12px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 20px;
}
.tag-orange { background: #fff1e6; color: #c2410c; }
.tag-purple { background: #ede9fe; color: #5b21b6; }
.tag-gray   { background: #f0ede8; color: #44403c; }

/* SECTIONS */
.section { padding: 56px 24px; }
.section-tinted { background: var(--bg2); }
.section-inner { max-width: 860px; margin: 0 auto; }
.fade-up { transition: opacity 0.7s ease, transform 0.7s ease; }

.section-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--orange);
  margin-bottom: 14px;
}

.section-body {
  font-size: 15px;
  line-height: 1.9;
  color: var(--muted);
  margin-bottom: 20px;
}
.section-body strong { color: var(--text); font-weight: 700; }

/* CHARS */
.chars-img {
  width: 100%;
  border-radius: var(--radius);
  margin-bottom: 10px;
  display: block;
}
.chars-caption {
  font-size: 13px;
  color: var(--muted);
  text-align: center;
  margin-bottom: 36px;
}

/* FEATURES */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2px;
  background: var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 24px;
}
.feature        { background: var(--bg); padding: 24px 20px; }
.feature-num    { font-family: var(--ff-logo); font-size: 11px; font-weight: 700; color: var(--orange); margin-bottom: 8px; letter-spacing: .1em; }
.feature-title  { font-size: 15px; font-weight: 700; margin-bottom: 6px; color: var(--text); }
.feature-desc   { font-size: 13px; line-height: 1.75; color: var(--muted); }

.combo-tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  background: #ede9fe;
  border-radius: var(--radius);
  font-size: 13px;
  color: #4c1d95;
  line-height: 1.7;
}
.combo-label {
  background: #7c3aed;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
  margin-top: 2px;
}

/* EXPAND */
.expand-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--muted);
  font-family: var(--ff);
  font-size: 13px;
  padding: 9px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color .2s, color .2s;
}
.expand-btn:hover { border-color: var(--orange); color: var(--orange); }
.world-extra {
  margin-top: 20px;
  padding: 20px;
  background: var(--bg);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  font-size: 14px;
  line-height: 1.9;
  color: var(--muted);
}

/* TIMELINE */
.timeline { position: relative; padding-left: 28px; margin-bottom: 28px; }
.timeline-line {
  position: absolute; left: 5px; top: 6px; bottom: 6px;
  width: 1px; background: var(--border);
}
.tl-item { display: flex; gap: 16px; margin-bottom: 28px; align-items: flex-start; }
.tl-date { font-size: 11px; font-weight: 700; color: var(--orange); min-width: 54px; padding-top: 1px; letter-spacing: .05em; }
.tl-dot  { position: absolute; left: 1px; width: 9px; height: 9px; border-radius: 50%; background: var(--orange); margin-top: 3px; }
.tl-label { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.tl-desc  { font-size: 13px; color: var(--muted); line-height: 1.7; }

.dev-note {
  font-size: 13px; color: var(--muted);
  padding: 14px 18px;
  background: var(--bg2);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

/* FOOTER */
.footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 48px 24px; text-align: center; }
.footer-logo { font-family: var(--ff-logo); font-size: 22px; font-weight: 900; color: var(--orange); margin-bottom: 6px; }
.footer-copy { font-size: 12px; color: var(--muted); opacity: .6; }
`;