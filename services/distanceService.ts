
export interface DistanceResult {
    distanceMeters: number;
    durationSeconds: number;
}

// Declare google namespace to avoid TypeScript errors if types are missing
declare const google: any;

let isScriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

export const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
    if (isScriptLoaded) return Promise.resolve();
    // Check if already on window (some other component might have loaded it)
    if ((window as any).google?.maps) {
        isScriptLoaded = true;
        return Promise.resolve();
    }
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
        // Double check inside promise
        if ((window as any).google?.maps) {
            isScriptLoaded = true;
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`; // libraries optional
        script.async = true;
        script.defer = true;
        script.onload = () => {
            isScriptLoaded = true;
            resolve();
        };
        script.onerror = (err) => {
            scriptPromise = null; // enable retry
            console.error('Google Maps Load Error:', err);
            reject(new Error('Failed to load Google Maps API'));
        };
        document.head.appendChild(script);
    });

    return scriptPromise;
};

export async function fetchDistanceMatrix(
    origin: string,
    destination: string
): Promise<DistanceResult> {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('VITE_GOOGLE_MAPS_API_KEY is missing. Using mock data.');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    distanceMeters: 20000, // 20 km
                    durationSeconds: 1800, // 30 mins
                });
            }, 1000);
        });
    }

    // 1. Ensure the JS API is loaded
    try {
        await loadGoogleMapsScript(apiKey);
    } catch (error) {
        // If script loading fails, we can either throw or return mock/empty. Throwing makes sure user knows info is invalid.
        throw error;
    }

    // 2. Use the DistanceMatrixService
    return new Promise((resolve, reject) => {
        if (!google?.maps?.DistanceMatrixService) {
            reject(new Error('Google Maps DistanceMatrixService not available'));
            return;
        }

        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
            },
            (response: any, status: any) => {
                if (status !== 'OK') {
                    reject(new Error(`Distance Matrix API Error: ${status}`));
                    return;
                }

                const row = response.rows[0];
                if (!row) {
                    reject(new Error('No rows in response'));
                    return;
                }

                const element = row.elements[0];
                if (element.status !== 'OK') {
                    // element.status can be ZERO_RESULTS, NOT_FOUND, etc.
                    reject(new Error(`Route status: ${element.status}`));
                    return;
                }

                // JS API returns .value which is number
                resolve({
                    distanceMeters: element.distance.value,
                    durationSeconds: element.duration.value,
                });
            }
        );
    });
}
