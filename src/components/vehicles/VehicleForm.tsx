import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { Vehicle } from '../../types';

interface VehicleFormProps {
  onSubmit: (data: Omit<Vehicle, 'id' | 'status' | 'registrationDate'>) => void;
  onCancel: () => void;
}

export function VehicleForm({ onSubmit, onCancel }: VehicleFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Vehicle, 'id' | 'status' | 'registrationDate'>>();

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Enregistrer un nouveau véhicule
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations du véhicule */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Informations du véhicule</h3>
              
              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                  Plaque d'immatriculation*
                </label>
                <input
                  {...register('licensePlate', { 
                    required: 'La plaque d\'immatriculation est requise',
                    pattern: {
                      value: /^[A-Z0-9]{2,3}[-\s]?[A-Z0-9]{3}[-\s]?[A-Z0-9]{2}$/,
                      message: 'Format de plaque invalide'
                    }
                  })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="AB-123-CD"
                />
                {errors.licensePlate && (
                  <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Marque*
                </label>
                <input
                  {...register('brand', { required: 'La marque est requise' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                  Modèle*
                </label>
                <input
                  {...register('model', { required: 'Le modèle est requis' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Année*
                </label>
                <input
                  {...register('year', { 
                    required: 'L\'année est requise',
                    min: { value: 1900, message: 'Année invalide' },
                    max: { value: new Date().getFullYear(), message: 'Année invalide' }
                  })}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                )}
              </div>
            </div>

            {/* Informations du propriétaire */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Informations du propriétaire</h3>
              
              <div>
                <label htmlFor="owner.name" className="block text-sm font-medium text-gray-700">
                  Nom complet*
                </label>
                <input
                  {...register('owner.name', { required: 'Le nom du propriétaire est requis' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.owner?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.owner.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="owner.contact" className="block text-sm font-medium text-gray-700">
                  Contact*
                </label>
                <input
                  {...register('owner.contact', { required: 'Le contact est requis' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Téléphone ou email"
                />
                {errors.owner?.contact && (
                  <p className="mt-1 text-sm text-red-600">{errors.owner.contact.message}</p>
                )}
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Documents disponibles</h4>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('documents.insurance')}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Assurance</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('documents.registration')}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Carte grise</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('documents.technicalInspection')}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Contrôle technique</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}