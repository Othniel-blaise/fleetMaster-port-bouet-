import { create } from 'zustand';

interface AuthState {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'user';
    firstName: string;
    lastName: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    // Pour se connecter en tant qu'administrateur, utiliser :
    // email: admin@fleetmaster.com
    // password: admin123
    if (email === 'admin@fleetmaster.com' && password === 'admin123') {
      set({
        user: {
          id: 'admin-1',
          email: email,
          role: 'admin',
          firstName: 'Admin',
          lastName: 'FleetMaster'
        }
      });
    } else {
      // Connexion utilisateur standard
      set({
        user: {
          id: 'user-1',
          email: email,
          role: 'user',
          firstName: 'Utilisateur',
          lastName: 'Standard'
        }
      });
    }
  },
  logout: () => set({ user: null })
}));