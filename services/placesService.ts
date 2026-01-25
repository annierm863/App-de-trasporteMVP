import { loadGoogleMapsScript } from './distanceService';

declare const google: any;

export async function attachPlacesAutocomplete(
    inputElement: HTMLInputElement,
    onPlaceSelected: (address: string) => void
) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        console.warn('VITE_GOOGLE_MAPS_API_KEY missing, Autocomplete disabled.');
        return;
    }

    try {
        await loadGoogleMapsScript(apiKey);

        if (!google?.maps?.places?.Autocomplete) {
            console.warn('Google Maps Places library not loaded');
            return;
        }

        const autocomplete = new google.maps.places.Autocomplete(inputElement, {
            types: ['geocode', 'establishment'],
            fields: ['formatted_address', 'geometry'],
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
                onPlaceSelected(place.formatted_address);
            }
        });

        // Prevent form submission on Enter if user selects a place via keyboard
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });

    } catch (error) {
        console.error('Failed to attach places autocomplete:', error);
    }
}
