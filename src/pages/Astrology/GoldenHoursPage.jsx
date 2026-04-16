import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppContext';
import { getSunTimes, getMoonPhase, getPlanetStatus, buildFullDaySchedule, fmt } from '../../utils/cosmicUtils';
import { PLANETS, getPersonalizedContent, getTimeSlot, TIME_SLOTS, BANNER_TEMPLATES } from '../../utils/planetaryContent';
import { calculateDailyTransits } from '../../utils/astrologyEngine';
import { calculateNatalChart } from '../../utils/astrologyEngine';
import { getDailyOracleMessage } from '../../utils/dailyOracleDictionary';
import CassiopeiaLogo from '../../components/CassiopeiaLogo';

// ─── Cosmic Banner Component ─────────────────────────────────────────────────
function CosmicBanner({ banner }) {
  return (
    <div style={{
      margin: '4px 0',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: banner.type === 'warning'
        ? 'linear-gradient(90deg, rgba(248,113,113,0.08), transparent)'
        : banner.type === 'peak'
          ? 'linear-gradient(90deg, rgba(251,191,36,0.08), transparent)'
          : `linear-gradient(90deg, ${banner.color}0c, transparent)`,
      borderLeft: `3px solid ${banner.color}60`,
      borderRadius: '0 12px 12px 0',
    }}>
      {/* Icon alanı: emoji varsa emoji, yoksa Material Symbol */}
      {banner.emoji ? (
        <span style={{
          fontSize: '20px',
          flexShrink: 0,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
        }}>{banner.emoji}</span>
      ) : (
        <span className="material-symbols-outlined" style={{
          fontSize: '18px',
          color: banner.color,
          flexShrink: 0,
        }}>{banner.icon}</span>
      )}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: '700',
          color: banner.color,
          letterSpacing: '0.02em',
        }}>{banner.title}</div>
        <div style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.4)',
          marginTop: '1px',
          lineHeight: '1.4',
        }}>{banner.subtitle}</div>
      </div>
    </div>
  );
}


// ─── Atmosfer Gradyanı (Günün Saatine Göre) ─────────────────────────────────
function getAtmosphereGradient() {
  const h = new Date().getHours();
  if (h >= 5  && h < 8)  return 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(251,146,60,0.18) 0%, rgba(244,63,94,0.08) 50%, transparent 100%)';
  if (h >= 8  && h < 12) return 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(251,191,36,0.14) 0%, rgba(253,224,71,0.05) 50%, transparent 100%)';
  if (h >= 12 && h < 17) return 'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 100%)';
  if (h >= 17 && h < 21) return 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(249,115,22,0.14) 0%, rgba(168,85,247,0.08) 50%, transparent 100%)';
  return 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(79,70,229,0.16) 0%, rgba(139,92,246,0.08) 50%, transparent 100%)';
}

