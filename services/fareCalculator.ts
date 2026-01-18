
export interface FareEstimate {
    distanceKm: number;
    durationMinutes: number;
    minFare: number;
    maxFare: number;
}

export function calculateFare(
    distanceMeters: number,
    durationSeconds: number
): FareEstimate {
    const BASE_FARE = 25;
    const PRICE_PER_KM = 2.2;
    const PRICE_PER_MIN = 0.3;

    const distanceKm = distanceMeters / 1000;
    const durationMinutes = durationSeconds / 60;

    const rawEstimate =
        BASE_FARE +
        distanceKm * PRICE_PER_KM +
        durationMinutes * PRICE_PER_MIN;

    // Apply min/max spread and round to whole dollars
    const minFare = Math.round(rawEstimate * 0.9);
    const maxFare = Math.round(rawEstimate * 1.1);

    return {
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        durationMinutes: Math.round(durationMinutes),
        minFare,
        maxFare,
    };
}
