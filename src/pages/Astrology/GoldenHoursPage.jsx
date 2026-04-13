import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Gezegen Veri Tabanı ─────────────────────────────────────────────────────
const PLANET_DATA = {
  'Güneş': {
    symbol: '☉',
    name: 'Güneş',
    color: '#fbbf24',
    tagline: 'Öz İfade & Liderlik',
    description: 'Güneş saatinde enerji yüksek, özgüven zirvede. Kendini göstermek, önemli kararlar almak ve liderlik gerektiren her şey bu saatte ışıldar.',
    dos: ['Önemli bir toplantıya gir ya da sunum yap', 'Uzun süredir ertelediğin cesur adımı at', 'Kendinle ilgili önemli bir karar ver', 'Sahnede parlayacağın bir adım için başvur'],
    donts: ['Gizli kalmak veya arka planda durmak', 'Takdir edilmeyeceğini düşündüğün işler', 'Uzlaşma ve taviz gerektiren müzakereler'],
    peak: true,
  },
  'Venüs': {
    symbol: '♀',
    name: 'Venüs',
    color: '#f472b6',
    tagline: 'Aşk, Uyum & Güzellik',
    description: 'Venüs saatinde çekim gücün yükseliyor. İlişkiler, estetik, para ve kişisel çekiciliğin tavan yapacak saatler. Bağ kurmak için altın zaman.',
    dos: ['Sevdiğin birine mesaj at ya da ara', 'Kişisel bakım için zaman ayır', 'Yeni bir bağlantı için adım at', 'Sanatsal veya yaratıcı bir işe başla', 'Önemli bir alışveriş veya yatırım yap'],
    donts: ['Ciddi ve soğuk iş görüşmeleri', 'Tartışma veya yüzleşme', 'Tek başına kapalı ortamlarda çalışmak'],
    peak: true,
  },
  'Merkür': {
    symbol: '☿',
    name: 'Merkür',
    color: '#a78bfa',
    tagline: 'İletişim & Zeka',
    description: 'Merkür saatinde zihin çalışıyor, kelimeler akıyor. Yazışmalar, müzakereler, öğrenme ve iletişim gerektiren her şey için biçilmiş kaftan.',
    dos: ['Önemli e-postalar veya mesajlar gönder', 'Bir konuşma, müzakere veya sunum yap', 'Yeni bir şey öğren ya da araştır', 'Sözleşme veya anlaşmaları gözden geçir'],
    donts: ['Monoton fiziksel işler', 'Duygusal açıdan ağır kararlar', 'Spor veya bedeni yorucu aktiviteler'],
    peak: false,
  },
  'Ay': {
    symbol: '☽',
    name: 'Ay',
    color: '#c4b5fd',
    tagline: 'Sezgi & Duygu',
    description: 'Ay saatinde sezgiler güçlü, duygular yoğun. Aile, ev, içsel yolculuk ve ruhsal konular için en derin saatler.',
    dos: ['Aile veya sevdiklerinle vakit geç', 'Günlük yaz veya iç sesini dinle', 'Ev ile ilgili konuları ele al', 'Meditasyon veya nefes çalışması yap'],
    donts: ['Büyük ve rasyonel kararlar almak', 'Agresif müzakereler', 'İş hayatında risk almak'],
    peak: false,
  },
  'Satürn': {
    symbol: '♄',
    name: 'Satürn',
    color: '#94a3b8',
    tagline: 'Disiplin & Yapı',
    description: 'Satürn saatinde ciddiyet hâkim, yapı ve düzen ön plana geçiyor. Zor ama gerekli işleri halletmek, borçları ödemek ve sistem kurmak için ideal.',
    dos: ['Uzun süredir ertelediğin zor işi bitir', 'Bütçe, borç veya mali konuları ele al', 'Sistematik ve planlı çalış', 'Disiplin gerektiren projeleri başlat'],
    donts: ['Eğlence ve sosyal aktiviteler', 'Duygusal konuşmalar', 'Yeni ve renkli başlangıçlar'],
    peak: false,
  },
  'Jüpiter': {
    symbol: '♃',
    name: 'Jüpiter',
    color: '#34d399',
    tagline: 'Şans & Genişleme',
    description: 'Jüpiter saatinde kapılar açılıyor, fırsatlar büyüyor. Büyük hayaller, cesur adımlar ve bolluk için gökyüzünün en cömert saati.',
    dos: ['Büyük bir fırsata başvur veya teklif yap', 'Uzun vadeli planlar kur', 'Birini mentor olarak yaklaşmak için ara', 'Öğrenme veya eğitim başlat'],
    donts: ['Küçük detaylara boğulmak', 'Karamsar veya kısıtlayıcı düşünceler', 'Reddedilme korkusuyla ertelemek'],
    peak: true,
  },
  'Mars': {
    symbol: '♂',
    name: 'Mars',
    color: '#f87171',
    tagline: 'Eylem & Cesaret',
    description: 'Mars saatinde enerji alev alev. Harekete geçmek, cesur kararlar almak, rekabetçi ortamlarda öne çıkmak için en güçlü zaman.',
    dos: ['Spor veya fiziksel aktivite yap', 'Uzun süredir ertelediğin cesur adımı at', 'Rekabetçi bir durumda öne çık', 'Savunman gereken bir şef için konuş'],
    donts: ['Narin ve duygusal konuşmalar', 'Sabır gerektiren, uzun soluklu işler', 'Dinlenme ve pasif aktiviteler'],
    peak: false,
  },
};

