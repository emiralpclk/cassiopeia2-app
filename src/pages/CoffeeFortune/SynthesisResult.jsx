import { useEffect, useState, useRef } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { callGemini } from '../../services/gemini';
import { buildTarotSynthesisPrompt } from '../../utils/prompts';
import { getMockSynthesisResult } from '../../services/mockData';
import OracleLoading from '../../components/OracleLoading';
import Typewriter from '../../components/Typewriter';

function SynthesisResult() {
  const { currentFortune, apiKey, user, isTestMode } = useAppState();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (Array.isArray(currentFortune?.selectedTarotCards) && currentFortune.selectedTarotCards.length === 3 && !currentFortune.synthesisResult) {
      if (hasRequested.current) return;
      hasRequested.current = true;
      runSynthesis();
    } else if (currentFortune?.synthesisResult) {
      setLoading(false);
      // Note: MARK_SYNTHESIS_ANIMATED is handled by the Typewriter onFinish in ResultsPage
    }
    
    return () => {
      hasRequested.current = false;
    };
  }, []);

  // Removed: premature MARK_SYNTHESIS_ANIMATED — now handled via Typewriter onFinish in ResultsPage

  async function runSynthesis() {
    // In test mode, we don't need apiKey
    if (!apiKey && !isTestMode) return;
    setLoading(true);
    try {
      if (isTestMode) {
        // Mock delay (1 second)
        await new Promise(resolve => setTimeout(resolve, 1000));
        const result = getMockSynthesisResult();
        dispatch({ type: 'SET_SYNTHESIS_RESULT', payload: result });
      } else {
        const computeAge = (bDate) => {
          if (!bDate?.year) return null;
          const today = new Date();
          let age = today.getFullYear() - parseInt(bDate.year);
          const m = today.getMonth() + 1;
          if (m < parseInt(bDate.month) || (m === parseInt(bDate.month) && today.getDate() < parseInt(bDate.day))) age--;
          return age;
        };
        const userAge = computeAge(user?.birthDate);

        const prompt = buildTarotSynthesisPrompt(
          currentFortune?.coffeeResult?.general || '',
          currentFortune?.intent || '',
          user?.zodiac || '',
          userAge ? `${userAge} yaşında` : '',
          user?.relationshipStatus || '',
          user?.gender || '',
          currentFortune?.selectedTarotCards?.[0] || null,
          currentFortune?.selectedTarotCards?.[1] || null,
          currentFortune?.selectedTarotCards?.[2] || null
        );

        if (!prompt) throw new Error('Sentez promptu hazırlanamadı.');

        const result = await callGemini(apiKey, prompt);
        dispatch({ type: 'SET_SYNTHESIS_RESULT', payload: result });
      }
    } catch (err) {
      console.error('Sentez hatası:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Sentez oluşturulamadı.' });
    }
    setLoading(false);
  }

  if (loading && !currentFortune?.synthesisResult) {
    return <OracleLoading message="Cassiopeia yıldızları birleştiriyor..." />;
  }

  if (!currentFortune?.synthesisResult) {
    return (
      <div className="fortune-step synthesis-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <p className="result-text faded" style={{ textAlign: 'center' }}>Sentez sonucu kâhin tarafından hazırlanıyor...</p>
        {loading && <OracleLoading message="Derin ruhlar harmanlanıyor..." />}
      </div>
    );
  }

  return (
    <div className="fortune-step synthesis-step">
      <div className="synthesis-header">
        <span className="material-symbols-outlined">flare</span>
        <h2 className="step-title">Büyük Resim</h2>
        <p className="step-subtitle">Kahve ve Tarot'un ortak mesajı</p>
      </div>

      <div className="synthesis-cards-mini">
        {Array.isArray(currentFortune?.selectedTarotCards) && currentFortune.selectedTarotCards.map((card, i) => (
          <div key={i} className="mini-card stagger-item" style={{ animationDelay: `${i * 0.2}s` }}>
            {card?.img ? (
              <img src={card.img} alt={card?.nameTr || 'Kart'} />
            ) : (
              <span className="material-symbols-outlined">style</span>
            )}
          </div>
        ))}
      </div>

      <div className="synthesis-content">
        {currentFortune?.synthesisResult && (
          <Typewriter 
            key={currentFortune.synthesisResult}
            className="result-text" 
            text={currentFortune.synthesisResult} 
            animate={!currentFortune?.synthesisAnimated}
            speed={30}
            onFinish={() => {
              if (!currentFortune?.synthesisAnimated) {
                dispatch({ type: 'MARK_SYNTHESIS_ANIMATED' });
              }
            }}
          />
        )}
      </div>

      <div className="synthesis-actions">
        <button className="step-button synthesis-back-btn" onClick={() => dispatch({ type: 'GO_BACK_TO_RESULTS' })}>
          <span className="material-symbols-outlined">arrow_back</span>
          Falıma Geri Dön
        </button>
      </div>
    </div>
  );
}

export default SynthesisResult;