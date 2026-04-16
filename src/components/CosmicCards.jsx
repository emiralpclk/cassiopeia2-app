import { useState, useEffect, useMemo, useRef } from 'react';
import { calculateNatalChart } from '../utils/astrologyEngine';
import {
  analyzeChartDNA,
  generateBigThreeNarrative,
  generateStrengthsWeaknesses,
  generateLoveDNA,
  generateContradictions,
  generateDestinyCareer,
  generateRetrogradeSummary,
  analyzeKozmikImza,
} from '../utils/chartNarrative';

// ─── ELEMENT RENKLERİ ─────────────────────────────────────────
const EL_COLORS = { 'Ateş': '#ff6b35', 'Su': '#74d7ff', 'Toprak': '#6bcb77', 'Hava': '#c8a9fa' };

// ─── ORTAK STİLLER ────────────────────────────────────────────
const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  overflow: 'hidden',
  marginBottom: '10px',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
};

const cardHeaderStyle = (isOpen) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 18px',
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent',
  transition: 'background 0.3s ease',
});

const chevronStyle = (isOpen) => ({
  fontSize: '14px',
  color: 'rgba(255,255,255,0.4)',
  transition: 'transform 0.3s ease',
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
});

const sectionTitleStyle = {
  fontSize: '0.82rem',
  fontWeight: '600',
  color: '#fff',
  letterSpacing: '0.02em',
};

const sectionSubStyle = {
  fontSize: '0.7rem',
  color: 'rgba(255,255,255,0.45)',
  marginTop: '2px',
};

const educationalStyle = {
  fontSize: '0.72rem',
  color: 'rgba(255,255,255,0.4)',
  fontStyle: 'italic',
  lineHeight: '1.5',
  marginBottom: '10px',
  paddingBottom: '10px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const interpretationStyle = {
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.8)',
  lineHeight: '1.65',
};


// ═══════════════════════════════════════════════════════════════
//  AÇILIR KART BİLEŞENİ
// ═══════════════════════════════════════════════════════════════

