import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../context/AppContext';
import { TAROT_DECK } from '../../utils/constants';

export default function TarotBridge() {
  const dispatch = useAppDispatch();
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  
  const [holdingIndex, setHoldingIndex] = useState(null);
  const [cardProgress, setCardProgress] = useState({});
  const [shakingIndex, setShakingIndex] = useState(null);
  const holdTimer = useRef(null);

  const [shuffled] = useState(() => {
    const deck = Array.isArray(TAROT_DECK) ? [...TAROT_DECK] : [];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  });

  const labels = ['Geçmiş', 'Şu An', 'Gelecek'];

  useEffect(() => {
    if (holdingIndex !== null) {
      if (navigator.vibrate) navigator.vibrate(20);
      setShakingIndex(holdingIndex);
      
      let stepCount = 0;
      holdTimer.current = setInterval(() => {
        stepCount++;
        if (navigator.vibrate && stepCount % 5 === 0) navigator.vibrate(10);
        
        setCardProgress(prev => {
          const current = prev[holdingIndex] || 0;
          if (current >= 100) {
            clearInterval(holdTimer.current);
            setHoldingIndex(null);
            setShakingIndex(null);
            if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
            
            // Seçimi gerçekleştir
            handleCardClick(holdingIndex);
            
            return { ...prev, [holdingIndex]: 100 };
          }
          return { ...prev, [holdingIndex]: Math.min(current + 2, 100) };
        });
      }, 30);
    } else {
      clearInterval(holdTimer.current);
      setShakingIndex(null);
      setCardProgress(prev => {
        const newProgress = { ...prev };
        let changed = false;
        Object.keys(newProgress).forEach(idx => {
          if (newProgress[idx] > 0 && newProgress[idx] < 100) {
            newProgress[idx] = 0;
            changed = true;
          }
        });
        return changed ? newProgress : prev;
      });
    }
    return () => clearInterval(holdTimer.current);
  }, [holdingIndex]);

  const handleCardClick = (cardIndex) => {
    if (selectedCards.length >= 3 || revealedIndices.includes(cardIndex)) return;
    setRevealedIndices((prev) => [...prev, cardIndex]);
    const card = shuffled?.[cardIndex];
    if (!card) return;
    
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 3) {
      setTimeout(() => {
        dispatch({ type: 'SET_TAROT_SYNTHESIS_CARDS', payload: newSelected });
      }, 1500);
    }
  };

  return (
    <div className="fortune-step bridge-step" style={{ position: 'relative' }}>
      <style>{`
        @keyframes custom-shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          20% { transform: translate(-2px, -1px) rotate(-1deg); }
          40% { transform: translate(1px, -2px) rotate(1deg); }
          60% { transform: translate(-2px, 2px) rotate(0deg); }
          80% { transform: translate(2px, 1px) rotate(-1deg); }
          100% { transform: translate(-1px, -1px) rotate(0deg); }
        }
      `}</style>
      <div className="bridge-header">
        <span className="material-symbols-outlined">flare</span>
        <h2 className="step-title">Kartlarını Seç</h2>
        <p className="step-subtitle">Fincanındaki enerjileri netleştirmek için 3 kart seç</p>
      </div>

      <div className="selected-cards-display">
        {labels.map((label, i) => (
          <div key={label} className={`selected-card-slot ${selectedCards?.[i] ? 'filled' : ''}`}>
            {selectedCards?.[i] ? (
              <>
                <div className="slot-card revealed">
                  {selectedCards[i]?.img ? (
                    <img src={selectedCards[i].img} alt={selectedCards[i]?.nameTr || 'Kart'} />
                  ) : (
                    <span className="material-symbols-outlined">style</span>
                  )}
                </div>
                <div className="slot-info">
                  <span className="slot-label">{label}</span>
                  <span className="slot-card-name-next">{selectedCards[i]?.nameTr}</span>
                </div>
              </>
            ) : (
              <>
                <div className="cosmic-slot-empty" style={{ width: '90px', height: '140px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                </div>
                <div className="slot-info">
                  <span className="slot-label">{label}</span>
                  <span className="slot-card-name-next faded">Bekleniyor</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedCards.length < 3 && (
        <div className="tarot-spread-container">
          <p className="bridge-instruction" style={{ marginBottom: '16px' }}>
            {3 - selectedCards.length} kart daha seç ({labels[selectedCards.length]})
            <br/>
            <span style={{ fontSize: '13px', opacity: 0.7, fontWeight: 'normal', color: 'var(--accent)' }}>Seçmek için kartın üzerine 1.5 saniye basılı tut</span>
          </p>
          <div className="tarot-spread">
            {Array.isArray(shuffled) && shuffled.slice(0, 12).map((card, i) => {
              const prog = cardProgress[i] || 0;
              const isRevealed = revealedIndices.includes(i);
              const isHoldingThis = holdingIndex === i;

              return (
                <button
                  key={card?.id || i}
                  className={`tarot-card-back ${isRevealed ? 'flipped' : ''}`}
                  onMouseDown={() => !isRevealed && setHoldingIndex(i)}
                  onMouseUp={() => setHoldingIndex(null)}
                  onMouseLeave={() => setHoldingIndex(null)}
                  onTouchStart={() => !isRevealed && setHoldingIndex(i)}
                  onTouchEnd={() => setHoldingIndex(null)}
                  disabled={isRevealed}
                  style={{
                    position: 'relative',
                    boxShadow: (!isRevealed && prog > 0) 
                      ? `0 0 ${10 + prog * 0.2}px rgba(80, 200, 120, ${0.2 + prog * 0.008})`
                      : undefined,
                    animation: (shakingIndex === i && !isRevealed) ? `custom-shake ${0.25 - prog * 0.0015}s linear infinite` : 'none',
                    cursor: isRevealed ? 'default' : 'grab',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    transition: isHoldingThis ? 'none' : 'box-shadow 0.3s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="card-back-face tarot-card-modern">
                    <div className="tarot-card-shimmer"></div>
                    {prog > 0 && !isRevealed && (
                      <div style={{ position: 'absolute', inset: 0, background: `rgba(80, 200, 120, ${prog * 0.004})`, pointerEvents: 'none' }}></div>
                    )}
                  </div>
                  <div className="card-front-face">
                    {card?.img ? (
                      <img src={card.img} alt={card?.nameTr || 'Kart'} />
                    ) : (
                      <span className="material-symbols-outlined">style</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}