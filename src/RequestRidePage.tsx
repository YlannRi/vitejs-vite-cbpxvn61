//Fixed making the buttons look like activity page using Ylann's css in App.css

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
            Available Rides -- Filter 
          </h3>
          {/* this is how you make the buttons like on the activity page (accesses App.css)*/ }
          <div className="past-list">
            {AVAILABLE_RIDES.map((ride) => (
              <div key={ride.id} className="card trip-row-card">
                <div className="trip-row-left">
                  <div className="trip-car-icon">🚗</div>
                  <div className="trip-row-text">
                    <div className="trip-row-title">
                      {ride.destination}
                    </div>
                    <div className="trip-row-meta">
                      {ride.driver}
                      <span className="trip-row-rating"> ⭐ {ride.rating}</span>
                    </div>
                    <div className="trip-row-meta">
                      Arrives by {ride.time} • {ride.seats} seats left
                    </div>
                    <div className="trip-row-price">
                      {ride.price}
                    </div>
                  </div>
                </div>

                <button
                  className="pill pill-solid trip-row-button"
                  onClick={() => alert(`Requested a seat with ${ride.driver}!`)}
                >
                  Request
                </button>
              </div>
            ))}
          </div>
          {/* Up until here, this can be copy and pasted*/}
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