
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { commonStyles, colors } from '../../styles/commonStyles';
import { Order } from '../../types';
import { mockOrders } from '../../data/mockData';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    console.log('Loading order with id:', id);
    if (id && id !== 'new') {
      const foundOrder = mockOrders.find(o => o.id === id);
      setOrder(foundOrder || null);
    }
  }, [id]);

  const handleEdit = () => {
    console.log('Edit order:', id);
    router.push(`/order/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la commande',
      'Êtes-vous sûr de vouloir supprimer cette commande ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            console.log('Delete order:', id);
            router.back();
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'DZD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

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

  if (!order) {
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Commande introuvable</Text>
          <Button
            text="Retour"
            onPress={() => router.back()}
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.row}>
          <Text style={commonStyles.title}>{order.title}</Text>
          <View style={[commonStyles.badge, getStatusBadgeStyle(order.status)]}>
            <Text style={commonStyles.badgeText}>{getStatusText(order.status)}</Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <View style={commonStyles.rowStart}>
            <Icon name="business-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12, fontWeight: '600' }]}>
              {order.client}
            </Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Dates</Text>
          <View style={commonStyles.rowStart}>
            <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12 }]}>
              Commande: {formatDate(order.orderDate)}
            </Text>
          </View>
          {order.deliveryDate && (
            <View style={[commonStyles.rowStart, { marginTop: 8 }]}>
              <Icon name="truck-outline" size={20} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginLeft: 12 }]}>
                Livraison: {formatDate(order.deliveryDate)}
              </Text>
            </View>
          )}
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Articles commandés</Text>
          {order.items.map((item, index) => (
            <View key={item.id} style={[commonStyles.row, { marginTop: index > 0 ? 12 : 8 }]}>
              <View style={{ flex: 1 }}>
                <Text style={commonStyles.text}>{item.name}</Text>
                <Text style={commonStyles.textSecondary}>
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </Text>
              </View>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {formatCurrency(item.totalPrice)}
              </Text>
            </View>
          ))}
          <View style={[commonStyles.row, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>Total</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
              {formatCurrency(order.totalAmount)}
            </Text>
          </View>
        </View>

        {order.notes && (
          <View style={commonStyles.card}>
            <Text style={commonStyles.label}>Notes</Text>
            <Text style={commonStyles.text}>{order.notes}</Text>
          </View>
        )}

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Date de création</Text>
          <Text style={commonStyles.textSecondary}>{formatDate(order.createdAt)}</Text>
        </View>

        <View style={{ marginBottom: 40 }}>
          <Button
            text="Modifier"
            onPress={handleEdit}
            style={{ marginBottom: 12 }}
          />
          <Button
            text="Supprimer"
            onPress={handleDelete}
            style={{ backgroundColor: colors.error }}
          />
        </View>
      </ScrollView>

      <View style={commonStyles.buttonContainer}>
        <Button
          text="Retour"
          onPress={() => router.back()}
          style={{ backgroundColor: colors.backgroundAlt, borderWidth: 1, borderColor: colors.border }}
          textStyle={{ color: colors.text }}
        />
      </View>
    </View>
  );
}
