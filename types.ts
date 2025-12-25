
export type UserRole = 'client' | 'driver' | 'admin';

export interface Location {
  address: string;
  city: string;
  time?: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  driverId?: string;
  driverName?: string;
  driverAvatar?: string;
  status: 'requested' | 'confirmed' | 'on_the_way' | 'completed' | 'cancelled';
  pickup: Location;
  dropoff: Location;
  date: string;
  time: string;
  passengers: number;
  tripType: string;
  fare: string;
  carModel?: string;
  carColor?: string;
  carPlate?: string;
}

export interface ClientProfile {
  name: string;
  phone: string;
  avatar: string;
}
