// Reason why navbar goes weird is because it has a scroll bar on the right
// Removed RouteRow for now because it's surplus
import React, { useState, useRef } from 'react';
import './ActivityPage.css';

// Trip type
type Trip = {
  id: number;
  destination?: string;
  username?: string;
  drivername?: string;
  time?: string;
  price?: string;
  numberPassengers?: number;
  rating?: number;
  action: 'More';
  status?: 'upcomingDriver' | 'upcomingUser' | 'requested' | 'pastUser' | 'passengerRequest' | 'pastDriver';
};

// ─── Trip data ────────────────────────────────────────────────────────────────
const upcomingTripsDriver: Trip[] = [
  { id: 1, destination: 'University of Bath', time: '23 Nov · 09:00', action: 'More', status: 'upcomingDriver', numberPassengers: 3 },
];
const upcomingTripsUser: Trip[] = [
  { id: 1, destination: 'University of Bath', time: '23 Nov · 09:00', price: '£7.60', action: 'More', status: 'upcomingUser', drivername: 'James Miller' },
];
const requestedTrips: Trip[] = [
  { id: 1, destination: 'University of Bath', time: '21 Nov · 00:17', price: '£6.60', action: 'More', status: 'requested', drivername: 'Priya Sharma' },
];
const passengerRequestedTrips: Trip[] = [
  { id: 1, username: 'Emma Thompson', rating: 4.8, time: 'Today · 14:20', price: '£8.40',  action: 'More', status: 'passengerRequest', destination: 'University of Bath' },
  { id: 2, username: 'Daniel Carter',  rating: 4.6, time: 'Today · 14:35', price: '£6.90',  action: 'More', status: 'passengerRequest', destination: 'City Centre' },
  { id: 3, username: 'Sophie Patel',   rating: 4.9, time: 'Today · 15:10', price: '£12.75', action: 'More', status: 'passengerRequest', destination: 'Bath Spa Station' },
  { id: 4, username: 'James Wilson',   time: 'Today · 15:25',              price: '£5.60',  action: 'More', status: 'passengerRequest', destination: 'Claverton Down' },
  { id: 5, username: 'Aisha Rahman',   rating: 4.7, time: 'Today · 16:00', price: '£15.20', action: 'More', status: 'passengerRequest', destination: 'Keynsham' },
];
const pastTripsDrivers: Trip[] = [
  { id: 1, destination: 'Second Bridge',         time: '21 Nov · 00:17', price: '£6.60', action: 'More', status: 'pastDriver', numberPassengers: 2 },
  { id: 2, destination: 'University of Bath',    time: '13 Nov · 22:03', price: '£7.63', action: 'More', status: 'pastDriver', numberPassengers: 1 },
  { id: 3, destination: 'University of Bath',    time: '31 Oct · 03:11', price: '£11.66', action: 'More', status: 'pastDriver', numberPassengers: 3 },
  { id: 4, destination: 'University of Bath',    time: '21 Oct · 03:25', price: '£10.14', action: 'More', status: 'pastDriver', numberPassengers: 2 },
  { id: 5, destination: 'University of Bath',    time: '17 Oct · 03:05', price: '£10.99', action: 'More', status: 'pastDriver', numberPassengers: 1 },
  { id: 6, destination: 'Bristol Airport (BRS)', time: '14 Oct · 17:19', price: '£42.05', action: 'More', status: 'pastDriver', numberPassengers: 4 },
];
const pastTripsUsers: Trip[] = [
  { id: 1, destination: 'Second Bridge',      time: '21 Nov · 00:17', price: '£6.60',  rating: 4.5, action: 'More', status: 'pastUser', drivername: 'Sarah Chen' },
  { id: 2, destination: 'University of Bath', time: '13 Nov · 22:03', price: '£7.63',  rating: 4.5, action: 'More', status: 'pastUser', drivername: 'Tom Richards' },
  { id: 3, destination: 'University of Bath', time: '31 Oct · 03:11', price: '£11.66', rating: 4.5, action: 'More', status: 'pastUser', drivername: 'Priya Sharma' },
  { id: 4, destination: 'University of Bath', time: '21 Oct · 03:25', price: '£10.14',              action: 'More', status: 'pastUser', drivername: 'Leo Barnes' },
];

