
// Calculate the end date based on effectiveDate and executionDelay
export const calculateEndDate = (effectiveDate: string, executionDelay: number, delayUnit: 'months' | 'weeks'): string => {
  const startDate = new Date(effectiveDate);
  const endDate = new Date(startDate);
  
  if (delayUnit === 'months') {
    endDate.setMonth(endDate.getMonth() + executionDelay);
  } else {
    endDate.setDate(endDate.getDate() + executionDelay * 7); // 7 days per week
  }
  
  return endDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'DZD',
  }).format(amount);
};

export const formatExecutionDelay = (delay: number, unit: 'months' | 'weeks') => {
  const unitText = unit === 'months' ? (delay > 1 ? 'mois' : 'mois') : (delay > 1 ? 'semaines' : 'semaine');
  return `${delay} ${unitText}`;
};
