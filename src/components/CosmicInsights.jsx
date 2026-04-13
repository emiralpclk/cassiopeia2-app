import { useState, useEffect, useMemo } from 'react';
import { calculateNatalChart, calculateElements, calculateModality, calculatePolarity, calculateAspects } from '../utils/astrologyEngine';
import { ASTRO_DICTIONARY, PLANET_DESCRIPTIONS, HOUSE_DESCRIPTIONS, MODALITY_DESCRIPTIONS, ASPECT_TYPE_DESCRIPTIONS } from '../utils/astrologyDictionary';

const EL_COLORS = { 'Ateş': '#ff6b35', 'Su': '#74d7ff', 'Toprak': '#6bcb77', 'Hava': '#c8a9fa' };
const EL_AURAS  = { 'Ateş': '255, 107, 53', 'Su': '116, 215, 255', 'Toprak': '107, 203, 119', 'Hava': '200, 169, 250' };
const MOD_COLORS = { 'Kardinal': '#FFD700', 'Sabit': '#00d2ff', 'Değişken': '#c8a9fa' };

const PLANET_COLORS = {
  sun: '#FFD700', moon: '#E8E8FF', mercury: '#A0B0FF', venus: '#FF85C2', mars: '#FF5555',
  jupiter: '#F6A500', saturn: '#8888FF', uranus: '#00E5CC', neptune: '#7B68EE', pluto: '#CC6677', northNode: '#B0B0B0'
};

const PLANET_ORDER = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'northNode'];

