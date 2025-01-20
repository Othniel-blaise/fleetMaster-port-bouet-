import { useEffect } from 'react';
import { useStore } from '../store';
import { checkReservationStatus } from '../utils/driverStatus';

export function useAutoStatusUpdate() {
  const { reservations = [], updateReservation } = useStore();

  useEffect(() => {
    // Fonction pour mettre à jour les statuts
    const updateStatuses = () => {
      // Vérifier que reservations existe et est un tableau
      if (!Array.isArray(reservations)) {
        return;
      }

      // Mettre à jour les réservations
      reservations.forEach(reservation => {
        const newStatus = checkReservationStatus(reservation);
        if (newStatus !== reservation.status) {
          updateReservation(reservation.id, { status: newStatus });
        }
      });
    };

    // Mettre à jour immédiatement au montage
    updateStatuses();

    // Mettre en place l'intervalle de mise à jour (toutes les minutes)
    const interval = setInterval(updateStatuses, 60000);

    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval);
  }, [reservations, updateReservation]);
}