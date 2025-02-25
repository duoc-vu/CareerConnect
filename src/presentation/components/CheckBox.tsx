import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme/theme';

interface CheckBoxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({ label, checked, onToggle }) => {
  return (
    <Pressable onPress={onToggle} style={[styles.container, checked && styles.containerChecked]}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.checkmark}>✔</Text>}
      </View>
      <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary.light,
    marginBottom: 10,
  },
  containerChecked: {
    backgroundColor: theme.colors.primary.light + '10', // Màu có opacity
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: theme.colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  boxChecked: {
    backgroundColor: theme.colors.primary.light,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  labelChecked: {
    color: theme.colors.primary.light,
    fontWeight: '600',
  },
});

export default CheckBox;