function ExpandableCard({ icon, title, subtitle, badge, badgeColor, aurora, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, children]);

  return (
    <div style={{ ...cardStyle, position: 'relative' }}>
      {/* Aurora Glow */}
      {aurora && (
        <div className="card-aurora" style={{ '--aurora-1': aurora, '--aurora-2': aurora }} />
      )}
      <div style={cardHeaderStyle(isOpen)} onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, zIndex: 1 }}>
          <span style={{ fontSize: '16px', opacity: 0.7, flexShrink: 0 }}>{icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={sectionTitleStyle}>{title}</div>
            {subtitle && <div style={sectionSubStyle}>{subtitle}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, zIndex: 1 }}>
          {badge && (
            <span style={{
              fontSize: '0.6rem',
              color: badgeColor || 'rgba(255,255,255,0.4)',
              background: `${badgeColor || 'rgba(255,255,255,0.1)'}15`,
              padding: '2px 8px',
              borderRadius: '10px',
              letterSpacing: '0.05em',
              fontWeight: 600,
              border: `1px solid ${badgeColor || 'rgba(255,255,255,0.1)'}30`,
            }}>
              {badge}
            </span>
          )}
          <span style={chevronStyle(isOpen)}>▾</span>
        </div>
      </div>
      <div style={{
        maxHeight: isOpen ? `${contentHeight + 20}px` : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div ref={contentRef} style={{ padding: '0 18px 18px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
//  SWIPEABLE BIG 3 KARTLARI
// ═══════════════════════════════════════════════════════════════

function SwipeableCards({ cards }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => activeIndex > 0 && setActiveIndex(activeIndex - 1);
  const next = () => activeIndex < cards.length - 1 && setActiveIndex(activeIndex + 1);

  const card = cards[activeIndex];
  if (!card) return null;

  const elementColor = EL_COLORS[card.element] || '#fff';

  const arrowStyle = (disabled) => ({
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: disabled ? 'transparent' : 'rgba(255,255,255,0.06)',
    border: disabled ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
    color: disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  });

  return (
    <div>
      {/* Kart İçeriği */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '14px',
        padding: '20px 16px',
        border: `1px solid ${elementColor}18`,
        minHeight: '180px',
        transition: 'all 0.3s ease',
      }}>
        {/* Kart Başlığı */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px', color: elementColor }}>{card.icon}</span>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: elementColor, letterSpacing: '0.05em' }}>
              {card.title}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>
              {card.sign} {card.degree !== undefined ? `${card.degree}°` : ''} {card.house ? `· ${card.house}. Ev` : ''}
            </div>
          </div>
        </div>

        {/* Öğretici */}
        <div style={educationalStyle}>{card.educational}</div>

        {/* Yorum */}
        <div style={interpretationStyle}>{card.interpretation}</div>
      </div>

      {/* Navigation: ‹ Ok | Dots | Ok › */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
        <div style={arrowStyle(activeIndex === 0)} onClick={prev}>‹</div>
        
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {cards.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: activeIndex === idx ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: activeIndex === idx ? EL_COLORS[cards[idx].element] || '#fff' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
        
        <div style={arrowStyle(activeIndex === cards.length - 1)} onClick={next}>›</div>
      </div>
    </div>
  );
}






// ═══════════════════════════════════════════════════════════════
//  ANA BİLEŞEN: CosmicCards
// ═══════════════════════════════════════════════════════════════

export default function CosmicCards({ profile }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (profile?.birthDate) {
      const chart = calculateNatalChart(
        profile.birthDate,
        profile.birthTime || null,
        profile.birthPlace || null,
        profile.birthDistrict || null
      );
      if (chart) setChartData(chart);
    }
  }, [profile]);

  const dna = useMemo(() => chartData ? analyzeChartDNA(chartData) : null, [chartData]);
  const bigThree = useMemo(() => chartData && dna ? generateBigThreeNarrative(chartData, dna) : null, [chartData, dna]);
  const sw = useMemo(() => chartData && dna ? generateStrengthsWeaknesses(chartData, dna) : null, [chartData, dna]);
  const love = useMemo(() => chartData && dna ? generateLoveDNA(chartData, dna) : null, [chartData, dna]);
  const contradictions = useMemo(() => chartData && dna ? generateContradictions(chartData, dna) : null, [chartData, dna]);
  const destiny = useMemo(() => chartData ? generateDestinyCareer(chartData) : null, [chartData]);
  const retro = useMemo(() => dna ? generateRetrogradeSummary(dna) : null, [dna]);
  const kozmikImza = useMemo(() => chartData ? analyzeKozmikImza(chartData) : null, [chartData]);

  if (!chartData || !dna) return null;

  // Big 3 kart listesi
  const big3Cards = [];
  if (bigThree?.sun) big3Cards.push(bigThree.sun);
  if (bigThree?.moon) big3Cards.push(bigThree.moon);
  if (bigThree?.ascendant) big3Cards.push(bigThree.ascendant);

  const dominantElColor = dna.dominantElement ? EL_COLORS[dna.dominantElement.name] : '#fff';

  return (
    <div style={{ padding: '0 20px', marginTop: '6px', marginBottom: '16px', position: 'relative', zIndex: 2 }}>

      {/* ━━━ KART 1: Sen Kimsin? ━━━ */}
      <ExpandableCard
        icon="☉"
        title="Sen Kimsin?"
        subtitle={`${chartData.sun.name} · ${chartData.moon.name}${chartData.ascendant ? ` · ↑${chartData.ascendant.name}` : ''}`}
        badge="Big 3"
        badgeColor="#FFD700"
        aurora="255, 215, 0"
      >
        {big3Cards.length > 0 && <SwipeableCards cards={big3Cards} />}

        {/* Sentez */}
        {bigThree?.synthesis && (
          <div style={{
            marginTop: '16px',
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            borderLeft: '3px solid rgba(255,215,0,0.3)',
          }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,215,0,0.5)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'uppercase' }}>
              İç Dünya Sentezi
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.65', fontStyle: 'italic' }}>
              {bigThree.synthesis}
            </div>
          </div>
        )}
      </ExpandableCard>


      {/* ━━━ KART 2: Güçlü Yönlerin & Kör Noktaların ━━━ */}
      <ExpandableCard
        icon="◆"
        title="Güçlü Yönlerin & Kör Noktaların"
        subtitle={dna.dominantElement ? `Baskın: ${dna.dominantElement.name} %${dna.dominantElement.percentage}` : ''}
        badge={dna.stelliums.length > 0 ? 'Stellium' : undefined}
        badgeColor="#6bcb77"
        aurora="107, 203, 119"
      >
        {/* Güçlü Yönler */}
        {sw?.strengths?.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6bcb77', letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
              Güçlü Yönlerin
            </div>
            {sw.strengths.map((s, i) => (
              <div key={i} style={{
                padding: '12px 14px',
                background: 'rgba(107, 203, 119, 0.04)',
                borderRadius: '10px',
                marginBottom: '8px',
                borderLeft: '3px solid rgba(107, 203, 119, 0.25)',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6bcb77', marginBottom: '4px' }}>
                  {s.label} {s.percentage ? `· %${s.percentage}` : ''}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>
                  {s.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Kör Noktalar */}
        {sw?.weaknesses?.length > 0 && (
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ff9500', letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
              Kör Noktaların
            </div>
            {sw.weaknesses.map((w, i) => (
              <div key={i} style={{
                padding: '12px 14px',
                background: 'rgba(255, 149, 0, 0.04)',
                borderRadius: '10px',
                marginBottom: '8px',
                borderLeft: '3px solid rgba(255, 149, 0, 0.2)',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ff9500', marginBottom: '4px' }}>
                  {w.label} {w.percentage !== undefined ? `· %${w.percentage}` : ''}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>
                  {w.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Retrograde detayları (2+ ise kör noktada gösterilir, 1 tane ise ayrıca) */}
        {retro && retro.count === 1 && retro.details.length > 0 && (
          <div style={{
            marginTop: '12px', padding: '12px 14px',
            background: 'rgba(255,255,255,0.02)', borderRadius: '10px',
            borderLeft: '3px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
              Retrograde Gezegen
            </div>
            <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>
              {retro.details[0].text}
            </div>
          </div>
        )}
      </ExpandableCard>


      {/* ━━━ KART 3: Aşk & İlişki DNA'n ━━━ */}
      {love && (
        <ExpandableCard
          icon="♀"
          title="Aşk & İlişki DNA'n"
          subtitle={`♀ ${love.venus.sign} · ♂ ${love.mars.sign}`}
          badge={love.sameElement ? 'Uyumlu' : 'Çelişki'}
          badgeColor={love.sameElement ? '#6bcb77' : '#ff6b35'}
          aurora="255, 133, 194"
        >
          {/* Venüs */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '16px', color: '#FF85C2' }}>♀</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FF85C2' }}>{love.venus.title}</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>· {love.venus.sign}</span>
            </div>
            <div style={educationalStyle}>{love.venus.educational}</div>
            <div style={interpretationStyle}>{love.venus.interpretation}</div>
          </div>

          {/* Mars */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '16px', color: '#FF5555' }}>♂</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FF5555' }}>{love.mars.title}</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>· {love.mars.sign}</span>
            </div>
            <div style={educationalStyle}>{love.mars.educational}</div>
            <div style={interpretationStyle}>{love.mars.interpretation}</div>
          </div>

          {/* Sentez */}
          {love.synthesis && (
            <div style={{
              padding: '14px 16px',
              background: 'rgba(255, 133, 194, 0.04)',
              borderRadius: '12px',
              borderLeft: '3px solid rgba(255, 133, 194, 0.25)',
            }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255, 133, 194, 0.5)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'uppercase' }}>
                Venüs-Mars Senerjin
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.65', fontStyle: 'italic' }}>
                {love.synthesis}
              </div>
            </div>
          )}
        </ExpandableCard>
      )}


      {/* ━━━ KART 4: Kozmik Çelişkilerin ━━━ */}
      {contradictions && contradictions.length > 0 && (
        <ExpandableCard
          icon="⚡"
          title="Kozmik Çelişkilerin"
          subtitle={`${contradictions.length} çelişki tespit edildi`}
          badge={`${contradictions.length}`}
          badgeColor="#ff9500"
          aurora="255, 149, 0"
        >
          {contradictions.map((c, i) => (
            <div key={i} style={{
              padding: '14px',
              background: 'rgba(255, 149, 0, 0.03)',
              borderRadius: '12px',
              marginBottom: i < contradictions.length - 1 ? '10px' : 0,
              border: '1px solid rgba(255, 149, 0, 0.06)',
            }}>
              {/* Çelişki başlığı */}
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255, 149, 0, 0.6)', letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
                {c.type}
              </div>

              {/* İki gezegen */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{
                  padding: '4px 10px', borderRadius: '8px',
                  background: `${EL_COLORS[c.planet1.element] || '#fff'}12`,
                  border: `1px solid ${EL_COLORS[c.planet1.element] || '#fff'}25`,
                  fontSize: '0.7rem', color: EL_COLORS[c.planet1.element] || '#fff',
                }}>
                  {c.planet1.glyph} {c.planet1.sign}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>vs</span>
                <div style={{
                  padding: '4px 10px', borderRadius: '8px',
                  background: `${EL_COLORS[c.planet2.element] || '#fff'}12`,
                  border: `1px solid ${EL_COLORS[c.planet2.element] || '#fff'}25`,
                  fontSize: '0.7rem', color: EL_COLORS[c.planet2.element] || '#fff',
                }}>
                  {c.planet2.glyph} {c.planet2.sign}
                </div>
              </div>

              {/* Sentez */}
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: '1.65' }}>
                {c.text}
              </div>
            </div>
          ))}
        </ExpandableCard>
      )}


      {/* ━━━ KART 5: Kader & Kariyer Pusulası ━━━ */}
      {destiny && destiny.length > 0 && (
        <ExpandableCard
          icon="☊"
          title="Kader & Kariyer Pusulası"
          subtitle={chartData.mc ? `MC: ${chartData.mc.name} · ☊ ${chartData.northNode?.name || ''}` : `☊ ${chartData.northNode?.name || ''}`}
          aurora="200, 169, 250"
        >
          {destiny.map((section, i) => (
            <div key={i} style={{
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '10px',
              marginBottom: i < destiny.length - 1 ? '10px' : 0,
              borderLeft: '3px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontFamily: 'serif' }}>{section.glyph}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{section.title}</span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>· {section.sign}</span>
              </div>
              <div style={educationalStyle}>{section.educational}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>
                {section.interpretation}
              </div>
            </div>
          ))}
        </ExpandableCard>
      )}


      {/* ━━━ KART 6: Kozmik İmzan (Upsell Hook) ━━━ */}
      {kozmikImza && kozmikImza.length > 0 && (
        <ExpandableCard
          icon="✦"
          title="Doğuştan Gelen Silahın"
          subtitle={`${kozmikImza.length} dikkat çekici yerleşim`}
          badge="Özel"
          badgeColor="#c8a9fa"
          aurora="200, 169, 250"
          defaultOpen={false}
        >
          {kozmikImza.map((sig, i) => (
            <div key={sig.key} style={{
              padding: '14px',
              background: `${sig.color}06`,
              borderRadius: '12px',
              marginBottom: i < kozmikImza.length - 1 ? '10px' : 0,
              border: `1px solid ${sig.color}15`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'serif', fontSize: '18px', color: sig.color }}>{sig.icon}</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: sig.color, letterSpacing: '0.03em' }}>
                    {sig.title}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                    {sig.sign} · {sig.house}. Ev
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.65' }}>
                {sig.hook}
              </div>
            </div>
          ))}

          {/* Kahine Danış CTA (Boş — sonra bağlanacak) */}
          <div
            onClick={() => alert('Kozmik Kahin çok yakında! 🔮')}
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(200,169,250,0.12), rgba(255,215,0,0.06))',
              border: '1px solid rgba(200,169,250,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c8a9fa', letterSpacing: '0.04em' }}>
                Daha Fazlasını Keşfet
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Bu yerleşimlerin hayatına etkisini Kahin'e sor
              </div>
            </div>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(200,169,250,0.15)',
              border: '1px solid rgba(200,169,250,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }}>🔮</div>
          </div>
        </ExpandableCard>
      )}

    </div>
  );
}
