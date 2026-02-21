import React, { useState } from 'react';
import './JourneyPage.css';
import { MapPlaceholder } from './App';
import { DetailRow } from './App';
import { Icons } from './App';


// ─── Mock Data ─────────────────────────────────────────────────
// BACKEND REQUIRED: Replace with real active trip data for current user

const MOCK_ACTIVE_USER_TRIP = {
  driverName: 'James Miller',
  arriving: '~09:45',
  pickupCode: 'K7M2',
  destination: 'University of Bath',
  numberplate: 'BA21 XYZ',
  carModel: 'Toyota Prius · White',
  timeOfArrival: '09:45',
  cost: '£7.60',
};

// Ordered by algorithm (closest pickup first)
const MOCK_DRIVER_PICKUPS = [
  { id: 1, name: 'Emma Thompson', rating: 4.8, pickupAddress: 'Claverton Down Rd', cost: '£8.40', confirmed: false, code: "YIGM" },
  { id: 2, name: 'Daniel Carter',  rating: 4.6, pickupAddress: 'North Road',         cost: '£6.90', confirmed: true, code: "YIGE" },
  { id: 3, name: 'Sophie Patel',   rating: 4.9, pickupAddress: 'Widcombe Hill',       cost: '£12.75',confirmed: false, code: "YIGH" },
];

// ─── User Journey View ─────────────────────────────────────────
const UserJourney: React.FC = () => {
  const trip = MOCK_ACTIVE_USER_TRIP;

  return (
    <div className="journey-content">
      {/* Driver header card */}
      <div className="journey-driver-header">
        <div className="journey-driver-avatar">{trip.driverName[0]}</div>
        <div className="journey-driver-info">
          <div className="journey-driver-name">{trip.driverName}</div>
          <div className="journey-driver-sub">Your Driver</div>
        </div>
        <div className="journey-arriving-badge">
          {Icons.clock}
          <span>Arriving {trip.arriving}</span>
        </div>
      </div>

      {/* Map */}
      <MapPlaceholder label="Live Map" />

      {/* Pickup code */}
      <div className="journey-code-card">
        <span className="journey-code-label">Pick Up Code</span>
        <span className="journey-code-value">{trip.pickupCode}</span>
      </div>

      {/* Trip details */}
      <div className="sheet-details-card">
        <DetailRow label="Destination"    value={trip.destination} />
        <DetailRow label="Numberplate"    value={trip.numberplate} />
        <DetailRow label="Car Model"      value={trip.carModel} />
        <DetailRow label="Time of Arrival" value={trip.timeOfArrival} />
        <DetailRow label="Cost"           value={trip.cost} valueClass="detail-price" />
      </div>

      {/* Action */}
      <div className="journey-actions">
        <button className="sheet-action-btn btn-message">
          {Icons.message} Message Driver
        </button>
      </div>
    </div>
  );
};

// ─── Driver Journey View ───────────────────────────────────────
const DriverJourney: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [confirmed, setConfirmed] = useState<Set<number>>(
    new Set(MOCK_DRIVER_PICKUPS.filter(p => p.confirmed).map(p => p.id))
  );

  const passengers = MOCK_DRIVER_PICKUPS;
  const current = passengers[currentIdx];
  const isConfirmed = confirmed.has(current.id);


  const handleConfirm = () => {
    setConfirmed(prev => new Set([...prev, current.id]));
  };


  return (
    <div className="journey-content">
      {/* Header */}
      <div className="journey-driver-mode-header">
        <div className="journey-mode-sub">Pick Up Order</div>

      </div>

      {/* Passenger tabs */}
      <div className="passenger-tabs">
        {passengers.map((p, i) => (
          <button
            key={p.id}
            className={`passenger-tab${i === currentIdx ? ' passenger-tab-active' : ''}${confirmed.has(p.id) ? ' passenger-tab-done' : ''}`}
            onClick={() => setCurrentIdx(i)}
          >
            {p.name.split(' ')[0]}
            {confirmed.has(p.id) && <span className="tab-done-dot">✓</span>}
          </button>
        ))}
      </div>

      {/* Map */}
      <MapPlaceholder label={`Map to ${current.name.split(' ')[0]}`} />

      {/* Passenger card */}
      <div className="journey-passenger-card">
        <div className="journey-passenger-header">
          <div className="journey-passenger-avatar">{current.name[0]}</div>
          <div className="journey-passenger-info">
            <div className="journey-passenger-name">{current.name}</div>
            {current.rating !== undefined
                ? <div className="journey-passenger-rating">⭐ {current.rating}</div>
                : <div className="journey-passenger-rating no-rating">No rating yet</div>
            }
            </div>
          {isConfirmed && (
            <div className="journey-confirmed-badge">Picked Up ✓</div>
          )}
        </div>

        <div className="sheet-details-card journey-passenger-details">
          <DetailRow label="Pick Up Address" value={<><span className="detail-pin">{Icons.pin}</span>{current.pickupAddress}</>} />
          <DetailRow label="Cost"            value={current.cost} valueClass="detail-price" />
          <DetailRow label="Code"            value={current.code} valueClass="detail-value" />
        </div>
      </div>

      {/* Actions */}
      <div className="journey-actions">
        <button className="sheet-action-btn btn-message">
          {Icons.message} Message
        </button>
        {!isConfirmed ? (
          <button className="sheet-action-btn btn-accept journey-confirm-btn" onClick={handleConfirm}>
            {Icons.check} Confirm Pick Up
          </button>
        ) : (
          <button className="sheet-action-btn btn-accept journey-confirm-btn journey-confirm-done" disabled>
            {Icons.check} Picked Up
          </button>
        )}
      </div>


    </div>
  );
};

// ─── Main JourneyPage ──────────────────────────────────────────
const JourneyPage: React.FC = () => {
  const [mode, setMode] = useState<'user' | 'driver'>('user');

  return (
    <>
      <header className="uber-header">
        <h1 className="activity-title">Journey</h1>
        <div className="top-toggle">
          <button
            className={`toggle-tab ${mode === 'user' ? 'toggle-tab-active' : ''}`}
            onClick={() => setMode('user')}
          >
            Rider
          </button>
          <button
            className={`toggle-tab ${mode === 'driver' ? 'toggle-tab-active' : ''}`}
            onClick={() => setMode('driver')}
          >
            Driver
          </button>
        </div>
      </header>

      {mode === 'user' ? <UserJourney /> : <DriverJourney />}
    </>
  );
};

export default JourneyPage;