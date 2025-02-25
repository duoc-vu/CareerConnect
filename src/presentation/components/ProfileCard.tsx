import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '../../theme/font';
import { useTheme } from '../../theme/themeContext';

interface ProfileCardProps {
  title: string;
  details: { label: string; value: string }[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ title, details }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: theme.bG }]}>
      <Text style={[styles.title, Fonts.semiBold, { color: theme.primary }]}>{title}</Text>
      {details.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={[styles.label, Fonts.medium, { color: theme.onPrimary }]}>{item.label}:</Text>
          <Text style={[styles.value, Fonts.regular, { color: theme.surface }]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
  },
});

export default ProfileCard;
