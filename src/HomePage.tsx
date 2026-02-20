import React, { useState } from 'react';


type HomePageProps = {
  onRequestRide: () => void;
  onPostRide: () => void;
};

const HomePage: React.FC<HomePageProps> = ({ onRequestRide, onPostRide }) => {
  const [mode, setMode] = useState<'user' | 'Driver'>('user');

  return (
    <>
      <header className="uber-header">
        <div className="uber-logo">SamudhyanRides</div>

        <div className="top-toggle">
          <button
            className={`toggle-tab ${mode === 'user' ? 'toggle-tab-active' : ''
              }`}
            onClick={() => setMode('user')}
          >
            Rides
          </button>
          <button
            className={`toggle-tab ${
              mode == 'Driver' ? 'toggle-tab-active' : ''  
            }`}
            onClick={() => setMode('Driver')}
          >
            Driver
          </button>
        </div>
      </header>

      <div className="search-wrapper">
        <button
          className="search-pill"
          onClick={mode === 'user' ? onRequestRide : onPostRide}
        >
          <span className="search-icon">🔍</span>
          <span className="search-text">
            {mode === 'user' ? 'Request a ride' : 'Post a ride'}
          </span>
        </button>
      </div>
    </>
  );
};

export default HomePage;