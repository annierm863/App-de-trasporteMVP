
export interface DistanceResult {
    distanceMeters: number;
    durationSeconds: number;
}

export async function fetchDistanceMatrix(
    origin: string,
    destination: string
): Promise<DistanceResult> {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('VITE_GOOGLE_MAPS_API_KEY is missing. Using mock data.');
        // Return a mock result so the app doesn't crash locally without the key
        // Simulating ~20km and 30 mins
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    distanceMeters: 20000,
                    durationSeconds: 1800,
                });
            }, 1000);
        });
    }

    // Use a proxy URL if needed, but for now we'll try direct call.
    // Note: Client-side calls to Google Maps Web Service APIs generally need a proxy to avoid CORS
    // unless the specific API allows it or a proxy is set up in Vite.
    // The user asked to call https://maps.googleapis.com/maps/api/distancematrix/json directly.
    // This often fails with CORS in browsers. 
    // However, I will implement as requested. If I encounter CORS issues I might need to suggest a proxy.
    // Actually, standard Maps JavaScript API is client side, but Distance Matrix Web Service is server-side usually,
    // or checks referers.

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origin
    )}&destinations=${encodeURIComponent(
        destination
    )}&mode=driving&units=metric&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(`Distance Matrix API Error: ${data.status} - ${data.error_message || ''}`);
        }

        const row = data.rows[0];
        if (!row) throw new Error('No rows in response');

        const element = row.elements[0];
        if (element.status !== 'OK') {
            throw new Error(`Route not found: ${element.status}`);
        }

        return {
            distanceMeters: element.distance.value,
            durationSeconds: element.duration.value,
        };
    } catch (error) {
        console.error('Error fetching distance matrix:', error);
        throw error;
    }
}
