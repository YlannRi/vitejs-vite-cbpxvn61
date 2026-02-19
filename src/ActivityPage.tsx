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
  status?: 'upcomingDriver' | 'upcomingUser' | 'requested' | 'pastUser' | 'passengerRequest' | 'pastDriver';
};

// ─── Mock passenger data ──────────────────────────────────────────────────────
// this would come from the API. Sliced by numberPassengers.
const ALL_MOCK_PASSENGERS = [
  { id: 1, name: 'Emma Thompson', rating: 4.8, pickupLocation: 'Claverton Down Rd', cost: '£8.40',  rated: false },
  { id: 2, name: 'Daniel Carter',  rating: 4.6, pickupLocation: 'North Rd',          cost: '£6.90',  rated: true  },
  { id: 3, name: 'Sophie Patel',   rating: 4.9, pickupLocation: 'Widcombe Hill',      cost: '£12.75', rated: false },
  { id: 4, name: 'James Wilson',   rating: undefined, pickupLocation: 'Bathwick St',  cost: '£5.60',  rated: false },
];
const getMockPassengers = (n: number) =>
  ALL_MOCK_PASSENGERS.slice(0, Math.min(n, ALL_MOCK_PASSENGERS.length));

// ─── Trip data (for testing frontend) ────────────────────────────────────────────────────────────────
const upcomingTripsDriver: Trip[] = [
  { id: 1, title: 'University of Bath', meta: '23 Nov · 09:00', action: 'More', status: 'upcomingDriver', numberPassengers: 3 },
];
const upcomingTripsUser: Trip[] = [
  { id: 1, title: 'University of Bath', meta: '23 Nov · 09:00', price: '£7.60', action: 'More', status: 'upcomingUser', drivername: 'James Miller' },
];
const requestedTrips: Trip[] = [
  { id: 1, title: 'University of Bath', meta: '21 Nov · 00:17', price: '£6.60', action: 'More', status: 'requested', drivername: 'Priya Sharma' },
];

const passengerRequestedTrips: Trip[] = [
  { id: 1, username: 'Emma Thompson', rating: 4.8, meta: 'Today · 14:20', price: '£8.40',  action: 'More', status: 'passengerRequest', title: 'University of Bath' },
  { id: 2, username: 'Daniel Carter',  rating: 4.6, meta: 'Today · 14:35', price: '£6.90',  action: 'More', status: 'passengerRequest', title: 'City Centre' },
  { id: 3, username: 'Sophie Patel',   rating: 4.9, meta: 'Today · 15:10', price: '£12.75', action: 'More', status: 'passengerRequest', title: 'Bath Spa Station' },
  { id: 4, username: 'James Wilson',   meta: 'Today · 15:25',              price: '£5.60',  action: 'More', status: 'passengerRequest', title: 'Claverton Down' },
  { id: 5, username: 'Aisha Rahman',   rating: 4.7, meta: 'Today · 16:00', price: '£15.20', action: 'More', status: 'passengerRequest', title: 'Keynsham' },
];
const pastTripsDrivers: Trip[] = [
  { id: 1, title: 'Second Bridge',         meta: '21 Nov · 00:17', price: '£6.60',  rating: 4.5, action: 'More', status: 'pastDriver', numberPassengers: 2 },
  { id: 2, title: 'University of Bath',    meta: '13 Nov · 22:03', price: '£7.63',  rating: 4.5, action: 'More', status: 'pastDriver', numberPassengers: 1 },
  { id: 3, title: 'University of Bath',    meta: '31 Oct · 03:11', price: '£11.66', rating: 4.5, action: 'More', status: 'pastDriver', numberPassengers: 3 },
  { id: 4, title: 'University of Bath',    meta: '21 Oct · 03:25', price: '£10.14', rating: 4.5, action: 'More', status: 'pastDriver', numberPassengers: 2 },
  { id: 5, title: 'University of Bath',    meta: '17 Oct · 03:05', price: '£10.99', rating: 4.5, action: 'More', status: 'pastDriver', numberPassengers: 1 },
  { id: 6, title: 'Bristol Airport (BRS)', meta: '14 Oct · 17:19', price: '£42.05', rating: 4.5, action: 'More', status: 'pastDriver', numberPassengers: 4 },
];
const pastTripsUsers: Trip[] = [
  { id: 1, title: 'Second Bridge',      meta: '21 Nov · 00:17', price: '£6.60',  rating: 4.5,       action: 'More', status: 'pastUser', drivername: 'Sarah Chen' },
  { id: 2, title: 'University of Bath', meta: '13 Nov · 22:03', price: '£7.63',  rating: 4.5,       action: 'More', status: 'pastUser', drivername: 'Tom Richards' },
  { id: 3, title: 'University of Bath', meta: '31 Oct · 03:11', price: '£11.66', rating: 4.5,       action: 'More', status: 'pastUser', drivername: 'Priya Sharma' },
  { id: 4, title: 'University of Bath', meta: '21 Oct · 03:25', price: '£10.14',                    action: 'More', status: 'pastUser', drivername: 'Leo Barnes' },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  message: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  cancel:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  star:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  report:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  accept:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  remove:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  back:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
};

