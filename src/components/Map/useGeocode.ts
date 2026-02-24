import { useState } from 'react';

export interface GeocodeResult {
    label: string;
    lat: number;
    lng: number;
}

export const useGeocode = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const geocodeAddress = async (address: string): Promise<GeocodeResult[]> => {
        if (!address.trim()) return [];

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://localhost:8000/routing/geocode?q=${encodeURIComponent(address)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Geocoding failed: ${response.statusText}`);
            }

            const data: GeocodeResult[] = await response.json();
            return data;
        } catch (err: any) {
            console.error('Error during geocoding:', err);
            setError(err.message || 'Failed to geocode address');
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { geocodeAddress, loading, error };
};
