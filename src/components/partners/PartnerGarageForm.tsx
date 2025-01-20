import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { useStore } from '../../store';
import type { PartnerGarage } from '../../types';

interface PartnerGarageFormProps {
  onClose: () => void;
  initialData?: PartnerGarage;
}

export function PartnerGarageForm({ onClose, initialData }: PartnerGarageFormProps) {
  const { addPartnerGarage, updatePartnerGarage } = useStore();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Omit<PartnerGarage, 'id' | 'createdAt' | 'updatedAt'>>({
    defaultValues: initialData || {
      status: 'active',
      rating: 0,
      metrics: {
        completedRepairs: 0,
        averageRepairTime: 0,
        customerSatisfaction: 0,
        costEfficiency: 0
      }
    }
  });

  const onSubmit = (data: Omit<PartnerGarage, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (initialData) {
      updatePartnerGarage(initialData.id, data);
    } else {
      addPartnerGarage(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {initialData ? 'Modifier le garage partenaire' : 'Ajouter un garage partenaire'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations générales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom du garage*
                </label>
                <input
                  {...register('name', { required: 'Le nom est requis' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adresse*
                </label>
                <input
                  {...register('address', { required: 'L\'adresse est requise' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone*
                </label>
                <input
                  {...register('contact.phone', { required: 'Le téléphone est requis' })}
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email*
                </label>
                <input
                  {...register('contact.email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Responsable*
                </label>
                <input
                  {...register('contact.manager', { required: 'Le responsable est requis' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <select
                  {...register('status')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Spécialités et services */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Spécialités et services</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Spécialités
                </label>
                <input
                  {...register('specialties')}
                  type="text"
                  placeholder="Séparez les spécialités par des virgules"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Services proposés
                </label>
                {/* Ici, vous pouvez ajouter un système dynamique pour ajouter/supprimer des services */}
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Horaires d'ouverture</h3>
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="grid grid-cols-3 gap-4 mb-2">
                <div className="capitalize">{day}</div>
                <input
                  {...register(`availability.${day}.start`)}
                  type="time"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <input
                  {...register(`availability.${day}.end`)}
                  type="time"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
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