
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { commonStyles, colors } from '../styles/commonStyles';
import { TabName } from '../types';
import { useContracts, useOrders } from '../hooks/useData';
import TabBar from '../components/TabBar';
import ContractCard from '../components/ContractCard';
import OrderCard from '../components/OrderCard';
import FloatingActionButton from '../components/FloatingActionButton';
import { router } from 'expo-router';

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const { contracts, loading: contractsLoading } = useContracts();
  const { orders, loading: ordersLoading } = useOrders();

  const handleTabPress = (tab: TabName) => {
    console.log('Tab pressed:', tab);
    setActiveTab(tab);
  };

  const handleContractPress = (contractId: string) => {
    console.log('Contract pressed:', contractId);
    router.push(`/contract/${contractId}`);
  };

  const handleOrderPress = (orderId: string) => {
    console.log('Order pressed:', orderId);
    router.push(`/order/${orderId}`);
  };

  const handleAddPress = () => {
    if (activeTab === 'contracts') {
      router.push('/contract/new');
    } else if (activeTab === 'orders') {
      router.push('/order/new');
    }
  };

  const renderHomeContent = () => {
    const activeContracts = contracts.filter(c => c.status === 'active');
    const pendingOrders = orders.filter(o => o.status === 'pending');
    
    return (
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Affaires SceMECA</Text>
        
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Contrats actifs ({activeContracts.length})</Text>
          {activeContracts.length > 0 ? (
            activeContracts.slice(0, 3).map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onPress={() => handleContractPress(contract.id)}
              />
            ))
          ) : (
            <View style={commonStyles.card}>
              <Text style={commonStyles.textSecondary}>Aucun contrat actif</Text>
            </View>
          )}
        </View>

        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Commandes en attente ({pendingOrders.length})</Text>
          {pendingOrders.length > 0 ? (
            pendingOrders.slice(0, 3).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() => handleOrderPress(order.id)}
              />
            ))
          ) : (
            <View style={commonStyles.card}>
              <Text style={commonStyles.textSecondary}>Aucune commande en attente</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderContractsContent = () => {
    if (contractsLoading) {
      return (
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Contrats ({contracts.length})</Text>
        
        {contracts.length > 0 ? (
          contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onPress={() => handleContractPress(contract.id)}
            />
          ))
        ) : (
          <View style={commonStyles.emptyState}>
            <Text style={commonStyles.emptyStateText}>Aucun contrat</Text>
            <Text style={commonStyles.emptyStateSubtext}>
              Créez votre contrat en appuyant sur le bouton +
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderOrdersContent = () => {
    if (ordersLoading) {
      return (
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Commandes ({orders.length})</Text>
        
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => handleOrderPress(order.id)}
            />
          ))
        ) : (
          <View style={commonStyles.emptyState}>
            <Text style={commonStyles.emptyStateText}>Aucune commande</Text>
            <Text style={commonStyles.emptyStateSubtext}>
              Créez votre commande en appuyant sur le bouton +
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'contracts':
        return renderContractsContent();
      case 'orders':
        return renderOrdersContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <View style={commonStyles.container}>
      {renderContent()}
      
      {(activeTab === 'contracts' || activeTab === 'orders') && (
        <FloatingActionButton onPress={handleAddPress} />
      )}
      
      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
