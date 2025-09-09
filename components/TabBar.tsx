
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { TabName } from '../types';

interface TabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

export default function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const tabs = [
    { name: 'home' as TabName, icon: 'home-outline' as const },
    { name: 'contracts' as TabName, icon: 'document-text-outline' as const },
    { name: 'orders' as TabName, icon: 'receipt-outline' as const },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => onTabPress(tab.name)}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={activeTab === tab.name ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
