import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Image, View } from "react-native";
import { theme } from "../../theme/theme";

interface UploadButtonProps {
  onMainPress?: () => void; // Hàm xử lý khi nhấn vào nút chính
  onFirstIconPress?: () => void; // Hàm xử lý khi nhấn vào icon đầu tiên
  onSecondIconPress?: () => void; // Hàm xử lý khi nhấn vào icon thứ hai
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onMainPress,
  onFirstIconPress,
  onSecondIconPress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái để điều khiển hiển thị icon bổ sung

  const handleMainPress = () => {
    setIsExpanded(!isExpanded); // Chuyển đổi trạng thái
    if (onMainPress) onMainPress(); // Gọi hàm xử lý nếu cần
  };

  return (
    <View style={styles.container}>
      {isExpanded && (
        <>
          {/* Icon đầu tiên */}
          <TouchableOpacity
            style={[styles.button, styles.additionalButton]}
            onPress={() => {
              if (onFirstIconPress) onFirstIconPress();
              setIsExpanded(false); // Ẩn các icon sau khi nhấn
            }}
          >
            <Image
              source={require("../../../asset/images/img_cells.png")} // Icon đầu tiên
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Icon thứ hai */}
          <TouchableOpacity
            style={[styles.button, styles.additionalButton]}
            onPress={() => {
              if (onSecondIconPress) onSecondIconPress();
              setIsExpanded(false); // Ẩn các icon sau khi nhấn
            }}
          >
            <Image
              source={require("../../../asset/images/plus.png")} 
              style={styles.icon}
            />
          </TouchableOpacity>
        </>
      )}

      {/* Nút chính */}
      <TouchableOpacity style={styles.button} onPress={handleMainPress}>
        <Image
          source={require("../../../asset/images/img_menu_1.png")} // Icon chính
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    right: 20,
    alignItems: "center",
  },
  button: {
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
  additionalButton: {
    marginBottom: 10, // Khoảng cách giữa icon bổ sung và icon chính
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.text.primary,
  },
});

export default UploadButton;