// ─── Small reusable bits ──────────────────────────────────────────────────────
const DetailRow: React.FC<{ label: string; value: React.ReactNode; valueClass?: string }> = ({ label, value, valueClass }) => (
  <div className="sheet-detail-row">
    <span className="detail-label">{label}</span>
    <span className={`detail-value ${valueClass ?? ''}`}>{value}</span>
  </div>
);

const Btn: React.FC<{ cls: string; icon: React.ReactNode; label: string; small?: boolean }> = ({ cls, icon, label, small }) => (
  <button className={`sheet-action-btn ${cls}${small ? ' btn-small' : ''}`}>
    {icon}{label}
  </button>
);

const RouteRow: React.FC<{ destination: string }> = ({ destination }) => (
  <div className="sheet-route-row">
    <div className="route-point">
      <div className="route-dot dot-green"/>
      <div><div className="route-label">Pick Up</div><div className="route-value">Current Location</div></div>
    </div>
    <div className="route-line-vert"/>
    <div className="route-point">
      <div className="route-dot dot-red"/>
      <div><div className="route-label">Drop Off</div><div className="route-value">{destination}</div></div>
    </div>
  </div>
);

// ─── Map Placeholder ──────────────────────────────────────────────────────────
const MapPlaceholder: React.FC = () => (
  <div className="map-placeholder">
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" className="map-svg">
      <rect width="400" height="220" fill="#e8ead6"/>
      <path d="M0,110 Q100,90 200,110 Q300,130 400,110" stroke="#fff" strokeWidth="10" fill="none"/>
      <path d="M0,110 Q100,90 200,110 Q300,130 400,110" stroke="#d4c89a" strokeWidth="8" fill="none" strokeDasharray="20,8"/>
      <path d="M150,0 Q160,80 170,110 Q180,150 175,220" stroke="#fff" strokeWidth="8" fill="none"/>
      <path d="M250,0 Q245,70 240,110 Q235,155 230,220" stroke="#fff" strokeWidth="6" fill="none"/>
      <path d="M80,170 Q130,140 180,110 Q230,80 310,55" stroke="#3b82f6" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10,4"/>
      <circle cx="80" cy="170" r="10" fill="#22c55e"/><circle cx="80" cy="170" r="6" fill="#fff"/><circle cx="80" cy="170" r="3" fill="#22c55e"/>
      <circle cx="310" cy="55" r="12" fill="#ef4444"/><circle cx="310" cy="55" r="6" fill="#fff"/>
      <path d="M310,67 L310,80" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
      <text x="60" y="195" fontSize="10" fill="#166534" fontWeight="bold">Pick Up</text>
      <text x="290" y="48" fontSize="10" fill="#991b1b" fontWeight="bold">Drop Off</text>
    </svg>
    <div className="map-badge">Map Preview</div>
  </div>
);

// ─── Passenger Carousel ───────────────────────────────────────────────────────
type Passenger = typeof ALL_MOCK_PASSENGERS[number];

