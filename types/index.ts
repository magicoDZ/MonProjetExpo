
export interface Contract {
  id: string;
  title: string;
  client: string;
  effectiveDate: string;
  value: number;
  status: 'active' | 'pending' | 'expired';
  description: string;
  terms: string;
  executionDelay: number;
  delayUnit: 'months' | 'weeks';
  createdAt: string;
}

export interface Order {
  id: string;
  contractId?: string;
  title: string;
  client: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  notes: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type TabName = 'home' | 'contracts' | 'orders';
