import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MysticIcon from '../../components/MysticIcon';
import NatalChartWheel from '../../components/NatalChartWheel';
import CosmicInsights from '../../components/CosmicInsights';
import CosmicCards from '../../components/CosmicCards';
import { useAppState } from '../../context/AppContext';
import { calculateNatalChart } from '../../utils/astrologyEngine';

export default function AstrologyDashboard() {
  const navigate = useNavigate();
  const { profiles, activeProfileId } = useAppState();
  const [profile, setProfile] = useState(null);
  const [chartSummary, setChartSummary] = useState(null);

  useEffect(() => {
    const p = profiles.find(pr => pr.id === activeProfileId) || profiles[0];
    if (p && p.birthPlace) {
      setProfile(p);
      
      // Calculate chart summary for header info
      try {
        const chart = calculateNatalChart(p.birthDate, p.birthTime || null, p.birthPlace, p.birthDistrict);
        if (chart) {
          setChartSummary({
            ascendant: chart.ascendant,
            mc: chart.mc,
            sunSign: chart.sun?.name,
            moonSign: chart.moon?.name,
            hasBirthTime: chart.hasBirthTime,
          });
        }
      } catch(e) {
        console.warn('Chart summary calc error:', e);
      }
    } else {
      navigate('/fallar/astroloji');
    }
  }, [profiles, activeProfileId, navigate]);

  if (!profile) return null;

  return (
    <div className="page" style={{ position: 'relative', minHeight: '100vh', paddingBottom: '100px', overflowY: 'auto' }}>
      
      {/* Standart Arka Plan */}
      <div className="meteor-back meteor-back-1" />
      <div className="meteor-back meteor-back-2" />
      <div className="meteor-front meteor-front-1" />
      <div className="meteor-front meteor-front-2" />

      {/* Header */}
      <div style={{ textAlign: 'center', paddingTop: '35px', paddingBottom: '0px', position: 'relative', zIndex: 2 }}>
        <p style={{ 
          fontSize: '0.75rem', 
          letterSpacing: '0.25em', 
          textTransform: 'uppercase', 
          color: 'var(--text-muted)',
          marginBottom: '4px'
        }}>
          Kozmik Harita
        </p>
        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.02em'
        }}>
          {profile.name}
        </h1>
        <p style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)', 
          marginTop: '4px',
          letterSpacing: '0.05em'
        }}>
          {profile.birthDate?.day}/{profile.birthDate?.month}/{profile.birthDate?.year}
          {profile.birthPlace ? ` · ${profile.birthPlace}` : ''}
        </p>
        
        {/* Ascendant & MC badges */}
        {chartSummary?.hasBirthTime && chartSummary.ascendant && (
          <div style={{ 
            display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px',
            animation: 'fade-in 0.6s ease 0.3s backwards'
          }}>
            <span style={{ 
              fontSize: '0.7rem', 
              color: 'var(--accent)', 
              background: 'rgba(255,215,0,0.06)',
              border: '1px solid rgba(255,215,0,0.12)',
              padding: '3px 10px',
              borderRadius: '20px',
              letterSpacing: '0.05em'
            }}>
              ↑ Yükselen: {chartSummary.ascendant.name} <span style={{ fontSize: 14, display: 'inline-block', transform: 'translateY(1px)' }}>{chartSummary.ascendant.icon}</span>
            </span>
            {chartSummary.mc && (
              <span style={{ 
                fontSize: '0.7rem', 
                color: 'rgba(255,255,255,0.4)', 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '3px 10px',
                borderRadius: '20px',
                letterSpacing: '0.05em'
              }}>
                MC: {chartSummary.mc.name} <span style={{ fontSize: 14, display: 'inline-block', transform: 'translateY(1px)' }}>{chartSummary.mc.icon}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── NATAL CHART WHEEL ── */}
      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        display: 'flex', 
        justifyContent: 'center',
        marginTop: '10px',
        marginBottom: '4px',
        padding: '0 10px',
      }}>
        <NatalChartWheel profile={profile} />
      </div>

      {/* ── KOZMİK İÇGÖRÜLER (Gezegenler, Evler, Açılar) ── */}
      <CosmicInsights profile={profile} />

      {/* ── KOZMİK KARTLAR (5 Açılır Kutucuk) ── */}
      <CosmicCards profile={profile} />

      {/* ── BÜYÜK KOZMİK RAPOR ── */}
      <div style={{ padding: '0 20px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
        <div 
          className="home-card" 
          style={{ 
            padding: '28px 20px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            boxShadow: '0 12px 32px rgba(255, 215, 0, 0.1)', 
            borderColor: 'rgba(255, 215, 0, 0.3)' 
          }} 
          onClick={() => navigate('/fallar/astroloji/okuma', { state: { type: 'grand-report' } })}
        >
          <div className="card-aurora" style={{ '--aurora-1': '255, 200, 0', '--aurora-2': '200, 150, 0' }} />
          <MysticIcon name="stars" color="var(--accent)" size={40} className="icon-max-glow shimmer" style={{ zIndex: 1, marginBottom: '12px' }} />
          <h2 style={{ zIndex: 1, fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Büyük Kozmik Rapor</h2>
          <p style={{ zIndex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>Haritanın tüm sırlarını ve kader çizgini deşifre eden destansı genel okuma</p>
        </div>
      </div>
    </div>
  );
}

