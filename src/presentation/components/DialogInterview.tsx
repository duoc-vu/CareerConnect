import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import Input from "./Input";
import DateTimePicker, { firestoreTimestampToDate } from "./DateTimePicker";

interface DialogInterviewProps {
  visible: boolean;
  sThoiGianPhongVan?: Date,
  sDiaDiem?: string,
  sLoiNhan?: string,
  onClose: () => void;
  onConfirm: (data: { date: Date; location: String, message: string }, appointment?: any) => void;
  appointment?: any;
}

const DialogInterview: React.FC<DialogInterviewProps> = ({
  visible,
  sThoiGianPhongVan,
  sDiaDiem,
  sLoiNhan,
  onClose,
  onConfirm,
  appointment,
}) => {
  const [date, setDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (visible) {
      const validDate = sThoiGianPhongVan instanceof Date
        ? sThoiGianPhongVan
        : firestoreTimestampToDate(sThoiGianPhongVan);
      setDate(validDate || new Date());
      setLocation(sDiaDiem || "");
      setMessage(sLoiNhan || "");
    }
  }, [visible, sThoiGianPhongVan, sDiaDiem, sLoiNhan]);


  const handleConfirm = () => {
    // const timestamp = dateToFirestoreTimestamp(date);
    onConfirm({ date, location, message }, appointment);
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

          <Text style={styles.label}>Chọn ngày và giờ</Text>
          <DateTimePicker date={date} setDate={setDate} style={styles.datePicker} showSeconds={false} />

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