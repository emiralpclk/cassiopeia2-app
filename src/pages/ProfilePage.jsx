import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, GENDER_OPTIONS, RELATIONSHIP_STATUSES, ELEMENT_DATA, getZodiacByDate } from '../utils/constants';
import MysticIcon from '../components/MysticIcon';

export default function ProfilePage() {
  const { user, apiKey, history, isTestMode, profiles, activeProfileId } = useAppState();
  const dispatch = useAppDispatch();
  const [showApiInput, setShowApiInput] = useState(false);
  const [newKey, setNewKey] = useState(apiKey || '');
  const [confirmClear, setConfirmClear] = useState(false);

  const calculateAgeFor = (p) => {
    if (!p?.birthDate?.year) return null;
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(p.birthDate.year);
    const birthMonth = parseInt(p.birthDate.month);
    const birthDay = parseInt(p.birthDate.day);
    
    let age = currentYear - birthYear;
    const m = new Date().getMonth() + 1;
    if (m < birthMonth || (m === birthMonth && new Date().getDate() < birthDay)) {
      age--;
    }
    return age;
  };

  const handleSaveKey = () => {
    if (newKey.trim()) {
      dispatch({ type: 'SET_API_KEY', payload: newKey.trim() });
      setShowApiInput(false);
    }
  };

  const handleClearHistory = () => {
    if (confirmClear) {
      dispatch({ type: 'CLEAR_HISTORY' });
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000); // Reset after 3s
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm('DİKKAT: Tüm profillerin, fal geçmişin ve API anahtarın kalıcı olarak silinecektir. Emin misin?')) {
      import('../services/storage').then(s => {
        s.clearAllData();
        window.location.reload();
      });
    }
  };

  const activeZodiac = user ? ZODIAC_SIGNS.find(z => z.id === user.zodiac) : null;

  const handleEdit = (p) => {
    dispatch({ type: 'START_EDIT_PROFILE', payload: p.id });
  };

  const handleAddProfile = () => {
    if (profiles.length < 4) {
      dispatch({ type: 'SHOW_ONBOARDING', payload: true });
    }
  };

  return (
    <div className="page profile-page fade-in">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1 className="page-title">Profil</h1>
      </div>

      {/* Global Stats at the Top */}
      <div className="profile-stats" style={{ marginBottom: '30px', marginTop: '0' }}>
        <div className="stat-item">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>history</span>
          <span className="stat-number">{history.length}</span>
          <span className="stat-label">Toplam Fal</span>
        </div>
        <div className="stat-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>style</span>
          <span className="stat-number">
            {history.filter(h => h.tarotCards?.length > 0).length}
          </span>
          <span className="stat-label">Ritüel</span>
        </div>
      </div>

      {/* Multi-Profile Master List */}
      <div className="profile-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="section-title" style={{ margin: 0, opacity: 0.6, fontSize: '14px', letterSpacing: '0.1em' }}>KİMLİKLER</h3>
          <div className="slot-progress-wrapper">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
              {profiles.length} / 4 Slot Aktif
            </span>
            <div className="slot-visual-bar">
              <div className="slot-visual-fill" style={{ width: `${(profiles.length / 4) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="profiles-list" style={{ display: 'grid', gap: '16px' }}>
          {profiles.map(p => {
            const isActive = p.id === activeProfileId;
            const pZodiac = ZODIAC_SIGNS.find(z => z.id === p.zodiac);
            
            return (
              <div 
                key={p.id} 
                className={`profile-identity-card ${isActive ? 'active-identity' : ''} ${p.isMain ? 'master-card' : ''}`}
                style={{ padding: p.isMain ? '28px' : '20px' }}
                onClick={() => dispatch({ type: 'SWITCH_PROFILE', payload: p.id })}
              >
                {/* Localized Glow Background */}
                <div className={`identity-aura-glow aura-${ELEMENT_DATA[pZodiac?.element]?.id}`}></div>
                
                <div className="profile-identity-tag" style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
                  <MysticIcon 
                    name={pZodiac?.id} 
                    color={ELEMENT_DATA[pZodiac?.element]?.color || '#fff'} 
                    size={p.isMain ? 40 : 32} 
                  />
                </div>
                
                <div style={{ flex: '1 1 0%', position: 'relative', zIndex: 2, minWidth: 0 }}>
                  {p.isMain && <div className="profile-tag-label">ANA HESAP</div>}
                  
                  <h4 style={{ 
                    fontSize: p.isMain ? '22px' : '18px', 
                    fontWeight: '700', 
                    margin: 0,
                    color: '#fff',
                    letterSpacing: '-0.01em'
                  }}>
                    {p.name.length > 10 ? p.name.slice(0, 10) + '..' : p.name}
                  </h4>
                  
                  <div className="profile-element-sub" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span>{calculateAgeFor(p) ? `${calculateAgeFor(p)} Yaşında` : 'Yaş Belirsiz'}</span>
                    <span style={{ opacity: 0.3 }}>•</span>
                    <span style={{ color: ELEMENT_DATA[pZodiac?.element]?.color }}>{pZodiac?.name}</span>
                  </div>
                </div>

                <div className="profile-actions" style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button 
                    className="profile-action-btn" 
                    onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                    style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', border: 'none' }}
                  >
                    <MysticIcon name="edit" size={18} color="#fff" />
                  </button>
                  {!p.isMain && (
                    <button 
                      className="profile-action-btn danger" 
                      onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_PROFILE', payload: p.id }); }}
                      style={{ background: 'rgba(255,68,68,0.1)', padding: '10px', borderRadius: '12px', color: '#ff4444', border: 'none' }}
                    >
                      <MysticIcon name="delete" size={18} color="#ff4444" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

            <button 
              className="add-identity-btn" 
              onClick={handleAddProfile}
              style={{
                border: '1px dashed rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.02)',
                padding: '16px',
                borderRadius: '24px',
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginTop: '10px'
              }}
            >
              <MysticIcon name="person_add" size={24} color="rgba(255,255,255,0.6)" />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Yeni Kimlik Ekle</span>
            </button>
        </div>
      </div>

      {/* Global Settings */}
      <div className="profile-section" style={{ marginTop: '40px' }}>
        <h3 className="section-title" style={{ opacity: 0.6, fontSize: '14px', letterSpacing: '0.1em' }}>SİSTEM</h3>

        {/* API Settings */}
        <button className="settings-item" onClick={() => setShowApiInput(!showApiInput)}>
          <MysticIcon name="key" size={20} color="var(--text-secondary)" />
          <div style={{ flex: 1, textAlign: 'left', marginLeft: '12px' }}>
            <span style={{ display: 'block', fontSize: '15px' }}>API Anahtarı</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mistik zeka bağlantısı</span>
          </div>
          <span className="material-symbols-outlined" style={{ 
            fontSize: '18px', 
            opacity: 0.3,
            transform: showApiInput ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s'
          }}>expand_more</span>
        </button>

        {showApiInput && (
          <div className="api-key-edit fade-in">
            <input
              type="password"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Gemini API anahtarı"
              className="settings-input"
            />
            <button className="settings-save" onClick={handleSaveKey}>Güncelle</button>
          </div>
        )}

        {/* Clear History */}
        <button 
          className={`settings-item ${confirmClear ? 'danger-active' : ''}`} 
          onClick={handleClearHistory}
          style={{ color: confirmClear ? 'var(--negative)' : 'inherit' }}
        >
          <MysticIcon 
            name="delete" 
            size={18} 
            color={confirmClear ? 'var(--negative)' : '#fff'} 
          />
          <div style={{ flex: 1, textAlign: 'left', marginLeft: '12px' }}>
            <span style={{ display: 'block', fontSize: '15px' }}>{confirmClear ? 'Emin misin?' : 'Geçmişi Temizle'}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tüm fallar silinir</span>
          </div>
        </button>

        {/* Factory Reset */}
        <button 
          className="settings-item" 
          onClick={handleFactoryReset}
          style={{ marginTop: '20px', border: '1px solid rgba(255, 69, 58, 0.2)', background: 'rgba(255, 69, 58, 0.05)', color: 'var(--negative)' }}
        >
          <MysticIcon name="restart" size={18} color="var(--negative)" />
          <div style={{ flex: 1, textAlign: 'left', marginLeft: '12px' }}>
            <span style={{ display: 'block', fontSize: '15px', fontWeight: '700' }}>Tüm Verileri Sıfırla</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fabrika ayarlarına dön</span>
          </div>
        </button>
      </div>

      {/* Developer Settings (Only in Dev environment) */}
      {import.meta.env.DEV && (
        <div className="profile-section developer-section">
          <h3 className="section-title" style={{ opacity: 0.6, fontSize: '14px' }}>MİSTİK ARAÇLAR (DEV)</h3>
          <div className="settings-item-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>auto_fix_high</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Test Modu</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ücretsiz mock data</span>
              </div>
            </div>
            <button 
              className={`toggle-switch ${isTestMode ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_TEST_MODE' })}
              style={{
                width: '40px',
                height: '20px',
                borderRadius: '10px',
                background: isTestMode ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                position: 'relative',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: isTestMode ? 'var(--bg)' : '#fff',
                position: 'absolute',
                top: '3px',
                left: isTestMode ? '23px' : '3px',
                transition: 'all 0.3s ease'
              }} />
            </button>
          </div>
        </div>
      )}

      <div className="profile-footer" style={{ marginTop: '40px', textAlign: 'center', opacity: 0.3, fontSize: '11px' }}>
        <p>Cassiopeia v1.2 • Cosmic App Engine Member</p>
      </div>
    </div>
  );
}