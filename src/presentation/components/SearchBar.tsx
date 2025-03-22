import React from "react";
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";

const SearchBar = ({ value, onChangeText }: any) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm việc làm "
        placeholderTextColor="#6B7280"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity>
        <Image source={require("../../../asset/images/img_search.png")} style={styles.searchIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8F9",
    borderRadius: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 50,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
});

export default SearchBar;