// ─── Mock passenger data ──────────────────────────────────────────────────────
const ALL_MOCK_PASSENGERS = [
  { id: 1, name: 'Emma Thompson', rating: 4.8, pickupLocation: 'Claverton Down Rd', cost: '£8.40',  rated: false },
  { id: 2, name: 'Daniel Carter',  rating: 4.6, pickupLocation: 'North Rd',          cost: '£6.90',  rated: true, triprated: 5  },
  { id: 3, name: 'Sophie Patel',   rating: 4.9, pickupLocation: 'Widcombe Hill',      cost: '£12.75', rated: false },
  { id: 4, name: 'James Wilson',   rating: undefined, pickupLocation: 'Bathwick St',  cost: '£5.60',  rated: false },
];
const getMockPassengers = (n: number) =>
  ALL_MOCK_PASSENGERS.slice(0, Math.min(n, ALL_MOCK_PASSENGERS.length));



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

// ═══════════════════════════════════════════════════════════════
// SHARED FEEDBACK MODAL
// Used for: Rating, Cancel, Accept, Deny, Remove, Report
// ═══════════════════════════════════════════════════════════════
type FeedbackModalConfig =
  | { kind: 'rating';  target: { name: string; role: 'driver' | 'passenger' } }
  | { kind: 'report' }
  | { kind: 'confirm'; icon: string; iconColor: string; title: string; body: string };

// ── Rating labels ──────────────────────────────────────────────
const RATING_LABELS: Record<number, string> = { 1:'Poor', 2:'Fair', 3:'Good', 4:'Great', 5:'Excellent' };

// ── Success / info toast that auto-closes the whole sheet ──────
const SuccessToast: React.FC<{ icon: string; title: string; sub: string }> = ({ icon, title, sub }) => (
  <div className="rating-success">
    <div className="rating-success-icon">{icon}</div>
    <div className="rating-success-title">{title}</div>
    <div className="rating-success-sub">{sub}</div>
  </div>
);

// ── Rating UI ──────────────────────────────────────────────────
const RatingUI: React.FC<{
  target: { name: string; role: 'driver' | 'passenger' };
  onSubmit: (r: number) => void;
  onClose: () => void;
}> = ({ target, onSubmit, onClose }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const display = hovered || selected;
  return (
    <div className="rating-modal-content">
      <div className="rating-avatar">{target.name[0]}</div>
      <div className="rating-title">How was your trip?</div>
      <div className="rating-subtitle">
        Rate your {target.role === 'driver' ? 'driver' : 'passenger'},{' '}
        <span className="rating-name">{target.name}</span>
      </div>
      <div className="rating-stars">
        {[1,2,3,4,5].map(n => (
          <button key={n}
            className={`rating-star${n <= display ? ' rating-star-filled' : ''}`}
            onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(n)} aria-label={`${n} star`}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              fill={n <= display ? '#fbbf24' : 'none'} stroke={n <= display ? '#fbbf24' : 'rgba(255,255,255,0.25)'}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
        ))}
      </div>
      <div className={`rating-label${display ? ' rating-label-visible' : ''}`}>
        {display ? RATING_LABELS[display] : '‎'}
      </div>
      <div className="rating-modal-actions">
        <button className="rating-btn-cancel" onClick={onClose}>Cancel</button>
        <button className={`rating-btn-submit${selected ? ' rating-btn-submit-active' : ''}`}
          onClick={() => selected && onSubmit(selected)} disabled={!selected}>
          Submit Rating
        </button>
      </div>
    </div>
  );
};

