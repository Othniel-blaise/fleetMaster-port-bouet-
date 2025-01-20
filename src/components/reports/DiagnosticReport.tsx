import React, { useState } from 'react';
import { FileText, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { useStore } from '../../store';
import type { GarageRecord } from '../../types';

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const priorityLabels = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800'
};

const getStatusIcon = (status: GarageRecord['status']) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'approved':
      return CheckCircle;
    case 'rejected':
      return XCircle;
    case 'completed':
      return CheckCircle;
    default:
      return Clock;
  }
};

const statusLabels = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  completed: 'Terminé'
};

export function DiagnosticReport() {
  const { garageRecords, vehicles, updateGarageRecord } = useStore();
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const handleCustomerDecision = (recordId: string, approved: boolean, notes?: string) => {
    updateGarageRecord(recordId, {
      status: approved ? 'approved' : 'rejected',
      customerDecision: {
        date: new Date(),
        approved,
        notes
      }
    });
  };

  const calculateTotalCost = (record: GarageRecord) => {
    // Calculer le coût des réparations
    const repairsCost = (record.repairs || []).reduce((total, repair) => {
      // Coût de la main d'œuvre
      const laborCost = (repair.laborHours || 0) * (record.laborCost?.ratePerHour || 60);
      
      // Coût des pièces
      const partsCost = repair.parts.reduce((sum, part) => {
        return sum + (part.quantity * part.unitPrice);
      }, 0);

      return total + laborCost + partsCost + (repair.cost || 0);
    }, 0);

    // Ajouter les coûts additionnels si présents
    const additionalCosts = record.cost || 0;

    return repairsCost + additionalCosts;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : 'Véhicule inconnu';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Rapports de diagnostic</h2>
        </div>
      </div>

      <div className="grid gap-6">
        {garageRecords.map((record) => {
          const StatusIcon = getStatusIcon(record.status);
          const isExpanded = selectedRecord === record.id;
          const totalCost = calculateTotalCost(record);

          return (
            <div key={record.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 cursor-pointer hover:bg-gray-50" onClick={() => setSelectedRecord(isExpanded ? null : record.id)}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[record.status]}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {statusLabels[record.status]}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[record.priority]}`}>
                        {priorityLabels[record.priority]}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      {getVehicleInfo(record.vehicleId)}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Client: {record.customerInfo.name}
                      {record.customerInfo.isPartner && record.customerInfo.companyName && 
                        ` (${record.customerInfo.companyName})`
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {record.diagnosticDate ? formatDate(record.diagnosticDate) : 'Date non spécifiée'}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                    </p>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-6 space-y-6">
                  {/* État du véhicule */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">État du véhicule</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Kilométrage</p>
                        <p className="text-sm font-medium text-gray-900">
                          {record.vehicleCondition.mileage.toLocaleString()} km
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Niveau de carburant</p>
                        <p className="text-sm font-medium text-gray-900">
                          {record.vehicleCondition.fuelLevel}%
                        </p>
                      </div>
                    </div>
                    {record.vehicleCondition.exteriorDamage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">État extérieur</p>
                        <p className="text-sm text-gray-900">{record.vehicleCondition.exteriorDamage}</p>
                      </div>
                    )}
                  </div>

                  {/* Problèmes signalés */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Problèmes signalés</h4>
                    <ul className="space-y-2">
                      {record.vehicleCondition.customerComplaints.map((complaint, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{complaint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Détail des coûts */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Détail des coûts</h4>
                    {record.repairs && record.repairs.map((repair, index) => {
                      const laborCost = (repair.laborHours || 0) * (record.laborCost?.ratePerHour || 60);
                      const partsCost = repair.parts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0);
                      const repairTotal = laborCost + partsCost + (repair.cost || 0);

                      return (
                        <div key={index} className="mb-4 last:mb-0">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{repair.description}</span>
                            <span className="font-medium">{repairTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                          </div>
                          <div className="ml-4 text-xs text-gray-500">
                            <div>Main d'œuvre: {laborCost.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</div>
                            <div>Pièces: {partsCost.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</div>
                            {repair.cost > 0 && (
                              <div>Autres coûts: {repair.cost.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Total estimé</h4>
                          <p className="text-2xl font-semibold text-gray-900 mt-1">
                            {totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                          </p>
                        </div>
                        {record.status === 'pending' && (
                          <div className="space-x-3">
                            <button
                              onClick={() => handleCustomerDecision(record.id, false)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <XCircle className="h-4 w-4 mr-2 text-red-500" />
                              Refuser
                            </button>
                            <button
                              onClick={() => handleCustomerDecision(record.id, true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Décision client */}
                  {record.customerDecision && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Décision client</h4>
                      <div className="flex items-center space-x-2">
                        {record.customerDecision.approved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="text-sm text-gray-600">
                          {record.customerDecision.approved ? 'Approuvé' : 'Refusé'} le {formatDate(record.customerDecision.date)}
                        </span>
                      </div>
                      {record.customerDecision.notes && (
                        <p className="mt-2 text-sm text-gray-600">{record.customerDecision.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}