
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { Order } from '../types';
import Icon from './Icon';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const getStatusBadgeStyle = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return commonStyles.badgeActive;
      case 'pending':
        return commonStyles.badgePending;
      case 'delivered':
        return { backgroundColor: colors.success };
      case 'cancelled':
        return commonStyles.badgeExpired;
      default:
        return commonStyles.badgePending;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'En attente';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <TouchableOpacity style={commonStyles.card} onPress={onPress}>
      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <Text style={commonStyles.subtitle}>{order.title}</Text>
          <Text style={commonStyles.textSecondary}>{order.client}</Text>
        </View>
        <View style={[commonStyles.badge, getStatusBadgeStyle(order.status)]}>
          <Text style={commonStyles.badgeText}>{getStatusText(order.status)}</Text>
        </View>
      </View>
      
      <View style={{ marginTop: 12 }}>
        <View style={commonStyles.rowStart}>
          <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            Commande: {formatDate(order.orderDate)}
          </Text>
        </View>
        
        {order.deliveryDate && (
          <View style={[commonStyles.rowStart, { marginTop: 4 }]}>
            <Icon name="truck-outline" size={16} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
              Livraison: {formatDate(order.deliveryDate)}
            </Text>
          </View>
        )}
        
        <View style={[commonStyles.rowStart, { marginTop: 8 }]}>
          <Icon name="cash-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>
            {formatCurrency(order.totalAmount)}
          </Text>
        </View>
        
        <View style={[commonStyles.rowStart, { marginTop: 4 }]}>
          <Icon name="list-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            {order.items.length} article{order.items.length > 1 ? 's' : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
