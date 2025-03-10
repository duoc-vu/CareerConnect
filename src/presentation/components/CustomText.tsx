import React from "react";
import { Text, StyleSheet } from "react-native";
import { Fonts } from "../../theme/font";

interface TextProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void; 
}

const CustomText: React.FC<TextProps> = ({ children, style, onPress }) => {
  return <Text style={[styles.text, style]} onPress={onPress}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "#000",
  },
});

export default CustomText;
