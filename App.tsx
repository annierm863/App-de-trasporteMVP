
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    <HashRouter>
      <div className="font-display selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginScreen />} />
          
          {/* Client Routes */}
          <Route path="/client/home" element={<ClientHome />} />
          <Route path="/client/ride/:id" element={<RideDetails />} />
          <Route path="/client/trips" element={<ClientTrips />} />
          <Route path="/client/trip-live/:id" element={<TripLive />} />
          <Route path="/client/profile" element={<ClientProfileScreen />} />
          <Route path="/client/service-info" element={<ServiceInfo />} />
          <Route path="/client/terms" element={<TermsPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/booking/:id" element={<AdminBookingDetail />} />
          <Route path="/admin/create-booking" element={<AdminCreateBooking />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/client/:id" element={<AdminClientDetail />} />
          <Route path="/admin/rates" element={<AdminRates />} />
          <Route path="/admin/rate/:id" element={<AdminRateDetail />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* Driver Routes */}
          <Route path="/driver/profile" element={<DriverProfile />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
