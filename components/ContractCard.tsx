
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { Contract } from '../types';
import Icon from './Icon';
import { calculateEndDate, formatDate, formatCurrency, formatExecutionDelay } from '../utils/dateUtils';

interface ContractCardProps {
  contract: Contract;
  onPress: () => void;
}

export default function ContractCard({ contract, onPress }: ContractCardProps) {
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

  const getCalculatedEndDate = () => {
    return calculateEndDate(contract.effectiveDate, contract.executionDelay, contract.delayUnit);
  };

  return (
    <TouchableOpacity style={commonStyles.card} onPress={onPress}>
      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <Text style={commonStyles.subtitle}>{contract.title}</Text>
          <Text style={commonStyles.textSecondary}>{contract.client}</Text>
        </View>
        <View style={[commonStyles.badge, getStatusBadgeStyle(contract.status)]}>
          <Text style={commonStyles.badgeText}>{getStatusText(contract.status)}</Text>
        </View>
      </View>
      
      <View style={{ marginTop: 12 }}>
        <View style={commonStyles.rowStart}>
          <Icon name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            Délai: {formatExecutionDelay(contract.executionDelay, contract.delayUnit)}
          </Text>
        </View>
        
        <View style={[commonStyles.rowStart, { marginTop: 4 }]}>
          <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            {formatDate(contract.effectiveDate)} - {formatDate(getCalculatedEndDate())}
          </Text>
        </View>

        <View style={[commonStyles.rowStart, { marginTop: 4 }]}>
          <Icon name="calendar-check-outline" size={16} color={colors.primary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            Fin prévue: <Text style={{ color: colors.primary, fontWeight: '600' }}>{formatDate(getCalculatedEndDate())}</Text>
          </Text>
        </View>
        
        <View style={[commonStyles.rowStart, { marginTop: 4 }]}>
          <Icon name="cash-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>
            {formatCurrency(contract.value)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
