import React, {type CSSProperties, useEffect, useState} from 'react';

type QuickActionCardProps = {
  emoji: string;
  label: string;
  hasDot?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  emoji,
  label,
  hasDot = false,
  onClick,
  style,
}) => (
  <button className="card quick-card" onClick={onClick} style={style}>
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
  const [userName, setUserName] = useState<string>('Loading...');
  const [rating, setRating] = useState<number | string>('...');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await fetch('https://localhost:8000/account/users/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const profile = data[0];

            const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            setUserName(fullName || profile.university_username || 'University Student');

            const rawRating = Number(profile.rider_rating);

            const userRating = (profile.rider_rating === null || profile.rider_rating === undefined || rawRating === 0)
              ? 'No rating'
              : rawRating.toFixed(2);

            setRating(userRating);
          }
        } else {
          setUserName('Unknown User');
          setRating('N/A');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUserName('Unknown User');
        setRating('N/A');
      }
    };

    fetchProfile();
  }, []);

  const handleLogoutClick = async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        await fetch('https://localhost:8000/account/auth/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error("Error communicating with logout endpoint:", error);
      }
    }

    onLogout();
  };

  return (
    <>
      <header className="account-header">
        <div className="account-info">
          <div className="account-name">{userName}</div>
          <div className="rating-badge">★ {rating}</div>
        </div>
      </header>

      <div className="quick-actions-grid">
        <QuickActionCard emoji="⚙" label="Settings" />
        <QuickActionCard emoji="➜" label="Logout" onClick={handleLogoutClick} />
        <QuickActionCard emoji="⚠️" label="Safety Alarm" style={{ color: '#ff5555' }} />
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