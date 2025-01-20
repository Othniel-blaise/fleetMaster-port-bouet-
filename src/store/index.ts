import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Driver, Vehicle, Reservation, GarageRecord, SparePart, PartInventoryMovement } from '../types';
import { updateDriverStatuses } from '../utils/driverStatus';

interface Store {
  // État
  vehicles: Vehicle[];
  drivers: Driver[];
  reservations: Reservation[];
  garageRecords: GarageRecord[];
  spareParts: SparePart[];
  partMovements: PartInventoryMovement[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadData: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  addGarageRecord: (record: Omit<GarageRecord, 'id'>) => void;
  updateGarageRecord: (id: string, record: Partial<GarageRecord>) => void;
  addSparePart: (part: Omit<SparePart, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSparePart: (id: string, part: Partial<SparePart>) => void;
  deleteSparePart: (id: string) => void;
  addPartMovement: (movement: Omit<PartInventoryMovement, 'id'>) => void;
  reserveParts: (repairId: string, parts: { partId: string; quantity: number }[]) => void;
  confirmPartsUsage: (repairId: string, parts: { partId: string; quantity: number }[]) => void;
  returnParts: (repairId: string, parts: { partId: string; quantity: number }[]) => void;
  getAvailableVehicles: () => Vehicle[];
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // État initial
      vehicles: [],
      drivers: [],
      reservations: [],
      garageRecords: [],
      spareParts: [],
      partMovements: [],
      isLoading: false,
      error: null,

      // Actions
      loadData: async () => {
        set({ isLoading: true, error: null });
        try {
          // Implement data loading from Supabase here
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addVehicle: (vehicle) => set((state) => ({
        vehicles: [...state.vehicles, {
          ...vehicle,
          id: crypto.randomUUID(),
          status: 'pending_validation',
          registrationDate: new Date()
        }]
      })),

      updateVehicle: (id, vehicle) => set((state) => {
        const updatedVehicles = state.vehicles.map((v) => 
          v.id === id ? { ...v, ...vehicle } : v
        );

        // Mettre à jour les réservations associées si nécessaire
        const updatedReservations = state.reservations.map(reservation => {
          if (reservation.vehicleId === id && vehicle.status === 'maintenance') {
            return { ...reservation, status: 'rejected' };
          }
          return reservation;
        });

        return {
          vehicles: updatedVehicles,
          reservations: updatedReservations
        };
      }),

      addDriver: (driver) => set((state) => ({
        drivers: [...state.drivers, {
          ...driver,
          id: crypto.randomUUID(),
          status: 'available'
        }]
      })),

      updateDriver: (id, driver) => set((state) => ({
        drivers: state.drivers.map((d) => 
          d.id === id ? { ...d, ...driver } : d
        )
      })),

      addReservation: (reservation) => set((state) => {
        const newReservation = {
          ...reservation,
          id: crypto.randomUUID()
        };

        // Mettre à jour le statut du véhicule si la réservation est approuvée
        const updatedVehicles = state.vehicles.map(vehicle => {
          if (vehicle.id === reservation.vehicleId && reservation.status === 'approved') {
            return { ...vehicle, status: 'in_use' };
          }
          return vehicle;
        });

        return {
          reservations: [...state.reservations, newReservation],
          vehicles: updatedVehicles
        };
      }),

      updateReservation: (id, reservation) => set((state) => {
        const updatedReservations = state.reservations.map((r) => 
          r.id === id ? { ...r, ...reservation } : r
        );

        // Mettre à jour le statut du véhicule en fonction du statut de la réservation
        const affectedReservation = updatedReservations.find(r => r.id === id);
        if (!affectedReservation) return { reservations: updatedReservations };

        const updatedVehicles = state.vehicles.map(vehicle => {
          if (vehicle.id === affectedReservation.vehicleId) {
            if (reservation.status === 'approved') {
              return { ...vehicle, status: 'in_use' };
            } else if (reservation.status === 'completed' || reservation.status === 'rejected') {
              return { ...vehicle, status: 'active' };
            }
          }
          return vehicle;
        });

        return {
          reservations: updatedReservations,
          vehicles: updatedVehicles
        };
      }),

      addGarageRecord: (record) => set((state) => {
        const newRecord = {
          ...record,
          id: crypto.randomUUID()
        };

        // Mettre à jour le statut du véhicule si nécessaire
        const updatedVehicles = state.vehicles.map(vehicle => {
          if (vehicle.id === record.vehicleId) {
            return { ...vehicle, status: 'maintenance' };
          }
          return vehicle;
        });

        return {
          garageRecords: [...state.garageRecords, newRecord],
          vehicles: updatedVehicles
        };
      }),

      updateGarageRecord: (id, record) => set((state) => {
        const updatedRecords = state.garageRecords.map((r) => 
          r.id === id ? { ...r, ...record } : r
        );

        // Mettre à jour le statut du véhicule si la maintenance est terminée
        const affectedRecord = updatedRecords.find(r => r.id === id);
        if (!affectedRecord) return { garageRecords: updatedRecords };

        const updatedVehicles = state.vehicles.map(vehicle => {
          if (vehicle.id === affectedRecord.vehicleId && record.status === 'completed') {
            return { ...vehicle, status: 'active' };
          }
          return vehicle;
        });

        return {
          garageRecords: updatedRecords,
          vehicles: updatedVehicles
        };
      }),

      addSparePart: (part) => set((state) => ({
        spareParts: [...state.spareParts, {
          ...part,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),

      updateSparePart: (id, part) => set((state) => ({
        spareParts: state.spareParts.map((p) => 
          p.id === id ? { ...p, ...part, updatedAt: new Date() } : p
        )
      })),

      deleteSparePart: (id) => set((state) => ({
        spareParts: state.spareParts.filter((p) => p.id !== id)
      })),

      addPartMovement: (movement) => set((state) => ({
        partMovements: [...state.partMovements, {
          ...movement,
          id: crypto.randomUUID()
        }]
      })),

      reserveParts: (repairId, parts) => {
        // Implement parts reservation logic
      },

      confirmPartsUsage: (repairId, parts) => {
        // Implement parts usage confirmation logic
      },

      returnParts: (repairId, parts) => {
        // Implement parts return logic
      },

      getAvailableVehicles: () => {
        const state = get();
        return state.vehicles.filter(vehicle => 
          vehicle.status === 'active' || vehicle.status === 'pending_validation'
        );
      }
    }),
    {
      name: 'fleet-master-storage',
      version: 1,
    }
  )
);