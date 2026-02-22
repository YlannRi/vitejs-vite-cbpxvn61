import React, { useState } from 'react';
import './App.css';
import HomePage from './HomePage';
import AccountPage from './AccountPage';
import LoginPage from './LoginPage';
import ActivityPage from './ActivityPage';
import RequestRidePage from './RequestRidePage';
import PostRidePage from './PostRidePage';
import JourneyPage from './JourneyPage';

type Tab = 'home' | 'journey' | 'activity' | 'account' | 'request' | 'post';

// Map Placeholder
export const MapPlaceholder: React.FC<{ label?: string }> = ({ label = 'Map Preview' }) => (
  <div className="map-placeholder">
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" className="map-svg">
      <rect width="400" height="220" fill="#e8ead6"/>
      <path d="M0,110 Q100,90 200,110 Q300,130 400,110" stroke="#fff" strokeWidth="10" fill="none"/>
      <path d="M0,110 Q100,90 200,110 Q300,130 400,110" stroke="#d4c89a" strokeWidth="8" fill="none" strokeDasharray="20,8"/>
      <path d="M150,0 Q160,80 170,110 Q180,150 175,220" stroke="#fff" strokeWidth="8" fill="none"/>
      <path d="M250,0 Q245,70 240,110 Q235,155 230,220" stroke="#fff" strokeWidth="6" fill="none"/>
      <path d="M80,170 Q130,140 180,110 Q230,80 310,55" stroke="#3b82f6" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10,4"/>
      <circle cx="80" cy="170" r="10" fill="#22c55e"/><circle cx="80" cy="170" r="6" fill="#fff"/><circle cx="80" cy="170" r="3" fill="#22c55e"/>
      <circle cx="310" cy="55" r="12" fill="#ef4444"/><circle cx="310" cy="55" r="6" fill="#fff"/>
      <path d="M310,67 L310,80" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
      <text x="60" y="195" fontSize="10" fill="#166534" fontWeight="bold">Pick Up</text>
      <text x="290" y="48" fontSize="10" fill="#991b1b" fontWeight="bold">Drop Off</text>
    </svg>
    <div className="map-badge">{label}</div>
  </div>
);

export const Icons = {
  message: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  cancel:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  star:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  report:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  accept:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  remove:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  back:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  pin:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  next:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
};

export const DetailRow: React.FC<{ label: string; value: React.ReactNode; valueClass?: string }> = ({ label, value, valueClass }) => (
  <div className="sheet-detail-row">
    <span className="detail-label">{label}</span>
    <span className={`detail-value ${valueClass ?? ''}`}>{value}</span>
  </div>
);

export const Btn: React.FC<{ cls: string; icon: React.ReactNode; label: string; small?: boolean; onClick?: () => void }> = ({ cls, icon, label, small, onClick }) => (
  <button className={`sheet-action-btn ${cls}${small ? ' btn-small' : ''}`} onClick={onClick}>
    {icon}{label}
  </button>
);



const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear the token
    setIsAuthenticated(false);            // Reset auth state
    setActiveTab('home');                 // Reset tab so it defaults to home on next login
  };

  const renderAuthedContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage
                 onRequestRide={() => setActiveTab('request')}
                 onPostRide={() => setActiveTab('post')}
               />;
      case 'request':
        return <RequestRidePage />;
      case 'post':
        return <PostRidePage />;
      case 'account':
        // Pass the handler to the AccountPage
        return <AccountPage onLogout={handleLogout} />;
      case 'journey':
        return <JourneyPage />;
      case 'activity':
        return <ActivityPage />;
      default:
        return <HomePage
                 onRequestRide={() => setActiveTab('request')}
                 onPostRide={() => setActiveTab('post')}
               />;
    }
  };

  return (
    <div className="uber-page">
      <div className="uber-container">
        {isAuthenticated ? (
          renderAuthedContent()
        ) : (
          <LoginPage onAuthSuccess={handleAuthSuccess} />
        )}
      </div>

      {isAuthenticated && (
        <nav className="bottom-nav">
          <button
            className={`nav-item ${
              activeTab === 'home' ? 'nav-item-active' : ''
            }`}
            onClick={() => setActiveTab('home')}
          >
            <div className="nav-icon">🚗</div>
            <div className="nav-label">Home</div>
          </button>

          <button
            className={`nav-item ${
              activeTab === 'journey' ? 'nav-item-active' : ''
            }`}
            onClick={() => setActiveTab('journey')}
          >
            <div className="nav-icon">🗺️</div>
            <div className="nav-label">Journey</div>
          </button>

          <button
            className={`nav-item ${
              activeTab === 'activity' ? 'nav-item-active' : ''
            }`}
            onClick={() => setActiveTab('activity')}
          >
            <div className="nav-icon">🕒</div>
            <div className="nav-label">Activity</div>
          </button>

          <button
            className={`nav-item ${
              activeTab === 'account' ? 'nav-item-active' : ''
            }`}
            onClick={() => setActiveTab('account')}
          >
            <div className="nav-icon">👤</div>
            <div className="nav-label">Account</div>
          </button>
        </nav>
      )}
    </div>
  );
};



export default App;