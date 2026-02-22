import React from 'react';

type QuickActionCardProps = {
  emoji: string;
  label: string;
  hasDot?: boolean;
  onClick?: () => void;
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  emoji,
  label,
  hasDot = false,
  onClick,
}) => (
  <button className="card quick-card" onClick={onClick}>
    <div className="card-icon small-icon">
      <span className="icon-glyph">{emoji}</span>
    </div>
    <span className="quick-card-label">{label}</span>
    {hasDot && <span className="quick-card-dot" />}
  </button>
);

type InfoCardProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, subtitle, right }) => (
  <div className="card info-card">
    <div className="info-card-main">
      <div className="info-card-title">{title}</div>
      {subtitle && <div className="info-card-subtitle">{subtitle}</div>}
    </div>
    {right && <div className="info-card-right">{right}</div>}
  </div>
);

type AccountPageProps = {
  onLogout: () => void;
};

const AccountPage: React.FC<AccountPageProps> = ({ onLogout }) => {

  const handleLogoutClick = async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        await fetch('http://localhost:8000/account/auth/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // We don't necessarily need to await a JSON response for a logout,
        // as long as the request was sent successfully to invalidate the session.
      } catch (error) {
        console.error("Error communicating with logout endpoint:", error);
      }
    }

    // Always log the user out on the frontend side, even if the backend call fails
    onLogout();
  };

  return (
    <>
      <header className="account-header">
        <div>
          <div className="account-name">Ylann Rimbon</div>
          <div className="rating-badge">★ 4.33</div>
        </div>
      </header>

      <div className="quick-actions-grid">
        <QuickActionCard emoji="⚙" label="Settings" />
        <QuickActionCard emoji="➜" label="Logout" onClick={handleLogoutClick} />
        <QuickActionCard emoji="🛡" label="Safety" />
        <QuickActionCard emoji="✉" label="Inbox" hasDot />
      </div>

      <InfoCard
        title="Your timetable"
        subtitle="See and manage your upcoming rides for uni."
        right={<span className="info-card-emoji">📅</span>}
      />

      <InfoCard
        title="Safety check-up"
        subtitle="Learn ways to make rides safer."
        right={
          <div className="safety-progress">
            <span className="safety-progress-ring">1/6</span>
          </div>
        }
      />
    </>
  );
};

export default AccountPage;