// ─── Hour Card (Expanded) ────────────────────────────────────────────────────
function HourCard({ h, isExpanded, onToggle, content, isLocked }) {
  const p = PLANETS[h.planetKey];
  if (!p) return null;

  const minutesUntilStart = Math.round((h.start - new Date()) / 60000);
  const soonLabel = !h.isPast && !h.isActive && minutesUntilStart <= 20 && minutesUntilStart > 0
    ? `${minutesUntilStart} dk sonra`
    : null;

  return (
    <div
      onClick={onToggle}
      style={{
        background: h.isActive
          ? `linear-gradient(135deg, ${p.color}18, ${p.color}08)`
          : h.isPast ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
        border: h.isActive
          ? `1px solid ${p.color}40`
          : soonLabel ? `1px solid ${p.color}25`
          : '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        padding: h.isActive ? '18px 18px' : '14px 16px',
        cursor: 'pointer',
        opacity: h.isPast ? 0.4 : 1,
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}>

      {/* Active glow */}
      {h.isActive && (
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: `${p.color}15`, filter: 'blur(30px)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Main Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
        {/* Planet circle */}
        <div style={{
          width: h.isActive ? '44px' : '38px',
          height: h.isActive ? '44px' : '38px',
          borderRadius: '50%',
          background: h.isActive ? `${p.color}25` : h.isNight ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.04)',
          border: h.isActive ? `2px solid ${p.color}50` : '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: h.isActive ? '22px' : '18px',
          flexShrink: 0,
          color: h.isActive ? '#fff' : p.color,
          fontFamily: 'serif',
          boxShadow: h.isActive ? `0 6px 20px ${p.color}30` : 'none',
          transition: 'all 0.3s ease',
        }}>
          {p.symbol}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: h.isActive ? '0.95rem' : '0.88rem',
              fontWeight: h.isActive ? '800' : '600',
              color: h.isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            }}>
              {p.name} Saati
            </span>
            {h.isActive && (
              <span style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em',
                color: p.color, background: `${p.color}20`,
                border: `1px solid ${p.color}35`,
                borderRadius: '6px', padding: '2px 8px', textTransform: 'uppercase',
              }}>
                <span style={{
                  display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%',
                  background: p.color, marginRight: '4px', verticalAlign: 'middle',
                  animation: 'pulse 1.5s infinite',
                }} />
                Şu An
              </span>
            )}
            {soonLabel && (
              <span style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em',
                color: p.color, opacity: 0.75,
                borderRadius: '6px', padding: '2px 6px',
                background: `${p.color}12`, border: `1px solid ${p.color}25`,
              }}>
                {soonLabel}
              </span>
            )}
            {isLocked && (
              <span className="material-symbols-outlined" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>lock</span>
            )}
            {h.isNight && !h.isActive && (
              <span className="material-symbols-outlined" style={{
                fontSize: '12px', color: 'rgba(167,139,250,0.4)',
              }}>dark_mode</span>
            )}
            {p.peak && !h.isPast && (
              <span style={{ fontSize: '11px', color: '#fbbf24' }}>⭐</span>
            )}
          </div>
          <div style={{
            fontSize: '0.72rem',
            color: h.isActive ? `${p.color}bb` : 'rgba(255,255,255,0.35)',
            marginTop: '2px',
          }}>
            {fmt(h.start)} – {fmt(h.end)} · {p.tagline}
          </div>
        </div>

        {/* Chevron */}
        <span className="material-symbols-outlined" style={{
          fontSize: '18px', color: 'rgba(255,255,255,0.2)',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
        }}>chevron_right</span>
      </div>

      {/* ── Expanded: KİLİTLİ ── */}
      {isExpanded && isLocked && (
        <div style={{
          marginTop: '16px', paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          animation: 'fade-in 0.3s ease',
        }}>
          <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden' }}>
            {/* Blurlu önizleme */}
            <div style={{ filter: 'blur(6px)', pointerEvents: 'none', opacity: 0.4 }}>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.65', margin: '0 0 10px', fontStyle: 'italic' }}>
                "{p.coreEnergy}"
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.1)', borderRadius: '12px', padding: '10px', height: '70px' }} />
                <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.1)', borderRadius: '12px', padding: '10px', height: '70px' }} />
              </div>
            </div>

            {/* Frosted overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(10,10,20,0.2) 0%, rgba(10,10,20,0.88) 55%)',
              backdropFilter: 'blur(2px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-end',
              padding: '16px',
              borderRadius: '14px',
            }}>
              <span className="material-symbols-outlined" style={{
                fontSize: '22px', marginBottom: '6px',
                color: isLocked === 'past' ? 'rgba(255,255,255,0.25)' : `${p.color}80`,
              }}>
                {isLocked === 'past' ? 'history' : 'schedule'}
              </span>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
                {isLocked === 'past' ? 'Bu saat geçti' : `${fmt(h.start)}'de açılacak`}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', marginTop: '3px', textAlign: 'center' }}>
                {isLocked === 'past'
                  ? 'Geçmiş saatlere ait detaylar görüntülenemiyor'
                  : 'Detaylar sadece o anda görünür hale gelir'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Expanded: AÇIK ── */}
      {isExpanded && !isLocked && content && (
        <div style={{
          marginTop: '16px', paddingTop: '16px',
          borderTop: `1px solid ${h.isActive ? p.color + '25' : 'rgba(255,255,255,0.06)'}`,
          animation: 'fade-in 0.3s ease',
        }}>
          {/* Description */}
          <p style={{
            fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.65', margin: '0 0 16px',
            fontStyle: 'italic',
          }}>
            "{content.description}"
          </p>

          {/* Dos & Donts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              background: 'rgba(52, 211, 153, 0.06)',
              border: '1px solid rgba(52,211,153,0.12)',
              borderRadius: '14px', padding: '12px',
            }}>
              <div style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em',
                color: '#34d399', marginBottom: '8px', textTransform: 'uppercase',
              }}>✓ Şimdi Yap</div>
              {content.dos.map((item, i) => (
                <div key={i} style={{
                  fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)',
                  lineHeight: '1.5', marginBottom: '5px',
                  display: 'flex', alignItems: 'flex-start', gap: '5px',
                }}>
                  <span style={{ color: '#34d399', flexShrink: 0, fontSize: '10px', marginTop: '2px' }}>›</span>
                  {item}
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(248, 113, 113, 0.06)',
              border: '1px solid rgba(248,113,113,0.12)',
              borderRadius: '14px', padding: '12px',
            }}>
              <div style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em',
                color: '#f87171', marginBottom: '8px', textTransform: 'uppercase',
              }}>✗ Kaçın</div>
              {content.donts.map((item, i) => (
                <div key={i} style={{
                  fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)',
                  lineHeight: '1.5', marginBottom: '5px',
                  display: 'flex', alignItems: 'flex-start', gap: '5px',
                }}>
                  <span style={{ color: '#f87171', flexShrink: 0, fontSize: '10px', marginTop: '2px' }}>›</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Kişisel Katmanlar */}
          {(content.genderTip || content.relationshipNote || content.zodiacNote) && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px', padding: '12px',
              marginBottom: '12px',
            }}>
              <div style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em',
                color: p.color, marginBottom: '8px', textTransform: 'uppercase',
                opacity: 0.7,
              }}>✦ Sana Özel</div>
              {content.zodiacNote && (
                <p style={{
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.55', margin: '0 0 8px',
                  fontWeight: '500',
                }}>{content.zodiacNote}</p>
              )}
              {content.genderTip && (
                <p style={{
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)',
                  lineHeight: '1.55', margin: '0 0 6px',
                }}>{content.genderTip}</p>
              )}
              {content.relationshipNote && (
                <p style={{
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)',
                  lineHeight: '1.55', margin: 0,
                  fontStyle: 'italic',
                }}>{content.relationshipNote}</p>
              )}
            </div>
          )}

          {/* Kozmik Fısıltı */}
          {(content.cosmicWhisper || content.mercuryWarning) && (
            <div style={{
              background: content.mercuryWarning
                ? 'rgba(248,113,113,0.06)'
                : 'rgba(196,181,253,0.06)',
              border: `1px solid ${content.mercuryWarning ? 'rgba(248,113,113,0.15)' : 'rgba(196,181,253,0.15)'}`,
              borderRadius: '14px', padding: '10px 12px',
              display: 'flex', alignItems: 'flex-start', gap: '8px',
            }}>
              <span className="material-symbols-outlined" style={{
                fontSize: '16px',
                color: content.mercuryWarning ? '#f87171' : '#c4b5fd',
                flexShrink: 0, marginTop: '1px',
              }}>{content.mercuryWarning ? 'sync_problem' : 'auto_awesome'}</span>
              <p style={{
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: '1.5', margin: 0,
              }}>
                {content.mercuryWarning || content.cosmicWhisper}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function GoldenHoursPage() {
  const navigate = useNavigate();
  const { profiles, activeProfileId } = useAppState();
  const [schedule, setSchedule] = useState(null);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const cityName = activeProfile?.birthPlace || 'İstanbul';

  // Cosmic state
  const moonPhase = useMemo(() => getMoonPhase(), []);
  const mercuryStatus = useMemo(() => {
    try { return getPlanetStatus('Mercury'); } catch { return {}; }
  }, []);

  const cosmicState = useMemo(() => ({
    moonPhase: moonPhase?.name || null,
    mercuryStatus: mercuryStatus?.isRetro ? 'retro' : mercuryStatus?.isShadow ? 'shadow' : 'direct',
  }), [moonPhase, mercuryStatus]);

  const userProfile = useMemo(() => ({
    gender: activeProfile?.gender || null,
    relationshipStatus: activeProfile?.relationshipStatus || null,
    zodiac: activeProfile?.zodiac || null,
  }), [activeProfile]);

  useEffect(() => {
    setSchedule(buildFullDaySchedule(cityName));
    const iv = setInterval(() => setSchedule(buildFullDaySchedule(cityName)), 60000);
    return () => clearInterval(iv);
  }, [cityName]);

  // Auto-expand active hour
  useEffect(() => {
    if (schedule && expandedIdx === null) {
      const activeIdx = schedule.hours.findIndex(h => h.isActive);
      if (activeIdx >= 0) setExpandedIdx(activeIdx);
    }
  }, [schedule]);

  // ── Daily Oracle hesaplama ──
  const dailyOracle = useMemo(() => {
    try {
      const transits = calculateDailyTransits();
      const moonSign = transits?.moon?.name;
      if (!moonSign) return null;

      // Kullanıcının Güneş burcunu bul
      const profile = activeProfile;
      let sunSign = null;
      if (profile?.birthDate) {
        const chart = calculateNatalChart(
          profile.birthDate,
          profile.birthTime || null,
          profile.birthPlace || null,
          profile.birthDistrict || null
        );
        sunSign = chart?.sun?.name;
      }
      if (!sunSign) return null;

      const message = getDailyOracleMessage(moonSign, sunSign);
      return { moonSign, sunSign, message, moonIcon: transits.moon.icon };
    } catch {
      return null;
    }
  }, [activeProfile]);

  if (!schedule) return null;

  // ─── Build timeline with banners ───────────────────────────────────
  const timelineItems = [];
  let sunriseBannerAdded = false;
  let sunsetBannerAdded = false;
  let moonBannerAdded = false;
  let mercuryBannerAdded = false;

  schedule.hours.forEach((h, i) => {
    // Sunrise banner (before first daytime hour)
    if (!sunriseBannerAdded && !h.isNight) {
      timelineItems.push({
        type: 'banner',
        data: BANNER_TEMPLATES.sunrise(fmt(schedule.sunrise)),
        key: 'sunrise',
      });
      sunriseBannerAdded = true;
    }

    // Sunset banner (before first nighttime hour)
    if (!sunsetBannerAdded && h.isNight) {
      timelineItems.push({
        type: 'banner',
        data: BANNER_TEMPLATES.sunset(fmt(schedule.sunset)),
        key: 'sunset',
      });
      sunsetBannerAdded = true;
    }

    // Moon phase banner (after 3rd hour)
    if (!moonBannerAdded && i === 3 && moonPhase) {
      timelineItems.push({
        type: 'banner',
        data: BANNER_TEMPLATES.moonPhase(moonPhase),
        key: 'moon',
      });
      moonBannerAdded = true;
    }

    // Mercury retro banner (after 6th hour if retro)
    if (!mercuryBannerAdded && i === 6 && mercuryStatus?.isRetro) {
      timelineItems.push({
        type: 'banner',
        data: BANNER_TEMPLATES.mercuryRetro(),
        key: 'mercury',
      });
      mercuryBannerAdded = true;
    }

    // Peak hour banner (just before peak hours that haven't passed)
    const planet = PLANETS[h.planetKey];
    if (planet?.peak && !h.isPast && h.isActive) {
      timelineItems.push({
        type: 'banner',
        data: BANNER_TEMPLATES.peakHour(planet.name),
        key: `peak-${i}`,
      });
    }

    // Hour card
    timelineItems.push({
      type: 'hour',
      data: h,
      index: i,
      key: `hour-${i}`,
    });
  });

  // Current hour info for hero
  const currentHour = schedule.hours.find(h => h.isActive);
  const currentPlanet = currentHour ? PLANETS[currentHour.planetKey] : null;
  const currentContent = currentHour
    ? getPersonalizedContent(currentHour.planetKey, new Date(), userProfile, cosmicState)
    : null;


  // Unlock penceresi: sadece [aktif-1, aktif, aktif+1]
  const activeHourIdx = schedule.hours.findIndex(h => h.isActive);
  const isHourLocked = (hourIndex) => {
    // -----------------------------------------------------
    // EMİRALP'E ÖZEL KİLİTSİZ MOD (Tüm saatler görünür)
    // Eski kilitli hale dönmek için bu fonksiyonu alttakiyle değiştir
    return false; 
    
    /* ESKİ KİLİT MANTIĞI:
    if (activeHourIdx < 0) return false;
    if (hourIndex < activeHourIdx - 1) return 'past';    // geçmiş — kilitli
    if (hourIndex > activeHourIdx + 1) return 'future';  // gelecek — kilitli
    return false; // açık pencere
    */
    // -----------------------------------------------------
  };

  return (
    <div className="page" style={{ paddingBottom: '100px', overflowY: 'auto', position: 'relative' }}>

      {/* ── ATMOSFER OVERLAY ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '280px',
        background: getAtmosphereGradient(),
        pointerEvents: 'none', zIndex: 0,
        transition: 'background 2s ease',
      }} />

      {/* ── HEADER ── */}
      <div style={{
        padding: '40px 20px 0', animation: 'entry-reveal 0.6s both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/astroloji')}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', width: '40px', height: '40px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>arrow_back</span>
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>Altın Saatler</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
              {cityName} · {fmt(schedule.sunrise)} – {fmt(schedule.sunset)}
            </p>
          </div>
        </div>

        {/* Bilgi Baloncuğu */}
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowInfo(true)}
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '10px 14px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '12px',
              textAlign: 'left',
              width: '100%',
              backdropFilter: 'blur(10px)',
              transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fbbf24' }}>auto_awesome</span>
            </div>
            
            <div style={{ flex: 1 }}>
              <span style={{
                fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)',
                lineHeight: '1.3', display: 'block',
              }}>
                Her saatin kendi gezegensel enerjisi var — binlerce yıllık kadim sistem.
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(251, 191, 36, 0.1)',
              padding: '4px 10px', borderRadius: '20px',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: '700', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>Nedir?</span>
              <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#fbbf24' }}>arrow_forward</span>
            </div>
          </button>
        </div>
      </div>

      {/* ── HERO — Şu Anki Saat ── */}
      {currentPlanet && currentHour && currentContent && (
        <div style={{ padding: '20px', animation: 'entry-reveal 0.6s 0.08s both' }}>
          <div style={{
            background: `linear-gradient(140deg, ${currentPlanet.color}18, ${currentPlanet.color}06)`,
            border: `1px solid ${currentPlanet.color}30`,
            borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden',
          }}>
            {/* Glows */}
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '160px', height: '160px', borderRadius: '50%',
              background: `${currentPlanet.color}20`, filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-20px', left: '-20px',
              width: '100px', height: '100px', borderRadius: '50%',
              background: `${currentPlanet.color}12`, filter: 'blur(30px)', pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Badge */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: `${currentPlanet.color}18`, border: `1px solid ${currentPlanet.color}40`,
                  borderRadius: '20px', padding: '4px 12px',
                }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: currentPlanet.color, display: 'inline-block',
                    animation: 'pulse 2s infinite',
                    boxShadow: `0 0 8px ${currentPlanet.color}`,
                  }} />
                  <span style={{
                    fontSize: '10px', fontWeight: '700', letterSpacing: '0.15em',
                    color: currentPlanet.color, textTransform: 'uppercase',
                  }}>
                    Şu An · {fmt(currentHour.start)} – {fmt(currentHour.end)}
                  </span>
                </div>
                {/* Time slot badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px', padding: '3px 8px',
                }}>
                  <span className="material-symbols-outlined" style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.35)',
                  }}>{currentContent.timeSlot.icon}</span>
                  <span style={{
                    fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '600',
                  }}>{currentContent.timeSlot.label}</span>
                </div>
              </div>

              {/* Planet + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: `${currentPlanet.color}20`, border: `2px solid ${currentPlanet.color}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px', flexShrink: 0, color: '#fff',
                  boxShadow: `0 8px 24px ${currentPlanet.color}30`,
                  fontFamily: 'serif',
                }}>
                  {currentPlanet.symbol}
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', lineHeight: 1 }}>
                    {currentPlanet.name} Saati
                  </div>
                  <div style={{ fontSize: '0.82rem', color: currentPlanet.color, marginTop: '4px', fontWeight: '600' }}>
                    {currentPlanet.tagline}
                  </div>
                  {currentHour.isNight && (
                    <div style={{
                      fontSize: '0.7rem', color: 'rgba(167,139,250,0.5)',
                      marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>dark_mode</span>
                      Gece Döngüsü
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.65',
                margin: '0 0 18px', fontStyle: 'italic',
              }}>
                "{currentContent.description}"
              </p>

              {/* Dos & Donts grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52,211,153,0.15)',
                  borderRadius: '16px', padding: '14px',
                }}>
                  <div style={{
                    fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
                    color: '#34d399', marginBottom: '10px', textTransform: 'uppercase',
                  }}>✓ Şimdi Yap</div>
                  {currentContent.dos.map((item, i) => (
                    <div key={i} style={{
                      fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)',
                      lineHeight: '1.5', marginBottom: '6px',
                      display: 'flex', alignItems: 'flex-start', gap: '6px',
                    }}>
                      <span style={{ color: '#34d399', flexShrink: 0, marginTop: '1px' }}>›</span>
                      {item}
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'rgba(248, 113, 113, 0.06)', border: '1px solid rgba(248,113,113,0.15)',
                  borderRadius: '16px', padding: '14px',
                }}>
                  <div style={{
                    fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em',
                    color: '#f87171', marginBottom: '10px', textTransform: 'uppercase',
                  }}>✗ Kaçın</div>
                  {currentContent.donts.map((item, i) => (
                    <div key={i} style={{
                      fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)',
                      lineHeight: '1.5', marginBottom: '6px',
                      display: 'flex', alignItems: 'flex-start', gap: '6px',
                    }}>
                      <span style={{ color: '#f87171', flexShrink: 0, marginTop: '1px' }}>›</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Kişisel katmanlar — hero'da */}
              {(currentContent.genderTip || currentContent.relationshipNote || currentContent.zodiacNote) && (
                <div style={{
                  marginTop: '14px', padding: '12px 14px',
                  background: `${currentPlanet.color}08`,
                  border: `1px solid ${currentPlanet.color}18`,
                  borderRadius: '14px',
                }}>
                  <div style={{
                    fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em',
                    color: currentPlanet.color, marginBottom: '6px', textTransform: 'uppercase', opacity: 0.7,
                  }}>✦ Sana Özel</div>
                  {currentContent.zodiacNote && (
                    <p style={{
                      fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)',
                      lineHeight: '1.55', margin: '0 0 6px',
                      fontWeight: '500',
                    }}>{currentContent.zodiacNote}</p>
                  )}
                  {currentContent.genderTip && (
                    <p style={{
                      fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)',
                      lineHeight: '1.55', margin: '0 0 4px',
                    }}>{currentContent.genderTip}</p>
                  )}
                  {currentContent.relationshipNote && (
                    <p style={{
                      fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)',
                      lineHeight: '1.55', margin: 0, fontStyle: 'italic',
                    }}>{currentContent.relationshipNote}</p>
                  )}
                </div>
              )}

              {/* Kozmik fısıltı — hero'da */}
              {(currentContent.cosmicWhisper || currentContent.mercuryWarning) && (
                <div style={{
                  marginTop: '12px', padding: '10px 14px',
                  background: currentContent.mercuryWarning
                    ? 'rgba(248,113,113,0.06)'
                    : 'rgba(196,181,253,0.06)',
                  border: `1px solid ${currentContent.mercuryWarning
                    ? 'rgba(248,113,113,0.15)'
                    : 'rgba(196,181,253,0.15)'}`,
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                }}>
                  <span className="material-symbols-outlined" style={{
                    fontSize: '16px',
                    color: currentContent.mercuryWarning ? '#f87171' : '#c4b5fd',
                    flexShrink: 0, marginTop: '1px',
                  }}>{currentContent.mercuryWarning ? 'sync_problem' : 'auto_awesome'}</span>
                  <p style={{
                    fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)',
                    lineHeight: '1.5', margin: 0,
                  }}>
                    {currentContent.mercuryWarning || currentContent.cosmicWhisper}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── KÂHİNİN YORUMU — Günlük Oracle ── */}
      {dailyOracle && (
        <div style={{ padding: '0 20px 8px', animation: 'entry-reveal 0.6s 0.15s both' }}>
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '18px',
            padding: '16px 18px',
            background: 'rgba(200, 169, 250, 0.04)',
            border: '1px solid rgba(200, 169, 250, 0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}>
            {/* Dekoratif glow */}
            <div style={{
              position: 'absolute', top: '-30px', right: '-20px',
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'rgba(200, 169, 250, 0.08)', filter: 'blur(30px)',
              pointerEvents: 'none',
            }} />

            {/* Başlık */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CassiopeiaLogo size={22} color="#c8a9fa" />
                </span>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c8a9fa', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Kâhinin Yorumu
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>
                    Ay bugün {dailyOracle.moonSign}'da {dailyOracle.moonIcon}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.04)',
                padding: '3px 8px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                Günlük
              </div>
            </div>

            {/* Mesaj */}
            <div style={{
              fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)',
              lineHeight: '1.65', fontStyle: 'italic',
              position: 'relative', zIndex: 1,
            }}>
              "{dailyOracle.message}"
            </div>
          </div>
        </div>
      )}

      {/* ── TIMELINE ── */}
      <div style={{ padding: '0 20px', animation: 'entry-reveal 0.6s 0.2s both' }}>
        <div style={{
          fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          24 Saatlik Kozmik Akış
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {timelineItems.map((item) => {
            if (item.type === 'banner') {
              return <CosmicBanner key={item.key} banner={item.data} />;
            }

            const h = item.data;
            const content = getPersonalizedContent(h.planetKey, h.start, userProfile, cosmicState);

            const locked = isHourLocked(h.hourIndex);
            return (
              <HourCard
                key={item.key}
                h={h}
                isExpanded={expandedIdx === item.index}
                onToggle={() => setExpandedIdx(expandedIdx === item.index ? null : item.index)}
                content={locked ? null : content}
                isLocked={locked}
                cosmicState={cosmicState}
              />
            );
          })}
        </div>

        <p style={{
          fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)',
          textAlign: 'center', marginTop: '20px', lineHeight: '1.5',
        }}>
          {cityName} koordinatlarına göre gerçek gün doğumu/batımı hesaplanmıştır.<br />
          Gündüz saatleri {fmt(schedule.sunrise)}–{fmt(schedule.sunset)} | Gece saatleri {fmt(schedule.sunset)}–{fmt(schedule.nextSunrise)}
        </p>
      </div>

      {/* ── INFO MODAL ── */}
      {showInfo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
          zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', animation: 'fade-in 0.3s ease',
        }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(20,20,30,0.9), rgba(10,10,15,0.95))',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '400px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: '-50px', right: '-50px',
              width: '150px', height: '150px', borderRadius: '50%',
              background: 'rgba(251, 191, 36, 0.15)', filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            
            <button onClick={() => setShowInfo(false)} style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', padding: '4px', zIndex: 2,
            }}>
              <span className="material-symbols-outlined">close</span>
            </button>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#fbbf24' }}>auto_awesome</span>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: '700' }}>Keldani Saatleri Nedir?</h3>
              </div>

              <div style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0 }}>
                  Gezegen saatleri "uydurulmuş" popüler bir konsept değil, kadim astrolojide <strong style={{color:'#fff'}}>Keldani Sıralaması (Chaldean Order)</strong> olarak bilinen binlerce yıllık gerçek bir sistemdir.
                </p>
                <p style={{ margin: 0 }}>
                  Eski astrologlar gökyüzünü izlerken, günün ve gecenin her bir saatini farklı bir gezegenin enerjisinin yönettiğini keşfetmişler.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ marginBottom: '6px' }}><span style={{color: '#f87171'}}>♂ Mars:</span> Krallar savaşa giderken beklerdi. (Kazanmak için)</div>
                  <div style={{ marginBottom: '6px' }}><span style={{color: '#a78bfa'}}>☿ Merkür:</span> Tüccarlar imza atarken beklerdi. (Kar için)</div>
                  <div><span style={{color: '#f472b6'}}>♀ Venüs:</span> Aşıklar evlenirken beklerdi. (Sonsuz uyum için)</div>
                </div>
                <p style={{ margin: 0 }}>
                  Astrolojide doğum haritan senin <em>"Kim"</em> olduğunu söylerken, Gezegen Saatleri sana <em>"Ne zaman?"</em> sorusunun cevabını verir. 
                </p>
                <p style={{ margin: 0, color: '#fbbf24', fontWeight: '600', fontStyle: 'italic' }}>
                  Yani burası senin takvim asistanın. Hayattaki başarının sırrı doğru şeyi, doğru gezegenin saatinde yapmaktır!
                </p>
              </div>

              <button 
                onClick={() => setShowInfo(false)}
                style={{
                  width: '100%', padding: '14px', borderRadius: '16px',
                  background: 'var(--accent)', color: 'var(--bg)',
                  fontWeight: '700', fontSize: '0.95rem', border: 'none',
                  marginTop: '24px', cursor: 'pointer'
                }}
              >
                Anladım, Planıma Dön
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
