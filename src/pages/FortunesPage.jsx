import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { FORTUNE_TYPES } from '../utils/constants';
import CassiopeiaLogo from '../components/CassiopeiaLogo';

export default function FortunesPage() {
  const navigate = useNavigate();
  const { lifetimeStats } = useAppState();
  const [clickedCard, setClickedCard] = useState(null);

  const handleClick = (type) => {
    if (!type.available) return;
    
    // Tıklandığı an kartın animasyon sınıfını tetikliyoruz
    setClickedCard(type.id);

    // Animasyon şovunu yapabilmesi için 600ms bekleyip sonra sayfaya yönlendiriyoruz
    setTimeout(() => {
      if (type.id === 'coffee') navigate('/fallar/kahve');
      if (type.id === 'tarot') navigate('/fallar/tarot');
    }, 600);
  };

  return (
    <div className="page fortunes-page">
      <div className="page-header" style={{ animation: 'entry-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) both', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Fallar</h1>
          <p className="page-subtitle">Ne öğrenmek istiyorsun?</p>
        </div>
        
        <button 
          onClick={() => navigate('/gecmis')}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(160,130,255,0.1), rgba(100,80,200,0.05))',
            border: '1px solid rgba(160,130,255,0.2)',
            borderRadius: '30px',
            padding: '4px',
            paddingLeft: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            gap: '8px'
          }}
          onTouchStart={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(160,130,255,0.2), rgba(100,80,200,0.1))'; e.currentTarget.style.transform = 'scale(0.94)'; e.currentTarget.style.borderColor = 'rgba(160,130,255,0.3)'; }}
          onTouchEnd={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(160,130,255,0.1), rgba(100,80,200,0.05))'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(160,130,255,0.2)'; }}
          onTouchCancel={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(160,130,255,0.1), rgba(100,80,200,0.05))'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(160,130,255,0.2)'; }}
          onMouseDown={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(160,130,255,0.2), rgba(100,80,200,0.1))'; e.currentTarget.style.transform = 'scale(0.94)'; e.currentTarget.style.borderColor = 'rgba(160,130,255,0.3)'; }}
          onMouseUp={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(160,130,255,0.1), rgba(100,80,200,0.05))'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(160,130,255,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(160,130,255,0.1), rgba(100,80,200,0.05))'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(160,130,255,0.2)'; }}
          aria-label="Geçmiş Fallarım"
        >
          <span style={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '0.3px',
            marginRight: '2px'
          }}>
            Geçmiş
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(160,130,255,0.2), rgba(100,80,200,0.1))',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>history</span>
            {lifetimeStats?.total > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                background: 'var(--accent)',
                color: '#000',
                fontSize: '10px',
                fontWeight: '800',
                minWidth: '16px',
                height: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 2px 8px rgba(160,130,255,0.5)'
              }}>
                {lifetimeStats.total}
              </span>
            )}
          </div>
        </button>
      </div>

      <div className="fortune-grid">
        {FORTUNE_TYPES.map((type, index) => (
          <button
            key={type.id}
            className={`fortune-type-card premium-macro-card ${!type.available ? 'locked' : ''} ${type.id}-card ${clickedCard === type.id ? 'clicked' : ''}`}
            style={{ animation: `entry-reveal 0.8s ${0.1 + (index * 0.1)}s both` }}
            onClick={() => handleClick(type)}
          >
            {/* Metin Alanı (Sol) */}
            <div className="fortune-type-info premium-info">
              <h3 className="fortune-type-name">{type.name}</h3>
              <p className="fortune-type-desc">{type.description}</p>
            </div>

            {/* Durum/Yönlendirme Alanı (Sağ Üst) */}
            <div className="card-status-area">
              {!type.available && <div className="fortune-type-badge">Yakında</div>}
              {type.available && <span className="material-symbols-outlined fortune-arrow">chevron_right</span>}
            </div>

            {/* Efsanevi Makro Sanat Alanı (Sağ Tarafa Yaslı Sade Filigran) */}
            <div className={`macro-art-container ${type.id}-macro`}>
              {/* Tarot Hariç Diğerlerinde Dev İkonlar */}
              {type.id !== 'tarot' && (
                type.icon ? (
                  <span className="material-symbols-outlined macro-bg-icon">{type.icon}</span>
                ) : (
                  <span className="macro-bg-emoji">{type.emoji}</span>
                )
              )}

              {/* Sadece Kahve İçin Özel Buhar Reaktörü */}
              {type.id === 'coffee' && (
                <div className="macro-coffee-steam">
                  <span className="macro-steam s1"></span>
                  <span className="macro-steam s2"></span>
                  <span className="macro-steam s3"></span>
                </div>
              )}

              {/* Sadece Tarot İçin: Yelpaze Şeklinde Holografik Kartlar */}
              {type.id === 'tarot' && (
                <>
                  <div className="macro-fanned-cards">
                    <div className="macro-card-item card-left"></div>
                    <div className="macro-card-item card-center"></div>
                    <div className="macro-card-item card-right"></div>
                  </div>
                  <div className="macro-tarot-shadow"></div>
                </>
              )}

              {/* Doğum Haritası (Astrology) İçin: Çark / Gezegen efekti */}
              {type.id === 'astrology' && (
                <div className="macro-astro-wheel">
                  <div className="macro-astro-core"></div>
                  <div className="macro-astro-ring ring1"></div>
                  <div className="macro-astro-ring ring2"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>



      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', paddingBottom: '24px', opacity: 0.8, animation: 'entry-reveal 1s 0.5s both' }}>
        <CassiopeiaLogo size={80} isLoading={true} color="var(--accent)" />
      </div>

    </div>
  );
}