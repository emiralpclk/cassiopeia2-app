import { useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';
import FortuneProfileSelector from '../../components/FortuneProfileSelector';
import CassiopeiaLogo from '../../components/CassiopeiaLogo';

export default function IntentStep() {
  const dispatch = useAppDispatch();
  const [intent, setIntent] = useState('');

  const PREDEFINED_INTENTS = [
    { id: 'general', label: 'Genel Açılım', text: 'Genel hayatıma, enerjime ve yakın geleceğime dair kapsamlı bir yorum istiyorum.' },
    { id: 'love', label: 'Aşk & İlişki', text: 'Kalp meselelerime, ilişki durumuma ve aşk hayatımdaki gelişmelere odaklan.' },
    { id: 'career', label: 'İş & Kariyer', text: 'Kariyer yolculuğum, maddi beklentilerim ve iş hayatımdaki fırsatlara bak.' },
    { id: 'health', label: 'Sağlık & Huzur', text: 'Bedensel ve ruhsal sağlığım, huzurum ve enerjim hakkında rehberlik et.' },
    { id: 'question', label: 'Bir Sorum Var', text: 'Aklımda spesifik bir soru var, fincanımda bunun cevabını ara.' },
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (intent.trim()) {
      dispatch({ type: 'SET_INTENT', payload: intent.trim() });
    }
  };

  const selectIntent = (item) => {
    setIntent(item.text);
  };

  return (
    <div className="fortune-step intent-step fade-in">
      <div className="step-header" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '16px' }}>
          <CassiopeiaLogo size={64} color="var(--accent)" isLoading={false} />
        </div>
        <h2 className="step-title">Niyetini Mühürle</h2>
        <p className="step-subtitle">Kimliğin ve niyetin birleşerek kâhinin yolunu aydınlatsın.</p>
      </div>

      <div className="intent-form-unified" style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ textAlign: 'left', width: '100%', marginBottom: '8px', paddingLeft: '4px' }}>
          <h4 className="section-subtitle" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Kimliğin</h4>
        </div>
        <div style={{ margin: '0 -20px', width: 'calc(100% + 40px)' }}>
          <FortuneProfileSelector />
        </div>

        <div className="intent-form-premium glass-card" style={{ width: '100%', padding: '24px', borderRadius: '24px', marginTop: '4px' }}>
          <h4 className="section-subtitle" style={{ marginBottom: '16px', fontSize: '11px' }}>Odak Noktan</h4>
          <div className="intent-grid" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '24px' }}>
            {PREDEFINED_INTENTS.map((item) => (
              <button 
                key={item.id} 
                className={`intent-chip ${intent === item.text ? 'active' : ''}`}
                onClick={() => selectIntent(item)}
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                <span className="intent-label">{item.label}</span>
              </button>
            ))}
          </div>

          <h4 className="section-subtitle" style={{ marginBottom: '12px', fontSize: '11px' }}>Detaylı Niyet (Opsiyonel)</h4>
          <textarea
            className="intent-input"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Aklındaki soruyu buraya yazabilirsin..."
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '16px', 
              padding: '16px', 
              height: '110px',
              fontSize: '14px'
            }}
            maxLength={500}
          />
          
          <div className="intent-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="intent-counter" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{intent.length}/500</span>
            <button 
              type="button" 
              className="step-button primary" 
              onClick={handleSubmit}
              disabled={!intent.trim()}
              style={{ margin: 0, padding: '12px 24px' }}
            >
              Devam
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .intent-step { padding-top: 32px; }
        .section-subtitle { font-family: var(--font-label); }
      `}} />
    </div>
  );
}