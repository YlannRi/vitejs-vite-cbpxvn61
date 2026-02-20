import React, { useState } from 'react';

// Mock data for available rides
const AVAILABLE_RIDES = [
  { id: 1, driver: 'Jonah McCarthy', destination: 'University of Bath', time: '09:15', price: '£3.50', seats: 2, rating: 4.8 },
  { id: 2, driver: 'Sam Wylie', destination: 'University of Bath', time: '09:30', price: '£2.50', seats: 1, rating: 4.5 },
  { id: 3, driver: 'Joseph Goodyear', destination: 'University of Bath', time: '10:00', price: '£3.50', seats: 3, rating: 4.9 },
];

const RequestRidePage: React.FC = () => {
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    // This should fetch data based on the inputs
    setHasSearched(true);
  };

  return (
    <div className="request-ride-page" style={{ padding: '20px', paddingBottom: '100px', overflowY: 'auto', height: '100%' }}>
      <h2 className="uber-logo" style={{ marginBottom: '20px' }}>
        Request a ride
      </h2>

      <div className="request-form">
        {/* Destination Input */}
        <div className="input-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="destination" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Destination
          </label>
          <input
            type="text"
            id="destination"
            placeholder="Where to?"
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Time of Arrival Input */}
        <div className="input-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="timeOfArrival" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Time of Arrival
          </label>
          <input
            type="time"
            id="timeOfArrival"
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="action-buttons" style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button
            onClick={handleSearch}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#000', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="search-results" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            Available Rides
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {AVAILABLE_RIDES.map((ride) => (
              <div
                key={ride.id}
                style={{
                  padding: '15px',
                  borderRadius: '12px',
                  border: '1px solid #eaeaea',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', color: '#2c2828', fontSize: '16px' }}>{ride.destination}</div>
                  <div style={{ fontWeight: 'bold', color: '#22c55e', fontSize: '16px' }}>{ride.price}</div>
                </div>

                <div style={{ fontSize: '14px', color: '#555', marginBottom: '4px' }}>
                  🚗 {ride.driver} <span style={{ color: '#fbbf24' }}>⭐ {ride.rating}</span>
                </div>

                <div style={{ fontSize: '14px', color: '#555', marginBottom: '4px' }}>
                  🕒 Arrives by {ride.time} <span>👥 {ride.seats} seats left</span>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#e5e5e5',
                    color: '#000',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  onClick={() => alert(`Requested a seat with ${ride.driver}!`)}
                >
                  Request Seat
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestRidePage;