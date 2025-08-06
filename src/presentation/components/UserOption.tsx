import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../theme/theme";  

interface UserType {
  selected: any;
  onSelect: (value: any) => void;
}

const UserOption: React.FC<UserType> = ({ selected, onSelect }) => {
  const basicIcon = <Text style={{ fontSize: 20 }}>👨‍💼</Text>; 
  const completeIcon = <Text style={{ fontSize: 20 }}>🏢</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, selected == 1 && styles.selectedButton, selected !== 1 && styles.deselectedButton]} 
        onPress={() => onSelect(1)}
      >
        <View style={styles.iconContainer}>
          {basicIcon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, selected === 1 && styles.selectedText]}>
            Ứng viên
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, selected === 2 && styles.selectedButton, selected !== 2 && styles.deselectedButton]} 
        onPress={() => onSelect(2)}
      >
        <View style={styles.iconContainer}>
          {completeIcon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, selected === 2 && styles.selectedText]}>
            Doanh nghiệp
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: theme.colors.primary.light,
    borderRadius: 8,
    marginRight: 10,
    width: '48%', 
    justifyContent: 'center',
    opacity: 1,  
  },
  deselectedButton: {
    opacity: 0.5, 
  },
  selectedButton: {
    borderColor: theme.colors.primary.selected,
    borderWidth: 2
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  selectedText: {
    color: theme.colors.primary.selected,
  },
});

export default UserOption;
