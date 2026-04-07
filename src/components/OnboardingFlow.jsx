import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, GENDER_OPTIONS, RELATIONSHIP_STATUSES, getZodiacByDate } from '../utils/constants';
import MysticIcon from './MysticIcon';

export default function OnboardingFlow() {
  const { showOnboarding, profiles, editingProfileId } = useAppState();
  const dispatch = useAppDispatch();
  
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [day, setDay] = useState('01');
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState('2003');
  const [gender, setGender] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [showComplexOptions, setShowComplexOptions] = useState(false);

  const isAddingNew = profiles && profiles.length > 0 && !editingProfileId;
  const isEditing = !!editingProfileId;

  // Pre-fill state and handle step logic
  useEffect(() => {
    if (showOnboarding) {
      if (isEditing) {
        const profileToEdit = profiles.find(p => p.id === editingProfileId);
        if (profileToEdit) {
          setName(profileToEdit.name || '');
          setDay(profileToEdit.birthDate?.day || '01');
          setMonth(profileToEdit.birthDate?.month || '01');
          setYear(profileToEdit.birthDate?.year || '2003');
          setGender(profileToEdit.gender || '');
          setRelationshipStatus(profileToEdit.relationshipStatus || '');
          // Always start at step 0 to allow name editing, even for main account
          setStep(0);
        }
      } else {
        // Reset for new additions or initial setup
        setStep(profiles && profiles.length > 0 ? 0 : 1);
        setName('');
        setDay('01'); setMonth('01'); setYear('2003');
        setGender(''); setRelationshipStatus('');
      }
    }
  }, [showOnboarding, editingProfileId, profiles]);

  const adjustValue = (field, delta, min, max) => {
    if (field === 'day') {
      setDay(prev => {
        let next = parseInt(prev) + delta;
        if (next < min) next = max;
        if (next > max) next = min;
        return String(next).padStart(2, '0');
      });
    }
    if (field === 'month') {
      setMonth(prev => {
        let next = parseInt(prev) + delta;
        if (next < min) next = max;
        if (next > max) next = min;
        return String(next).padStart(2, '0');
      });
    }
    if (field === 'year') {
      setYear(prev => {
        let next = parseInt(prev) + delta;
        if (next < min) next = max;
        if (next > max) next = min;
        return String(next);
      });
    }
  };

  const formatName = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleComplete = () => {
    const d = parseInt(day);
    const m = parseInt(month);
    const zodiacData = getZodiacByDate(d, m);
    
    // Capitalize every word in name
    const formattedName = formatName(name);
    
    // Determine which profile we are working on
    const profileToEdit = isEditing ? profiles.find(p => p.id === editingProfileId) : null;

    const profileData = {
      id: isEditing ? editingProfileId : (isAddingNew ? Date.now().toString() : 'main'),
      name: formattedName, // Always use the provided name
      zodiac: zodiacData?.id || 'aries',
      gender,
      relationshipStatus,
      birthDate: { day, month, year },
      onboarded: true,
      isMain: isEditing ? profileToEdit?.isMain : !isAddingNew
    };

    if (isAddingNew) {
      dispatch({ type: 'ADD_PROFILE', payload: profileData });
    } else {
      dispatch({ type: 'SET_USER', payload: profileData });
    }
  };

  if (!showOnboarding) return null;

  const isDateValid = () => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    return d > 0 && d <= 31 && m > 0 && m <= 12 && y >= 1920 && y <= new Date().getFullYear();
  };

  const filteredRelationships = RELATIONSHIP_STATUSES.filter(r => 
    showComplexOptions ? r.complex : !r.complex
  );

  return (
    <div className="modal-overlay onboarding-overlay">
      <div className="onboarding-container fade-in">
        
        {/* Step 0: Name (Only for adding new profiles) */}
        {step === 0 && (
          <div className="onboarding-step">
            <h2 className="step-title">Kimi Ekliyoruz?</h2>
            <p className="step-subtitle">Bu profile bir isim vererek Cassiopeia'nın onu tanımasını sağla.</p>
            
            <div className="name-input-container" style={{ marginTop: '40px', width: '100%' }}>
              <input 
                type="text"
                placeholder="Örn: Ayşe, Mehmet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="onboarding-input-box"
                autoFocus
                style={{ textAlign: 'center', fontSize: '20px', padding: '20px', width: '100%', height: 'auto' }}
              />
            </div>

            <button 
              className="onboarding-next" 
              disabled={name.trim().length < 2} 
              onClick={() => setStep(1)}
              style={{ marginTop: '40px' }}
            >
              Devam Et
            </button>

            <button 
              className="modal-link back-button" 
              onClick={() => dispatch({ type: 'SHOW_ONBOARDING', payload: false })}
              style={{ marginTop: '20px' }}
            >
              Vazgeç
            </button>
          </div>
        )}

        {/* Step 1: Birth Date */}
        {step === 1 && (
          <div className="onboarding-step">
            <h2 className="step-title">{isAddingNew ? `${formatName(name)} Ne Zaman Doğdu?` : 'Kozmik Yolculuğun Ne Zaman Başladı?'}</h2>
            <p className="step-subtitle">Doğum tarihini belirleyerek yıldız haritasını çıkaralım.</p>
            
            <div className="birth-date-inputs" style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '40px 0' }}>
              {/* Gün */}
              <div className="onboarding-input-wrapper">
                <button className="stepper-btn" onClick={() => adjustValue('day', 1, 1, 31)}>
                  <MysticIcon name="add" size={18} />
                </button>
                <div className="onboarding-input-box" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {day}
                </div>
                <button className="stepper-btn" onClick={() => adjustValue('day', -1, 1, 31)}>
                  <MysticIcon name="remove" size={18} />
                </button>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Gün</span>
              </div>

              {/* Ay */}
              <div className="onboarding-input-wrapper">
                <button className="stepper-btn" onClick={() => adjustValue('month', 1, 1, 12)}>
                  <MysticIcon name="add" size={18} />
                </button>
                <div className="onboarding-input-box" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {month}
                </div>
                <button className="stepper-btn" onClick={() => adjustValue('month', -1, 1, 12)}>
                  <MysticIcon name="remove" size={18} />
                </button>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Ay</span>
              </div>

              {/* Yıl */}
              <div className="onboarding-input-wrapper">
                <button className="stepper-btn" onClick={() => adjustValue('year', 1, 1920, new Date().getFullYear())}>
                  <MysticIcon name="add" size={18} />
                </button>
                <div className="onboarding-input-box" style={{ width: '90px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {year}
                </div>
                <button className="stepper-btn" onClick={() => adjustValue('year', -1, 1920, new Date().getFullYear())}>
                  <MysticIcon name="remove" size={18} />
                </button>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Yıl</span>
              </div>
            </div>

            <button 
              className="onboarding-next" 
              disabled={!isDateValid()} 
              onClick={() => setStep(2)}
            >
              Devam Et
            </button>
            <div style={{ marginTop: '20px' }}>
              <button 
                className="modal-link back-button" 
                onClick={() => isAddingNew ? setStep(0) : dispatch({ type: 'SHOW_ONBOARDING', payload: false })}
                style={{ fontSize: '12px', opacity: 0.6 }}
              >
                <MysticIcon name="chevron_left" color="currentColor" size={14} style={{ marginRight: '5px' }} />
                {isAddingNew ? 'Geri Dön' : 'Vazgeç'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Gender */}
        {step === 2 && (
          <div className="onboarding-step">
            <h2 className="step-title">Cinsiyet Kimliği</h2>
            <p className="step-subtitle">Enerjisini en iyi yansıtan seçeneği belirle.</p>
            
            <div className="gender-grid" style={{ display: 'grid', gap: '12px', marginTop: '30px' }}>
              {GENDER_OPTIONS.map(opt => (
                <button 
                  key={opt.id}
                  className={`gender-card ${gender === opt.id ? 'active' : ''}`}
                  onClick={() => setGender(opt.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: gender === opt.id ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: gender === opt.id ? 'var(--bg)' : '#fff', cursor: 'pointer' }}
                >
                  <MysticIcon 
                    name={opt.id === 'woman' ? 'female' : opt.id === 'man' ? 'male' : 'nonbinary'} 
                    color={gender === opt.id ? 'var(--bg)' : '#fff'} 
                    size={24} 
                  />
                  <span style={{ fontWeight: '600', fontSize: '15px', letterSpacing: '0.02em' }}>{opt.label}</span>
                </button>
              ))}
            </div>

            <button 
              className="onboarding-next" 
              disabled={!gender} 
              onClick={() => setStep(3)}
              style={{ marginTop: '30px' }}
            >
              Devam Et
            </button>
            <button className="modal-link back-button" onClick={() => setStep(1)} style={{ marginTop: '15px' }}>
              <MysticIcon name="chevron_left" size={18} style={{ marginRight: '4px' }} />
              Geri Dön
            </button>
          </div>
        )}

        {/* Step 3: Relationship Status */}
        {step === 3 && (
          <div className="onboarding-step">
            <h2 className="step-title">İlişki Durumu</h2>
            <p className="step-subtitle">Duygusal bağları, Cassiopeia'nın dilini şekillendirir.</p>
            
            <div className="relationship-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '30px' }}>
              {filteredRelationships.map(opt => (
                <button 
                  key={opt.id}
                  className={`relationship-card ${relationshipStatus === opt.id ? 'active' : ''}`}
                  onClick={() => setRelationshipStatus(opt.id)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: relationshipStatus === opt.id ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: relationshipStatus === opt.id ? 'var(--bg)' : '#fff', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{opt.label}</span>
                </button>
              ))}
            </div>

            <button 
              className="modal-link complex-toggle" 
              onClick={() => setShowComplexOptions(!showComplexOptions)}
              style={{ marginTop: '20px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', color: 'var(--accent)' }}
            >
              {showComplexOptions ? 'Daha sade seçenekler...' : 'İşler biraz daha karmaşık...'}
            </button>

            <button 
              className="onboarding-next" 
              disabled={!relationshipStatus} 
              onClick={handleComplete}
              style={{ marginTop: '30px' }}
            >
              {isAddingNew ? `${formatName(name)} Profilini Oluştur` : 'Cassiopeia\'ya Katıl'}
            </button>
            <button 
              className="modal-link back-button" 
              onClick={() => setStep(2)} 
              style={{ marginTop: '15px', fontSize: '12px', opacity: 0.6 }}
            >
              <MysticIcon name="chevron_left" size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Geri Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
}