import React, { useState } from 'react';
import { Plus, Star, MapPin, Phone, Mail, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';
import { useStore } from '../../store';
import { PartnerGarageForm } from './PartnerGarageForm';
import { PerformanceMetrics } from './PerformanceMetrics';
import type { PartnerGarage } from '../../types';

export function PartnerGarageList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedGarage, setExpandedGarage] = useState<string | null>(null);
  const [showMetrics, setShowMetrics] = useState<string | null>(null);
  const { partnerGarages, garagePerformance } = useStore();

  const toggleExpand = (id: string) => {
    setExpandedGarage(expandedGarage === id ? null : id);
    setShowMetrics(null);
  };

  const toggleMetrics = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMetrics(showMetrics === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Garages Partenaires</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un garage
        </button>
      </div>

      <div className="grid gap-6">
        {partnerGarages.map((garage) => (
          <div
            key={garage.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => toggleExpand(garage.id)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">{garage.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      garage.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {garage.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{garage.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="text-sm">{garage.contact.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <span className="text-sm">{garage.contact.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < garage.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({garage.metrics.customerSatisfaction.toFixed(1)}/5)
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => toggleMetrics(garage.id, e)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <BarChart2 className="h-5 w-5" />
                  </button>
                  {expandedGarage === garage.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedGarage === garage.id && (
                <div className="mt-6 border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Spécialités</h4>
                      <div className="flex flex-wrap gap-2">
                        {garage.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Services</h4>
                      <div className="space-y-2">
                        {garage.services.map((service, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{service.type}</span>
                            <span className="font-medium">
                              {service.price.toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Horaires</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(garage.availability).map(([day, hours]) => (
                          hours && (
                            <div key={day} className="flex justify-between">
                              <span className="capitalize">{day}</span>
                              <span>{hours.start} - {hours.end}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
                      <div className="space-y-2">
                        {garage.certifications.map((cert, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium">{cert.name}</div>
                            <div className="text-gray-500">
                              Délivré par {cert.issuedBy}
                              <br />
                              Expire le {cert.expiryDate.toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showMetrics === garage.id && (
                <PerformanceMetrics
                  garage={garage}
                  performance={garagePerformance.find(p => p.garageId === garage.id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <PartnerGarageForm
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}