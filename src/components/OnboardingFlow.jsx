import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, GENDER_OPTIONS, RELATIONSHIP_STATUSES, getZodiacByDate } from '../utils/constants';
import { TURKEY_CITIES, TURKEY_DISTRICTS } from '../utils/cities';
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

  // Astroloji için yeni global alanlar
  const [birthTime, setBirthTime] = useState('');
  const [dontKnowTime, setDontKnowTime] = useState(false);
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDistrict, setBirthDistrict] = useState('');

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
          setBirthTime(profileToEdit.birthTime || '');
          setDontKnowTime(profileToEdit.birthTime === null && profileToEdit.onboarded); 
          setBirthPlace(profileToEdit.birthPlace || '');
          setBirthDistrict(profileToEdit.birthDistrict || '');
          
          setStep(0);
        }
      } else {
        setStep(0);
        setName('');
        setDay('01'); setMonth('01'); setYear('2003');
        setGender(''); setRelationshipStatus('');
        setBirthTime(''); setDontKnowTime(false); setBirthPlace(''); setBirthDistrict('');
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
    
    const formattedName = formatName(name);
    
    const profileToEdit = isEditing ? profiles.find(p => p.id === editingProfileId) : null;

    const profileData = {
      id: isEditing ? editingProfileId : (isAddingNew ? Date.now().toString() : 'main'),
      name: formattedName,
      zodiac: zodiacData?.id || 'aries',
      gender,
      relationshipStatus,
      birthDate: { day, month, year },
      birthTime: dontKnowTime ? null : birthTime,
      birthPlace,
      birthDistrict,
      onboarded: true,
      isMain: isEditing ? profileToEdit?.isMain : !isAddingNew
    };

    if (isAddingNew) {
      dispatch({ type: 'ADD_PROFILE', payload: profileData });
    } else {
      dispatch({ type: 'SET_USER', payload: profileData });
    }
    dispatch({ type: 'SHOW_ONBOARDING', payload: false });
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
      <div className="onboarding-container fade-in" style={{ paddingBottom: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {step === 0 && (
          <div className="onboarding-step">
            <h2 className="step-title">{isAddingNew ? 'Kimi Ekliyoruz?' : 'Adın Ne?'}</h2>
            <p className="step-subtitle">{isAddingNew ? 'Bu profile bir isim vererek Cassiopeia\'nın onu tanımasını sağla.' : 'Cassiopeia seni tanısın, adını paylaş.'}</p>
            
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

        {step === 1 && (
          <div className="onboarding-step">
            <h2 className="step-title">{isAddingNew ? `${formatName(name)} Ne Zaman Doğdu?` : 'Kozmik Yolculuğun Ne Zaman Başladı?'}</h2>
            <p className="step-subtitle">Doğum tarihini belirleyerek yıldız haritasını çıkaralım.</p>
            
            <div className="birth-date-inputs" style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '40px 0' }}>
              <div className="onboarding-input-wrapper">
                <button className="stepper-btn" onClick={() => adjustValue('day', 1, 1, 31)}><MysticIcon name="add" size={18} /></button>
                <div className="onboarding-input-box" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{day}</div>
                <button className="stepper-btn" onClick={() => adjustValue('day', -1, 1, 31)}><MysticIcon name="remove" size={18} /></button>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Gün</span>
              </div>
              <div className="onboarding-input-wrapper">
                <button className="stepper-btn" onClick={() => adjustValue('month', 1, 1, 12)}><MysticIcon name="add" size={18} /></button>
                <div className="onboarding-input-box" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{month}</div>
                <button className="stepper-btn" onClick={() => adjustValue('month', -1, 1, 12)}><MysticIcon name="remove" size={18} /></button>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Ay</span>
              </div>
              <div className="onboarding-input-wrapper">
                <button className="stepper-btn" onClick={() => adjustValue('year', 1, 1920, new Date().getFullYear())}><MysticIcon name="add" size={18} /></button>
                <div className="onboarding-input-box" style={{ width: '90px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{year}</div>
                <button className="stepper-btn" onClick={() => adjustValue('year', -1, 1920, new Date().getFullYear())}><MysticIcon name="remove" size={18} /></button>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Yıl</span>
              </div>
            </div>

            <button className="onboarding-next" disabled={!isDateValid()} onClick={() => setStep(2)}>Devam Et</button>
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
                  <MysticIcon name={opt.id === 'woman' ? 'female' : opt.id === 'man' ? 'male' : 'nonbinary'} color={gender === opt.id ? 'var(--bg)' : '#fff'} size={24} />
                  <span style={{ fontWeight: '600', fontSize: '15px', letterSpacing: '0.02em' }}>{opt.label}</span>
                </button>
              ))}
            </div>

            <button className="onboarding-next" disabled={!gender} onClick={() => setStep(3)} style={{ marginTop: '30px' }}>Devam Et</button>
            <button className="modal-link back-button" onClick={() => setStep(1)} style={{ marginTop: '15px' }}>
              <MysticIcon name="chevron_left" size={18} style={{ marginRight: '4px' }} />
              Geri Dön
            </button>
          </div>
        )}

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

            <button className="modal-link complex-toggle" onClick={() => setShowComplexOptions(!showComplexOptions)} style={{ marginTop: '20px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 16px', color: 'var(--accent)' }}>
              {showComplexOptions ? 'Daha sade seçenekler...' : 'İşler biraz daha karmaşık...'}
            </button>

            <button className="onboarding-next" disabled={!relationshipStatus} onClick={() => setStep(4)} style={{ marginTop: '30px' }}>
              Devam Et
            </button>
            <button className="modal-link back-button" onClick={() => setStep(2)} style={{ marginTop: '15px', fontSize: '12px', opacity: 0.6 }}>
              <MysticIcon name="chevron_left" size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Geri Dön
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="onboarding-step">
            <h2 className="step-title">Astroloji Detayları</h2>
            <p className="step-subtitle">Eğer net bir yıldız haritası okuması istersen, bu bilgileri ekleyebilirsin. İstersen sonra da tamamlayabilirsin.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '25px', textAlign: 'left' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Doğum Saati (İsteğe Bağlı)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="time" 
                    className="astro-input" 
                    value={birthTime}
                    onChange={(e) => {
                      setBirthTime(e.target.value);
                      setDontKnowTime(false);
                    }}
                    disabled={dontKnowTime}
                    style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: dontKnowTime ? 'gray' : '#fff', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-body)' }}
                  />
                  <button 
                    onClick={() => setDontKnowTime(!dontKnowTime)}
                    style={{ padding: '15px', borderRadius: '12px', background: dontKnowTime ? 'var(--accent)' : 'transparent', color: dontKnowTime ? '#000' : 'var(--text-secondary)', border: '1px solid var(--accent)', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px' }}
                  >
                    Bilmiyorum
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Doğduğun Şehir</label>
                <select 
                  className="astro-input" 
                  value={birthPlace}
                  onChange={(e) => { setBirthPlace(e.target.value); setBirthDistrict(''); }}
                  style={{ WebkitAppearance: 'none', background: '#0a0a0f', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <option value="" disabled>Seçiniz...</option>
                  {TURKEY_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>

              {birthPlace && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>İlçe</label>
                  <select 
                    className="astro-input" 
                    value={birthDistrict}
                    onChange={(e) => setBirthDistrict(e.target.value)}
                    style={{ WebkitAppearance: 'none', background: '#0a0a0f', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', animation: 'fade-in 0.3s ease' }}
                  >
                    <option value="" disabled>İlçe Seç...</option>
                    {(TURKEY_DISTRICTS[birthPlace] || ["Merkez", "Diğer İlçeler"]).map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button 
              className="onboarding-next" 
              onClick={handleComplete}
              style={{ marginTop: '30px' }}
            >
              Saveliği Tamamla & {isAddingNew ? `Oluştur` : 'Kaydet'}
            </button>
            <button 
              className="modal-link back-button" 
              onClick={handleComplete}
              style={{ marginTop: '15px', fontSize: '14px', color: 'var(--accent)', textDecoration: 'underline' }}
            >
              Şimdilik Atla (Sonra Doldururum)
            </button>
            <button className="modal-link back-button" onClick={() => setStep(3)} style={{ marginTop: '15px', fontSize: '12px', opacity: 0.6 }}>
              <MysticIcon name="chevron_left" size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Geri Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
}