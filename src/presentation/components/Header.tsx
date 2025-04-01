import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Fonts } from "../../theme/font";

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  backgroundColor?: string;
  style?: any;
  rightIcon?: any;
  onRightPress?: () => void;
}

const HeaderWithIcons: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  backgroundColor = "#fff",
  style,
  rightIcon = null,
  onRightPress, }) => {
  return (
    <View style={[styles.header, { backgroundColor }, style]}>
      <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
        <Image source={require("../../../asset/images/img_arrow_left.png")} style={styles.icon} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconContainer}>
          <Image source={rightIcon} style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} /> 
      )}
    </View>
    
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: "relative",
    marginTop: 10,
    paddingTop: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: Fonts.semiBold.fontFamily,
    color: "black",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -100 }],
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  iconPlaceholder: {
    width: 40,
  },
  iconRight: {
  },
});

export default HeaderWithIcons;
