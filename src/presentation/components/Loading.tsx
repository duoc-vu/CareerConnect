import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { theme } from "../../theme/theme"; 

interface LoadingProps {
  size?: "small" | "large";
}

const Loading: React.FC<LoadingProps> = ({ size = "large" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary.light} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Tùy chỉnh background mờ
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});

export default Loading;
