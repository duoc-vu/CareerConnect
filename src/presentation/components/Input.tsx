import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { theme } from "../../theme/theme";
import { Fonts } from "../../theme/font";

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChangeText }) => {
  return (
    <TextInput
      style={[styles.input, Fonts.regular]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={theme.colors.disabled.light}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.primary.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});

export default Input;
