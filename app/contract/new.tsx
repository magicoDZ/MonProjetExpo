
import { View, Text, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Button from '../../components/Button';
import { calculateEndDate, formatDate } from '../../utils/dateUtils';

export default function NewContractScreen() {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [executionDelay, setExecutionDelay] = useState('');
  const [delayUnit, setDelayUnit] = useState<'months' | 'weeks'>('months');

  const getCalculatedEndDate = () => {
    if (effectiveDate && executionDelay) {
      try {
        return calculateEndDate(effectiveDate, parseInt(executionDelay), delayUnit);
      } catch (error) {
        console.log('Error calculating end date:', error);
        return '';
      }
    }
    return '';
  };

  const handleSave = () => {
    if (!title.trim() || !client.trim() || !effectiveDate.trim() || !value.trim() || !executionDelay.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const contractData = {
      title: title.trim(),
      client: client.trim(),
      effectiveDate: effectiveDate.trim(),
      value: parseFloat(value),
      status: 'pending' as const,
      description: description.trim(),
      terms: terms.trim(),
      executionDelay: parseInt(executionDelay),
      delayUnit,
    };

    console.log('Creating new contract:', contractData);
    console.log('Calculated end date:', getCalculatedEndDate());
    
    Alert.alert(
      'Succès',
      'Le contrat a été créé avec succès.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Nouveau contrat</Text>

        <View style={commonStyles.section}>
          <Text style={commonStyles.label}>Titre *</Text>
          <TextInput
            style={commonStyles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Nom du contrat"
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

          <Text style={commonStyles.label}>Date d'entrée en vigueur *</Text>
          <TextInput
            style={commonStyles.input}
            value={effectiveDate}
            onChangeText={setEffectiveDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={commonStyles.label}>Délai d'exécution *</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TextInput
              style={[commonStyles.input, { flex: 1, marginRight: 12, marginBottom: 0 }]}
              value={executionDelay}
              onChangeText={setExecutionDelay}
              placeholder="Nombre"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={[
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                  delayUnit === 'months' && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setDelayUnit('months')}
              >
                <Text style={[
                  { color: colors.text, fontSize: 14 },
                  delayUnit === 'months' && { color: 'white' }
                ]}>
                  Mois
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                  delayUnit === 'weeks' && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setDelayUnit('weeks')}
              >
                <Text style={[
                  { color: colors.text, fontSize: 14 },
                  delayUnit === 'weeks' && { color: 'white' }
                ]}>
                  Semaines
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {getCalculatedEndDate() && (
            <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, marginBottom: 16 }]}>
              <Text style={commonStyles.label}>Date de fin prévue (calculée)</Text>
              <Text style={[commonStyles.text, { fontWeight: '600', color: colors.primary }]}>
                {formatDate(getCalculatedEndDate())}
              </Text>
            </View>
          )}

          <Text style={commonStyles.label}>Valeur (€) *</Text>
          <TextInput
            style={commonStyles.input}
            value={value}
            onChangeText={setValue}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />

          <Text style={commonStyles.label}>Description</Text>
          <TextInput
            style={commonStyles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Description du contrat"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />

          <Text style={commonStyles.label}>Conditions</Text>
          <TextInput
            style={commonStyles.textArea}
            value={terms}
            onChangeText={setTerms}
            placeholder="Conditions du contrat"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={{ marginBottom: 40 }}>
          <Button
            text="Créer le contrat"
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
