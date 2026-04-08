import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FORTUNE_TYPES } from '../utils/constants';
import CassiopeiaLogo from '../components/CassiopeiaLogo';

export default function FortunesPage() {
  const navigate = useNavigate();
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
      <div className="page-header" style={{ animation: 'entry-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
        <h1 className="page-title">Fallar</h1>
        <p className="page-subtitle">Ne öğrenmek istiyorsun?</p>
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
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', paddingBottom: '24px', opacity: 0.8, animation: 'entry-reveal 1s 0.5s both' }}>
        <CassiopeiaLogo size={80} isLoading={true} color="var(--accent)" />
      </div>
    </div>
  );
}