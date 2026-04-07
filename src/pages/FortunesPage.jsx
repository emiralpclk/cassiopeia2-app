import { useNavigate } from 'react-router-dom';
import { FORTUNE_TYPES } from '../utils/constants';
import CassiopeiaLogo from '../components/CassiopeiaLogo';

export default function FortunesPage() {
  const navigate = useNavigate();

  const handleClick = (type) => {
    if (!type.available) return;
    if (type.id === 'coffee') navigate('/fallar/kahve');
    if (type.id === 'tarot') navigate('/fallar/tarot');
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
            className={`fortune-type-card ${!type.available ? 'locked' : ''}`}
            style={{ animation: `entry-reveal 0.8s ${0.1 + (index * 0.1)}s both` }}
            onClick={() => handleClick(type)}
          >
            <div className="fortune-type-emoji">{type.emoji}</div>
            <div className="fortune-type-info">
              <h3 className="fortune-type-name">{type.name}</h3>
              <p className="fortune-type-desc">{type.description}</p>
            </div>
            {!type.available && (
              <div className="fortune-type-badge">Yakında</div>
            )}
            {type.available && (
              <span className="material-symbols-outlined fortune-arrow">chevron_right</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', paddingBottom: '24px', opacity: 0.8, animation: 'entry-reveal 1s 0.5s both' }}>
        <CassiopeiaLogo size={80} isLoading={true} color="var(--accent)" />
      </div>
    </div>
  );
}