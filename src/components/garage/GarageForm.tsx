import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Minus, PenTool as Tool, Wrench } from 'lucide-react';
import type { Vehicle, GarageRecord, RepairItem } from '../../types';

interface GarageFormProps {
  onSubmit: (data: Omit<GarageRecord, 'id' | 'status' | 'completedDate'>) => void;
  onClose: () => void;
  vehicles: Vehicle[];
}

export function GarageForm({ onSubmit, onClose, vehicles }: GarageFormProps) {
  const [repairs, setRepairs] = useState<Partial<RepairItem>[]>([]);
  const [customerComplaints, setCustomerComplaints] = useState<string[]>(['']);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Omit<GarageRecord, 'id' | 'status' | 'completedDate'>>();

  const isPartner = watch('customerInfo.isPartner');
  const selectedType = watch('type');

  const handleAddRepair = () => {
    setRepairs([...repairs, {
      description: '',
      cost: 0,
      laborHours: 0,
      parts: [],
      priority: 'medium',
      status: 'pending'
    }]);
  };

  const handleRemoveRepair = (index: number) => {
    setRepairs(repairs.filter((_, i) => i !== index));
  };

  const handleAddPart = (repairIndex: number) => {
    const updatedRepairs = [...repairs];
    updatedRepairs[repairIndex].parts = [
      ...(updatedRepairs[repairIndex].parts || []),
      { name: '', quantity: 1, unitPrice: 0 }
    ];
    setRepairs(updatedRepairs);
  };

  const handleRemovePart = (repairIndex: number, partIndex: number) => {
    const updatedRepairs = [...repairs];
    updatedRepairs[repairIndex].parts = updatedRepairs[repairIndex].parts?.filter((_, i) => i !== partIndex);
    setRepairs(updatedRepairs);
  };

  const handleComplaintChange = (index: number, value: string) => {
    const newComplaints = [...customerComplaints];
    newComplaints[index] = value;
    setCustomerComplaints(newComplaints);
  };

  const addComplaint = () => {
    setCustomerComplaints([...customerComplaints, '']);
  };

  const removeComplaint = (index: number) => {
    if (customerComplaints.length > 1) {
      setCustomerComplaints(customerComplaints.filter((_, i) => i !== index));
    }
  };

  const onFormSubmit = (data: any) => {
    const formattedData = {
      ...data,
      repairs: repairs.map(repair => ({
        ...repair,
        parts: repair.parts || []
      })),
      vehicleCondition: {
        ...data.vehicleCondition,
        customerComplaints: customerComplaints.filter(c => c.trim() !== '')
      }
    };
    onSubmit(formattedData);
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
          Nouvelle intervention
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Type d'intervention */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Type d'intervention
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className="relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  {...register('type')}
                  value="diagnostic"
                  className="sr-only"
                />
                <div className="flex flex-col items-center">
                  <Tool className="h-6 w-6 text-blue-500" />
                  <span className="mt-2 text-sm font-medium">Diagnostic</span>
                </div>
              </label>
              <label className="relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  {...register('type')}
                  value="repair"
                  className="sr-only"
                />
                <div className="flex flex-col items-center">
                  <Wrench className="h-6 w-6 text-orange-500" />
                  <span className="mt-2 text-sm font-medium">Réparation</span>
                </div>
              </label>
              <label className="relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  {...register('type')}
                  value="maintenance"
                  className="sr-only"
                />
                <div className="flex flex-col items-center">
                  <Tool className="h-6 w-6 text-green-500" />
                  <span className="mt-2 text-sm font-medium">Maintenance</span>
                </div>
              </label>
            </div>
          </div>

          {/* Informations client */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom complet*
                </label>
                <input
                  {...register('customerInfo.name', { required: 'Le nom est requis' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.customerInfo?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerInfo.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone*
                </label>
                <input
                  {...register('customerInfo.phone', { required: 'Le téléphone est requis' })}
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.customerInfo?.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerInfo.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...register('customerInfo.email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.customerInfo?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerInfo.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <input
                    {...register('customerInfo.isPartner')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Client partenaire
                  </label>
                </div>
                {isPartner && (
                  <input
                    {...register('customerInfo.companyName')}
                    type="text"
                    placeholder="Nom de l'entreprise"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Informations véhicule */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations véhicule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Véhicule*
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
                <label className="block text-sm font-medium text-gray-700">
                  Kilométrage actuel*
                </label>
                <input
                  {...register('vehicleCondition.mileage', { 
                    required: 'Le kilométrage est requis',
                    min: { value: 0, message: 'Le kilométrage doit être positif' }
                  })}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.vehicleCondition?.mileage && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleCondition.mileage.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Niveau de carburant (%)*
                </label>
                <input
                  {...register('vehicleCondition.fuelLevel', { 
                    required: 'Le niveau de carburant est requis',
                    min: { value: 0, message: 'Le niveau doit être entre 0 et 100' },
                    max: { value: 100, message: 'Le niveau doit être entre 0 et 100' }
                  })}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.vehicleCondition?.fuelLevel && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleCondition.fuelLevel.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priorité
                </label>
                <select
                  {...register('priority', { required: 'La priorité est requise' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  État extérieur
                </label>
                <textarea
                  {...register('vehicleCondition.exteriorDamage')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Décrivez l'état extérieur du véhicule..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  État intérieur
                </label>
                <textarea
                  {...register('vehicleCondition.interiorCondition')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Décrivez l'état intérieur du véhicule..."
                />
              </div>
            </div>
          </div>

          {/* Problèmes signalés */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Problèmes signalés</h3>
            <div className="space-y-4">
              {customerComplaints.map((complaint, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={complaint}
                    onChange={(e) => handleComplaintChange(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Décrivez le problème..."
                  />
                  <button
                    type="button"
                    onClick={() => removeComplaint(index)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                    disabled={customerComplaints.length === 1}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addComplaint}
                className="flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un problème
              </button>
            </div>
          </div>

          {/* Réparations */}
          {selectedType === 'repair' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Réparations</h3>
                <button
                  type="button"
                  onClick={handleAddRepair}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une réparation
                </button>
              </div>

              <div className="space-y-6">
                {repairs.map((repair, repairIndex) => (
                  <div key={repairIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Réparation {repairIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveRepair(repairIndex)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <input
                          type="text"
                          value={repair.description}
                          onChange={(e) => {
                            const updatedRepairs = [...repairs];
                            updatedRepairs[repairIndex].description = e.target.value;
                            setRepairs(updatedRepairs);
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Heures de travail
                          </label>
                          <input
                            type="number"
                            value={repair.laborHours}
                            onChange={(e) => {
                              const updatedRepairs = [...repairs];
                              updatedRepairs[repairIndex].laborHours = Number(e.target.value);
                              setRepairs(updatedRepairs);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Priorité
                          </label>
                          <select
                            value={repair.priority}
                            onChange={(e) => {
                              const updatedRepairs = [...repairs];
                              updatedRepairs[repairIndex].priority = e.target.value as any;
                              setRepairs(updatedRepairs);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="low">Basse</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Haute</option>
                          </select>
                        </div>
                      </div>

                      {/* Pièces détachées */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Pièces détachées
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddPart(repairIndex)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-500"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter une pièce
                          </button>
                        </div>

                        <div className="space-y-2">
                          {repair.parts?.map((part, partIndex) => (
                            <div key={partIndex} className="flex gap-2 items-start">
                              <input
                                type="text"
                                value={part.name}
                                onChange={(e) => {
                                  const updatedRepairs = [...repairs];
                                  updatedRepairs[repairIndex].parts![partIndex].name = e.target.value;
                                  setRepairs(updatedRepairs);
                                }}
                                placeholder="Nom de la pièce"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                              <input
                                type="number"
                                value={part.quantity}
                                onChange={(e) => {
                                  const updatedRepairs = [...repairs];
                                  updatedRepairs[repairIndex].parts![partIndex].quantity = Number(e.target.value);
                                  setRepairs(updatedRepairs);
                                }}
                                placeholder="Quantité"
                                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                              <input
                                type="number"
                                value={part.unitPrice}
                                onChange={(e) => {
                                  const updatedRepairs = [...repairs];
                                  updatedRepairs[repairIndex].parts![partIndex].unitPrice = Number(e.target.value);
                                  setRepairs(updatedRepairs);
                                }}
                                placeholder="Prix unitaire"
                                className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePart(repairIndex, partIndex)}
                                className="p-2 text-gray-400 hover:text-gray-500"
                              >
                                <Minus className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes techniques */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes techniques</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description du diagnostic*
                </label>
                <textarea
                  {...register('description', { 
                    required: 'La description est requise',
                    minLength: { value: 10, message: 'La description doit contenir au moins 10 caractères' }
                  })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Décrivez le diagnostic initial..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes du technicien
                </label>
                <textarea
                  {...register('vehicleCondition.technicianNotes')}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Notes techniques supplémentaires..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date estimée de fin
                  </label>
                  <input
                    {...register('estimatedCompletionDate')}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Coût estimé (€)*
                  </label>
                  <input
                    {...register('cost', { 
                      required: 'Le coût est requis',
                      min: { value:0, message: 'Le coût doit être positif' }
                    
                    })}
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.cost && (
                    <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>
                  )}
                </div>
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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}