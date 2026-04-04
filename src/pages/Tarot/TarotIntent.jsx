import { useState } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { TAROT_DECK } from '../../utils/constants';

export default function TarotIntent() {
  const dispatch = useAppDispatch();
  const { user } = useAppState();
  const [intent, setIntent] = useState('');
  const [userName, setUserName] = useState('');
  const [selected, setSelected] = useState([]);

  const handleCardClick = (card) => {
    if (selected.find(c => c.id === card.id)) {
      setSelected(selected.filter(c => c.id !== card.id));
    } else if (selected.length < 3) {
      setSelected([...selected, card]);
    }
  };

  const handleStart = () => {
    if (intent.trim() && userName.trim() && selected.length === 3) {
       dispatch({ 
          type: 'SET_TAROT_INTENT', 
          payload: { intent: intent.trim(), userName: userName.trim() } 
       });
       dispatch({ type: 'SET_TAROT_SYNTHESIS_CARDS', payload: selected });
       dispatch({ type: 'SET_TAROT_STEP', payload: 'ritual' });
    }
  };

  return (
    <div className="fortune-step tarot-ritual-intent fade-in">
       <div className="step-header">
          <span className="material-symbols-outlined">flare</span>
          <h2>Zümrüt Ritüeli</h2>
          <p>Kâhinin kartları senin için seçebilmesi için niyetini mühürle.</p>
       </div>

       <div className="intent-form-premium glass-card">
          <input 
             type="text" 
             value={userName} 
             onChange={(e) => setUserName(e.target.value)} 
             placeholder="Adın veya bir mahlas" 
             className="modal-input" 
          />
          <textarea 
             value={intent} 
             onChange={(e) => setIntent(e.target.value)} 
             placeholder="Kalbinden ne geçiyor?" 
          />
       </div>

       <div className="tarot-selection-grid scroll-container mt-4">
          <h4 className="section-subtitle">3 Kart Seç</h4>
          <div className="deck-scroll">
             {TAROT_DECK.map((card) => {
                const isSelected = selected.find(c => c.id === card.id);
                return (
                   <div 
                      key={card.id} 
                      className={`tarot-card-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleCardClick(card)}
                   >
                      <img src={card.img} alt={card.nameTr} />
                      {isSelected && <div className="card-badge"><span className="material-symbols-outlined">check</span></div>}
                   </div>
                );
             })}
          </div>
       </div>

       <button 
          className="step-button primary wide mt-4" 
          disabled={!intent.trim() || !userName.trim() || selected.length < 3} 
          onClick={handleStart}
       >
          Ritüeli Başlat ({selected.length}/3)
       </button>

       <style dangerouslySetInnerHTML={{ __html: `
          .tarot-ritual-intent { padding: 40px 20px; text-align: center; display: flex; flex-direction: column; height: 100vh; }
          .intent-form-premium { padding: 24px; margin-bottom: 24px; }
          .intent-form-premium textarea { width: 100%; height: 100px; background: none; border: none; color: var(--text-primary); font-family: inherit; font-size: 15px; resize: none; outline: none; margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; }
          .section-subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 12px; text-align: left; }
       `}} />
    </div>
  );
}
