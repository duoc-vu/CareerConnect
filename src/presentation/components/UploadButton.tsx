import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import { theme } from "../../theme/theme";

interface UploadButtonProps {
  onPress: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image
        source={require("../../../asset/images/plus.png")} 
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: theme.colors.background.light,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, 
    zIndex: 10, 
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.text.primary,
  },
});

export default UploadButton;
