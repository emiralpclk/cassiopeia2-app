import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typewriter from '../../components/Typewriter';
import { TURKEY_CITIES, TURKEY_DISTRICTS } from '../../utils/cities';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import FortuneProfileSelector from '../../components/FortuneProfileSelector';
import MysticIcon from '../../components/MysticIcon';
import CassiopeiaLogo from '../../components/CassiopeiaLogo';

export default function AstrologyOnboarding() {
  const navigate = useNavigate();
  const { profiles, activeProfileId } = useAppState();
  const dispatch = useAppDispatch();
  
  const [activeProfile, setActiveProfile] = useState(null);
  
  // Eksik veriler için yerel state
  const [birthTime, setBirthTime] = useState('');
  const [dontKnowTime, setDontKnowTime] = useState(false);
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDistrict, setBirthDistrict] = useState('');
  
  // Profildeki astro verisi eksikse formu gösterelim
  const [isMissingData, setIsMissingData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Sabit, hızlı yüklenen ve Cassiopeia ruhuna uyan bir derin uzay arka planı. 
  // Dinamik API yükleme gecikmelerinden kaçınmak için bunu kullanıyoruz.
  const staticCosmicBg = "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200&auto=format&fit=crop";

  useEffect(() => {
    // 1. Context'ten aktif profili çek
    const p = profiles.find(pr => pr.id === activeProfileId) || profiles[0];
    if (p) {
      setActiveProfile(p);
      setIsEditing(false); // Reset edit mode when switching profile
      
      // 2. Eksik Astro verisi var mı kontrol et
      const hasTime = p.birthTime || (p.birthTime === null); 
      const hasPlace = p.birthPlace && p.birthDistrict;
      
      if (!hasTime || !hasPlace) {
        setIsMissingData(true);
        // Eğer bir kısmı varsa pre-fill or reset
        setBirthTime(p.birthTime || '');
        setBirthPlace(p.birthPlace || '');
        setBirthDistrict(p.birthDistrict || '');
      } else {
        setIsMissingData(false);
        // Pre-fill even if not missing (for editing)
        setBirthTime(p.birthTime === null ? '' : p.birthTime);
        setDontKnowTime(p.birthTime === null);
        setBirthPlace(p.birthPlace);
        setBirthDistrict(p.birthDistrict);
      }
    }
  }, [profiles, activeProfileId]);

  const handleCompleteMissingData = () => {
    if (!birthPlace || !birthDistrict) return;

    // Aktif profili güncelle
    const updatedProfile = {
      ...activeProfile,
      birthTime: dontKnowTime ? null : birthTime,
      birthPlace,
      birthDistrict
    };

    dispatch({ type: 'SET_USER', payload: updatedProfile });
    
    // Gittik!
    navigate('/astroloji');
  };

  return (
    <div className="page fade-in" style={{ position: 'relative', overflow: 'hidden' }}>

      <div className="page-header" style={{ position: 'relative', zIndex: 2, marginTop: '20px' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem', color: 'var(--accent)' }}>Kozmik Harita</h1>
        <p className="page-subtitle">Kimin yıldızlarına bakıyoruz?</p>
      </div>

      <div style={{ position: 'relative', zIndex: 2, marginTop: '20px', margin: '20px -20px 0', width: 'calc(100% + 40px)' }}>
        <FortuneProfileSelector />
      </div>

      <div className="onboarding-content-container" style={{ position: 'relative', zIndex: 2, margin: '0 20px 40px 20px' }}>
        {(isMissingData || isEditing) && activeProfile ? (
          <div className="onboarding-content fade-in" style={{ 
            padding: '40px 24px', 
            background: 'rgba(20, 20, 30, 0.65)', 
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            backdropFilter: 'blur(30px)',
            borderRadius: '32px',
            position: 'relative',
            overflow: 'hidden',
            animation: 'slide-up 0.8s ease backwards'
          }}>
            
            <div className="question-area" style={{ minHeight: '60px', marginBottom: '20px' }}>
              <Typewriter 
                text={isEditing ? `${activeProfile.name} için bilgileri güncelleyelim.` : `Haritanı çıkarmam için ${activeProfile.name} hakkında birkaç kozmik detaya daha ihtiyacım var.`} 
                speed={30} 
                className="oracle-text" 
              />
            </div>

            <div className="input-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Doğum Saati (İsteğe Bağlı ama Önerilir)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="time" 
                    className="astro-input" 
                    value={birthTime}
                    onChange={(e) => {
                      setBirthTime(e.target.value);
                      setDontKnowTime(false);
                    }}
                    disabled={dontKnowTime}
                    style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: dontKnowTime ? 'gray' : '#fff', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-body)' }}
                  />
                  <button 
                    onClick={() => setDontKnowTime(!dontKnowTime)}
                    style={{ padding: '15px', borderRadius: '12px', background: dontKnowTime ? 'var(--accent)' : 'transparent', color: dontKnowTime ? '#000' : 'var(--text-secondary)', border: '1px solid var(--accent)', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px' }}
                  >
                    Bilmiyorum
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Doğduğun Şehir</label>
                <select 
                  className="astro-input" 
                  value={birthPlace}
                  onChange={(e) => { setBirthPlace(e.target.value); setBirthDistrict(''); }}
                  style={{ WebkitAppearance: 'none', background: '#0a0a0f', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <option value="" disabled>Doğduğun Şehri Seç...</option>
                  {TURKEY_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>

              {birthPlace && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>İlçe</label>
                  <select 
                    className="astro-input" 
                    value={birthDistrict}
                    onChange={(e) => setBirthDistrict(e.target.value)}
                    style={{ WebkitAppearance: 'none', background: '#0a0a0f', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', animation: 'fade-in 0.3s ease' }}
                  >
                    <option value="" disabled>İlçe Seç...</option>
                    {(TURKEY_DISTRICTS[birthPlace] || ["Merkez", "Diğer İlçeler"]).map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              )}
              
            </div>

            <div className="action-area" style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
              {isEditing && (
                <button 
                  onClick={() => setIsEditing(false)}
                  style={{ 
                    flex: 1, 
                    padding: '18px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: '600',
                    fontSize: '13px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  İPTAL
                </button>
              )}
              <button 
                onClick={handleCompleteMissingData}
                disabled={!birthPlace || !birthDistrict}
                style={{ 
                  flex: 2, 
                  padding: '18px',
                  borderRadius: '16px',
                  background: (!birthPlace || !birthDistrict) ? 'rgba(255,255,255,0.02)' : 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(167, 139, 250, 0.05))',
                  border: (!birthPlace || !birthDistrict) ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(167, 139, 250, 0.3)',
                  color: (!birthPlace || !birthDistrict) ? 'rgba(255,255,255,0.2)' : '#C4B5FD',
                  fontWeight: '600',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: (!birthPlace || !birthDistrict) ? 'not-allowed' : 'pointer',
                  boxShadow: (!birthPlace || !birthDistrict) ? 'none' : '0 12px 30px rgba(167, 139, 250, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isEditing ? 'GÜNCELLE' : 'TAMAMLA VE GEÇ'}
              </button>
            </div>
          </div>
        ) : (
          <div className="ready-state fade-in" style={{ 
            padding: '40px 24px', 
            background: `linear-gradient(rgba(15, 15, 25, 0.75), rgba(15, 15, 25, 0.9)), url('${staticCosmicBg}') center/cover no-repeat`, 
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            borderRadius: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="card-aurora" style={{ '--aurora-1': '255, 215, 0', '--aurora-2': '212, 175, 55', opacity: 0.15 }} />
            
            {/* Medallion Segment */}
            <div style={{ position: 'relative', zIndex: 2, marginBottom: '32px' }}>
              <div style={{ 
                width: '86px', 
                height: '86px', 
                margin: '0 auto 20px', 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.05)'
              }}>
                <div style={{ filter: 'drop-shadow(0 4px 12px rgba(167, 139, 250, 0.4))' }}>
                  <CassiopeiaLogo size={64} color="#C4B5FD" />
                </div>
              </div>
              
              <h2 style={{ 
                fontSize: '1.6rem', 
                fontWeight: '600', 
                color: '#fff',
                letterSpacing: '0.02em',
                marginBottom: '10px'
              }}>
                Gezegenler Hazır
              </h2>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem', 
                lineHeight: '1.6', 
                maxWidth: '280px', 
                margin: '0 auto',
                opacity: 0.8
              }}>
                {activeProfile?.name} için gökyüzü haritası hazırlandı. Kaderin fısıltılarını duymaya hazır mısın?
              </p>
            </div>

            {/* Cosmic Coordinates Segment */}
            <div style={{ 
              position: 'relative', 
              zIndex: 2, 
              display: 'flex', 
              flexDirection: 'column',
              gap: '12px',
              padding: '24px 20px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '36px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>Doğum Anı</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.05em' }}>
                    {activeProfile?.birthTime || 'Belirsiz'}
                  </span>
                </div>
                <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.1)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>Konum</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.02em' }}>
                    {activeProfile?.birthDistrict}, {activeProfile?.birthPlace}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions Segment */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={() => navigate('/astroloji/pano')}
                style={{ 
                  width: '100%', 
                  padding: '18px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(167, 139, 250, 0.05))',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  color: '#C4B5FD',
                  fontWeight: '600',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body, sans-serif)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 12px 30px rgba(167, 139, 250, 0.15)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.25), rgba(167, 139, 250, 0.08))';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(167, 139, 250, 0.05))';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                KOZMİK AKIŞI BAŞLAT
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>rocket_launch</span>
              </button>

              <button 
                onClick={() => setIsEditing(true)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  padding: '12px',
                  color: 'rgba(255,255,255,0.4)', 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  fontFamily: 'var(--font-body, sans-serif)',
                  letterSpacing: '1px', 
                  textTransform: 'uppercase', 
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                Doğum Bilgilerini Düzenle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
