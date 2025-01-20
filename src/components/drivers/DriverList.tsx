import React, { useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import type { Driver } from '../../types';
import { DriverForm } from './DriverForm';
import { useStore } from '../../store';

const statusColors = {
  available: 'bg-green-100 text-green-800',
  on_duty: 'bg-blue-100 text-blue-800',
  off_duty: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  available: 'Disponible',
  on_duty: 'En service',
  off_duty: 'Hors service'
};

export function DriverList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const { drivers, vehicles, addDriver, updateDriver } = useStore();

  const handleNewDriver = (data: Omit<Driver, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    addDriver(data);
    setIsFormOpen(false);
  };

  const handleUpdateDriver = (data: Omit<Driver, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (editingDriver) {
      updateDriver(editingDriver.id, data);
      setEditingDriver(null);
      setIsFormOpen(false);
    }
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Date invalide';
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Conducteurs</h2>
          <button 
            onClick={() => {
              setEditingDriver(null);
              setIsFormOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un conducteur
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro de permis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule assigné
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.firstName} {driver.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.licenseNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(driver.licenseExpiry)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.assignedVehicleId ? 
                      vehicles.find(v => v.id === driver.assignedVehicleId)?.licensePlate || '-' 
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[driver.status]}`}>
                      {statusLabels[driver.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleEdit(driver)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <DriverForm
          onSubmit={editingDriver ? handleUpdateDriver : handleNewDriver}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDriver(null);
          }}
          vehicles={vehicles}
          initialData={editingDriver}
        />
      )}
    </div>
  );
}