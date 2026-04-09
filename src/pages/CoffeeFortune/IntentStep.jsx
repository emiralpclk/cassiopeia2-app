import { useState } from 'react';
import { useAppDispatch } from '../../context/AppContext';
import FortuneProfileSelector from '../../components/FortuneProfileSelector';
import CassiopeiaLogo from '../../components/CassiopeiaLogo';
import TypewriterWhispers from '../../components/TypewriterWhispers';

export default function IntentStep() {
  const dispatch = useAppDispatch();
  const [intent, setIntent] = useState('');

  const PREDEFINED_INTENTS = [
    { id: 'general', label: 'Genel Açılım', text: 'Genel hayatıma, enerjime ve yakın geleceğime dair kapsamlı bir yorum istiyorum.' },
    { id: 'love', label: 'Aşk & İlişki', text: 'Kalp meselelerime, ilişki durumuma ve aşk hayatımdaki gelişmelere odaklan.' },
    { id: 'career', label: 'İş & Kariyer', text: 'Kariyer yolculuğum, maddi beklentilerim ve iş hayatımdaki fırsatlara bak.' },
    { id: 'social', label: 'Arkadaşlıklar', text: 'Yakın çevrem, dostluklarım ve sosyal hayatımdaki enerjiler hakkında derin bir farkındalık; ikili ilişkilerimdeki gizli dinamikler hakkında netlik arıyorum.' },
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
    <div className="intent-step fade-in">
      <div className="page-header">
        <h1 className="page-title">
          Niyetini Mühürle
        </h1>
        <p className="page-subtitle">Sana rehberlik etmesi için niyetini paylaş.</p>
      </div>

      <div className="intent-form" style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }}>Kimliğin</label>
          <div style={{ margin: '0 -20px', width: 'calc(100% + 40px)' }}>
            <FortuneProfileSelector />
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>Hızlı Odaklar</label>
          <div className="intent-grid" style={{ marginBottom: '16px', justifyContent: 'flex-start' }}>
            {PREDEFINED_INTENTS.map((item) => (
              <button 
                key={item.id} 
                className={`intent-chip ${intent === item.text ? 'active' : ''}`}
                onClick={() => selectIntent(item)}
                style={{ padding: '8px 14px', fontSize: '12px', background: 'transparent' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <textarea
            className="intent-input"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Yukarıdan seçebilir veya aklındaki soruyu buraya yazabilirsin..."
            spellCheck="false"
            rows="4"
          />
          <TypewriterWhispers onSelect={setIntent} />
        </div>

        <button 
          className="step-button ritual-active" 
          onClick={handleSubmit}
          disabled={!intent.trim()}
          style={{ width: '100%', justifyContent: 'center', boxShadow: '0 0 20px var(--accent-glow)' }}
        >
          Devam Et
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .intent-step { padding-top: 32px; }
      `}} />
    </div>
  );
}