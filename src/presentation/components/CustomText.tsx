import React from "react";
import { Text, StyleSheet } from "react-native";
import { Fonts } from "../../theme/font";

interface TextProps {
  children: React.ReactNode;
  style?: any;
}

const CustomText: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "#000",
  },
});

export default CustomText;
