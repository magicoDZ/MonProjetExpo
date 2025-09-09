
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { commonStyles, colors } from '../../styles/commonStyles';
import { Contract } from '../../types';
import { mockContracts } from '../../data/mockData';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { calculateEndDate, formatDate, formatCurrency, formatExecutionDelay } from '../../utils/dateUtils';

export default function ContractDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    console.log('Loading contract with id:', id);
    if (id && id !== 'new') {
      const foundContract = mockContracts.find(c => c.id === id);
      setContract(foundContract || null);
    }
  }, [id]);

  const handleEdit = () => {
    console.log('Edit contract:', id);
    router.push(`/contract/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le contrat',
      'Êtes-vous sûr de vouloir supprimer ce contrat ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            console.log('Delete contract:', id);
            router.back();
          },
        },
      ]
    );
  };

  const getStatusBadgeStyle = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return commonStyles.badgeActive;
      case 'pending':
        return commonStyles.badgePending;
      case 'expired':
        return commonStyles.badgeExpired;
      default:
        return commonStyles.badgePending;
    }
  };

  const getStatusText = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'pending':
        return 'En attente';
      case 'expired':
        return 'Expiré';
      default:
        return 'En attente';
    }
  };

  const getCalculatedEndDate = (contract: Contract) => {
    return calculateEndDate(contract.effectiveDate, contract.executionDelay, contract.delayUnit);
  };

  if (!contract) {
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Contrat introuvable</Text>
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
          <Text style={commonStyles.title}>{contract.title}</Text>
          <View style={[commonStyles.badge, getStatusBadgeStyle(contract.status)]}>
            <Text style={commonStyles.badgeText}>{getStatusText(contract.status)}</Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <View style={commonStyles.rowStart}>
            <Icon name="business-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12, fontWeight: '600' }]}>
              {contract.client}
            </Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Délai d'exécution</Text>
          <View style={commonStyles.rowStart}>
            <Icon name="time-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12, fontWeight: '600' }]}>
              {formatExecutionDelay(contract.executionDelay, contract.delayUnit)}
            </Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Période</Text>
          <View style={commonStyles.rowStart}>
            <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12 }]}>
              Du {formatDate(contract.effectiveDate)} au {formatDate(getCalculatedEndDate(contract))}
            </Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Date de fin prévue</Text>
          <View style={commonStyles.rowStart}>
            <Icon name="calendar-outline" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 12, fontWeight: '600', color: colors.primary }]}>
              {formatDate(getCalculatedEndDate(contract))}
            </Text>
          </View>
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
            Calculée à partir de la date d'entrée en vigueur + délai d'exécution
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Valeur du contrat</Text>
          <View style={commonStyles.rowStart}>
            <Icon name="cash-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12, fontWeight: '600', fontSize: 18 }]}>
              {formatCurrency(contract.value)}
            </Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Description</Text>
          <Text style={commonStyles.text}>{contract.description}</Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Conditions</Text>
          <Text style={commonStyles.text}>{contract.terms}</Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.label}>Date de création</Text>
          <Text style={commonStyles.textSecondary}>{formatDate(contract.createdAt)}</Text>
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
