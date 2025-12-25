import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import LandingPage from './screens/LandingPage';
import LoginScreen from './screens/LoginScreen';
import ClientHome from './screens/ClientHome';
import RideDetails from './screens/RideDetails';
import ClientTrips from './screens/ClientTrips';
import TripLive from './screens/TripLive';
import ClientProfileScreen from './screens/ClientProfileScreen';
import ServiceInfo from './screens/ServiceInfo';
import TermsPage from './screens/TermsPage';
import AdminDashboard from './screens/AdminDashboard';
import AdminBookings from './screens/AdminBookings';
import AdminBookingDetail from './screens/AdminBookingDetail';
import AdminCreateBooking from './screens/AdminCreateBooking';
import AdminClients from './screens/AdminClients';
import AdminClientDetail from './screens/AdminClientDetail';
import AdminRates from './screens/AdminRates';
import AdminRateDetail from './screens/AdminRateDetail';
import AdminSettings from './screens/AdminSettings';
import DriverProfile from './screens/DriverProfile';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="font-display selection:bg-primary/30">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.ROOT} element={<LandingPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginScreen />} />

          {/* Client Routes */}
          <Route path={ROUTES.CLIENT_HOME} element={<ClientHome />} />
          <Route path={ROUTES.CLIENT_RIDE_DETAIL} element={<RideDetails />} />
          <Route path={ROUTES.CLIENT_TRIPS} element={<ClientTrips />} />
          <Route path={ROUTES.CLIENT_TRIP_LIVE} element={<TripLive />} />
          <Route path={ROUTES.CLIENT_PROFILE} element={<ClientProfileScreen />} />
          <Route path={ROUTES.CLIENT_SERVICE_INFO} element={<ServiceInfo />} />
          <Route path={ROUTES.CLIENT_TERMS} element={<TermsPage />} />

          {/* Admin Routes */}
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_BOOKINGS} element={<AdminBookings />} />
          <Route path={ROUTES.ADMIN_BOOKING_DETAIL} element={<AdminBookingDetail />} />
          <Route path={ROUTES.ADMIN_CREATE_BOOKING} element={<AdminCreateBooking />} />
          <Route path={ROUTES.ADMIN_CLIENTS} element={<AdminClients />} />
          <Route path={ROUTES.ADMIN_CLIENT_DETAIL} element={<AdminClientDetail />} />
          <Route path={ROUTES.ADMIN_RATES} element={<AdminRates />} />
          <Route path={ROUTES.ADMIN_RATE_DETAIL} element={<AdminRateDetail />} />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />

          {/* Driver Routes */}
          <Route path={ROUTES.DRIVER_PROFILE} element={<DriverProfile />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.ROOT} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
