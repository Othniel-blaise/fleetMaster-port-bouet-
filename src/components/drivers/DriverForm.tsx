import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { Driver, Vehicle } from '../../types';

interface DriverFormProps {
  onSubmit: (data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  vehicles: Vehicle[];
  initialData?: Driver | null;
}

export function DriverForm({ onSubmit, onClose, vehicles, initialData }: DriverFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>>({
    defaultValues: initialData ? {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      licenseNumber: initialData.licenseNumber,
      licenseExpiry: initialData.licenseExpiry instanceof Date 
        ? initialData.licenseExpiry.toISOString().split('T')[0]
        : new Date(initialData.licenseExpiry).toISOString().split('T')[0],
      assignedVehicleId: initialData.assignedVehicleId,
      status: initialData.status,
      contact: initialData.contact,
      documents: initialData.documents
    } : {
      status: 'available' as const
    }
  });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {initialData ? 'Modifier le conducteur' : 'Ajouter un conducteur'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Prénom*
                  </label>
                  <input
                    {...register('firstName', { required: 'Le prénom est requis' })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nom*
                  </label>
                  <input
                    {...register('lastName', { required: 'Le nom est requis' })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  {...register('contact.phone')}
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...register('contact.email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresse email invalide'
                    }
                  })}
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.contact?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact.address" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <textarea
                  {...register('contact.address')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Informations professionnelles</h3>

              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                  Numéro de permis*
                </label>
                <input
                  {...register('licenseNumber', { 
                    required: 'Le numéro de permis est requis',
                    pattern: {
                      value: /^[A-Z]{4}[0-9]{2}-[0-9]{2}-[0-9]{8}[A-Z]$/,
                      message: 'Format invalide. Exemple: ABCD12-34-12345678Z'
                    }
                  })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm uppercase"
                  placeholder="ABCD12-34-12345678Z"
                />
                {errors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.licenseNumber.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700">
                  Date d'expiration du permis*
                </label>
                <input
                  {...register('licenseExpiry', { 
                    required: 'La date d\'expiration est requise',
                    validate: (value) => {
                      const date = new Date(value);
                      return date > new Date() || 'La date d\'expiration doit être dans le futur';
                    }
                  })}
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.licenseExpiry && (
                  <p className="mt-1 text-sm text-red-600">{errors.licenseExpiry.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Statut*
                </label>
                <select
                  {...register('status', { required: 'Le statut est requis' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="available">Disponible</option>
                  <option value="on_duty">En service</option>
                  <option value="off_duty">Hors service</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="assignedVehicleId" className="block text-sm font-medium text-gray-700">
                  Véhicule assigné
                </label>
                <select
                  {...register('assignedVehicleId')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Aucun véhicule assigné</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Documents</h4>
                
                <div>
                  <label htmlFor="documents.licenseImage" className="block text-sm font-medium text-gray-700">
                    Image du permis (URL)
                  </label>
                  <input
                    {...register('documents.licenseImage')}
                    type="url"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="documents.medicalCertificate" className="block text-sm font-medium text-gray-700">
                    Certificat médical (URL)
                  </label>
                  <input
                    {...register('documents.medicalCertificate')}
                    type="url"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
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
              {initialData ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}