// ─── Gezegen Saat Hesaplayıcı ────────────────────────────────────────────────
const PLANET_ORDER = ['Güneş', 'Venüs', 'Merkür', 'Ay', 'Satürn', 'Jüpiter', 'Mars'];
const DAY_START_PLANET = [0, 3, 6, 2, 5, 1, 4]; // 0=Paz, 1=Pzt... hangi indeksten başlar

function buildDaySchedule() {
  const now = new Date();
  const sunrise = new Date(now); sunrise.setHours(6, 30, 0, 0);
  const sunset  = new Date(now); sunset.setHours(20, 30, 0, 0);
  const dayLen  = sunset - sunrise;
  const hourLen = dayLen / 12;

  const dayOfWeek  = now.getDay();
  const startIdx   = DAY_START_PLANET[dayOfWeek];

  const hours = [];
  for (let i = 0; i < 12; i++) {
    const planetKey = PLANET_ORDER[(startIdx + i) % 7];
    const start = new Date(sunrise.getTime() + i * hourLen);
    const end   = new Date(sunrise.getTime() + (i + 1) * hourLen);
    const isActive = now >= start && now < end;
    const isPast   = now >= end;
    hours.push({ planetKey, start, end, isActive, isPast });
  }
  return { hours, now };
}

function fmt(date) {
  return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function GoldenHoursPage() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(buildDaySchedule);
  const [expandedIdx, setExpandedIdx] = useState(null);

  useEffect(() => {
    const iv = setInterval(() => setSchedule(buildDaySchedule()), 60000);
    return () => clearInterval(iv);
  }, []);

  const currentHour = schedule.hours.find(h => h.isActive);
  const currentPlanet = currentHour ? PLANET_DATA[currentHour.planetKey] : null;
  const peakHours = schedule.hours.filter(h => PLANET_DATA[h.planetKey]?.peak && !h.isPast);

  return (
    <div className="page" style={{ paddingBottom: '100px', overflowY: 'auto' }}>

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '40px 20px 0', animation: 'entry-reveal 0.6s both',
      }}>
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
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>Gökyüzünün günlük enerji akışı</p>
        </div>
      </div>

      {/* ── ŞU ANKİ SAAT — HERO KART ── */}
      {currentPlanet && currentHour && (
        <div style={{ padding: '20px', animation: 'entry-reveal 0.6s 0.08s both' }}>
          <div style={{
            background: `linear-gradient(135deg, ${currentPlanet.color}20, ${currentPlanet.color}08)`,
            border: `1px solid ${currentPlanet.color}35`,
            borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '160px', height: '160px', borderRadius: '50%',
              background: `${currentPlanet.color}25`, filter: 'blur(40px)', pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: `${currentPlanet.color}18`, border: `1px solid ${currentPlanet.color}40`,
                borderRadius: '20px', padding: '4px 12px', marginBottom: '16px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentPlanet.color, display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.15em', color: currentPlanet.color, textTransform: 'uppercase' }}>
                  Şu An · {fmt(currentHour.start)} – {fmt(currentHour.end)}
                </span>
              </div>

              {/* Planet + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
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
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', lineHeight: 1 }}>
                    {currentPlanet.name} Saati
                  </div>
                  <div style={{ fontSize: '0.82rem', color: currentPlanet.color, marginTop: '4px', fontWeight: '600' }}>
                    {currentPlanet.tagline}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.65',
                margin: '0 0 20px',
              }}>
                {currentPlanet.description}
              </p>

              {/* Dos & Donts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{
                  background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52,211,153,0.15)',
                  borderRadius: '16px', padding: '14px',
                }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', color: '#34d399', marginBottom: '10px', textTransform: 'uppercase' }}>
                    ✓ Şimdi Yap
                  </div>
                  {currentPlanet.dos.slice(0, 3).map((item, i) => (
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
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', color: '#f87171', marginBottom: '10px', textTransform: 'uppercase' }}>
                    ✗ Kaçın
                  </div>
                  {currentPlanet.donts.slice(0, 3).map((item, i) => (
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
            </div>
          </div>
        </div>
      )}

      {/* ── BUGÜNÜN PARLAMA ANLARI ── */}
      {peakHours.length > 0 && (
        <div style={{ padding: '0 20px 16px', animation: 'entry-reveal 0.6s 0.16s both' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,215,0,0.03))',
            border: '1px solid rgba(255,215,0,0.15)', borderRadius: '20px', padding: '18px 20px',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em',
              color: 'rgba(255,215,0,0.7)', textTransform: 'uppercase', marginBottom: '14px',
            }}>
              ⭐ Bugünün Parlama Anları
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {peakHours.slice(0, 3).map((h, i) => {
                const p = PLANET_DATA[h.planetKey];
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: `${p.color}0c`, borderRadius: '12px',
                    padding: '10px 14px', border: `1px solid ${p.color}20`,
                  }}>
                    <span style={{ fontSize: '20px', color: p.color, fontFamily: 'serif' }}>{p.symbol}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{p.name} Saati</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>{p.tagline}</div>
                    </div>
                    <div style={{
                      fontSize: '0.78rem', fontWeight: '700', color: p.color,
                      background: `${p.color}15`, borderRadius: '10px', padding: '4px 10px',
                      border: `1px solid ${p.color}25`,
                    }}>
                      {fmt(h.start)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── GÜN ZAMANÇİZELGESİ ── */}
      <div style={{ padding: '0 20px', animation: 'entry-reveal 0.6s 0.24s both' }}>
        <div style={{
          fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          Günün Tüm Saatleri
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {schedule.hours.map((h, i) => {
            const p = PLANET_DATA[h.planetKey];
            const isExpanded = expandedIdx === i;

            return (
              <div
                key={i}
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                style={{
                  background: h.isActive
                    ? `linear-gradient(135deg, ${p.color}18, ${p.color}08)`
                    : h.isPast ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                  border: h.isActive
                    ? `1px solid ${p.color}40`
                    : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  opacity: h.isPast ? 0.45 : 1,
                  transition: 'all 0.25s ease',
                }}>

                {/* Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Planet emoji */}
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: h.isActive ? `${p.color}25` : 'rgba(255,255,255,0.04)',
                    border: h.isActive ? `1.5px solid ${p.color}50` : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0, color: h.isActive ? '#fff' : p.color,
                    fontFamily: 'serif',
                  }}>
                    {p.symbol}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.9rem', fontWeight: h.isActive ? '700' : '600',
                        color: h.isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                      }}>
                        {p.name} Saati
                      </span>
                      {h.isActive && (
                        <span style={{
                          fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em',
                          color: p.color, background: `${p.color}20`,
                          border: `1px solid ${p.color}35`,
                          borderRadius: '6px', padding: '2px 7px', textTransform: 'uppercase',
                        }}>
                          Şu An
                        </span>
                      )}
                      {p.peak && !h.isPast && (
                        <span style={{ fontSize: '12px' }}>⭐</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      {fmt(h.start)} – {fmt(h.end)} · {p.tagline}
                    </div>
                  </div>

                  {/* Chevron */}
                  <span className="material-symbols-outlined" style={{
                    fontSize: '18px', color: 'rgba(255,255,255,0.25)',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}>
                    chevron_right
                  </span>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div style={{
                    marginTop: '14px', paddingTop: '14px',
                    borderTop: `1px solid ${h.isActive ? p.color + '25' : 'rgba(255,255,255,0.06)'}`,
                    animation: 'fade-in 0.25s ease',
                  }}>
                    <p style={{
                      fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)',
                      lineHeight: '1.6', margin: '0 0 12px',
                    }}>
                      {p.description}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '9px', color: '#34d399', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Yapılacaklar</div>
                        {p.dos.slice(0, 2).map((d, j) => (
                          <div key={j} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', marginBottom: '4px' }}>
                            <span style={{ color: '#34d399' }}>›</span> {d}
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '9px', color: '#f87171', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Kaçınılacaklar</div>
                        {p.donts.slice(0, 2).map((d, j) => (
                          <div key={j} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', marginBottom: '4px' }}>
                            <span style={{ color: '#f87171' }}>›</span> {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)',
          textAlign: 'center', marginTop: '20px', lineHeight: '1.5',
        }}>
          Günboyu (06:30–20:30) güneş saatleri hesaplanmıştır.<br />
          Gece saatleri gün batımı konumuna göre değişir.
        </p>
      </div>
    </div>
  );
}
