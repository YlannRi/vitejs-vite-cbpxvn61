import React, { useState } from 'react';

type ShortcutCardProps = {
  icon: 'clock' | 'plus';
  title: string;
  subtitle?: string;
  isAdd?: boolean;
};

const ShortcutCard: React.FC<ShortcutCardProps> = ({
  icon,
  title,
  subtitle,
  isAdd,
}) => (
  <button className={`card shortcut-card ${isAdd ? 'shortcut-add' : ''}`}>
    <div className="card-icon">
      {icon === 'clock' && <span className="icon-glyph">🕒</span>}
      {icon === 'plus' && <span className="icon-glyph">＋</span>}
    </div>
    <div className="card-body">
      <div className="card-title">{title}</div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
    </div>
  </button>
);

type ServiceCardProps = {
  emoji: string;
  title: string;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ emoji, title }) => (
  <button className="card service-card">
    <div className="card-icon">
      <span className="icon-glyph">{emoji}</span>
    </div>
    <div className="card-body">
      <div className="card-title">{title}</div>
    </div>
  </button>
);

type HomePageProps = {
  onRequestRide: () => void;
};

const HomePage: React.FC<HomePageProps> = ({ onRequestRide }) => {
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
        <button className="search-pill" onClick={onRequestRide}>
          <span className="search-icon">🔍</span>
          <span className="search-text">Request a ride</span>
        </button>
      </div>

      {/* Shortcuts: same for both user and rider */}
      <section className="uber-section">
        <h2 className="section-title">Shortcuts</h2>

        <ShortcutCard
          icon="clock"
          title="University of Bath"
          subtitle="Claverton Down, Bath, BA2 7AY, GB"
        />
        <ShortcutCard
          icon="clock"
          title="The King of Wessex (Wetherspoon)"
          subtitle="5–10 W James St, Bath, Somerset, BA1 ..."
        />
        <ShortcutCard icon="plus" title="Save a place" isAdd />
      </section>

      <section className="uber-section">
        <h2 className="section-title">Services</h2>

        {mode === 'user' ? (
          <>
            {/* Passenger side services */}
            <ServiceCard emoji="📅" title="Reserve a trip for later" />
            <ServiceCard emoji="👥" title="Saved groups" />
          </>
        ) : (
          <>
            {/* Driver side (Rider) services */}
            <ServiceCard emoji="📅" title="Schedule a ride" />
            <ServiceCard emoji="🚗" title="Start a ride" />
          </>
        )}
      </section>
    </>
  );
};

export default HomePage;