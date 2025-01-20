import React, { useState } from 'react';
import { Plus, CheckCircle, XCircle, Clock, Filter, AlertTriangle } from 'lucide-react';
import type { Reservation } from '../../types';
import { ReservationForm } from './ReservationForm';
import { useStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800'
} as const;

const statusLabels = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Rejetée',
  completed: 'Terminée'
} as const;

export function ReservationList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | Reservation['status']>('all');
  const { reservations, vehicles, drivers, addReservation, updateReservation } = useStore();
  const { user } = useAuth();

  const isValidator = user?.role === 'admin';

  const handleNewReservation = (data: Omit<Reservation, 'id' | 'status'>) => {
    addReservation({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: 'pending'
    });
    setIsFormOpen(false);
  };

  const handleValidation = (id: string, approved: boolean) => {
    if (!isValidator) return;
    
    updateReservation(id, {
      status: approved ? 'approved' : 'rejected',
      validatedBy: {
        userId: user?.id || '',
        name: `${user?.firstName} ${user?.lastName}`,
        date: new Date()
      }
    });
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'Conducteur inconnu';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Véhicule inconnu';
  };

  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) {
      return 'Date invalide';
    }
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReservations = reservations.filter(
    reservation => filterStatus === 'all' || reservation.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {isValidator && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Mode Valideur - Vous pouvez approuver ou refuser les réservations en attente
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {isValidator ? 'Validation des Réservations' : 'Réservations'}
              </h2>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvées</option>
                  <option value="rejected">Rejetées</option>
                  <option value="completed">Terminées</option>
                </select>
              </div>
            </div>
            {!isValidator && (
              <button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle réservation
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conducteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  {isValidator && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getDriverName(reservation.driverId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getVehicleInfo(reservation.vehicleId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(reservation.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(reservation.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                          {reservation.status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
                          {reservation.status === 'approved' && <CheckCircle className="w-4 h-4 mr-1" />}
                          {reservation.status === 'rejected' && <XCircle className="w-4 h-4 mr-1" />}
                          {reservation.status === 'completed' && <CheckCircle className="w-4 h-4 mr-1" />}
                          {statusLabels[reservation.status]}
                        </span>
                        {reservation.validatedBy && (
                          <p className="mt-1 text-xs text-gray-500">
                            Validé par {reservation.validatedBy.name}
                            <br />
                            le {formatDate(reservation.validatedBy.date)}
                          </p>
                        )}
                      </div>
                    </td>
                    {isValidator && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleValidation(reservation.id, true)}
                              className="inline-flex items-center p-1 text-green-600 hover:text-green-800"
                              title="Approuver"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleValidation(reservation.id, false)}
                              className="inline-flex items-center p-1 text-red-600 hover:text-red-800"
                              title="Refuser"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!isValidator && isFormOpen && (
        <ReservationForm
          onSubmit={handleNewReservation}
          onClose={() => setIsFormOpen(false)}
          vehicles={vehicles}
          drivers={drivers}
        />
      )}
    </div>
  );
}