const PassengerCarousel: React.FC<{ passengers: Passenger[]; isPast: boolean }> = ({ passengers, isPast }) => {
  const [idx, setIdx] = useState(0);
  const p = passengers[idx];
  const total = passengers.length;

  return (
    <div className="passenger-carousel">
      {/* Name tabs */}
      {total > 1 && (
        <div className="passenger-tabs">
          {passengers.map((pass, i) => (
            <button
              key={pass.id}
              className={`passenger-tab${i === idx ? ' passenger-tab-active' : ''}`}
              onClick={() => setIdx(i)}
            >
              {pass.name.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Card */}
      <div className="passenger-card">
        {/* Avatar + name */}
        <div className="passenger-card-header">
          <div className="passenger-avatar">{p.name[0]}</div>
          <div>
            <div className="passenger-name">{p.name}</div>
            {p.rating !== undefined
              ? <div className="passenger-rating">⭐ {p.rating}</div>
              : <div className="passenger-rating" style={{ color: 'var(--text-secondary)' }}>No rating yet</div>
            }
          </div>
        </div>

        {/* Details */}
        <div className="sheet-details-card passenger-details">
          <DetailRow label="Pick Up" value={p.pickupLocation}/>
          <DetailRow label="Cost"    value={p.cost} valueClass="detail-price"/>
        </div>

        {/* Per-passenger actions */}
        <div className="passenger-actions">
          <Btn cls="btn-message" icon={Icons.message} label="Message" small/>
          {isPast ? (
            <>
              {!p.rated && <Btn cls="btn-rate"   icon={Icons.star}   label="Rate"   small/>}
              <Btn cls="btn-report" icon={Icons.report} label="Report" small/>
            </>
          ) : (
            <Btn cls="btn-cancel" icon={Icons.remove} label="Remove" small/>
          )}
        </div>

        {/* Dot + arrow nav */}
        {total > 1 && (
          <div className="carousel-nav">
            <button className="carousel-arrow" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>‹</button>
            <div className="carousel-dots">
              {passengers.map((_, i) => (
                <button key={i} className={`carousel-dot${i === idx ? ' carousel-dot-active' : ''}`} onClick={() => setIdx(i)}/>
              ))}
            </div>
            <button className="carousel-arrow" onClick={() => setIdx(i => Math.min(total - 1, i + 1))} disabled={idx === total - 1}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Trip Details Panel ───────────────────────────────────────────────────────
const TripDetailsPanel: React.FC<{ trip: Trip; mode: 'user' | 'Driver'; onClose: () => void }> = ({ trip, mode, onClose }) => {
  const [closing, setClosing] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const close = () => { setClosing(true); setTimeout(onClose, 320); };

  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartY.current !== null && e.changedTouches[0].clientY - touchStartY.current > 80) close();
    touchStartY.current = null;
  };

  const passengers = getMockPassengers(trip.numberPassengers ?? 1);

  const renderBody = () => {
    switch (trip.status) {

      /* ── Upcoming User ─────────────────────────────────────────────────── */
      case 'upcomingUser':
        return (
          <>
            <RouteRow destination={trip.title ?? 'Destination'}/>
            <div className="sheet-details-card">
              <DetailRow label="Driver"      value={trip.drivername ?? 'Pending'}/>
              <DetailRow label="Destination" value={trip.title ?? '—'}/>
              <DetailRow label="Date & Time" value={trip.meta ?? '—'}/>
              <DetailRow label="Cost"        value={trip.price ?? '—'} valueClass="detail-price"/>
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Driver"/>
              <Btn cls="btn-cancel"  icon={Icons.cancel}  label="Cancel Trip"/>
            </div>
          </>
        );

      /* ── Requested ─────────────────────────────────────────────────────── */
      case 'requested':
        return (
          <>
            <RouteRow destination={trip.title ?? 'Destination'}/>
            <div className="sheet-details-card">
              <DetailRow label="Driver"      value={trip.drivername ?? 'Pending'}/>
              <DetailRow label="Destination" value={trip.title ?? '—'}/>
              <DetailRow label="Be There For" value={trip.meta ?? '—'}/>
              <DetailRow label="Cost"        value={trip.price ?? '—'} valueClass="detail-price"/>
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Driver"/>
              <Btn cls="btn-cancel"  icon={Icons.cancel}  label="Cancel Trip"/>
            </div>
          </>
        );

      /* ── Past User ─────────────────────────────────────────────────────── */
      case 'pastUser':
        return (
          <>
            <RouteRow destination={trip.title ?? 'Destination'}/>
            <div className="sheet-details-card">
              <DetailRow label="Driver"       value={trip.drivername ?? '—'}/>
              <DetailRow label="Destination"  value={trip.title ?? '—'}/>
              <DetailRow label="Pick Up Time" value={trip.meta ?? '—'}/>
              <DetailRow label="Arrival Time" value="~09:45"/>
              <DetailRow label="Cost"         value={trip.price ?? '—'} valueClass="detail-price"/>
              {trip.rating !== undefined && (
                <DetailRow label="Your Rating" value={`⭐ ${trip.rating}`}/>
              )}
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Driver"/>
              {trip.rating === undefined && (
                <Btn cls="btn-rate" icon={Icons.star} label="Rate Trip"/>
              )}
              <Btn cls="btn-report" icon={Icons.report} label="Report Issue"/>
            </div>
          </>
        );

      /* ── Upcoming Driver ───────────────────────────────────────────────── */
      case 'upcomingDriver':
        return (
          <>
            <RouteRow destination={trip.title ?? 'Destination'}/>
            <div className="sheet-details-card">
              <DetailRow label="Destination"  value={trip.title ?? '—'}/>
              <DetailRow label="Departure"    value={trip.meta ?? '—'}/>
              <DetailRow label="Est. Arrival" value="~09:45"/>
            </div>
            <div className="passenger-section-label">
              Passengers <span className="passenger-count-badge">{passengers.length}</span>
            </div>
            <PassengerCarousel passengers={passengers} isPast={false}/>
            <div className="sheet-actions" style={{ marginTop: 12 }}>
              <Btn cls="btn-cancel" icon={Icons.cancel} label="Cancel Whole Trip"/>
            </div>
          </>
        );

      /* ── Passenger Request ─────────────────────────────────────────────── */
      case 'passengerRequest':
        return (
          <>
            <RouteRow destination={trip.title ?? 'Destination'}/>
            <div className="sheet-details-card">
              <DetailRow label="Passenger"   value={trip.username ?? '—'}/>
              {trip.rating !== undefined && (
                <DetailRow label="Rating"    value={`⭐ ${trip.rating}`}/>
              )}
              <DetailRow label="Destination" value={trip.title ?? '—'}/>
              <DetailRow label="Drop Off By" value={trip.meta ?? '—'}/>
              <DetailRow label="Cost"        value={trip.price ?? '—'} valueClass="detail-price"/>
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Passenger"/>
              <Btn cls="btn-accept"  icon={Icons.accept}  label="Accept Request"/>
              <Btn cls="btn-cancel"  icon={Icons.cancel}  label="Deny Request"/>
            </div>
          </>
        );

      /* ── Past Driver ───────────────────────────────────────────────────── */
      case 'pastDriver':
        return (
          <>
            <RouteRow destination={trip.title ?? 'Destination'}/>
            <div className="sheet-details-card">
              <DetailRow label="Destination" value={trip.title ?? '—'}/>
              <DetailRow label="Departure"   value={trip.meta ?? '—'}/>
              <DetailRow label="Arrival"     value="~09:45"/>
            </div>
            <div className="passenger-section-label">
              Passengers <span className="passenger-count-badge">{passengers.length}</span>
            </div>
            <PassengerCarousel passengers={passengers} isPast={true}/>
          </>
        );

      default: return null;
    }
  };

  return (
    <>
      <div className={`sheet-overlay${closing ? ' overlay-closing' : ''}`} onClick={close}/>
      <div
        className={`trip-sheet${closing ? ' sheet-closing' : ''}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="sheet-handle-area"><div className="sheet-handle"/></div>

        <div className="sheet-scroll">
          <div className="sheet-header">
            <button className="sheet-back-btn" onClick={close}>{Icons.back} Back</button>
            <h2 className="sheet-title">Trip Details</h2>
            <div style={{ width: 60 }}/>
          </div>

          <MapPlaceholder/>
          {renderBody()}
          <div style={{ height: 32 }}/>
        </div>
      </div>
    </>
  );
};

// ─── Trip Section ─────────────────────────────────────────────────────────────
type TripSectionProps = {
  title: string; trips: Trip[]; emptyTitle: string; emptySubtitle: string; emptyIcon: string;
  collapsible?: boolean; mode: 'user' | 'Driver'; onTripMore: (t: Trip) => void; showFilter?: boolean;
};

const TripSection: React.FC<TripSectionProps> = ({
  title, trips, emptyTitle, emptySubtitle, emptyIcon, collapsible = false, onTripMore, showFilter,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Cost');
  const [filterOpen, setFilterOpen] = useState(false);
  const visible = collapsible && !expanded ? trips.slice(0, 3) : trips;

  return (
    <section className="uber-section">
      <div className="section-header-row">
        <h2 className="section-title">{title}</h2>
        {showFilter && (
          <div className="filter-container">
            <button className="filter-button" onClick={() => setFilterOpen(o => !o)}>{selectedFilter} ▾</button>
            {filterOpen && (
              <div className="filter-dropdown">
                {['Cost', 'Rating', 'Ease'].map(opt => (
                  <div key={opt} className="filter-option" onClick={() => { setSelectedFilter(opt); setFilterOpen(false); }}>{opt}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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
            {visible.map(trip => (
              <div key={trip.id} className="card trip-row-card">
                <div className="trip-row-left">
                  <div className="trip-car-icon">🚗</div>
                  <div className="trip-row-text">
                    <div className="trip-row-title">{trip.title ?? trip.username ?? 'Trip'}</div>
                    <div className="trip-row-meta">{trip.meta}</div>
                    {trip.drivername   && <div className="trip-row-meta">{trip.drivername}</div>}
                    {trip.username     && <div className="trip-row-meta">{trip.username}</div>}
                    {trip.numberPassengers !== undefined && <div className="trip-row-meta">Passengers: {trip.numberPassengers}</div>}
                    <div className="trip-row-price">
                      {trip.price}
                      {trip.rating !== undefined && <> – <span className="trip-row-rating">⭐ {trip.rating}</span></>}
                    </div>
                  </div>
                </div>
                <button className="pill pill-solid trip-row-button" onClick={() => onTripMore(trip)}>{trip.action}</button>
              </div>
            ))}
          </div>
          {collapsible && trips.length > 3 && (
            <div className="see-more-container">
              <button className="see-more-button" onClick={() => setExpanded(e => !e)}>
                {expanded ? 'See less' : 'See more'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

// ─── Activity Page ────────────────────────────────────────────────────────────
const ActivityPage: React.FC = () => {
  const [mode, setMode] = useState<'user' | 'Driver'>('user');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <>
      <header className="uber-header">
        <h1 className="activity-title">Activity</h1>
        <div className="top-toggle">
          <button className={`toggle-tab ${mode === 'user'   ? 'toggle-tab-active' : ''}`} onClick={() => setMode('user')}>Rider</button>
          <button className={`toggle-tab ${mode === 'Driver' ? 'toggle-tab-active' : ''}`} onClick={() => setMode('Driver')}>Driver</button>
        </div>
      </header>

      <TripSection title="Upcoming" trips={mode === 'user' ? upcomingTripsUser : upcomingTripsDriver}
        emptyTitle="You have no upcoming trips" emptySubtitle="Reserve your trip →" emptyIcon="📅"
        collapsible mode={mode} onTripMore={setSelectedTrip}/>

      {mode === 'user' ? (
        <TripSection title="Requested" trips={requestedTrips}
          emptyTitle="You have no requested trips" emptySubtitle="Book a reservation →" emptyIcon="🗓️"
          collapsible mode={mode} onTripMore={setSelectedTrip}/>
      ) : (
        <TripSection title="Passenger Requests" trips={passengerRequestedTrips}
          emptyTitle="You have no requests" emptySubtitle="Post a trip →" emptyIcon="🗓️"
          collapsible mode={mode} onTripMore={setSelectedTrip} showFilter/>
      )}

      <TripSection title="Past" trips={mode === 'user' ? pastTripsUsers : pastTripsDrivers}
        emptyTitle="No past trips yet" emptySubtitle="Your completed rides will appear here" emptyIcon="🕘"
        collapsible mode={mode} onTripMore={setSelectedTrip}/>

      {selectedTrip && (
        <TripDetailsPanel trip={selectedTrip} mode={mode} onClose={() => setSelectedTrip(null)}/>
      )}
    </>
  );
};

export default ActivityPage;
