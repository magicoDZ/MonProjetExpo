
import { View, Text, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { OrderItem } from '../../types';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function NewOrderScreen() {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', name: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ]);

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'DA',
    }).format(amount);
  };

  const handleSave = () => {
    if (!title.trim() || !client.trim() || !orderDate.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const validItems = items.filter(item => item.name.trim() && item.quantity > 0 && item.unitPrice > 0);
    
    if (validItems.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins un article valide.');
      return;
    }

    const orderData = {
      title: title.trim(),
      client: client.trim(),
      orderDate: orderDate.trim(),
      deliveryDate: deliveryDate.trim() || undefined,
      notes: notes.trim(),
      items: validItems,
      totalAmount: getTotalAmount(),
      status: 'pending' as const,
    };

    console.log('Creating new order:', orderData);
    
    Alert.alert(
      'Succès',
      'La commande a été créée avec succès.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Nouvelle commande</Text>

        <View style={commonStyles.section}>
          <Text style={commonStyles.label}>Titre *</Text>
          <TextInput
            style={commonStyles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Nom de la commande"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={commonStyles.label}>Client *</Text>
          <TextInput
            style={commonStyles.input}
            value={client}
            onChangeText={setClient}
            placeholder="Nom du client"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={commonStyles.label}>Date de commande *</Text>
          <TextInput
            style={commonStyles.input}
            value={orderDate}
            onChangeText={setOrderDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={commonStyles.label}>Date de livraison</Text>
          <TextInput
            style={commonStyles.input}
            value={deliveryDate}
            onChangeText={setDeliveryDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={commonStyles.label}>Articles</Text>
          {items.map((item, index) => (
            <View key={item.id} style={commonStyles.card}>
              <View style={commonStyles.row}>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>Article {index + 1}</Text>
                {items.length > 1 && (
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    <Icon name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
              
              <TextInput
                style={commonStyles.input}
                value={item.name}
                onChangeText={(value) => updateItem(index, 'name', value)}
                placeholder="Nom de l'article"
                placeholderTextColor={colors.textSecondary}
              />
              
              <View style={commonStyles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={commonStyles.label}>Quantité</Text>
                  <TextInput
                    style={commonStyles.input}
                    value={item.quantity.toString()}
                    onChangeText={(value) => updateItem(index, 'quantity', parseInt(value) || 0)}
                    placeholder="1"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={commonStyles.label}>Prix unitaire (€)</Text>
                  <TextInput
                    style={commonStyles.input}
                    value={item.unitPrice.toString()}
                    onChangeText={(value) => updateItem(index, 'unitPrice', parseFloat(value) || 0)}
                    placeholder="0.00"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={commonStyles.row}>
                <Text style={commonStyles.label}>Total</Text>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {formatCurrency(item.totalPrice)}
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={[commonStyles.card, { alignItems: 'center' }]} onPress={addItem}>
            <View style={commonStyles.rowStart}>
              <Icon name="add-outline" size={20} color={colors.primary} />
              <Text style={[commonStyles.text, { marginLeft: 8, color: colors.primary }]}>
                Ajouter un article
              </Text>
            </View>
          </TouchableOpacity>

          <View style={commonStyles.card}>
            <View style={commonStyles.row}>
              <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
                Total de la commande
              </Text>
              <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
                {formatCurrency(getTotalAmount())}
              </Text>
            </View>
          </View>

          <Text style={commonStyles.label}>Notes</Text>
          <TextInput
            style={commonStyles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes sur la commande"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={{ marginBottom: 40 }}>
          <Button
            text="Créer la commande"
            onPress={handleSave}
            style={{ marginBottom: 12 }}
          />
        </View>
      </ScrollView>

      <View style={commonStyles.buttonContainer}>
        <Button
          text="Annuler"
          onPress={() => router.back()}
          style={{ backgroundColor: colors.backgroundAlt, borderWidth: 1, borderColor: colors.border }}
          textStyle={{ color: colors.text }}
        />
      </View>
    </View>
  );
}
