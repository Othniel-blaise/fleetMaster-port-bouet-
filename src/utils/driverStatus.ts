import { Driver, Reservation } from '../types';

export function calculateDriverStatus(driver: Driver, reservations: Reservation[]): Driver['status'] {
  const now = new Date();
  
  // Vérifier si le conducteur a une réservation active
  const activeReservation = reservations.find(reservation => {
    if (reservation.driverId !== driver.id || reservation.status !== 'approved') {
      return false;
    }
    
    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);
    
    return now >= startDate && now <= endDate;
  });

  if (activeReservation) {
    return 'on_duty';
  }

  // Vérifier si le permis est expiré
  if (new Date(driver.licenseExpiry) < now) {
    return 'off_duty';
  }

  return 'available';
}

export function updateDriverStatuses(drivers: Driver[], reservations: Reservation[]): Driver[] {
  return drivers.map(driver => ({
    ...driver,
    status: calculateDriverStatus(driver, reservations)
  }));
}

export function shouldUpdateDriverStatus(reservation: Reservation): boolean {
  const now = new Date();
  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);
  
  return now >= startDate && now <= endDate;
}

// Nouvelle fonction pour vérifier et mettre à jour les réservations
export function checkReservationStatus(reservation: Reservation): 'pending' | 'approved' | 'rejected' | 'completed' {
  const now = new Date();
  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);

  if (now > endDate) {
    return 'completed';
  }

  return reservation.status;
}