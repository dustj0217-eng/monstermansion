"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── 색상 토큰 (기존과 동일) ──────────────────────────────
const C = {
  bg:      "#0a0418",
  card:    "#130830",
  cardAlt: "#1e0d45",
  border:  "#4c1d95",
  borderL: "#6d28d9",
  accent:  "#c4b5fd",
  accentB: "#a78bfa",
  text:    "#f0ebff",
  textSub: "#ddd0ff",
  textDim: "#9d7fea",
  textMut: "#5b3ea6",
  cta:     "#7c3aed",
} as const;

type CharacterId =
  | "vampire" | "zombie" | "mummy" | "ghost"
  | "frankenstein" | "mermaid" | "witch" | "werewolf";

interface ResidentType {
  id: CharacterId; monster: string; image: string;
  desc: string; strength: string; weakness: string; tip: string;
  compatibleWith: CharacterId; incompatibleWith: CharacterId;
}

// ── 유형 데이터 ───────────────────────────────────────────
const RESIDENT_TYPES: ResidentType[] = [
  {
    id: "vampire", monster: "뱀파이어",
    image: "/images/characters/뱀파이어.png",
    desc: "바깥에서 다 쏟아붓고 들어오는 당신은 혹시 뱀파이어? 사회생활은 나름 잘 하는데, 퇴근하면 말 걸지 마세요 모드로 전환되는 입주민. 집은 오직 회복을 위한 공간. 겉으로는 멀쩡해 보이지만 속은 늘 번아웃 직전이다.",
    strength: "일 앞에서는 누구보다 빠르고 유능하게 움직인다. 해야 할 건 한다.",
    weakness: "충전이 안 된 상태에서 뭔가를 요구받으면 감당이 안 된다. 에너지 관리가 안 되면 급격히 무너진다.",
    tip: "집에 들어오기 전에 딱 10분만 혼자만의 디컴프레션 루틴을 만들어봐. 전환이 훨씬 부드러워져.",
    compatibleWith: "ghost", incompatibleWith: "werewolf",
  },
  {
    id: "zombie", monster: "좀비",
    image: "/images/characters/좀비.png",
    desc: "매일 같은 시간에 일어나고, 정해진 동선대로 움직이는 당신은 혹시 좀비? 스케줄이 흔들리면 하루가 무너지는 것 같고, 루틴 안에 있을 때만 비로소 안심이 되는 입주민. 감정보다 효율, 즉흥보다 계획.",
    strength: "꾸준함이 최강 무기. 남들이 작심삼일 할 때 혼자 한 달째 유지하고 있다.",
    weakness: "계획이 틀어지면 필요 이상으로 흔들린다. 변수가 생기면 대처가 느리다.",
    tip: "플랜 B도 루틴으로 만들어봐. 예외 상황까지 미리 정해두면 변수가 훨씬 덜 무서워져.",
    compatibleWith: "mummy", incompatibleWith: "witch",
  },
  {
    id: "mummy", monster: "미라",
    image: "/images/characters/미라.png",
    desc: "오래된 방식, 자기만의 기준, 한번 자리 잡으면 잘 안 움직이는 당신은 혹시 미라? 새로운 것보다 익숙한 것이 편하고, 신뢰를 쌓는 데 시간이 걸리지만 한번 쌓이면 의리는 최고인 입주민.",
    strength: "흔들리지 않는 자기 페이스. 남들 시선에 크게 휘둘리지 않는다.",
    weakness: "변화 자체를 거부하다 보면 기회를 놓칠 때가 있다. 새로운 것에 대한 진입장벽이 너무 높다.",
    tip: "아주 작은 것 하나만 바꿔봐. 바꾼다고 네가 흔들리는 게 아니야.",
    compatibleWith: "zombie", incompatibleWith: "werewolf",
  },
  {
    id: "ghost", monster: "유령",
    image: "/images/characters/유령.png",
    desc: "사람들 눈에 잘 띄지 않고, 먼저 나서는 일이 거의 없는 당신은 혹시 유령? 구석에 조용히 있는데 사실 다 보고 있고, 다 느끼고 있는 입주민. 가까워지면 누구보다 섬세하게 챙겨준다.",
    strength: "관찰력과 신중함 덕에 실수가 적다. 한번 믿은 사람은 끝까지 간다.",
    weakness: "존재감이 너무 희미해서 관계에서 자꾸 뒷전이 된다. 말을 안 하면 상대는 모른다.",
    tip: "침묵이 항상 미덕은 아니야. 한 마디만 먼저 꺼내봐.",
    compatibleWith: "vampire", incompatibleWith: "werewolf",
  },
  {
    id: "frankenstein", monster: "프랑켄슈타인",
    image: "/images/characters/프랑켄슈타인.png",
    desc: "혼자 뭔가를 끊임없이 만들고 조립하는 당신은 혹시 프랑켄슈타인? 작업실 안에 있을 때 가장 행복하고, 완성되지 않은 것들로 가득 찬 공간을 좋아하는 입주민. 감정을 말보다 만든 것으로 표현하는 타입.",
    strength: "한번 시작한 건 끝을 본다. 디테일에 강하고 끈질기다.",
    weakness: "보여주기 전에 혼자 지쳐버리는 경우가 너무 많다. 완벽주의가 발목을 잡는다.",
    tip: "미완성인 채로 꺼내도 괜찮아. 같이 만드는 것도 나쁘지 않아.",
    compatibleWith: "witch", incompatibleWith: "mermaid",
  },
  {
    id: "mermaid", monster: "인어",
    image: "/images/characters/인어.png",
    desc: "사람이 좋아서 사람한테서 에너지를 얻는 당신은 혹시 인어? 집에 사람 부르는 걸 좋아하고, 관계망이 넓으며, 감정 공감 능력이 높은 입주민.",
    strength: "사람을 좋아해서 사람을 잘 안다. 관계와 소통에 탁월하다.",
    weakness: "남 챙기다가 정작 자기 감정은 쌓아둔다. 혼자 있는 시간이 길어지면 눈에 띄게 시든다.",
    tip: "들어주는 만큼 네 이야기도 해봐. 관계는 일방통행이 아니야.",
    compatibleWith: "werewolf", incompatibleWith: "frankenstein",
  },
  {
    id: "witch", monster: "마녀",
    image: "/images/characters/마녀.png",
    desc: "아이디어가 넘치고 크고 작은 사고를 치는 당신은 혹시 마녀? 계획보다 즉흥, 규칙보다 자기만의 원칙이 있는 입주민. 분위기를 주도하는 걸 좋아하고 실행력은 있지만 마무리가 가끔 약하다.",
    strength: "기획력과 실행력, 분위기 파악까지. 사람들이 자기도 모르게 따라가는 타입.",
    weakness: "내 방식이 맞다는 확신이 관계를 삐걱거리게 할 때가 있다. 마무리보다 시작이 많다.",
    tip: "레시피 없이 요리해도 될 때가 있어. 의외로 더 잘 풀릴 수도 있어.",
    compatibleWith: "frankenstein", incompatibleWith: "zombie",
  },
  {
    id: "werewolf", monster: "늑대인간",
    image: "/images/characters/늑대인간.png",
    desc: "평소엔 무난한데 어느 순간 완전히 다른 사람이 되는 당신은 혹시 늑대인간? 감정이 날씨처럼 바뀌고, 에너지가 폭발했다가 급격히 꺼지는 사이클이 뚜렷한 입주민.",
    strength: "최고의 에너자이저. 타오를 때는 누구보다 뜨겁고 추진력이 넘친다.",
    weakness: "폭발 이후 수습이 약하다. 충동적으로 저지른 것들이 나중에 발목을 잡는다.",
    tip: "에너지를 쓰기 전에 방향을 한 번만 점검해봐. 그게 전부야.",
    compatibleWith: "mermaid", incompatibleWith: "ghost",
  },
];

