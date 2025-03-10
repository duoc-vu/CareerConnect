import React from "react";
import { TextInput, StyleProp, StyleSheet, TextStyle } from "react-native";
import { theme } from "../../theme/theme";
import { Fonts } from "../../theme/font";

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: StyleProp<TextStyle>;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChangeText, style, secureTextEntry = false  }) => {
  return (
    <TextInput
      style={[styles.input, Fonts.regular, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={theme.colors.placeholder.light}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.primary.dark,
    borderRadius: 8,
    paddingHorizontal: 12,
    textAlignVertical: 'center', 
  },
});

export default Input;
