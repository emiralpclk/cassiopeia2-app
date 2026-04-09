import React from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ZODIAC_SIGNS, ELEMENT_DATA } from '../utils/constants';
import MysticIcon from './MysticIcon';

export default function FortuneProfileSelector() {
  const { profiles, activeProfileId } = useAppState();
  const dispatch = useAppDispatch();

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

  const handleAddProfile = () => {
    if (profiles.length < 4) {
      dispatch({ type: 'SHOW_ONBOARDING', payload: true });
    }
  };

  return (
    <div className="fortune-profile-selector" style={{ 
      margin: '-20px 0 -20px 0', 
      display: 'flex', 
      overflowX: 'auto', 
      gap: '16px', 
      padding: '40px 20px 40px 20px',
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      WebkitMaskImage: 'none',
      maskImage: 'none'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        .fortune-profile-selector::-webkit-scrollbar { display: none; }
        .fortune-profile-selector .profile-identity-card.active-identity {
          box-shadow: 0 0 40px var(--accent-glow), 0 0 12px rgba(255, 255, 255, 0.08);
        }
      `}} />
      {profiles.map(p => {
        const isActive = p.id === activeProfileId;
        const pZodiac = ZODIAC_SIGNS.find(z => z.id === p.zodiac);
        
        return (
          <div 
            key={p.id} 
            className={`profile-identity-card ${isActive ? 'active-identity' : ''} ${p.isMain ? 'master-card' : ''}`}
            style={{ 
              padding: p.isMain ? '28px' : '20px',
              width: '84vw',
              maxWidth: '340px',
              flex: '0 0 auto',
              scrollSnapAlign: 'start',
              cursor: 'pointer'
            }}
            onClick={() => dispatch({ type: 'SWITCH_PROFILE', payload: p.id })}
          >
            <div className={`identity-aura-glow aura-${ELEMENT_DATA[pZodiac?.element]?.id}`}></div>
            
            <div className="profile-identity-tag" style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
              <MysticIcon 
                name={pZodiac?.id} 
                color={ELEMENT_DATA[pZodiac?.element]?.color || '#fff'} 
                size={p.isMain ? 40 : 32} 
              />
            </div>
            
            <div style={{ flex: '1 1 0%', position: 'relative', zIndex: 2, minWidth: 0, textAlign: 'left' }}>
              {p.isMain && <div className="profile-tag-label" style={{ fontSize: '10px' }}>ANA HESAP</div>}
              
              <h4 style={{ 
                fontSize: p.isMain ? '22px' : '18px', 
                fontWeight: '700', 
                margin: '0 0 4px 0',
                color: '#fff',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {p.name.length > 15 ? p.name.slice(0, 15) + '..' : p.name}
              </h4>
              
              <div className="profile-element-sub" style={{ 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                fontSize: '13px'
              }}>
                <span>{calculateAgeFor(p) ? `${calculateAgeFor(p)} Yaşında` : 'Yaş Belirsiz'}</span>
                <span style={{ opacity: 0.3, margin: '0 6px' }}>•</span>
                <span style={{ color: ELEMENT_DATA[pZodiac?.element]?.color }}>{pZodiac?.name}</span>
              </div>
            </div>
          </div>
        );
      })}

      {profiles.length < 4 && (
        <div 
          className="add-identity-card" 
          onClick={handleAddProfile}
          style={{
            border: '2px dashed rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.02)',
            padding: '16px',
            borderRadius: '24px',
            minWidth: '200px',
            flex: '0 0 auto',
            scrollSnapAlign: 'start',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>add</span>
          </div>
          <span style={{ fontWeight: '600', fontSize: '13px', paddingTop: '4px' }}>Yeni Profil</span>
        </div>
      )}
    </div>
  );
}
