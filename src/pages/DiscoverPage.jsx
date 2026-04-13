import { useMemo, useState } from 'react';
import { getMoonPhase, getPlanetStatus, RETRO_SIGN_INSIGHTS, SIGN_INSIGHTS, SHADOW_ALERT, POST_RETRO_TEXT } from '../utils/cosmicUtils';
import { MoonPhase } from 'moon-phase-illuminated';
import { getUserProfile } from '../services/storage';
import { ZODIAC_SIGNS } from '../utils/constants';
import MysticIcon from '../components/MysticIcon';
import CassiopeiaLogo from '../components/CassiopeiaLogo';
import RetroTimer from '../components/RetroTimer';
import { useAppState } from '../context/AppContext';

export default function DiscoverPage() {
  const { isTestMode } = useAppState();

  // Test modu state'leri
  const ZODIAC_LIST = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
  const [testPhase, setTestPhase] = useState('direct'); // 'direct' | 'shadow' | 'retro'
  const [testSign, setTestSign] = useState('Koç');

  // ✅ Aşama 1 Performans Fix
  const stableNow = useMemo(() => new Date(), []);

  // Profil'den gelen gerçek burç
  const realUserZodiac = useMemo(() => {
    const profile = getUserProfile();
    if (!profile?.zodiac) return null;
    const zodiacEntry = ZODIAC_SIGNS.find(z => z.id === profile.zodiac);
    return zodiacEntry?.name || null;
  }, []);

  // Test modunda burç override'ı — tüm kişisel yazıları etkiler
  const userZodiac = isTestMode ? testSign : realUserZodiac;

  const moon = useMemo(() => getMoonPhase(stableNow), [stableNow]);
  // Mercury hesabı: test modunda testSign ve testPhase kullanıcıyı etkiler
  const mercury = useMemo(() => getPlanetStatus('Mercury', stableNow, userZodiac), [stableNow, userZodiac]);
  const venus = useMemo(() => getPlanetStatus('Venus', stableNow, userZodiac), [stableNow, userZodiac]);
  const mars = useMemo(() => getPlanetStatus('Mars', stableNow, userZodiac), [stableNow, userZodiac]);


  // Test modu: faz ve Mercury burcu override'ı (kullanıcı burcu artık userZodiac'dan geliyor)
  const mercuryDisplay = useMemo(() => {
    if (!isTestMode) return mercury;
    const isRetro = testPhase === 'retro';
    const isShadow = testPhase === 'shadow';
    const insight = isRetro
      ? (RETRO_SIGN_INSIGHTS[testSign] || mercury.signInsight)
      : (SIGN_INSIGHTS[testSign] || mercury.signInsight);

    // Kullanıcı burcuna göre kişisel içerik (userZodiac zaten testSign'a override edildi)
    const userSignInfo = isRetro
      ? (RETRO_SIGN_INSIGHTS[testSign] || SIGN_INSIGHTS[testSign] || null)
      : (SIGN_INSIGHTS[testSign] || null);
    const userDos = userSignInfo?.dos || insight?.dos || [];
    const userDonts = userSignInfo?.donts || insight?.donts || [];

    return {
      ...mercury,
      isRetro,
      isShadow,
      currentSign: testSign,
      signInsight: insight,
      userDos,
      userDonts,
      daysToRetro: isRetro ? 0 : isShadow ? 12 : 76,
      daysUntilEnd: isRetro ? 24 : isShadow ? 12 : 0,
      phaseText: isRetro ? 'RETROGRADE' : isShadow ? 'GÖLGE' : 'DIRECT',
    };
  }, [isTestMode, testPhase, testSign, mercury]);

  // Turkish suffix maps for dynamic ritual label
  const MOON_LOCATIVE = {
    'Yeni Ay': "Yeni Ay'da",
    'Hilal': "Hilal'de",
    'İlk Dördün': "İlk Dördün'de",
    'Büyüyen Ay': "Büyüyen Ay'da",
    'Dolunay': "Dolunay'da",
    'Küçülen Ay': "Küçülen Ay'da",
    'Son Dördün': "Son Dördün'de",
    'Balzamik Ay': "Balzamik Ay'da"
  };
  const ZODIAC_DATIVE = {
    'Koç': "Koç'a", 'Aslan': "Aslan'a", 'Yay': "Yay'a",
    'Boğa': "Boğa'ya", 'Başak': "Başak'a", 'Oğlak': "Oğlak'a",
    'İkizler': "İkizler'e", 'Terazi': "Terazi'ye", 'Kova': "Kova'ya",
    'Yengeç': "Yengeç'e", 'Akrep': "Akrep'e", 'Balık': "Balık'a"
  };
  const ritualLabel = useMemo(() => {
    const moonPart = MOON_LOCATIVE[moon.name] || moon.name;
    const zodiacPart = userZodiac ? ZODIAC_DATIVE[userZodiac] : null;
    if (zodiacPart) return `${moonPart} ${zodiacPart} Tavsiyem`;
    return `${moonPart} Tavsiye`;
  }, [moon.name, userZodiac]);

  const moonVisual = useMemo(() => {
    const p = moon.value;
    const R = 70;
    const sweep = p < 0.5 ? 1 : 0;
    const rx = Math.abs(Math.cos(p * 2 * Math.PI) * R);
    return `M 0 -${R} A ${R} ${R} 0 1 ${sweep} 0 ${R} A ${rx} ${R} 0 1 ${1 - sweep} 0 -${R}`;
  }, [moon.value]);

  const categories = [
    { title: 'Semboller Ansiklopedisi', icon: 'menu_book', desc: 'Fincandaki sembollerin anlamlarını öğren' },
    { title: 'Tarot Rehberi', icon: 'style', desc: '78 tarot kartının detaylı anlamları' },
    { title: 'Burçlar Kitapçığı', icon: 'stars', desc: '12 burç hakkında her şey' },
    { title: 'Merkür Retrosu ve Sen', icon: 'history', desc: 'Retronun burcuna ve falına etkileri' },
    { title: 'Rüya Tabirleri', icon: 'bedtime', desc: 'Gördüğün rüyaların kâhince yorumu' },
    { title: 'Numeroloji', icon: '123', desc: 'Sayıların hayatındaki gizli dili' },
  ];

  return (
    <div className={`page discover-page ${mercuryDisplay.isRetro ? 'retro-active' : ''}`}>

      {/* --- TEST MODU PANELİ (sadece profil test butonu aktifken görünür) --- */}
      {isTestMode && (
        <div style={{
          background: 'rgba(196,181,253,0.08)',
          border: '1px dashed rgba(196,181,253,0.35)',
          borderRadius: '14px',
          padding: '12px 14px',
          marginBottom: '16px',
          marginTop: '8px'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', color: 'rgba(196,181,253,0.7)', textTransform: 'uppercase', marginBottom: '10px' }}>
            ⚡ Test Modu — Kesfet UI Simülasörü
          </div>

          {/* Faz seçici */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            {[['direct', '✅ İleri'], ['shadow', '⚠ Gölge'], ['retro', '☿ Retro']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setTestPhase(val)}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: testPhase === val
                    ? (val === 'retro' ? '1.5px solid rgba(239,68,68,0.8)' : val === 'shadow' ? '1.5px solid rgba(251,191,36,0.8)' : '1.5px solid rgba(74,222,128,0.8)')
                    : '1.5px solid rgba(255,255,255,0.1)',
                  background: testPhase === val
                    ? (val === 'retro' ? 'rgba(239,68,68,0.15)' : val === 'shadow' ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.12)')
                    : 'rgba(255,255,255,0.04)',
                  color: testPhase === val
                    ? (val === 'retro' ? 'rgb(239,68,68)' : val === 'shadow' ? 'rgb(251,191,36)' : 'rgb(74,222,128)')
                    : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Burç seçici */}
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Merkür Burcu</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {ZODIAC_LIST.map(sign => (
              <button
                key={sign}
                onClick={() => setTestSign(sign)}
                style={{
                  padding: '5px 9px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: testSign === sign ? 700 : 400,
                  border: testSign === sign ? '1.5px solid rgba(196,181,253,0.6)' : '1px solid rgba(255,255,255,0.1)',
                  background: testSign === sign ? 'rgba(196,181,253,0.15)' : 'rgba(255,255,255,0.03)',
                  color: testSign === sign ? 'rgb(196,181,253)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {sign}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="page-header" style={{ marginBottom: '10px' }}>
        <h1 className="page-title">Keşfet</h1>
        <p className="page-subtitle">Kozmik rehberin ve arşivin</p>
      </div>

      {/* --- Section 1: Cosmic Whisper (Synthesized) --- */}
      <div className="cosmic-whisper-container fade-in">
        <div className="whisper-icon-wrapper">
          <CassiopeiaLogo size={42} color="var(--gold)" />
        </div>
        <div className="whisper-content">
          <div className="whisper-header-row">
            <span className="whisper-label">GÜNLÜK KOZMİK DİREKTİF</span>
            <span className="whisper-theme-badge">{mercuryDisplay.cosmicDirective.theme}</span>
          </div>
          <p className="whisper-text-deep">{mercuryDisplay.cosmicDirective.text}</p>
        </div>
      </div>

      {/* --- Section 2: Moon Hero --- */}
      <div className="moon-hero">
        <div className="moon-visual-container">
          <div className="moon-glow"></div>
          <div className="moon-visual">
            <div className="moon-surface-texture"></div>
            <MoonPhase phase={moon.value} size={140} />
          </div>
        </div>
        <div className="fade-in" style={{ transform: 'translateY(-10px)' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Günün Ay Fazı
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
            {moon.name}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '260px', lineHeight: '1.5', margin: '0 auto 16px', opacity: 0.8 }}>
            {moon.energy}
          </p>
          
          {/* Moon Whisper / Daily Ritual Card */}
          <div className="moon-whisper-card">
            <div className="whisper-logo-mini">
              <CassiopeiaLogo size={18} color="rgba(var(--gold-rgb), 0.7)" />
            </div>
            <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '6px' }}>
              {ritualLabel}
            </div>
            <p className="whisper-message">{mercuryDisplay.ritual || moon.whisper}</p>
          </div>
        </div>
      </div>

      {/* --- Section 3: Retrograde Dashboard --- */}
      <div className={`retro-dashboard-container fade-in ${mercuryDisplay.isRetro ? 'retro-mode' : mercuryDisplay.isShadow ? 'shadow-mode' : ''}`}>

        {/* --- Durum Bantları --- */}
        {mercuryDisplay.isRetro ? (
          <div className="retro-state-banner retro-state-banner--retro">
            <span className="retro-state-icon">☿</span>
            <div style={{ flex: 1 }}>
              <div className="retro-state-title">MERKÜR RETRODA</div>
              <div className="retro-state-sub">İletişim, teknoloji ve kararlar alanında dikkatli ol</div>
            </div>
            {mercuryDisplay.daysUntilEnd > 0 && (
              <div className="retro-state-badge retro-state-badge--retro">
                <span className="badge-val">{mercuryDisplay.daysUntilEnd}</span>
                <span className="badge-unit">GÜN KALDI</span>
              </div>
            )}
          </div>
        ) : mercuryDisplay.isShadow ? (
          <div className="retro-state-banner retro-state-banner--shadow">
            <span className="retro-state-icon">⚠</span>
            <div style={{ flex: 1 }}>
              <div className="retro-state-title">GÖLGE FAZI</div>
              <div className="retro-state-sub">{mercuryDisplay.shadowAlert.text}</div>
            </div>
            {mercuryDisplay.daysUntilEnd > 0 && (
              <div className="retro-state-badge retro-state-badge--shadow">
                <span className="badge-val">{mercuryDisplay.daysUntilEnd}</span>
                <span className="badge-unit">RETROYA</span>
              </div>
            )}
          </div>
        ) : (
          <div className="retro-top-alert">
            <div className="retro-alert-text">Bir Sonraki Retroya:</div>
            <div className="retro-days-box">{mercuryDisplay.daysToRetro}</div>
            <div className="retro-alert-text">GÜN</div>
          </div>
        )}

        <h3 className="retro-title">Merkür {mercuryDisplay.currentSign} Seyahati</h3>

        <p style={{
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          marginBottom: '16px',
          opacity: 0.85,
          borderLeft: `2px solid ${mercuryDisplay.isRetro ? 'var(--negative)' : mercuryDisplay.isShadow ? 'rgba(var(--gold-rgb),0.4)' : 'var(--positive)'}`,
          paddingLeft: '10px'
        }}>
          {mercuryDisplay.isRetro
            ? `Merkür şu an ${mercuryDisplay.currentSign} burcunda geri gidiyor. İletişim, kararlar ve ilişkilerde bu faza özel enerjiyi iyi oku.`
            : mercuryDisplay.isShadow
            ? `Merkür ${mercuryDisplay.currentSign} burcunda yavaşlıyor. Retro başlamadan önemli adımlarını at.`
            : `Merkür şu an ${mercuryDisplay.currentSign} burcunda ileri hareket ediyor. İletişim keskin, kararlar hız kazanıyor.`
          }
        </p>

        <div className={`retro-analysis-card ${mercuryDisplay.isRetro ? 'retro-card-active' : ''}`}>
          <div className="analysis-focus">
            <span className="analysis-label">{mercuryDisplay.isRetro ? 'RETRO GÜNDEMİ' : mercuryDisplay.isShadow ? 'GÖLGE UYARISI' : 'ASTROLOJİK GÜNDEM'}</span>
            <span className="analysis-value">{mercuryDisplay.signInsight.focus}</span>
          </div>
          <div className="analysis-divider"></div>
          <div className="analysis-oracle">
            <p className="oracle-text">&quot;{mercuryDisplay.signInsight.oracle}&quot;</p>
          </div>
        </div>
        
        {/* ✅ Aşama 1: Saniye geri sayımı artık izole RetroTimer bileşeninde,
            DiscoverPage'i her saniye re-render etmiyor */}
        <RetroTimer targetTime={mercuryDisplay.nextSignDate} currentSign={mercuryDisplay.currentSign} />
        {mercuryDisplay.nextSign && (
          <div style={{ marginBottom: '16px' }}>
            <div className="retro-next-stop">
              <span className="next-label">Sıradaki Durak:</span>
              <span className="next-value">{mercuryDisplay.nextSign}</span>
            </div>
            <p style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: '6px',
              lineHeight: '1.5',
              fontStyle: 'italic',
              opacity: 0.75
            }}>
              Merkür {mercuryDisplay.nextSign} burcuna geçtiğinde enerji ve öncelikler değişecek; şimdiden hazırlanmaya başlayabilirsin.
            </p>
          </div>
        )}

        {/* Değişiklik 3: İnce Progress Bar başlığı */}
        <div className="progress-section">
          <p style={{
            fontSize: '9px',
            color: 'var(--text-muted)',
            opacity: 0.55,
            letterSpacing: '0.08em',
            marginBottom: '5px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Merkür'ün {mercuryDisplay.currentSign} yolculuğu</span>
            <span>%{Math.round(mercuryDisplay.progress)} tamamlandı</span>
          </p>
          <div className="retro-progress-track dynamic-glow">
            <div 
              className="retro-progress-fill" 
              style={{ 
                width: `${mercuryDisplay.progress}%`,
                backgroundColor: mercuryDisplay.isRetro ? 'var(--negative)' : 'var(--gold)'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- Section 4: Merkür Manifestosu (Değişiklik 4) --- */}
      <div className="survival-guide-section fade-in">
        <h3 className="section-label">Merkür Manifestosu <span className="sign-badge">{userZodiac || mercuryDisplay.currentSign}</span></h3>
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontStyle: 'italic',
          marginBottom: '14px',
          opacity: 0.75,
          lineHeight: '1.5'
        }}>
          {userZodiac
            ? `Sen bir ${userZodiac} olarak Merkür'ün ${mercuryDisplay.currentSign} enerjisini en iyi şekilde kullanmak için:`
            : `Merkür ${mercuryDisplay.currentSign} burcundayken bu enerjiden en iyi şekilde yararlanmak için:`
          }
        </p>
        <div className="survival-grid">
          <div className="survival-card dos">
            <h4 className="survival-card-title">Yapılması Gerekenler</h4>
            <ul className="survival-list">
              {(mercuryDisplay.userDos || mercuryDisplay.dos).map((item, idx) => (
                <li key={idx}><span className="survival-bullet">✓</span> {item}</li>
              ))}
            </ul>
          </div>
          <div className="survival-card donts">
            <h4 className="survival-card-title">Dikkat Edilmesi Gerekenler</h4>
            <ul className="survival-list">
              {(mercuryDisplay.userDonts || mercuryDisplay.donts).map((item, idx) => (
                <li key={idx}><span className="survival-bullet">✕</span> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- Section 5: Other Planets --- */}
      <h3 className="section-label" style={{ marginTop: '30px' }}>Diğer Gezegenler</h3>
      <div className="cosmic-status-row">
        {[venus, mars].map(planet => (
          <div 
            key={planet.label} 
            className="planet-card locked" 
            style={{ 
              position: 'relative', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              textAlign: 'left',
              paddingLeft: '24px'
            }}
          >
            <span className="planet-name">{planet.label}</span>
            <span className="planet-status-label" style={{ opacity: 0.6 }}>Kozmik Analiz</span>
            <span className="discover-badge" style={{ top: '10px', right: '10px' }}>Yakında</span>
          </div>
        ))}
      </div>

      {/* --- Section 6: Dictionary/Archive --- */}
      <h3 className="section-label" style={{ marginTop: '20px' }}>Mistik Arşiv</h3>
      <div className="discover-grid">
        {categories.map((cat) => (
          <div key={cat.title} className="discover-card locked">
            <span className="material-symbols-outlined discover-icon">{cat.icon}</span>
            <h4 className="discover-title">{cat.title}</h4>
            <p className="discover-desc">{cat.desc}</p>
            <span className="discover-badge">Yakında</span>
          </div>
        ))}
      </div>
    </div>
  );
}