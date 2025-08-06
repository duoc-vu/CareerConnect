import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { theme } from "../../theme/theme";
import { Fonts } from "../../theme/font";

interface MenuEditProps {
  visible: boolean;
  onClose: () => void;
  options: { label: string; onPress: () => void }[];
  style?: any;
}

const MenuEdit: React.FC<MenuEditProps> = ({ visible, onClose, options, style}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      style={[style]}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.menuContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              onClose();
              option.onPress();
            }}
          >
            <Text style={styles.menuText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 5,
    position: "absolute",
    top: 40,
    right: 0,
    borderRadius: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  menuText: {
    fontSize: 14,
    fontFamily: Fonts.regular.fontFamily,
    color: theme.colors.text.primary,
  },
});

export default MenuEdit;