import React from "react";
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";

const SearchBar = ({style, value, onChangeText }: any) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm việc làm "
        placeholderTextColor="#1F3C88"
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
    borderColor: "#1F3C88",
    borderWidth: 1,
    marginVertical: 10,
    height: 50,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 13.5,
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