export default function CosmicInsights({ profile }) {
  const [activeTab, setActiveTab] = useState('planets');
  const [chartData, setChartData] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

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

  const elements  = useMemo(() => chartData ? calculateElements(chartData) : [], [chartData]);
  const modality  = useMemo(() => chartData ? calculateModality(chartData) : [], [chartData]);
  const polarity  = useMemo(() => chartData ? calculatePolarity(chartData) : [], [chartData]);
  const aspects   = useMemo(() => chartData ? calculateAspects(chartData) : [], [chartData]);

  if (!chartData) return null;

  const hasHouses = chartData.hasBirthTime && chartData.houses;
  const primaryElement = elements.length > 0 ? elements[0] : null;

  const tabs = [
    { id: 'planets', label: 'Gezegenler', icon: '☉' },
    { id: 'houses',  label: 'Evler',      icon: '⌂', disabled: !hasHouses },
    { id: 'aspects', label: 'Açılar',     icon: '△' },
  ];

  const toggleExpand = (key, e) => {
    e?.preventDefault();
    setExpandedItem(prev => prev === key ? null : key);
  };

  // Tab değişince listeyi kapat
  const handleTabChange = (id) => {
    setActiveTab(id);
    setShowAll(false);
    setExpandedItem(null);
  };

  const INITIAL_COUNT = 4;

  // Kapalıyken: son satırların üzerine binen gradient + buton
  const showMoreOverlay = () => (
    <div 
      onClick={() => setShowAll(true)} 
      style={{ 
        position: 'relative',
        marginTop: '-70px',
        paddingTop: '40px',
        paddingBottom: '4px',
        textAlign: 'center',
        cursor: 'pointer',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(8, 8, 18, 0.6) 40%, rgba(8, 8, 18, 0.9) 100%)',
        borderRadius: '0 0 14px 14px',
        zIndex: 3,
      }}
    >
      <span style={{ 
        fontSize: '0.73rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.08em',
        padding: '6px 18px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s ease',
      }}>
        Devamını Gör <span style={{ fontSize: '9px' }}>▼</span>
      </span>
    </div>
  );

  // Açıkken: altta basit yazı
  const showLessBtn = () => (
    <div 
      onClick={() => setShowAll(false)} 
      style={{ 
        textAlign: 'center', 
        padding: '12px 0 4px', 
        cursor: 'pointer',
      }}
    >
      <span style={{ 
        fontSize: '0.7rem', 
        color: 'rgba(255,255,255,0.3)', 
        letterSpacing: '0.05em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        Daha Az Gör <span style={{ fontSize: '8px', transform: 'rotate(180deg)', display: 'inline-block' }}>▼</span>
      </span>
    </div>
  );

  return (
    <div style={{ padding: '0 20px', marginTop: '10px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
      
      {/* ── TAB BAR ── */}
      <div style={{ 
        display: 'flex', gap: '4px', marginBottom: '16px', 
        background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '4px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            style={{ 
              flex: 1, padding: '10px 6px', borderRadius: '11px',
              background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: tab.disabled ? 'rgba(255,255,255,0.15)' : activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none',
              fontWeight: activeTab === tab.id ? '600' : '400',
              transition: 'all 0.3s ease', cursor: tab.disabled ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
              fontSize: '0.8rem', fontFamily: 'var(--font-body)',
            }}
          >
            <span style={{ fontSize: '12px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── INLINE GUIDANCE & 101 BUTTON ── */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '16px', padding: '0 8px', gap: '12px'
      }}>
        <div style={{ flex: 1, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, letterSpacing: '0.02em', fontStyle: 'italic' }}>
          {activeTab === 'planets' && 'Gezegenler, bizi oluşturan temel enerjiler ve içimizdeki farklı karakterlerdir. ("KİM/NE?")'}
          {activeTab === 'houses' && 'Evler, bu enerjilerin hayatımızda sahneye çıktığı 12 farklı yaşam alanıdır. ("NEREDE?")'}
          {activeTab === 'aspects' && 'Açılar, içimizdeki farklı aktörlerin birbiriyle uyumu, çatışması ve aralarındaki diyalogdur. ("NASIL?")'}
        </div>
        <button 
          onClick={() => setShowGuideModal(true)}
          style={{ 
            background: 'none', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '20px',
            padding: '4px 10px', fontSize: '0.65rem', color: '#FFD700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          <span>Nasıl Okunur?</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* GEZEGENLER TAB */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'planets' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
          {PLANET_ORDER.filter((_, idx) => showAll || idx < INITIAL_COUNT).map(key => {
            const p = chartData[key];
            if (!p) return null;
            const isExpanded = expandedItem === key;
            const color = PLANET_COLORS[key] || '#fff';
            const dictEntry = ASTRO_DICTIONARY[key]?.[p.name];
            const desc = PLANET_DESCRIPTIONS[key];
            const houseDesc = p.house ? HOUSE_DESCRIPTIONS[p.house] : null;

            return (
              <div key={key}
                onPointerDown={(e) => toggleExpand(key, e)}
                style={{
                  background: isExpanded ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isExpanded ? color + '33' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '14px',
                  padding: isExpanded ? '14px' : '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Planet Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'serif', fontSize: 20, color, width: 28, textAlign: 'center' }}>{p.glyph}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{p.label}</span>
                      {p.retrograde && <span style={{ fontSize: 9, color: '#ff9500', background: 'rgba(255,149,0,0.1)', padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>℞</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
                      {desc?.title || ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      {p.name} <span style={{ fontSize: 18, transform: 'translateY(1px)' }}>{p.icon}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                      {p.degree.toFixed(1)}°{p.house ? ` · ${p.house}. Ev` : ''}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </div>
                
                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fade-in 0.2s ease' }}>
                    {desc && (
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 10 }}>
                        {desc.desc}
                      </p>
                    )}
                    
                    {dictEntry && (
                      <div style={{ 
                        padding: '10px 12px', borderRadius: 10, marginBottom: 8,
                        background: `linear-gradient(135deg, ${color}08, transparent)`,
                        borderLeft: `3px solid ${color}33`,
                      }}>
                        <div style={{ fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 600 }}>
                          {p.name}'da {p.label}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                          {dictEntry}
                        </div>
                      </div>
                    )}
                    
                    {houseDesc && (
                      <div style={{ 
                        padding: '8px 10px', borderRadius: 8,
                        background: 'rgba(255,215,0,0.03)',
                        border: '1px solid rgba(255,215,0,0.06)',
                        fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5
                      }}>
                        <span style={{ color: '#FFD700', fontWeight: 600 }}>⌂ {p.house}. Ev:</span> {houseDesc.title} — {houseDesc.desc}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {PLANET_ORDER.filter(k => chartData[k]).length > INITIAL_COUNT && (
            showAll ? showLessBtn() : showMoreOverlay()
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* EVLER TAB */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'houses' && hasHouses && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chartData.houses.filter((_, i) => showAll || i < INITIAL_COUNT).map((house, i) => {
            const hNum = i + 1;
            const hDesc = HOUSE_DESCRIPTIONS[hNum];
            const isExpanded = expandedItem === `house-${hNum}`;
            const planetsHere = PLANET_ORDER.filter(k => chartData[k]?.house === hNum);

            return (
              <div key={hNum}
                onPointerDown={(e) => toggleExpand(`house-${hNum}`, e)}
                style={{
                  background: isExpanded ? 'rgba(255,215,0,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isExpanded ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '14px',
                  padding: isExpanded ? '14px' : '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: 30, height: 30, borderRadius: 8,
                    background: isExpanded ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 'bold', color: isExpanded ? '#FFD700' : 'rgba(255,255,255,0.4)',
                    border: isExpanded ? '1px solid rgba(255,215,0,0.15)' : 'none',
                  }}>{hNum}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{hDesc?.title || `${hNum}. Ev`}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                      {house.name} {house.icon} · {house.degree.toFixed(1)}°
                    </div>
                  </div>
                  {planetsHere.length > 0 && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      {planetsHere.map(k => (
                        <span key={k} style={{ fontFamily: 'serif', fontSize: 13, color: PLANET_COLORS[k] || '#fff' }}>
                          {chartData[k]?.glyph}
                        </span>
                      ))}
                    </div>
                  )}
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </div>

                {isExpanded && hDesc && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fade-in 0.2s ease' }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 10 }}>
                      {hDesc.desc}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {hDesc.keywords.map(kw => (
                        <span key={kw} style={{ 
                          fontSize: 10, padding: '3px 8px', borderRadius: 8,
                          background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.08)',
                          color: 'rgba(255,255,255,0.4)'
                        }}>{kw}</span>
                      ))}
                    </div>
                    {planetsHere.length > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Bu Evdeki Gezegenler</div>
                        {planetsHere.map(k => {
                          const pl = chartData[k];
                          return pl ? (
                            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontFamily: 'serif', fontSize: 14, color: PLANET_COLORS[k] }}>{pl.glyph}</span>
                              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{pl.label}</span>
                              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{pl.name} {pl.degree.toFixed(1)}°</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {chartData.houses.length > INITIAL_COUNT && (
            showAll ? showLessBtn() : showMoreOverlay()
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* AÇILAR TAB */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'aspects' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {aspects.length > 0 ? aspects.filter((_, i) => showAll || i < INITIAL_COUNT).map((asp, i) => {
            const isExpanded = expandedItem === `asp-${i}`;
            const typeDesc = ASPECT_TYPE_DESCRIPTIONS[asp.type];
            
            return (
              <div key={i}
                onPointerDown={(e) => toggleExpand(`asp-${i}`, e)}
                style={{
                  background: isExpanded ? `${asp.color}08` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isExpanded ? asp.color + '33' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '14px',
                  padding: isExpanded ? '14px' : '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: 6, height: 6, borderRadius: '50%', background: asp.color,
                    boxShadow: `0 0 6px ${asp.color}`,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'serif', fontSize: 14, color: PLANET_COLORS[asp.planet1Key] }}>{asp.planet1Glyph}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{asp.planet1}</span>
                      <span style={{ fontSize: 12, color: asp.color, fontWeight: 700 }}>{asp.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{asp.planet2}</span>
                      <span style={{ fontFamily: 'serif', fontSize: 14, color: PLANET_COLORS[asp.planet2Key] }}>{asp.planet2Glyph}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                      {asp.type} · {asp.orbStr}° Orb
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: 9, padding: '2px 7px', borderRadius: 6,
                    background: asp.harmony === 'uyumlu' ? 'rgba(0,210,255,0.08)' : asp.harmony === 'gerilim' ? 'rgba(255,85,85,0.08)' : 'rgba(255,255,255,0.04)',
                    color: asp.harmony === 'uyumlu' ? '#74d7ff' : asp.harmony === 'gerilim' ? '#ff5555' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${asp.harmony === 'uyumlu' ? 'rgba(0,210,255,0.15)' : asp.harmony === 'gerilim' ? 'rgba(255,85,85,0.15)' : 'rgba(255,255,255,0.06)'}`,
                    fontWeight: 600,
                  }}>
                    {asp.harmony === 'uyumlu' ? 'Uyum' : asp.harmony === 'gerilim' ? 'Gerilim' : 'Nötr'}
                  </span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fade-in 0.2s ease' }}>
                    {typeDesc && (
                      <div style={{ 
                        padding: '8px 10px', borderRadius: 8, marginBottom: 8,
                        background: `${asp.color}08`, borderLeft: `3px solid ${asp.color}33`,
                      }}>
                        <div style={{ fontSize: 10, color: asp.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 600 }}>
                          {asp.type} Nedir?
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                          {typeDesc.desc}
                        </div>
                      </div>
                    )}
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                      {asp.description}
                    </p>
                  </div>
                )}
              </div>
            );
          }) : (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '30px 0' }}>
              Belirgin bir büyük açı bulunamadı.
            </div>
          )}
          {aspects.length > INITIAL_COUNT && (
            showAll ? showLessBtn() : showMoreOverlay()
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* ELEMENT + MODALİTE + POLARİTE BALANCE */}
      {/* ────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        {/* Element Dengesi */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '10px',
        }}>
          {primaryElement && (
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                BASKIN ENERJİ
              </span>
              <div style={{ color: EL_COLORS[primaryElement.name], fontSize: '1.1rem', fontWeight: 'bold', marginTop: 3 }}>
                {primaryElement.name}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {elements.map(el => (
              <div key={el.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 46, fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{el.name}</div>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${el.percentage}%`, height: '100%', 
                    background: EL_COLORS[el.name], 
                    boxShadow: `0 0 8px rgba(${EL_AURAS[el.name]}, 0.4)`,
                    borderRadius: 10,
                    transition: 'width 0.8s ease',
                  }} />
                </div>
                <div style={{ width: 28, textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                  %{el.percentage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modalite + Polarite Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          
          {/* Modalite */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '14px',
          }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4, textAlign: 'center' }}>
              MODALİTE
            </div>
            <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: 12, lineHeight: 1.3 }}>
              Olaylara yaklaşım tarzın ve<br/>eylem motivasyonun
            </div>
            {modality.map(m => (
              <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: MOD_COLORS[m.name] || '#fff', fontWeight: 500 }}>{m.name}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>%{m.percentage}</span>
              </div>
            ))}
          </div>

          {/* Polarite */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            padding: '14px',
          }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4, textAlign: 'center' }}>
              POLARİTE
            </div>
            <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: 12, lineHeight: 1.3 }}>
              Enerjinin içe veya dışa<br/>dönüklük dengesi
            </div>
            {polarity.map(p => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, width: 14, textAlign: 'center', color: p.name === 'Aktif' ? '#FFD700' : '#c8a9fa' }}>
                    {p.name === 'Aktif' ? '☉' : '☽'}
                  </span>
                  <span style={{ fontSize: 10, color: p.name === 'Aktif' ? '#FFD700' : '#c8a9fa', fontWeight: 500 }}>
                    {p.name}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>%{p.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ────────────────────────────────────────────────────────── */}
      {/* ASTROLOJİ 101 MODAL */}
      {/* ────────────────────────────────────────────────────────── */}
      {showGuideModal && (
        <div 
          onClick={() => setShowGuideModal(false)} 
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(5, 5, 10, 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px',
            animation: 'fade-in 0.3s ease-out'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()} 
            style={{ 
              background: 'rgba(20, 20, 30, 0.6)', 
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '28px',
              maxWidth: 420, width: '100%',
              padding: '32px 24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative', overflow: 'hidden'
            }}
          >
            {/* Dekoratif Aurora */}
            <div style={{
              position: 'absolute', top: '-20%', left: '10%', right: '10%', height: '150px',
              background: 'radial-gradient(circle, rgba(160, 176, 255, 0.15) 0%, transparent 70%)',
              filter: 'blur(30px)', zIndex: 0, pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <span style={{ fontSize: 44, display: 'block', marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(255,215,0,0.2))' }}>🎭</span>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: 6, fontWeight: 600, letterSpacing: '0.02em' }}>Astroloji 101</h2>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Tiyatro Metaforu</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                {[
                  { icon: '⊙', title: 'Gezegenler (Aktörler)', color: '#FFD700', bg: 'rgba(255,215,0,0.04)', text: 'İçindeki farklı karakterlerdir. (Örn: Mars savaşçındır, Venüs aşığındır.)' },
                  { icon: '♈︎', title: 'Burçlar (Kostümler/Roller)', color: '#A0B0FF', bg: 'rgba(160,176,255,0.04)', text: 'Bu aktörlerin "nasıl" davrandığıdır. (Örn: Venüs Koç burcundayken aşık sabırsızdır.)' },
                  { icon: '⌂', title: 'Evler (Sahneler)', color: '#FF85C2', bg: 'rgba(255,133,194,0.04)', text: 'Olayın hayatın neresinde geçtiğidir. (Örn: 7. Ev evlilik sahnesi, 10. Ev kariyerdir.)' },
                  { icon: '△', title: 'Açılar (Diyaloglar)', color: '#00E5CC', bg: 'rgba(0,229,204,0.04)', text: 'İçindeki aktörler birbirine destek mi (Üçgen) yoksa kavga mı (Kare) ediyor?' }
                ].map((item, idx) => (
                  <div key={idx} style={{ 
                    background: item.bg, 
                    border: `1px solid ${item.color}22`,
                    padding: '14px 16px', 
                    borderRadius: '16px',
                    display: 'flex', gap: '14px', alignItems: 'flex-start'
                  }}>
                    <span style={{ color: item.color, fontSize: '1.2rem', marginTop: '-2px' }}>{item.icon}</span>
                    <div>
                      <strong style={{ color: item.color, display: 'block', marginBottom: 4, fontSize: '0.9rem', letterSpacing: '0.02em' }}>{item.title}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, margin: 0 }}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowGuideModal(false)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.08)', 
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '16px',
                  borderRadius: '16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Anladım, Haritama Dön
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
