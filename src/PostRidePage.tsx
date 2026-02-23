import React, { useState } from 'react';

const PostRidePage: React.FC = () => {
  // Form State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('3');

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Get the token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // 2. Construct the payload for the JSON body
      // We map these exactly to the Pydantic RideCreate model on your backend
      const payload = {
        origin: origin,
        destination: destination,
        departure_time: new Date(timeInput).toISOString(),
        seats_total: parseInt(seats, 10),
      };

      // 3. Make the authorized POST request
      const response = await fetch('https://localhost:8000/account/rides/rides/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        let errorMessage = `Backend error: ${response.status} ${response.statusText}`;

        if (errData?.detail) {
          if (typeof errData.detail === 'string') {
            errorMessage = errData.detail;
          } else if (Array.isArray(errData.detail)) {
            errorMessage = `Validation Error: ${errData.detail[0].loc.join('.')} - ${errData.detail[0].msg}`;
          }
        }

        if (response.status === 401) {
          errorMessage = "401 Unauthorized: Your token might be expired. Please log in again.";
        }

        if (response.status === 403) {
           errorMessage = "403 Forbidden: You must be a verified driver to post a ride.";
        }

        throw new Error(errorMessage);
      }

      // Success handling
      setSuccess(true);

      // Optional: Clear the form after successful post
      setOrigin('');
      setDestination('');
      setTimeInput('');
      setPrice('');
      setSeats('3');

    } catch (err: unknown) {
      console.error("Error posting ride:", err);
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
        <h1 className="activity-title">Post a Ride</h1>
      </header>

      <div className="auth-card" style={{ marginBottom: '24px' }}>
        {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

        {success && (
          <div style={{ padding: '12px', backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            Ride successfully posted!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Pick-up Location</label>
            <input
              type="text"
              className="auth-input"
              placeholder="e.g. Lower Oldfield Park"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Destination</label>
            <input
              type="text"
              className="auth-input"
              placeholder="e.g. University of Bath"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Destination arrival Date and Time</label>
            <input
              type="datetime-local"
              className="auth-input"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="auth-field" style={{ flex: 1 }}>
              <label className="auth-label">Price (£)</label>
              <input
                type="number"
                step="0.10"
                min="0"
                className="auth-input"
                placeholder="e.g. 5.50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="auth-field" style={{ width: '100px' }}>
              <label className="auth-label">Seats</label>
              <input
                type="number"
                min="1"
                max="8"
                className="auth-input"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
            style={{ marginTop: '12px' }}
          >
            {loading ? 'Posting...' : 'Post Ride'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRidePage;