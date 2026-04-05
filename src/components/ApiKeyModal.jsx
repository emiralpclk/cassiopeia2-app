import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';

function ApiKeyModal() {
  const { showApiKeyModal, apiKey, isTestMode } = useAppState();
  const dispatch = useAppDispatch();
  const [tempKey, setTempKey] = useState(apiKey || '');

  if (!showApiKeyModal || isTestMode) return null;

  const handleSave = () => {
    const key = tempKey.trim();
    dispatch({ type: 'SET_API_KEY', payload: key });
    if (key) {
      dispatch({ type: 'SHOW_API_KEY_MODAL', payload: false });
    }
  };

  const handleTestMode = () => {
    // Only toggle if not already on, or just turn it on
    if (!isTestMode) {
      dispatch({ type: 'TOGGLE_TEST_MODE' });
    }
    dispatch({ type: 'SHOW_API_KEY_MODAL', payload: false });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">API Ayarları</h2>
        <input 
          type="password" 
          value={tempKey} 
          onChange={(e) => setTempKey(e.target.value)} 
          placeholder="Gemini API Key Girin..." 
          className="modal-input" 
        />
        <p className="modal-desc" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'center' }}>
          Yorumların mühürlenmesi için geçerli bir anahtar gereklidir.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button className="modal-button" onClick={handleSave}>Anahtarı Kaydet</button>
          
          {import.meta.env.DEV && (
            <button 
              className="modal-button secondary" 
              onClick={handleTestMode}
              style={{ 
                background: 'rgba(255,215,0,0.1)', 
                color: '#FFD700', 
                border: '1px solid rgba(255,215,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>bug_report</span>
              Test Moduyla Devam Et (Ücretsiz)
            </button>
          )}
        </div>

        {apiKey && (
          <button className="modal-link" onClick={() => dispatch({ type: 'SHOW_API_KEY_MODAL', payload: false })}>Kapat</button>
        )}
      </div>
    </div>
  );
}

export default ApiKeyModal;