import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import Input from "./Input";
import DatePicker from "./DatePicker";

interface DialogInterviewProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: { date: Date; location: String, message: string }) => void;
}

const DialogInterview: React.FC<DialogInterviewProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [date, setDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");

  const handleConfirm = () => {
    onConfirm({ date, location, message });
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>Tạo lịch hẹn phỏng vấn</Text>

          <Text style={styles.label}>Chọn ngày</Text>
          <DatePicker date={date} setDate={setDate} style={styles.datePicker} />

          <Text style={styles.label}>Địa điểm</Text>
          <Input
            placeholder="Nhập địa điểm"
            value={location}
            onChangeText={setLocation}
            multiline
            style={styles.location}
          />

          <Text style={styles.label}>Lời nhắn</Text>
          <Input
            placeholder="Nhập lời nhắn"
            value={message}
            onChangeText={setMessage}
            multiline
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialogContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#012A74",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  location: {
    width: "100%",
    height: "auto",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  datePicker: {
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#012A74",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DialogInterview;