export default function TypesPage() {
  const [selected, setSelected] = useState<CharacterId | null>(null);
  const selectedType = RESIDENT_TYPES.find(t => t.id === selected) ?? null;

  return (
    <div style={{ background: C.bg, minHeight: "100dvh", overflowY: "auto" }}>

      {/* 헤더 */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/test"
          className="font-noto text-xs tracking-widest"
          style={{ color: C.textDim, textDecoration: "none" }}>
          ← 돌아가기
        </Link>
        <span style={{ color: C.border }}>|</span>
        <p className="font-jua text-lg" style={{ color: C.text }}>전체 입주민 유형</p>
      </div>

      <div style={{ padding: "28px 20px 60px", maxWidth: 400, margin: "0 auto" }}>

        {/* 유형 그리드 */}
        <p className="font-noto text-xs text-center tracking-widest"
          style={{ color: C.accentB, marginBottom: 20 }}>
          눌러서 자세히 보기
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {RESIDENT_TYPES.map((type) => {
            const isSelected = selected === type.id;
            return (
              <button key={type.id}
                onClick={() => setSelected(isSelected ? null : type.id)}
                className="font-jua transition-all active:scale-95"
                style={{
                  background: isSelected ? "#2d1060" : C.card,
                  border: `1.5px solid ${isSelected ? C.cta : C.border}`,
                  borderRadius: 20,
                  padding: "20px 12px 16px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  cursor: "pointer",
                  boxShadow: isSelected ? `0 0 0 1px ${C.cta}` : "none",
                  transition: "all 0.15s",
                }}>
                <img src={type.image} alt={type.monster}
                  style={{ width: 68, height: 68, objectFit: "contain" }} />
                <p className="font-jua text-base" style={{ color: isSelected ? C.accent : C.text }}>
                  {type.monster}
                </p>
              </button>
            );
          })}
        </div>

        {/* 상세 패널 */}
        {selectedType && (
          <div style={{
            marginTop: 24,
            background: C.card,
            border: `1.5px solid ${C.cta}`,
            borderRadius: 28,
            padding: "28px 22px",
            transition: "all 0.2s",
            alignItems: "center",
          }}>
            {/* 캐릭터 헤더 */}
            <p className="font-noto items-center text-center">나는 어떤 몬스터일까?</p>
            <h2 className="font-jua items-center text-center" 
            style={{ fontSize: 40, color: C.text, marginBottom: 4}}>
                {selectedType.monster}
            </h2>
            <img src={selectedType.image} alt={selectedType.monster}
            style={{ width: "100%", height: "100%", objectFit: "contain" }} />

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <div className="font-noto" style={{ color: C.textSub, fontSize: 14, lineHeight: 1.9, textAlign: "left" }}>
                <p>✦ {selectedType.desc}</p>
                <div style={{ margin: "12px 0", height: 1, background: C.cardAlt }} />
                <p style={{ color: C.accentB }}>✦ {selectedType.strength}</p>
                <div style={{ margin: "12px 0", height: 1, background: C.cardAlt }} />
                <p>✦ {selectedType.weakness}</p>
                <div style={{ margin: "12px 0", height: 1, background: C.cardAlt }} />
                <p style={{ color: C.accent }}>✦ {selectedType.tip}</p>
              </div>
            </div>

            {/* 룸메이트 궁합 */}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 20, paddingTop: 20 }}>
              <p className="font-jua" style={{ color: C.text, fontSize: 22, marginBottom: 14 }}>
                룸메이트 궁합
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "같이 살면 좋은", id: selectedType.compatibleWith },
                  { label: "같이 살면 힘든", id: selectedType.incompatibleWith },
                ].map(({ label, id }) => {
                  const t = RESIDENT_TYPES.find(r => r.id === id);
                  return (
                    <button key={label}
                      onClick={() => setSelected(id)}
                      style={{
                        flex: 1,
                        background: C.cardAlt,
                        border: `1px solid ${C.border}`,
                        borderRadius: 16,
                        padding: "14px 10px",
                        cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        transition: "all 0.15s",
                      }}>
                      <p className="font-noto" style={{ color: C.accentB, fontSize: 10, letterSpacing: "0.12em" }}>
                        {label}
                      </p>
                      <div style={{
                        width: 120, height: 120,
                        borderRadius: "50%",
                        background: C.border,
                        overflow: "hidden",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {t?.image
                          ? <img src={t.image} alt={t.monster} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          : <span style={{ fontSize: 24 }}>🌙</span>
                        }
                      </div>
                      <p className="font-jua" style={{ color: C.text, fontSize: 17 }}>{t?.monster}</p>
                      <p className="font-noto" style={{ color: C.textDim, fontSize: 10, letterSpacing: "0.08em" }}>
                        눌러서 보기 →
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
          <Link href="/test" className="font-jua"
            style={{
              fontSize: 16,
              padding: "14px 36px",
              borderRadius: 18,
              border: `2px solid ${C.cta}`,
              color: C.accent,
              textDecoration: "none",
              transition: "all 0.2s",
            }}>
            ✦ 테스트 하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
}