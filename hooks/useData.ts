
import { useState, useEffect } from 'react';
import { Contract, Order } from '../types';
import { mockContracts, mockOrders } from '../data/mockData';

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContracts(mockContracts);
      setLoading(false);
    }, 500);
  }, []);

  const addContract = (contract: Omit<Contract, 'id' | 'createdAt'>) => {
    const newContract: Contract = {
      ...contract,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContracts(prev => [newContract, ...prev]);
    console.log('Contract added:', newContract);
  };

  const updateContract = (id: string, updates: Partial<Contract>) => {
    setContracts(prev => prev.map(contract => 
      contract.id === id ? { ...contract, ...updates } : contract
    ));
    console.log('Contract updated:', id, updates);
  };

  const deleteContract = (id: string) => {
    setContracts(prev => prev.filter(contract => contract.id !== id));
    console.log('Contract deleted:', id);
  };

  return {
    contracts,
    loading,
    addContract,
    updateContract,
    deleteContract,
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrders(prev => [newOrder, ...prev]);
    console.log('Order added:', newOrder);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
    console.log('Order updated:', id, updates);
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
    console.log('Order deleted:', id);
  };

  return {
    orders,
    loading,
    addOrder,
    updateOrder,
    deleteOrder,
  };
}
