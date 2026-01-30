import { useState, useEffect } from 'react';
import './TopBanner.css';

export default function TopBanner() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  // Calculate countdown to end of day
  const getCountdown = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const diff = endOfDay - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
  };

  const countdown = getCountdown();

  return (
    <div className="top-banner">
      <div className="top-banner-container">
        <div className="banner-left">
          <span className="limited-offer-badge">
            🎉 Limited Time Offer
          </span>
          <div className="banner-text">
            <h3>Special Deals & Offers</h3>
            <p>Get up to 40% off on selected items</p>
          </div>
        </div>

        <div className="banner-center">
          <div className="live-datetime">
            <div className="date-display">📅 {formatDate(currentTime)}</div>
            <div className="time-display">🕐 {formatTime(currentTime)}</div>
          </div>
        </div>

        <div className="banner-right">
          <div className="countdown-timer">
            <div className="timer-box">
              <div className="timer-value">{String(countdown.hours).padStart(2, '0')}</div>
              <div className="timer-label">HOURS</div>
            </div>
            <div className="timer-box">
              <div className="timer-value">{String(countdown.minutes).padStart(2, '0')}</div>
              <div className="timer-label">MINS</div>
            </div>
            <div className="timer-box">
              <div className="timer-value">{String(countdown.seconds).padStart(2, '0')}</div>
              <div className="timer-label">SECS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
