export const ROUTES = {
    // Public
    ROOT: "/",
    LOGIN: "/login",

    // Client
    CLIENT_HOME: "/client/home",
    CLIENT_RIDE_DETAIL: "/client/ride/:id",
    CLIENT_TRIPS: "/client/trips",
    CLIENT_TRIP_LIVE: "/client/trip-live/:id",
    CLIENT_PROFILE: "/client/profile",
    CLIENT_SERVICE_INFO: "/client/service-info",
    CLIENT_TERMS: "/client/terms",

    // Admin
    ADMIN_DASHBOARD: "/admin/dashboard",
    ADMIN_BOOKINGS: "/admin/bookings",
    ADMIN_BOOKING_DETAIL: "/admin/booking/:id",
    ADMIN_CREATE_BOOKING: "/admin/create-booking",
    ADMIN_CLIENTS: "/admin/clients",
    ADMIN_CLIENT_DETAIL: "/admin/client/:id",
    ADMIN_RATES: "/admin/rates",
    ADMIN_RATE_DETAIL: "/admin/rate/:id",
    ADMIN_SETTINGS: "/admin/settings",

    // Driver
    DRIVER_PROFILE: "/driver/profile",
} as const;
