
export interface FareEstimate {
    distanceKm: number;
    durationMinutes: number;
    fare: number;
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

    // Return exact rounded fare
    const fare = Math.round(rawEstimate);

    return {
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        durationMinutes: Math.round(durationMinutes),
        fare,
    };
}
