import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Minus } from 'lucide-react';
import { useStore } from '../../store';
import type { SparePart } from '../../types';

interface SparePartFormProps {
  onClose: () => void;
  initialData?: SparePart;
}

export function SparePartForm({ onClose, initialData }: SparePartFormProps) {
  const { addSparePart, updateSparePart } = useStore();
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<SparePart, 'id' | 'createdAt' | 'updatedAt'>>({
    defaultValues: initialData || {
      status: 'available',
      history: {
        purchases: [],
        usage: []
      },
      metrics: {
        turnoverRate: 0,
        averageDemand: 0,
        lastRestockDate: new Date()
      }
    }
  });

  const onSubmit = (data: Omit<SparePart, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (initialData) {
      updateSparePart(initialData.id, data);
    } else {
      addSparePart(data);
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
          {initialData ? 'Modifier une pièce' : 'Ajouter une pièce'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations de base */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de base</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Référence*
                </label>
                <input
                  {...register('reference', { required: 'La référence est requise' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.reference && (
                  <p className="mt-1 text-sm text-red-600">{errors.reference.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom*
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
                  Catégorie*
                </label>
                <input
                  {...register('category', { required: 'La catégorie est requise' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fabricant*
                </label>
                <input
                  {...register('manufacturer', { required: 'Le fabricant est requis' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Prix et stock */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Prix et stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prix d'achat*
                </label>
                <input
                  {...register('price.purchase', { 
                    required: 'Le prix d\'achat est requis',
                    min: { value: 0, message: 'Le prix doit être positif' }
                  })}
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prix de vente*
                </label>
                <input
                  {...register('price.retail', { 
                    required: 'Le prix de vente est requis',
                    min: { value: 0, message: 'Le prix doit être positif' }
                  })}
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock actuel*
                </label>
                <input
                  {...register('stock.current', { 
                    required: 'Le stock actuel est requis',
                    min: { value: 0, message: 'Le stock doit être positif' }
                  })}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock minimum*
                </label>
                <input
                  {...register('stock.minimum', { 
                    required: 'Le stock minimum est requis',
                    min: { value: 0, message: 'Le stock minimum doit être positif' }
                  })}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock optimal*
                </label>
                <input
                  {...register('stock.optimal', { 
                    required: 'Le stock optimal est requis',
                    min: { value: 0, message: 'Le stock optimal doit être positif' }
                  })}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Emplacement
                </label>
                <input
                  {...register('stock.location')}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Compatibilité */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Compatibilité</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marques compatibles
                </label>
                <input
                  {...register('compatibility.brands')}
                  type="text"
                  placeholder="Séparez les marques par des virgules"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Modèles compatibles
                </label>
                <input
                  {...register('compatibility.models')}
                  type="text"
                  placeholder="Séparez les modèles par des virgules"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Année début
                </label>
                <input
                  {...register('compatibility.years.from')}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Année fin
                </label>
                <input
                  {...register('compatibility.years.to')}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Fournisseur */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations fournisseur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom du fournisseur*
                </label>
                <input
                  {...register('supplier.name', { required: 'Le nom du fournisseur est requis' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Référence fournisseur
                </label>
                <input
                  {...register('supplier.reference')}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Délai de livraison (jours)*
                </label>
                <input
                  {...register('supplier.leadTime', { 
                    required: 'Le délai de livraison est requis',
                    min: { value: 0, message: 'Le délai doit être positif' }
                  })}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
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