// Ajouter les nouvelles interfaces pour la gestion des pièces
export interface SparePart {
  id: string;
  reference: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  price: {
    purchase: number;
    retail: number;
  };
  stock: {
    current: number;
    minimum: number;
    optimal: number;
    location: string;
  };
  compatibility: {
    brands: string[];
    models: string[];
    years: {
      from: number;
      to: number;
    };
  };
  supplier: {
    id: string;
    name: string;
    reference: string;
    leadTime: number;
  };
  status: 'available' | 'low_stock' | 'out_of_stock' | 'discontinued';
  history: {
    purchases: {
      date: Date;
      quantity: number;
      unitPrice: number;
      supplierId: string;
    }[];
    usage: {
      date: Date;
      quantity: number;
      repairId: string;
      vehicleId: string;
    }[];
  };
  metrics: {
    turnoverRate: number;
    averageDemand: number;
    lastRestockDate: Date;
    lastUsageDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PartInventoryMovement {
  id: string;
  partId: string;
  type: 'in' | 'out';
  quantity: number;
  date: Date;
  reason: 'purchase' | 'repair' | 'return' | 'adjustment' | 'loss';
  reference: string;
  price: number;
  userId: string;
  notes?: string;
}

// Mettre à jour l'interface RepairItem pour inclure plus de détails sur les pièces
export interface RepairItem {
  id: string;
  description: string;
  cost: number;
  laborHours: number;
  parts: {
    partId: string;
    quantity: number;
    unitPrice: number;
    status: 'pending' | 'reserved' | 'used' | 'returned';
    reservationDate?: Date;
    usageDate?: Date;
  }[];
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'waiting_parts' | 'completed';
}