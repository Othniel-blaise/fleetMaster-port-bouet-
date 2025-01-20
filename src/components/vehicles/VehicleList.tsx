import React, { useState } from 'react';
import { Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { Vehicle } from '../../types';
import { VehicleForm } from './VehicleForm';
import { useStore } from '../../store';

const statusColors = {
  pending_validation: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  maintenance: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  pending_validation: 'En attente de validation',
  active: 'Actif',
  maintenance: 'En maintenance',
  inactive: 'Inactif'
};

const StatusIcon = ({ status }: { status: Vehicle['status'] }) => {
  switch (status) {
    case 'pending_validation':
      return <Clock className="h-4 w-4 mr-1" />;
    case 'active':
      return <CheckCircle className="h-4 w-4 mr-1" />;
    case 'maintenance':
    case 'inactive':
      return <AlertCircle className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

export function VehicleList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { vehicles, addVehicle, updateVehicle } = useStore();

  const handleNewVehicle = (data: Omit<Vehicle, 'id' | 'status' | 'registrationDate'>) => {
    const newVehicle = {
      ...data,
      status: 'pending_validation' as const,
      registrationDate: new Date()
    };
    addVehicle(newVehicle);
    setIsFormOpen(false);
  };

  const handleStatusChange = (vehicleId: string, newStatus: Vehicle['status']) => {
    updateVehicle(vehicleId, { status: newStatus });
  };

  const isDocumentExpired = (date?: Date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Véhicules</h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-500">{vehicle.year}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[vehicle.status]}`}>
                  <StatusIcon status={vehicle.status} />
                  {statusLabels[vehicle.status]}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Immatriculation</p>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.licensePlate}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Propriétaire</p>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.owner.name}</p>
                  <p className="text-sm text-gray-500">{vehicle.owner.contact}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Documents</p>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${vehicle.documents.insurance ? 'bg-green-400' : 'bg-red-400'} mr-2`} />
                      <span className="text-sm text-gray-600">Assurance</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${vehicle.documents.registration ? 'bg-green-400' : 'bg-red-400'} mr-2`} />
                      <span className="text-sm text-gray-600">Carte grise</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${vehicle.documents.technicalInspection ? 'bg-green-400' : 'bg-red-400'} mr-2`} />
                      <span className="text-sm text-gray-600">Contrôle technique</span>
                    </div>
                  </div>
                </div>

                {vehicle.status === 'pending_validation' && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleStatusChange(vehicle.id, 'active')}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => handleStatusChange(vehicle.id, 'inactive')}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dates importantes */}
            {(vehicle.lastInspectionDate || vehicle.nextInspectionDate) && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Dates importantes</h4>
                <div className="space-y-1">
                  {vehicle.lastInspectionDate && (
                    <p className="text-sm text-gray-600">
                      Dernier contrôle : {vehicle.lastInspectionDate.toLocaleDateString()}
                    </p>
                  )}
                  {vehicle.nextInspectionDate && (
                    <p className={`text-sm ${isDocumentExpired(vehicle.nextInspectionDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      Prochain contrôle : {vehicle.nextInspectionDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isFormOpen && (
        <VehicleForm
          onSubmit={handleNewVehicle}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}