import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { Driver, Vehicle } from '../../types';

interface ReservationFormData {
  vehicleId: string;
  driverId: string;
  startDate: string;
  endDate: string;
}

interface ReservationFormProps {
  onSubmit: (data: ReservationFormData) => void;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export function ReservationForm({ onSubmit, onClose, vehicles, drivers }: ReservationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ReservationFormData>();

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Nouvelle réservation
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
              Véhicule
            </label>
            <select
              {...register('vehicleId', { required: 'Veuillez sélectionner un véhicule' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Sélectionner un véhicule</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="driverId" className="block text-sm font-medium text-gray-700">
              Conducteur
            </label>
            <select
              {...register('driverId', { required: 'Veuillez sélectionner un conducteur' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Sélectionner un conducteur</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.firstName} {driver.lastName}
                </option>
              ))}
            </select>
            {errors.driverId && (
              <p className="mt-1 text-sm text-red-600">{errors.driverId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Date de début
            </label>
            <input
              type="datetime-local"
              {...register('startDate', { required: 'La date de début est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Date de fin
            </label>
            <input
              type="datetime-local"
              {...register('endDate', { required: 'La date de fin est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}