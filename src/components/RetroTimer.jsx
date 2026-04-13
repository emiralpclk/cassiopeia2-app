import { useState, useEffect } from 'react';
import { calculateCountdown } from '../utils/cosmicUtils';

/**
 * RetroTimer — Isolated countdown component.
 * Only this component runs setInterval every second.
 * The parent DiscoverPage is completely free from per-second re-renders.
 */
export default function RetroTimer({ targetTime, currentSign }) {
  const [countdown, setCountdown] = useState(() => calculateCountdown(targetTime));

  useEffect(() => {
    if (!targetTime) return;
    setCountdown(calculateCountdown(targetTime));
    const id = setInterval(() => {
      setCountdown(calculateCountdown(targetTime));
    }, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  if (!countdown) return null;

  return (
    <>
      <div className="retro-timer">
        <div className="timer-unit">
          <span className="timer-val">{String(countdown.days).padStart(2, '0')}</span>
          <span className="timer-label">GÜN</span>
        </div>
        <div className="timer-sep">:</div>
        <div className="timer-unit">
          <span className="timer-val">{String(countdown.hours).padStart(2, '0')}</span>
          <span className="timer-label">SAAT</span>
        </div>
        <div className="timer-sep">:</div>
        <div className="timer-unit">
          <span className="timer-val">{String(countdown.minutes).padStart(2, '0')}</span>
          <span className="timer-label">DAK</span>
        </div>
        <div className="timer-sep">:</div>
        <div className="timer-unit">
          <span className="timer-val">{String(countdown.seconds).padStart(2, '0')}</span>
          <span className="timer-label">SN</span>
        </div>
      </div>
      <p className="retro-timer-hint">
        Merkür {currentSign} burcundan ayrılıyor
      </p>
    </>
  );
}
