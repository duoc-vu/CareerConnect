import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { theme } from "../../theme/theme";

const SearchBar = ({ value, onChangeText }: any) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm..."
        placeholderTextColor={theme.colors.disabled.light}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.light,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  input: {
    height: 40,
    fontSize: 16,
  },
});

export default SearchBar;
