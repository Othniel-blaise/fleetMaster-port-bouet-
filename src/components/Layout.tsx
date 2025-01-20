import React, { useState } from 'react';
import { LayoutGrid, Car, Users, Calendar, Settings, BarChart2, FileText, Wrench, Users2, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export function Layout({ children, onTabChange, activeTab }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const NavItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <button
      onClick={() => {
        onTabChange(value);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#2d3545] rounded-lg group transition-colors ${
        activeTab === value ? 'bg-[#2d3545]' : ''
      }`}
    >
      <Icon className={`h-5 w-5 ${activeTab === value ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-[#1a1f2b] text-gray-300"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64 bg-[#1a1f2b] text-gray-300 flex flex-col fixed h-full transition-transform duration-200 ease-in-out z-40`}>
        {/* Logo */}
        <div className="p-6 flex items-center space-x-3">
          <Car className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-semibold text-white">FleetMaster</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavItem icon={LayoutGrid} label="Tableau de bord" value="dashboard" />
          <NavItem icon={Calendar} label="Réservations" value="reservations" />
          <NavItem icon={Car} label="Véhicules" value="vehicles" />
          <NavItem icon={Users} label="Conducteurs" value="drivers" />
          <NavItem icon={Wrench} label="Garage" value="garage" />
          <NavItem icon={FileText} label="Rapports" value="reports" />
          {/* <NavItem icon={Users2} label="Partenaires" value="#" /> */}
          <NavItem icon={BarChart2} label="Analytique" value="analytics" />
          {/* <NavItem icon={Settings} label="Paramètres" value="#" /> */}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-300 hover:bg-[#2d3545] rounded-lg group transition-colors"
          >
            <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 bg-gray-100 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}