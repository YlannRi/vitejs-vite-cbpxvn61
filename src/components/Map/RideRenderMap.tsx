import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker } from 'react-leaflet';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';

interface RideRenderMapProps {
    rideId: number;
    onPickupSelect?: (lat: number, lng: number) => void;
    existingPickup?: { lat: number; lng: number };
    height?: string;
    interactive?: boolean;
    refreshTrigger?: number;
}

export const RideRenderMap: React.FC<RideRenderMapProps> = ({
    rideId,
    onPickupSelect,
    existingPickup,
    height = '300px',
    interactive = true,
    refreshTrigger = 0,
}) => {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPickup, setSelectedPickup] = useState<LatLngExpression | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchRoute = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');

                // Fetch the GeoJSON route from our routing backend
                const response = await fetch(`https://localhost:8000/routing/ride/${rideId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to load route: ${response.statusText}`);
                }

                const data = await response.json();

                if (isMounted) {
                    setGeoJsonData(data);
                }
            } catch (err: any) {
                console.error("Error fetching map route:", err);
                if (isMounted) {
                    setError(err.message || "Could not fetch route");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (rideId) {
            fetchRoute();
        }

        return () => {
            isMounted = false;
        };
    }, [rideId, refreshTrigger]);

    // Component to handle map clicks for passenger pickup selection
    const MapClickEvent = () => {
        useMapEvents({
            click(e: LeafletMouseEvent) {
                if (onPickupSelect && interactive) {
                    setSelectedPickup(e.latlng);
                    onPickupSelect(e.latlng.lat, e.latlng.lng);
                }
            },
        });
        return null;
    };

    // Component to automatically fit map to the route bounds
    const FitBounds = ({ data }: { data: any }) => {
        const map = useMapEvents({});
        useEffect(() => {
            if (data && data.features && data.features.length > 0) {
                try {
                    const L = (window as any).L;
                    const geoJsonLayer = L.geoJSON(data);
                    map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
                } catch (e) {
                    console.error("Error fitting bounds:", e);
                }
            }
        }, [data, map]);
        return null;
    };

    // Center coordinate - we can default to Bath until we have dynamic bounds
    const defaultCenter: LatLngExpression = [51.3758, -2.3599];

    if (loading) {
        return <div style={{ height, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb', borderRadius: '8px' }}>Loading map route...</div>;
    }

    if (error) {
        return <div style={{ height, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px' }}>{error}</div>;
    }

    return (
        <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={interactive}
                dragging={interactive}
                zoomControl={interactive}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {geoJsonData && (
                    <>
                        <GeoJSON data={geoJsonData} style={{ color: '#3b82f6', weight: 5, opacity: 0.8 }} />
                        <FitBounds data={geoJsonData} />
                    </>
                )}

                {selectedPickup && (
                    <Marker position={selectedPickup} />
                )}

                {existingPickup && (
                    <Marker position={[existingPickup.lat, existingPickup.lng]} />
                )}

                {interactive && <MapClickEvent />}

            </MapContainer>
        </div>
    );
};