// ── Report UI ──────────────────────────────────────────────────
const ReportUI: React.FC<{ onSubmit: (text: string) => void; onClose: () => void }> = ({ onSubmit, onClose }) => {
  const [text, setText] = useState('');
  return (
    <div className="rating-modal-content">
      <div className="report-icon-wrap">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div className="rating-title">Report an Issue</div>
      <div className="rating-subtitle">Describe what happened and we'll look into it</div>
      <textarea
        className="report-textarea"
        placeholder="Tell us what went wrong…"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={4}
      />
      <div className="rating-modal-actions">
        <button className="rating-btn-cancel" onClick={onClose}>Cancel</button>
        <button className={`rating-btn-submit report-btn${text.trim() ? ' rating-btn-submit-active report-btn-active' : ''}`}
          onClick={() => text.trim() && onSubmit(text)} disabled={!text.trim()}>
          Send Report
        </button>
      </div>
    </div>
  );
};

// ── Confirm UI (cancel / accept / deny / remove) ───────────────
const ConfirmUI: React.FC<{
  icon: string; iconColor: string; title: string; body: string;
  confirmLabel: string; confirmCls: string;
  onConfirm: () => void; onClose: () => void;
}> = ({ icon, iconColor, title, body, confirmLabel, confirmCls, onConfirm, onClose }) => (
  <div className="rating-modal-content">
    <div className="confirm-icon" style={{ color: iconColor }}>{icon}</div>
    <div className="rating-title">{title}</div>
    <div className="rating-subtitle">{body}</div>
    <div className="rating-modal-actions" style={{ marginTop: 8 }}>
      <button className="rating-btn-cancel" onClick={onClose}>Go Back</button>
      <button className={`rating-btn-submit rating-btn-submit-active ${confirmCls}`} onClick={onConfirm}>
        {confirmLabel}
      </button>
    </div>
  </div>
);

// ── Master modal shell ─────────────────────────────────────────
type ModalState =
  | { type: 'rating';   target: { name: string; role: 'driver' | 'passenger' } }
  | { type: 'report' }
  | { type: 'cancel';   title: string; body: string }
  | { type: 'accept';   passengerName: string }
  | { type: 'deny';     passengerName: string }
  | { type: 'remove';   passengerName: string }
  | { type: 'success';  icon: string; title: string; sub: string };

const Modal: React.FC<{
  state: ModalState;
  onClose: () => void;
  onDone: () => void;      // close sheet + return to activity
}> = ({ state, onClose, onDone }) => {

  const showSuccess = (icon: string, title: string, sub: string, delay = 1200) => {
    // We can't setState here (different component), so caller handles it
  };

  const [inner, setInner] = useState<ModalState>(state);

  const succeed = (icon: string, title: string, sub: string) => {
    setInner({ type: 'success', icon, title, sub });
    setTimeout(onDone, 1400);
  };

  const isSuccess = inner.type === 'success';

  return (
    <>
      <div className="rating-modal-overlay" onClick={isSuccess ? undefined : onClose}/>
      <div className={`rating-modal${isSuccess ? ' rating-modal-submitted' : ''}`}>
        <div className="rating-modal-handle-area"><div className="sheet-handle"/></div>

        {isSuccess && inner.type === 'success' ? (
          <div className="rating-success">
            <div className="rating-success-icon" style={{ fontSize: 40 }}>{inner.icon}</div>
            <div className="rating-success-title">{inner.title}</div>
            <div className="rating-success-sub">{inner.sub}</div>
          </div>
        ) : inner.type === 'rating' ? (
          <RatingUI
            target={inner.target}
            onSubmit={(r) => succeed('⭐', 'Rating Submitted!', 'Thanks for your feedback')}
            onClose={onClose}
          />
        ) : inner.type === 'report' ? (
          <ReportUI
            onSubmit={() => succeed('✅', 'Report Sent', 'Thanks for letting us know — we\'ll look into it')}
            onClose={onClose}
          />
        ) : inner.type === 'cancel' ? (
          <ConfirmUI
            icon="🚫" iconColor="#f87171"
            title={inner.title} body={inner.body}
            confirmLabel="Yes, Cancel" confirmCls="btn-confirm-cancel"
            onConfirm={() => succeed('🚫', 'Trip Cancelled', 'Your trip has been cancelled successfully')}
            onClose={onClose}
          />
        ) : inner.type === 'accept' ? (
          <ConfirmUI
            icon="✅" iconColor="#4ade80"
            title={`Accept ${inner.passengerName}?`}
            body={`${inner.passengerName} will be notified that their request has been accepted.`}
            confirmLabel="Accept Request" confirmCls="btn-confirm-accept"
            onConfirm={() => succeed('✅', 'Request Accepted!', `${inner.passengerName} has been added to your trip`)}
            onClose={onClose}
          />
        ) : inner.type === 'deny' ? (
          <ConfirmUI
            icon="❌" iconColor="#f87171"
            title={`Deny ${inner.passengerName}?`}
            body={`${inner.passengerName} will be notified that their request has been declined.`}
            confirmLabel="Deny Request" confirmCls="btn-confirm-cancel"
            onConfirm={() => succeed('❌', 'Request Denied', `${inner.passengerName}'s request has been declined`)}
            onClose={onClose}
          />
        ) : inner.type === 'remove' ? (
          <ConfirmUI
            icon="🗑️" iconColor="#f87171"
            title={`Remove ${inner.passengerName}?`}
            body={`${inner.passengerName} will be removed from your trip and notified.`}
            confirmLabel="Remove Passenger" confirmCls="btn-confirm-cancel"
            onConfirm={() => succeed('🗑️', 'Passenger Removed', `${inner.passengerName} has been removed from your trip`)}
            onClose={onClose}
          />
        ) : null}
      </div>
    </>
  );
};

