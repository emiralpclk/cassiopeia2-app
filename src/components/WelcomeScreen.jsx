import { useEffect, useState } from 'react';
import { useAppDispatch } from '../context/AppContext';
import CassiopeiaLogo from './CassiopeiaLogo';

export default function WelcomeScreen() {
  const dispatch = useAppDispatch();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Initial entrance delay for magic feel
    const timer = setTimeout(() => setShowContent(true), 100);
    
    // Auto-proceed after animation completes (3 tur × 1.8s = ~5.4s)
    const proceedTimer = setTimeout(() => {
      dispatch({ type: 'HIDE_WELCOME' });
    }, 5500);

    return () => {
      clearTimeout(timer);
      clearTimeout(proceedTimer);
    };
  }, [dispatch]);

  return (
    <div className="welcome-screen" style={{
      position: 'fixed',
      inset: 0,
      background: '#050508',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Ambience */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(226, 232, 240, 0.05) 0%, transparent 70%)',
        opacity: showContent ? 1 : 0,
        transition: 'opacity 2s ease'
      }} />

      {/* The Sigil Element */}
      <div className="sigil-container" style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '40px',
        transform: showContent ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-45deg)',
        opacity: showContent ? 1 : 0,
        transition: 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Cassiopeia Logo — loading spin modu */}
        <CassiopeiaLogo
          size={180}
          isLoading={true}
          color="var(--accent)"
        />
      </div>

      {/* Welcome Text */}
      <div style={{
        textAlign: 'center',
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        opacity: showContent ? 1 : 0,
        transition: 'all 1s ease 0.5s'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          letterSpacing: '-0.02em',
          background: 'var(--accent-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px'
        }}>
          Cassiopeia'ya Hoş Geldiniz
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          opacity: 0.8,
          letterSpacing: '0.02em',
          fontWeight: '300'
        }}>
          Fala dair her şeyiniz.
        </p>
      </div>

      {/* Progress Line */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        width: '120px',
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'var(--accent-gradient)',
          animation: 'loading-line 3s forwards ease-in-out'
        }} />
      </div>

      <style>{`
        @keyframes sigil-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes core-pulse {
          from { opacity: 0.4; transform: scale(1); }
          to { opacity: 1; transform: scale(1.5); }
        }
        @keyframes loading-line {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
