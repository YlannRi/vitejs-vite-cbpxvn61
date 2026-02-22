//Fixed making the buttons look like activity page using Ylann's css in App.css

import React, { useState } from 'react';

type Ride = {
  id: number;
  destination?: string;
  date?: string;
  driverName?: string;
  price?: string;
};

const RequestRidePage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if a search has been executed so we don't show the "No rides" empty state before they click search
  const [hasSearched, setHasSearched] = useState(false);

  // State for the input boxes (currently ignored in the fetch request)
  const [destinationInput, setDestinationInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Get the token from LocalStorage
      const token = localStorage.getItem('authToken');

      // Safety check in case it's missing
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // MAKE THE AUTHORIZED REQUEST
      const response = await fetch('http://localhost:8000/account/rides/rides/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("401 Unauthorized: The hardcoded token might be expired or invalid.");
        }
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setRides(data);

    } catch (err: unknown) {
      console.error("Error fetching rides:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <header className="uber-header">
        <h1 className="activity-title">Find a Ride</h1>
      </header>

      {/* --- Search Form Area --- */}
      <div className="auth-card" style={{ marginBottom: '24px' }}>
        <div className="auth-field">
          <label className="auth-label">Destination</label>
          <input
            type="text"
            className="auth-input"
            placeholder="e.g. University of Bath"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Time of arrival</label>
          <input
            type="datetime-local"
            className="auth-input"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
          />
        </div>

        <button
          className="auth-submit"
          onClick={handleSearch} // This connects the button to the function
          disabled={loading}
          style={{ marginTop: '12px' }}
        >
          {loading ? 'Searching...' : 'Search Rides'}
        </button>
      </div>

      {/* --- Results Area --- */}
      {loading && <p style={{ color: 'var(--text-secondary)' }}>Searching for rides...</p>}

      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {/* Empty State (Only shows if they searched and got 0 results) */}
      {!loading && !error && hasSearched && rides.length === 0 && (
        <div className="card activity-upcoming-card">
          <div>
            <div className="activity-upcoming-title">No rides available</div>
            <div className="activity-upcoming-subtitle">Try a different time or destination.</div>
          </div>
          <div className="activity-upcoming-icon">📭</div>
        </div>
      )}

      {/* Populated List */}
      {!loading && !error && hasSearched && rides.length > 0 && (
        <div className="past-list">
          {rides.map((ride) => (
            <div key={ride.id} className="card trip-row-card">
              <div className="trip-row-left">
                <div className="trip-car-icon">🚗</div>
                <div className="trip-row-text">
                  <div className="trip-row-title">{ride.destination || `Ride #${ride.id}`}</div>
                  <div className="trip-row-meta">{ride.date || 'Flexible'}</div>
                  <div className="trip-row-meta">Driver: {ride.driverName || 'Pending'}</div>
                  <div className="trip-row-price">{ride.price || 'TBD'}</div>
                </div>
              </div>
              <button className="pill pill-solid trip-row-button">Request</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestRidePage;



// const [selectedFilter, setSelectedFilter] = useState('Cost');
// const [filterOpen, setFilterOpen] = useState(false);

// 
//   <div className="filter-container">
//   <button className="filter-button" onClick={() => setFilterOpen(o => !o)}>{selectedFilter} ▾</button>
//   {filterOpen && (
//     <div className="filter-dropdown">
//       {['Cost', 'Rating', 'Ease'].map(opt => (
//         <div key={opt} className="filter-option" onClick={() => { setSelectedFilter(opt); setFilterOpen(false); }}>{opt}</div>
//       ))}
//     </div>
// 
// </div>
// )}