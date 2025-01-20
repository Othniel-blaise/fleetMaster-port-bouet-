import React, { useState } from 'react';
import { Car, Users, Calendar } from 'lucide-react';
import { Layout } from './components/Layout';
import { VehicleList } from './components/vehicles/VehicleList';
import { DriverList } from './components/drivers/DriverList';
import { ReservationList } from './components/reservations/ReservationList';
import { GarageList } from './components/garage/GarageList';
// import { Statistics } from './components/dashboard/Statistics';
import { SearchFilters } from './components/filters/SearchFilters';
import { LoginForm } from './components/auth/LoginForm';
import { useAutoStatusUpdate } from './hooks/useAutoStatusUpdate';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { DiagnosticReport } from './components/reports/DiagnosticReport';
import { useStore } from './store';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { vehicles, drivers, reservations } = useStore();
  const { user } = useAuth();

  // Utiliser le hook de mise à jour automatique
  useAutoStatusUpdate();

  if (!user) {
    return <LoginForm />;
  }

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // TODO: Implement search functionality
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    // TODO: Apply filters to the data
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'vehicles':
        return (
          <>
            <SearchFilters
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              filters={filters}
            />
            <VehicleList />
          </>
        );
      case 'drivers':
        return (
          <>
            <SearchFilters
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              filters={filters}
            />
            <DriverList />
          </>
        );
      case 'reservations':
        return (
          <>
            <SearchFilters
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              filters={filters}
            />
            <ReservationList />
          </>
        );
      case 'garage':
        return <GarageList />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'reports':
        return <DiagnosticReport />;
      case 'dashboard':
      default:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Car className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Total Véhicules</h2>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">{vehicles.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Conducteurs Actifs</h2>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                      {drivers.filter(d => d.status === 'on_duty').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">Réservations en attente</h2>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                      {reservations.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* <Statistics /> */}
            <div className="mt-6 sm:mt-8">
              <ReservationList />
            </div>
          </>
        );
    }
  };

  return (
    <Layout onTabChange={setActiveTab} activeTab={activeTab}>
      {renderContent()}
    </Layout>
  );
}