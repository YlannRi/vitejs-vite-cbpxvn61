import React, { useState, useRef } from 'react';
import './ActivityPage.css';

type Trip = {
  id: number;
  title?: string;
  username?: string;
  drivername?: string;
  meta?: string;
  price?: string;
  numberPassengers?: number;
  rating?: number;
  action: 'More';
  status?: 'upcoming' | 'requested' | 'past' | 'passengerRequest';
};

const upcomingTrips: Trip[] = [
  {
    id: 1,
    title: 'University of Bath',
    meta: '23 Nov · 09:00',
    price: '£7.60',
    action: 'More',
    status: 'upcoming',
    drivername: 'James Miller',
  },
];

const requestedTrips: Trip[] = [
  {
    id: 1,
    title: 'University of Bath',
    meta: '21 Nov · 00:17',
    price: '£6.60',
    action: 'More',
    status: 'requested',
    drivername: 'Pending',
  },
];

const pastTrips: Trip[] = [
  { id: 1, title: 'Second Bridge', meta: '21 Nov · 00:17', price: '£6.60', rating: 4.5, action: 'More', status: 'past', drivername: 'Sarah Chen' },
  { id: 2, title: 'University of Bath', meta: '13 Nov · 22:03', price: '£7.63', rating: 4.5, action: 'More', status: 'past', drivername: 'Tom Richards' },
  { id: 3, title: 'University of Bath', meta: '31 Oct · 03:11', price: '£11.66', rating: 4.5, action: 'More', status: 'past', drivername: 'Priya Sharma' },
  { id: 4, title: 'University of Bath', meta: '21 Oct · 03:25', price: '£10.14', rating: 4.5, action: 'More', status: 'past', drivername: 'Leo Barnes' },
  { id: 5, title: 'University of Bath', meta: '17 Oct · 03:05', price: '£10.99', rating: 4.5, action: 'More', status: 'past', drivername: 'Mia Foster' },
  { id: 6, title: 'Bristol Airport (BRS)', meta: '14 Oct · 17:19', price: '£42.05', rating: 4.5, action: 'More', status: 'past', drivername: 'Kai Nguyen' },
];

const passengerRequestedTrips: Trip[] = [
  { id: 1, username: 'Emma Thompson', rating: 4.8, meta: 'Today · 14:20', price: '£8.40', action: 'More', status: 'passengerRequest', title: 'University of Bath' },
  { id: 2, username: 'Daniel Carter', rating: 4.6, meta: 'Today · 14:35', price: '£6.90', action: 'More', status: 'passengerRequest', title: 'City Centre' },
  { id: 3, username: 'Sophie Patel', rating: 4.9, meta: 'Today · 15:10', price: '£12.75', action: 'More', status: 'passengerRequest', title: 'Bath Spa Station' },
  { id: 4, username: 'James Wilson', meta: 'Today · 15:25', price: '£5.60', action: 'More', status: 'passengerRequest', title: 'Claverton Down' },
  { id: 5, username: 'Aisha Rahman', rating: 4.7, meta: 'Today · 16:00', price: '£15.20', action: 'More', status: 'passengerRequest', title: 'Keynsham' },
];

// ─── Map Placeholder ────────────────────────────────────────────────────────
const MapPlaceholder: React.FC = () => (
  <div className="map-placeholder">
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" className="map-svg">
      {/* Background */}
      <rect width="400" height="220" fill="#e8ead6" />
      {/* Roads */}
      <path d="M0,110 Q100,90 200,110 Q300,130 400,110" stroke="#fff" strokeWidth="10" fill="none" />
      <path d="M0,110 Q100,90 200,110 Q300,130 400,110" stroke="#d4c89a" strokeWidth="8" fill="none" strokeDasharray="20,8" />
      <path d="M150,0 Q160,80 170,110 Q180,150 175,220" stroke="#fff" strokeWidth="8" fill="none" />
      <path d="M250,0 Q245,70 240,110 Q235,155 230,220" stroke="#fff" strokeWidth="6" fill="none" />
      {/* Route line */}
      <path d="M80,170 Q130,140 180,110 Q230,80 310,55" stroke="#3b82f6" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10,4" />
      {/* Pickup dot */}
      <circle cx="80" cy="170" r="10" fill="#22c55e" />
      <circle cx="80" cy="170" r="6" fill="#fff" />
      <circle cx="80" cy="170" r="3" fill="#22c55e" />
      {/* Dropoff pin */}
      <circle cx="310" cy="55" r="12" fill="#ef4444" />
      <circle cx="310" cy="55" r="6" fill="#fff" />
      <path d="M310,67 L310,80" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      {/* Labels */}
      <text x="60" y="195" fontSize="10" fill="#166534" fontWeight="bold">Pick Up</text>
      <text x="290" y="48" fontSize="10" fill="#991b1b" fontWeight="bold">Drop Off</text>
    </svg>
    <div className="map-badge">Map Preview</div>
  </div>
);

