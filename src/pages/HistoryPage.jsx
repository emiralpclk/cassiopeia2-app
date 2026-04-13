import { useAppState } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ImageModal from '../components/ImageModal';

export default function HistoryPage() {
  const { history, lifetimeStats } = useAppState();
  const navigate = useNavigate();
  const [zoomedImage, setZoomedImage] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tarih belirsiz';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return 'Tarih hatalı';
    }
  };

  const coffeeHistory = history.filter(item => item.type === 'coffee');
  const tarotHistory = history.filter(item => item.type === 'tarot');

  const HistoryCard = ({ item, index }) => (
    <div 
      key={item?.id || index} 
      className="history-item stagger-item" 
      onClick={() => navigate(`/gecmis/${index}`)}
      style={{ transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', cursor: 'pointer' }}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.95)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--accent-glow)'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      onTouchCancel={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.95)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--accent-glow)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div className="history-item-image" onClick={(e) => {
        const imgUrl = item?.images?.[0]?.dataUrl || item?.imageDataUrl;
        if (imgUrl) {
          e.stopPropagation();
          setZoomedImage(imgUrl);
        }
      }}>
        {item?.images?.[0]?.dataUrl || item?.imageDataUrl ? (
          <img src={item?.images?.[0]?.dataUrl || item?.imageDataUrl} alt="Fincan" />
        ) : (
          <div className="history-placeholder">
            <span className="material-symbols-outlined">{item.type === 'coffee' ? 'coffee' : 'style'}</span>
          </div>
        )}
      </div>
      <div className="history-item-info">
        <p className="history-intent">{item?.intent || 'Genel Niyet'}</p>
        <span className="history-date">{formatDate(item?.date)}</span>
      </div>
      {item?.tarotCards?.length > 0 && item.type === 'coffee' && (
        <div className="history-tarot-badge">
          <span className="material-symbols-outlined">flare</span>
          Sentez
        </div>
      )}
    </div>
  );

  return (
    <div className="page history-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Geçmiş</h1>
        <p className="page-subtitle">Önceki falların (Son 5 Kayıt)</p>
      </div>

      {/* Global Stats at the Top */}
      <div className="profile-stats" style={{ marginBottom: '30px', marginTop: '0' }}>
        <div className="stat-item">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>coffee</span>
          <span className="stat-number">{lifetimeStats.coffee}</span>
          <span className="stat-label">Kahve Falı</span>
        </div>
        <div className="stat-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>history</span>
          <span className="stat-number">{lifetimeStats.total}</span>
          <span className="stat-label">Toplam Fal</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">history</span>
          <h3>Henüz fal baktırmadın</h3>
          <p>İlk falını baktırdığında burada görünecek</p>
          <button className="step-button" onClick={() => navigate('/fallar')}>
            Fal Baktır
          </button>
        </div>
      ) : (
        <div className="history-sections-container">
          {/* Coffee Section */}
          <div className="history-section">
            <div className="section-header-premium">
              <span className="material-symbols-outlined">coffee</span>
              <h3>Kahve Falları</h3>
            </div>
            {coffeeHistory.length > 0 ? (
              <div className="history-list">
                {coffeeHistory.map((item, i) => <HistoryCard key={item.id} item={item} index={history.indexOf(item)} />)}
              </div>
            ) : (
              <p className="faded-small">Henüz kahve falı kaydın yok.</p>
            )}
          </div>

          <div className="divider" style={{ margin: '40px 0' }}></div>

          {/* Tarot Section */}
          <div className="history-section">
            <div className="section-header-premium">
              <span className="material-symbols-outlined">style</span>
              <h3>Tarot Okumaları</h3>
            </div>
            {tarotHistory.length > 0 ? (
              <div className="history-list">
                {tarotHistory.map((item, i) => <HistoryCard key={item.id} item={item} index={history.indexOf(item)} />)}
              </div>
            ) : (
              <p className="faded-small">Henüz tarot okuması kaydın yok.</p>
            )}
          </div>
        </div>
      )}

      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </div>
  );
}