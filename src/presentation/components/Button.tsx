import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Fonts } from "../../theme/font";
import { theme } from "../../theme//theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, Fonts.semiBold, style]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary.light,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: theme.colors.disabled.light,
  },
  text: {
    color: theme.colors.onPrimary.light,
    fontSize: 16,
  },
});

export default Button;