// ─── Trip Details Panel ───────────────────────────────────────────────────────
type TripDetailsPanelProps = {
  trip: Trip;
  mode: 'user' | 'Driver';
  onClose: () => void;
};

const TripDetailsPanel: React.FC<TripDetailsPanelProps> = ({ trip, mode, onClose }) => {
  const [closing, setClosing] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 320);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const delta = e.changedTouches[0].clientY - touchStartY.current;
      if (delta > 80) handleClose();
    }
    touchStartY.current = null;
  };

  const isPast = trip.status === 'past';
  const isUpcoming = trip.status === 'upcoming';
  const isPassengerRequest = trip.status === 'passengerRequest';
  const isRequested = trip.status === 'requested';

  const otherPersonLabel = mode === 'Driver' ? 'Passenger' : 'Driver';
  const otherPersonName = mode === 'Driver' ? (trip.username ?? 'Unknown') : (trip.drivername ?? 'Pending');

  return (
    <>
      <div className={`sheet-overlay ${closing ? 'overlay-closing' : ''}`} onClick={handleClose} />
      <div
        ref={panelRef}
        className={`trip-sheet ${closing ? 'sheet-closing' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="sheet-handle-area" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="sheet-handle" />
        </div>

        {/* Scrollable content */}
        <div className="sheet-scroll">
          {/* Header */}
          <div className="sheet-header">
            <button className="sheet-back-btn" onClick={handleClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back
            </button>
            <h2 className="sheet-title">Trip Details</h2>
            <div style={{ width: 60 }} />
          </div>

          {/* Map */}
          <MapPlaceholder />

          {/* Route info */}
          <div className="sheet-route-row">
            <div className="route-point route-start">
              <div className="route-dot dot-green" />
              <div>
                <div className="route-label">Pick Up</div>
                <div className="route-value">Current Location</div>
              </div>
            </div>
            <div className="route-line-vert" />
            <div className="route-point route-end">
              <div className="route-dot dot-red" />
              <div>
                <div className="route-label">Drop Off</div>
                <div className="route-value">{trip.title ?? 'Destination'}</div>
              </div>
            </div>
          </div>

          {/* Details card */}
          <div className="sheet-details-card">
            <div className="sheet-detail-row">
              <span className="detail-label">{otherPersonLabel} Name</span>
              <span className="detail-value">{otherPersonName}</span>
            </div>
            {(mode === 'Driver' && trip.rating !== undefined) && (
              <div className="sheet-detail-row">
                <span className="detail-label">Rating</span>
                <span className="detail-value">⭐ {trip.rating}</span>
              </div>
            )}
            <div className="sheet-detail-row">
              <span className="detail-label">Destination</span>
              <span className="detail-value">{trip.title ?? '—'}</span>
            </div>
            <div className="sheet-detail-row">
              <span className="detail-label">Date & Time</span>
              <span className="detail-value">{trip.meta}</span>
            </div>
            <div className="sheet-detail-row">
              <span className="detail-label">Cost</span>
              <span className="detail-value detail-price">{trip.price}</span>
            </div>
            {isPast && trip.rating !== undefined && mode === 'user' && (
              <div className="sheet-detail-row">
                <span className="detail-label">Your Rating</span>
                <span className="detail-value">⭐ {trip.rating}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="sheet-actions">
            <button className="sheet-action-btn btn-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Message
            </button>

            {(isUpcoming || isRequested || isPassengerRequest) && (
              <button className="sheet-action-btn btn-cancel">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Cancel Trip
              </button>
            )}

            {isPast && (
              <>
                {mode === 'user' && (
                  <button className="sheet-action-btn btn-rate">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Rate Trip
                  </button>
                )}
                <button className="sheet-action-btn btn-report">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Report Issue
                </button>
              </>
            )}

            {isPassengerRequest && mode === 'Driver' && (
              <button className="sheet-action-btn btn-accept">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Accept Request
              </button>
            )}
          </div>

          <div style={{ height: 32 }} />
        </div>
      </div>
    </>
  );
};

// ─── Trip Section ─────────────────────────────────────────────────────────────
type TripSectionProps = {
  title: string;
  trips: Trip[];
  emptyTitle: string;
  emptySubtitle: string;
  emptyIcon: string;
  collapsible?: boolean;
  mode: 'user' | 'Driver';
  onTripMore: (trip: Trip) => void;
};

const TripSection: React.FC<TripSectionProps> = ({
  title, trips, emptyTitle, emptySubtitle, emptyIcon, collapsible = false, onTripMore,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleTrips = collapsible && !expanded ? trips.slice(0, 3) : trips;

  return (
    <section className="uber-section">
      <h2 className="section-title">{title}</h2>
      {trips.length === 0 ? (
        <div className="card activity-upcoming-card">
          <div>
            <div className="activity-upcoming-title">{emptyTitle}</div>
            <div className="activity-upcoming-subtitle">{emptySubtitle}</div>
          </div>
          <div className="activity-upcoming-icon">{emptyIcon}</div>
        </div>
      ) : (
        <>
          <div className="past-list">
            {visibleTrips.map((trip) => (
              <div key={trip.id} className="card trip-row-card">
                <div className="trip-row-left">
                  <div className="trip-car-icon">🚗</div>
                  <div className="trip-row-text">
                    <div className="trip-row-title">{trip.title ?? trip.username ?? 'Trip'}</div>
                    <div className="trip-row-meta">{trip.meta}</div>
                    <div className="trip-row-price">
                      {trip.price}
                      {trip.rating !== undefined && (
                        <> {' - '}<span className="trip-row-rating">⭐ {trip.rating}</span></>
                      )}
                    </div>
                  </div>
                </div>
                <button className="pill pill-solid trip-row-button" onClick={() => onTripMore(trip)}>
                  {trip.action}
                </button>
              </div>
            ))}
          </div>
          {collapsible && trips.length > 3 && (
            <div className="see-more-container">
              <button className="see-more-button" onClick={() => setExpanded(!expanded)}>
                {expanded ? 'See less' : 'See more'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

// ─── Activity Page ─────────────────────────────────────────────────────────────
const ActivityPage: React.FC = () => {
  const [mode, setMode] = useState<'user' | 'Driver'>('user');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleMore = (trip: Trip) => setSelectedTrip(trip);
  const handleClose = () => setSelectedTrip(null);

  return (
    <>
      <header className="uber-header">
        <h1 className="activity-title">Activity</h1>
        <div className="top-toggle">
          <button className={`toggle-tab ${mode === 'user' ? 'toggle-tab-active' : ''}`} onClick={() => setMode('user')}>
            Rides
          </button>
          <button className={`toggle-tab ${mode === 'Driver' ? 'toggle-tab-active' : ''}`} onClick={() => setMode('Driver')}>
            Driver
          </button>
        </div>
      </header>

      <TripSection
        title="Upcoming"
        trips={upcomingTrips}
        emptyTitle="You have no upcoming trips"
        emptySubtitle="Reserve your trip →"
        emptyIcon="📅"
        collapsible
        mode={mode}
        onTripMore={handleMore}
      />

      {mode === 'user' ? (
        <TripSection
          title="Requested"
          trips={requestedTrips}
          emptyTitle="You have no requested trips"
          emptySubtitle="Book a reservation →"
          emptyIcon="🗓️"
          collapsible
          mode={mode}
          onTripMore={handleMore}
        />
      ) : (
        <TripSection
          title="Passenger Requests"
          trips={passengerRequestedTrips}
          emptyTitle="You have no requests"
          emptySubtitle="Post a trip →"
          emptyIcon="🗓️"
          collapsible
          mode={mode}
          onTripMore={handleMore}
        />
      )}

      <TripSection
        title="Past"
        trips={pastTrips}
        emptyTitle="No past trips yet"
        emptySubtitle="Your completed rides will appear here"
        emptyIcon="🕘"
        collapsible
        mode={mode}
        onTripMore={handleMore}
      />

      {selectedTrip && (
        <TripDetailsPanel trip={selectedTrip} mode={mode} onClose={handleClose} />
      )}
    </>
  );
};

export default ActivityPage;