// ─── Small reusable bits ──────────────────────────────────────────────────────
const DetailRow: React.FC<{ label: string; value: React.ReactNode; valueClass?: string }> = ({ label, value, valueClass }) => (
  <div className="sheet-detail-row">
    <span className="detail-label">{label}</span>
    <span className={`detail-value ${valueClass ?? ''}`}>{value}</span>
  </div>
);

const Btn: React.FC<{ cls: string; icon: React.ReactNode; label: string; small?: boolean; onClick?: () => void }> = ({ cls, icon, label, small, onClick }) => (
  <button className={`sheet-action-btn ${cls}${small ? ' btn-small' : ''}`} onClick={onClick}>
    {icon}{label}
  </button>
);

// const RouteRow: React.FC<{ destination: string }> = ({ destination }) => (
//   <div className="sheet-route-row">
//     <div className="route-point">
//       <div className="route-dot dot-green"/>
//       <div><div className="route-label">Pick Up</div><div className="route-value">Current Location</div></div>
//     </div>
//     <div className="route-line-vert"/>
//     <div className="route-point">
//       <div className="route-dot dot-red"/>
//       <div><div className="route-label">Drop Off</div><div className="route-value">{destination}</div></div>
//     </div>
//   </div>
// );

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

const PassengerCarousel: React.FC<{
  passengers: Passenger[];
  isPast: boolean;
  onRatePassenger?: (p: Passenger) => void;
  onRemovePassenger?: (p: Passenger) => void;
}> = ({ passengers, isPast, onRatePassenger, onRemovePassenger }) => {
  const [idx, setIdx] = useState(0);
  const p = passengers[idx];
  const total = passengers.length;

  return (
    <div className="passenger-carousel">
      {total > 1 && (
        <div className="passenger-tabs">
          {passengers.map((pass, i) => (
            <button key={pass.id}
              className={`passenger-tab${i === idx ? ' passenger-tab-active' : ''}`}
              onClick={() => setIdx(i)}>
              {pass.name.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      <div className="passenger-card">
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

        <div className="sheet-details-card passenger-details">
          <DetailRow label="Pick Up" value={p.pickupLocation}/>
          <DetailRow label="Cost"    value={p.cost} valueClass="detail-price"/>
          {isPast && p.rated && (
            <DetailRow label="Trip Rating" value={`⭐ ${p.triprated}`} valueClass="passenger-rating"/>
          )}
        </div>

        <div className="passenger-actions">
          <Btn cls="btn-message" icon={Icons.message} label="Message" small/>
          {isPast ? (
            <>
              {!p.rated && (
                <Btn cls="btn-rate" icon={Icons.star} label="Rate" small onClick={() => onRatePassenger?.(p)}/>
              )}

            </>
          ) : (
            <Btn cls="btn-cancel" icon={Icons.remove} label="Remove" small onClick={() => onRemovePassenger?.(p)}/>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Trip Details Panel ───────────────────────────────────────────────────────
const TripDetailsPanel: React.FC<{ trip: Trip; mode: 'user' | 'Driver'; onClose: () => void }> = ({ trip, mode, onClose }) => {
  const [closing, setClosing] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const touchStartY = useRef<number | null>(null);

  const close = () => { setClosing(true); setTimeout(onClose, 320); };
  const openModal = (m: ModalState) => setModal(m);
  const closeModal = () => setModal(null);
  // Called when action is confirmed + success shown — dismiss modal then sheet
  const doneModal = () => { setModal(null); close(); };

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
            {/* <RouteRow destination={trip.destination ?? 'Destination'}/> */}
            <div className="sheet-details-card">
              <DetailRow label="Driver"         value={trip.drivername ?? 'Pending'}/>
              <DetailRow label="Destination"    value={trip.destination ?? '—'}/>
              <DetailRow label="Date & Arrival" value={trip.time ?? '—'}/>
              <DetailRow label="Estimated leave" value="Pending"/>
              <DetailRow label="Cost"           value={trip.price ?? '—'} valueClass="detail-price"/>
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Driver"/>
              <Btn cls="btn-cancel"  icon={Icons.cancel}  label="Cancel Trip"
                onClick={() => openModal({ type: 'cancel',
                  title: 'Cancel this trip?',
                  body: 'Are you sure you want to cancel your upcoming trip? The driver will be notified.' })}/>
            </div>
          </>
        );

      /* ── Requested ─────────────────────────────────────────────────────── */
      case 'requested':
        return (
          <>
            {/* <RouteRow destination={trip.destination ?? 'Destination'}/> */}
            <div className="sheet-details-card">
              <DetailRow label="Driver"      value={trip.drivername ?? 'Pending'}/>
              <DetailRow label="Destination" value={trip.destination ?? '—'}/>
              <DetailRow label="Be There For" value={trip.time ?? '—'}/>
              <DetailRow label="Cost"        value={trip.price ?? '—'} valueClass="detail-price"/>
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Driver"/>
              <Btn cls="btn-cancel"  icon={Icons.cancel}  label="Cancel Trip"
                onClick={() => openModal({ type: 'cancel',
                  title: 'Cancel this request?',
                  body: 'Are you sure you want to cancel your trip request? The driver will be notified.' })}/>
            </div>
          </>
        );

      /* ── Past User ─────────────────────────────────────────────────────── */
      case 'pastUser':
        return (
          <>
            {/* <RouteRow destination={trip.destination ?? 'Destination'}/> */}
            <div className="sheet-details-card">
              <DetailRow label="Driver"       value={trip.drivername ?? '—'}/>
              <DetailRow label="Destination"  value={trip.destination ?? '—'}/>
              <DetailRow label="Pick Up Time" value={trip.time ?? '—'}/>
              <DetailRow label="Arrival Time" value="09:45"/>
              <DetailRow label="Cost"         value={trip.price ?? '—'} valueClass="detail-price"/>
              {trip.rating !== undefined && (
                <DetailRow label="Your Rating" value={`⭐ ${trip.rating}`}/>
              )}
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Driver"/>
              {trip.rating === undefined && (
                <Btn cls="btn-rate" icon={Icons.star} label="Rate Trip"
                  onClick={() => openModal({ type: 'rating',
                    target: { name: trip.drivername ?? 'Your Driver', role: 'driver' } })}/>
              )}
              <Btn cls="btn-report" icon={Icons.report} label="Report Issue"
                onClick={() => openModal({ type: 'report' })}/>
            </div>
          </>
        );

      /* ── Upcoming Driver ───────────────────────────────────────────────── */
      case 'upcomingDriver':
        return (
          <>
            {/* <RouteRow destination={trip.destination ?? 'Destination'}/> */}
            <div className="sheet-details-card">
              <DetailRow label="Destination"  value={trip.destination ?? '—'}/>
              <DetailRow label="Departure"    value={trip.time ?? '—'}/>
              <DetailRow label="Est. Arrival" value="~09:45"/>
            </div>
            <div className="passenger-section-label">
              Passengers <span className="passenger-count-badge">{passengers.length}</span>
            </div>
            <PassengerCarousel
              passengers={passengers}
              isPast={false}
              onRemovePassenger={(p) => openModal({ type: 'remove', passengerName: p.name })}
            />
            <div className="sheet-actions" style={{ marginTop: 12 }}>
              <Btn cls="btn-cancel" icon={Icons.cancel} label="Cancel Whole Trip"
                onClick={() => openModal({ type: 'cancel',
                  title: 'Cancel whole trip?',
                  body: 'This will cancel your trip for all passengers. Everyone will be notified.' })}/>
            </div>
          </>
        );

      /* ── Passenger Request ─────────────────────────────────────────────── */
      case 'passengerRequest':
        return (
          <>
            {/* <RouteRow destination={trip.destination ?? 'Destination'}/> */}
            <div className="sheet-details-card">
              <DetailRow label="Passenger"   value={trip.username ?? '—'}/>
              {trip.rating !== undefined && (
                <DetailRow label="Rating"    value={`⭐ ${trip.rating}`}/>
              )}
              <DetailRow label="Destination" value={trip.destination ?? '—'}/>
              <DetailRow label="Drop Off By" value={trip.time ?? '—'}/>
              <DetailRow label="Cost"        value={trip.price ?? '—'} valueClass="detail-price"/>
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Passenger"/>
              <Btn cls="btn-accept"  icon={Icons.accept}  label="Accept Request"
                onClick={() => openModal({ type: 'accept', passengerName: trip.username ?? 'Passenger' })}/>
              <Btn cls="btn-cancel"  icon={Icons.cancel}  label="Deny Request"
                onClick={() => openModal({ type: 'deny', passengerName: trip.username ?? 'Passenger' })}/>
            </div>
          </>
        );

      /* ── Past Driver ───────────────────────────────────────────────────── */
      case 'pastDriver':
        return (
          <>
            {/* <RouteRow destination={trip.destination ?? 'Destination'}/> */}
            <div className="sheet-details-card">
              <DetailRow label="Destination" value={trip.destination ?? '—'}/>
              <DetailRow label="Departure"   value={trip.time ?? '—'}/>
              <DetailRow label="Arrival"     value="~09:45"/>
            </div>
            <div className="passenger-section-label">
              Passengers <span className="passenger-count-badge">{passengers.length}</span>
            </div>
            <PassengerCarousel
              passengers={passengers}
              isPast={true}
              onRatePassenger={(p) => openModal({ type: 'rating', target: { name: p.name, role: 'passenger' } })}
            />
            <div className="sheet-actions" style={{ marginTop: 12 }}>
              <Btn cls="btn-report" icon={Icons.report} label="Report Issue"
                onClick={() => openModal({ type: 'report' })}/>
            </div>
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

      {modal && (
        <Modal state={modal} onClose={closeModal} onDone={doneModal}/>
      )}
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
                    <div className="trip-row-title">{trip.destination ?? trip.username ?? 'Trip'}</div>
                    <div className="trip-row-meta">{trip.time}</div>
                    {trip.drivername && <div className="trip-row-meta">{trip.drivername}</div>}
                    {trip.username   && <div className="trip-row-meta">{trip.username}</div>}
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
