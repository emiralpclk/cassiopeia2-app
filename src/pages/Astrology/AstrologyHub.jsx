import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppContext';
import CassiopeiaLogo from '../../components/CassiopeiaLogo';
import { getMoonPhase, getPlanetStatus } from '../../utils/cosmicUtils';
import natalChartImg from '../../assets/natal_chart_wheel.png';

const MOON_ICONS = {
  'Yeni Ay': 'nightlight', 'Hilal': 'nightlight_round', 'İlk Dördün': 'brightness_4',
  'Büyüyen Ay': 'brightness_6', 'Dolunay': 'brightness_1', 'Küçülen Ay': 'brightness_5',
  'Son Dördün': 'brightness_4', 'Balzamik Ay': 'nightlight',
};

// ─── Gezegen Transit Saatleri (Planetary Hours) için yardımcı ───────────────
function getPlanetaryHours() {
  const now = new Date();
  const sunrise = new Date(now); sunrise.setHours(6, 30, 0, 0);
  const sunset = new Date(now); sunset.setHours(20, 30, 0, 0);
  const dayLength = sunset - sunrise;
  const hourLen = dayLength / 12;

  const dayPlanets = ['Güneş', 'Venüs', 'Merkür', 'Ay', 'Satürn', 'Jüpiter', 'Mars'];
  const daySymbols = ['☀️', '♀️', '☿️', '☽', '♄', '♃', '♂️']; // These will be rendered as text-only symbols
  const dayOfWeek = now.getDay(); // 0=Pazar
  const dayStart = [0, 3, 6, 2, 5, 1, 4]; // Her gün hangi gezegenle başlar

  const elapsed = now - sunrise;
  if (elapsed < 0 || elapsed > dayLength) {
    return { planet: '☽ Ay', label: 'Gece Vakti', nextChange: null };
  }

  const hourIndex = Math.floor(elapsed / hourLen);
  const startIdx = dayStart[dayOfWeek];
  const currentPlanetIdx = (startIdx + hourIndex) % 7;
  const nextHourStart = new Date(sunrise.getTime() + (hourIndex + 1) * hourLen);

  return {
    planet: dayPlanets[currentPlanetIdx],
    symbol: daySymbols[currentPlanetIdx],
    label: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} – geçerli saat`,
    nextChange: nextHourStart,
  };
}

function getDaysUntil(date) {
  const now = new Date();
  const diff = date.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ─── Planet Color Map ────────────────────────────────────────────────────────
const PLANET_COLORS = {
  'Güneş':   '#fbbf24',
  'Venüs':   '#f472b6',
  'Merkür':  '#a78bfa',
  'Ay':      '#c4b5fd',
  'Satürn':  '#94a3b8',
  'Jüpiter': '#34d399',
  'Mars':    '#f87171',
};

// ─── ModuleCard Component ────────────────────────────────────────────────────
function ModuleCard({ module, index, onClick }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={`astro-module-card ${module.locked ? 'locked' : ''}`}
      style={{
        animation: `entry-reveal 0.7s ${0.08 + index * 0.08}s both`,
        '--module-color': module.color,
        position: 'relative',
        opacity: module.locked ? 0.6 : 1,
        transform: isPressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: module.locked ? 'default' : 'pointer',
      }}
      onClick={() => !module.locked && onClick(module)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Işıltı Efekti */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
        background: `radial-gradient(ellipse at 30% 20%, ${module.color}18 0%, transparent 60%)`,
      }} />

      {/* Sol: Bilgi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {module.id === 'cosmic-identity' ? (
            <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CassiopeiaLogo size={28} color={module.color} />
            </div>
          ) : (
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: module.color }}>{module.icon}</span>
          )}
          <div>
            <h3 style={{
              fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)',
              margin: 0, letterSpacing: '-0.01em',
            }}>{module.name}</h3>
            {module.badge && (
              <span style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: module.color,
                background: `${module.color}18`,
                border: `1px solid ${module.color}30`,
                borderRadius: '6px', padding: '2px 7px',
                display: 'inline-block', marginTop: '2px',
              }}>{module.badge}</span>
            )}
          </div>
        </div>
        <p style={{
          fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0,
          lineHeight: '1.5', paddingLeft: '32px', whiteSpace: 'pre-line',
        }}>{module.description}</p>
      </div>

      {/* Sağ: Durum */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {module.locked
          ? <span style={{
              fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '4px 10px',
            }}>YAKINDA</span>
          : <span className="material-symbols-outlined" style={{
              fontSize: '20px', color: `${module.color}80`,
            }}>chevron_right</span>
        }
      </div>
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AstrologyHub() {
  const navigate = useNavigate();
  const { profiles, activeProfileId } = useAppState();
  const [planetaryHour, setPlanetaryHour] = useState(null);
  const [moonPhase, setMoonPhase] = useState(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const hasChart = activeProfile?.birthPlace && activeProfile?.birthDistrict;

  useEffect(() => {
    setPlanetaryHour(getPlanetaryHours());
    const interval = setInterval(() => setPlanetaryHour(getPlanetaryHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof getMoonPhase === 'function') {
      setMoonPhase(getMoonPhase());
    }
  }, []);

  const planetColor = planetaryHour ? (PLANET_COLORS[planetaryHour.planet] || '#c4b5fd') : '#c4b5fd';

  // ─── Canlı Kozmik Takvim ─────────────────────────────────────────────────
  const mercuryStatus = getPlanetStatus('Mercury');
  const daysToMercuryRetro = mercuryStatus.daysToRetro || 0;
  const mercuryRetroDate = daysToMercuryRetro > 0
    ? new Date(Date.now() + daysToMercuryRetro * 86400000)
    : null;

  // Venüs Retrosu: 1 Mart 2025, Güneş Tutulmaları: 2026 ve 2027 gerçek tarihleri
  const COSMIC_EVENTS = [
    mercuryRetroDate && {
      id: 'mercury-retro',
      title: 'Merkür Retrosu',
      description: mercuryStatus.currentSign ? `${mercuryStatus.currentSign} burcunda · İletişim dönemi` : 'İletişim ve seyahat dönemi',
      date: mercuryRetroDate,
      color: '#a78bfa',
      icon: '☿',
      days: daysToMercuryRetro,
    },
    {
      id: 'solar-eclipse',
      title: 'Güneş Tutulması',
      description: 'Başlangıç enerjisi zirveye çıkıyor',
      date: new Date('2026-08-02'), // Gerçek tarih: 2026 Ağustos Tam Güneş Tutulması
      color: '#fbbf24',
      icon: '●',
      days: getDaysUntil(new Date('2026-08-02')),
    },
    {
      id: 'venus-retro',
      title: 'Venüs Retrosu',
      description: 'İlişkiler ve değerler yeniden doğuyor',
      date: new Date('2026-10-03'), // Gerçek tarih: Venüs 3 Ekim–13 Kasım 2026
      color: '#f472b6',
      icon: '♀',
      days: getDaysUntil(new Date('2026-10-03')),
    },
  ].filter(Boolean).filter(e => (e.days || getDaysUntil(e.date)) > 0);

  const nextEvent = COSMIC_EVENTS[0] || null;

  const MODULES = [
    {
      id: 'cosmic-bond',
      name: 'Kozmik Bağ',
      description: 'İki ruhun uyumunu analiz et\nSynastri haritası',
      icon: 'join_inner',
      color: '#f472b6',
      badge: 'YAKINDA',
      locked: true,
    },
  ];

  // Aktif profil bilgisi
  const profileName = activeProfile?.name || 'Sen';
  const profileZodiac = activeProfile?.zodiac || null;
  const ZODIAC_NAMES = {
    aries: 'Koç', taurus: 'Boğa', gemini: 'İkizler', cancer: 'Yengeç',
    leo: 'Aslan', virgo: 'Başak', libra: 'Terazi', scorpio: 'Akrep',
    sagittarius: 'Yay', capricorn: 'Oğlak', aquarius: 'Kova', pisces: 'Balık'
  };
  const zodiacName = profileZodiac ? (ZODIAC_NAMES[profileZodiac] || profileZodiac) : null;

  const handleModuleClick = (module) => {
    if (module.onClick) module.onClick();
  };

  return (
    <div className="page astrology-hub-page" style={{ paddingBottom: '100px' }}>

      {/* ── HEADER ── */}
      <div className="page-header" style={{ animation: 'entry-reveal 0.7s both' }}>
        <div>
          <h1 className="page-title">Astroloji</h1>
          <p className="page-subtitle">Gökyüzünün seni anlattığı yer</p>
        </div>
      </div>

      {/* ── ALTIN SAATLER KARTI ── */}
      {planetaryHour && (
        <div
          style={{ padding: '0 20px', marginBottom: '16px', animation: 'entry-reveal 0.7s 0.05s both' }}
          onClick={() => navigate('/astroloji/altin-saatler')}
        >
          <div style={{
            background: `linear-gradient(140deg, ${planetColor}18 0%, rgba(255,255,255,0.03) 60%)`,
            border: `1px solid ${planetColor}30`,
            borderRadius: '24px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}>
            {/* Arka plan glow */}
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '150px', height: '150px', borderRadius: '50%',
              background: `${planetColor}20`, filter: 'blur(50px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-20px', left: '-20px',
              width: '80px', height: '80px', borderRadius: '50%',
              background: `${planetColor}15`, filter: 'blur(30px)',
              pointerEvents: 'none',
            }} />

            {/* Üst: Başlık + Ay */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px', position: 'relative', zIndex: 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: '900', letterSpacing: '0.25em',
                  color: '#fbbf24', textTransform: 'uppercase',
                  textShadow: '0 0 12px rgba(251, 191, 36, 0.8)',
                }}>
                  Altın Saatler
                </span>
                <div style={{
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  borderRadius: '6px', padding: '2px 8px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#fbbf24', display: 'inline-block',
                    boxShadow: '0 0 8px #fbbf24',
                    animation: 'pulse 1.5s infinite',
                  }} />
                  <span style={{ fontSize: '9px', fontWeight: '800', color: '#fbbf24', letterSpacing: '0.05em' }}>CANLI</span>
                </div>
              </div>
              {moonPhase && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: planetColor }}>
                    {MOON_ICONS[moonPhase.name] || 'nightlight_round'}
                  </span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '600' }}>{moonPhase.name}</span>
                </div>
              )}
            </div>

            {/* Orta: Şu anki gezegen */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              marginBottom: '16px', position: 'relative', zIndex: 1,
            }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${planetColor}30, ${planetColor}10)`,
                border: `1.5px solid ${planetColor}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', color: '#fff',
                boxShadow: `0 8px 25px ${planetColor}40`,
                fontFamily: 'serif', fontStyle: 'italic'
              }}>
                {planetaryHour.symbol}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: `${planetColor}`, fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px', opacity: 0.8 }}>
                  Aktif Enerji
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {planetaryHour.planet} Saati
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontWeight: '500' }}>
                  {planetaryHour.nextChange
                    ? `${planetaryHour.nextChange.getHours().toString().padStart(2,'0')}:${planetaryHour.nextChange.getMinutes().toString().padStart(2,'0')}'de döngü değişiyor`
                    : 'Gece döngüsünde'}
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <p style={{
              fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.5',
              margin: '0 0 18px', position: 'relative', zIndex: 1, fontWeight: '400'
            }}>
              Anın yöneticisi <span style={{ color: planetColor, fontWeight: '700' }}>{planetaryHour.planet}</span>. Bu saat diliminde hangi adımları atmalısın, hangi konularda geri durmalısın? Öğrenmek için tıkla.
            </p>

            {/* CTA Butonu — Daha kibar ve transparan (Hierarchy Fix) */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: `${planetColor}15`,
              border: `1px solid ${planetColor}40`,
              backdropFilter: 'blur(10px)',
              borderRadius: '14px',
              padding: '10px 16px',
              position: 'relative',
              zIndex: 1,
              marginTop: '4px'
            }}>
              <span style={{ 
                fontSize: '0.85rem', 
                fontWeight: '800', 
                color: planetColor, 
                letterSpacing: '-0.01em' 
              }}>
                Akışı Detaylandır
              </span>
              <span className="material-symbols-outlined" style={{ 
                fontSize: '18px', 
                color: planetColor, 
                fontWeight: '900' 
              }}>arrow_forward</span>
            </div>
          </div>
        </div>
      )}


      {/* ── DOĞUM HARITAN HERO KARTI ── */}
      <div
        style={{ padding: '0 20px', marginBottom: '16px', animation: 'entry-reveal 0.7s 0.12s both', cursor: 'pointer' }}
        onClick={() => navigate('/astroloji/giris')}
      >
        <div style={{
          position: 'relative',
          background: 'linear-gradient(140deg, rgba(167,139,250,0.18) 0%, rgba(13,14,26,0.95) 60%)',
          border: '1px solid rgba(167,139,250,0.3)',
          borderRadius: '24px',
          padding: '24px 20px',
          overflow: 'hidden',
          minHeight: '160px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(167,139,250,0.12)',
        }}>

          {/* Arka plan glow */}
          <div style={{
            position: 'absolute', top: '-60px', left: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(167,139,250,0.12)', filter: 'blur(60px)',
            pointerEvents: 'none',
          }} />

          {/* Dönen Harita Görüntüsü */}
          <div style={{
            position: 'absolute',
            right: '-30px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '200px',
            height: '200px',
            opacity: 0.35,
            pointerEvents: 'none',
          }}>
            <img
            src={natalChartImg}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                animation: 'chart-spin 80s linear infinite',
                filter: 'saturate(1.2) brightness(1.1)',
              }}
            />
          </div>

          {/* Sol: İçerik */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '60%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{
                fontSize: '10px', fontWeight: '900', letterSpacing: '0.2em',
                color: '#a78bfa', textTransform: 'uppercase',
              }}>Kozmik Kimlik</span>
              <span style={{
                fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em',
                color: hasChart ? '#4ade80' : '#fbbf24',
                background: hasChart ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.12)',
                border: `1px solid ${hasChart ? 'rgba(74,222,128,0.3)' : 'rgba(251,191,36,0.3)'}`,
                borderRadius: '6px', padding: '2px 8px',
                textTransform: 'uppercase',
              }}>{hasChart ? 'Hazır' : 'Kurulum Gerekli'}</span>
            </div>

            <h2 style={{
              fontSize: '1.55rem', fontWeight: '900', color: '#fff',
              margin: '0 0 4px', letterSpacing: '-0.02em', lineHeight: 1.1,
            }}>Doğum Haritan</h2>

            {zodiacName ? (
              <p style={{
                fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)',
                margin: '0 0 18px', lineHeight: '1.5',
              }}>
                {profileName} · {zodiacName} Burcu
              </p>
            ) : (
              <p style={{
                fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)',
                margin: '0 0 18px', lineHeight: '1.5',
              }}>
                Gezegenlerini ve kader çizgini keşfet
              </p>
            )}

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(167,139,250,0.15)',
              border: '1px solid rgba(167,139,250,0.35)',
              borderRadius: '14px', padding: '10px 16px',
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#a78bfa' }}>Haritanı Aç</span>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#a78bfa' }}>arrow_forward</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DİĞER MODÜLLER (Kozmik Bağ) ── */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {MODULES.map((module, index) => (
          <ModuleCard
            key={module.id}
            module={module}
            index={index}
            onClick={handleModuleClick}
          />
        ))}
      </div>

      {/* ── KOZMİK GERİ SAYIM ── */}
      {nextEvent && (
        <div style={{ padding: '0 20px', marginBottom: '20px', animation: 'entry-reveal 0.7s 0.35s both' }}>
          <div style={{
            background: `linear-gradient(135deg, ${nextEvent.color}12, transparent)`,
            border: `1px solid ${nextEvent.color}25`,
            borderRadius: '20px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
              background: `radial-gradient(circle, ${nextEvent.color}18 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            <div style={{ fontSize: '10px', color: `${nextEvent.color}99`, fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Kozmik Takvim
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative', zIndex: 1 }}>
              <span style={{ 
                fontSize: '32px', color: nextEvent.color, 
                fontFamily: 'serif', fontWeight: '400', lineHeight: 1,
                width: '32px', textAlign: 'center'
              }}>
                {nextEvent.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>{nextEvent.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>{nextEvent.description}</div>
              </div>
              <div style={{
                background: `${nextEvent.color}18`,
                border: `1px solid ${nextEvent.color}35`,
                borderRadius: '14px',
                padding: '8px 14px',
                textAlign: 'center',
                flexShrink: 0,
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: nextEvent.color, lineHeight: 1 }}>
                  {getDaysUntil(nextEvent.date)}
                </div>
                <div style={{ fontSize: '9px', color: `${nextEvent.color}80`, letterSpacing: '0.1em', fontWeight: '700', textTransform: 'uppercase', marginTop: '2px' }}>
                  GÜN
                </div>
              </div>
            </div>

            {/* Tüm Etkinlikler Mini Listesi */}
            <div style={{
              marginTop: '16px', paddingTop: '14px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              {COSMIC_EVENTS.filter(e => getDaysUntil(e.date) > 0).slice(0, 3).map(event => (
                <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '16px', width: '20px', textAlign: 'center', color: event.color,
                    fontFamily: 'serif'
                  }}>{event.icon}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flex: 1 }}>{event.title}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: '700', color: event.color,
                    background: `${event.color}12`, border: `1px solid ${event.color}25`,
                    borderRadius: '8px', padding: '2px 9px',
                  }}>{getDaysUntil(event.date)} gün</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── LOGO ── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', paddingBottom: '12px', opacity: 0.7, animation: 'entry-reveal 1s 0.5s both' }}>
        <CassiopeiaLogo size={70} isLoading={true} color="var(--accent)" />
      </div>
    </div>
  );
}
