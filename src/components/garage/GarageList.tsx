import React, { useState } from 'react';
import { Plus, Wrench, MoreVertical, CheckCircle, XCircle, Clock, PenTool as Tool, Calendar } from 'lucide-react';
import type { GarageRecord, MaintenanceSchedule } from '../../types';
import { GarageForm } from './GarageForm';
import { useStore } from '../../store';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  waiting_parts: 'bg-orange-100 text-orange-800'
};

const statusLabels = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  completed: 'Terminé',
  in_progress: 'En cours',
  waiting_parts: 'En attente de pièces'
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

export function GarageList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'diagnostic' | 'repair' | 'maintenance'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const { garageRecords, vehicles, maintenanceSchedules, addGarageRecord, updateGarageRecord } = useStore();

  const handleNewRecord = (data: Omit<GarageRecord, 'id' | 'status' | 'completedDate'>) => {
    addGarageRecord({
      ...data,
      status: 'pending',
      laborCost: {
        hours: 0,
        ratePerHour: 60,
        total: 0
      },
      partsCost: {
        subtotal: 0,
        tax: 0,
        total: 0
      }
    });
    setIsFormOpen(false);
  };

  const handleStatusChange = (recordId: string, newStatus: GarageRecord['status']) => {
    updateGarageRecord(recordId, { 
      status: newStatus,
      completedDate: newStatus === 'completed' ? new Date() : undefined
    });
    setOpenMenuId(null);
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : 'Véhicule inconnu';
  };

  const calculateTotalCost = (record: GarageRecord) => {
    const laborTotal = record.laborCost?.total || 0;
    const partsTotal = record.partsCost?.total || 0;
    return laborTotal + partsTotal;
  };

  const filteredRecords = garageRecords.filter(record => {
    if (filterType !== 'all' && record.type !== filterType) return false;
    if (filterStatus !== 'all' && record.status !== filterStatus) return false;
    return true;
  });

  const getMaintenanceInfo = (vehicleId: string) => {
    return maintenanceSchedules
      .filter(schedule => schedule.vehicleId === vehicleId && schedule.status === 'pending')
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Wrench className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Garage</h2>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle intervention
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tous les types</option>
          <option value="diagnostic">Diagnostic</option>
          <option value="repair">Réparation</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="waiting_parts">En attente de pièces</option>
          <option value="completed">Terminé</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    {record.type === 'diagnostic' && <Tool className="h-5 w-5 text-blue-500" />}
                    {record.type === 'repair' && <Wrench className="h-5 w-5 text-orange-500" />}
                    {record.type === 'maintenance' && <Calendar className="h-5 w-5 text-green-500" />}
                    <h3 className="text-lg font-medium text-gray-900">
                      {getVehicleInfo(record.vehicleId)}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{record.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[record.status]}`}>
                    {statusLabels[record.status]}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[record.priority]}`}>
                    {record.priority === 'low' ? 'Basse' : record.priority === 'medium' ? 'Moyenne' : 'Haute'}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Client</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {record.customerInfo.name}
                    {record.customerInfo.isPartner && record.customerInfo.companyName && 
                      ` (${record.customerInfo.companyName})`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="mt-1 text-sm text-gray-900">{record.customerInfo.phone}</p>
                </div>
              </div>

              {record.repairs && record.repairs.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Réparations</h4>
                  <div className="space-y-2">
                    {record.repairs.map((repair, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{repair.description}</p>
                            <p className="text-sm text-gray-500">
                              {repair.laborHours}h - {repair.parts.length} pièce(s)
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[repair.status]}`}>
                            {statusLabels[repair.status]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Coût total estimé</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {calculateTotalCost(record).toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'XOF' 
                      })}
                    </p>
                  </div>
                  {record.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(record.id, 'in_progress')}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Démarrer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <GarageForm
          onSubmit={handleNewRecord}
          onClose={() => setIsFormOpen(false)}
          vehicles={vehicles}
        />
      )}
    </div>
  );
}