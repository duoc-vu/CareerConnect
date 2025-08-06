import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from "react-native";
import DocumentPicker from "react-native-document-picker";
import HeaderWithIcons from "../../components/Header";
import Dialog from "../../components/Dialog";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { useLoading } from "../../../context/themeContext";
import RNFS from "react-native-fs";
import XLSX from "xlsx";
import firestore from "@react-native-firebase/firestore";
import { useUser } from "../../../context/UserContext";

const ImportCSVScreen = ({ navigation }: any) => {
  const { userId } = useUser();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    content: "",
    isError: false,
  });
  const { loading, setLoading } = useLoading();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const columnMapping: { [key: string]: string } = {
    "Lĩnh vực tuyển dụng": "sLinhVucTuyenDung",
    "Mô tả công việc": "sMoTaCongViec",
    "Mức lương tối đa": "sMucLuongToiDa",
    "Mức lương tối thiểu": "sMucLuongToiThieu",
    "Số lượng tuyển dụng": "sSoLuongTuyenDung",
    "Số năm kinh nghiệm": "sSoNamKinhNghiem",
    "Thời gian đăng bài": "sThoiGianDangBai",
    "Thời hạn tuyển dụng": "sThoiHanTuyenDung",
    "Vị trí tuyển dụng": "sViTriTuyenDung",
    "Địa chỉ làm việc": "sDiaChiLamViec",
  };

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });

      if (result && result[0].uri) {
        setSelectedFile(result[0].uri);
        setDialogContent({
          title: "File đã chọn",
          content: `Bạn đã chọn file: ${result[0].name}`,
          isError: false,
        });
        setDialogVisible(true);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log("Người dùng đã hủy chọn file");
      } else {
        console.error("Lỗi DocumentPicker:", error);
        setDialogContent({
          title: "Lỗi",
          content: "Không thể chọn file. Vui lòng thử lại.",
          isError: true,
        });
        setDialogVisible(true);
      }
    }
  };

  const validateFileFormat = (rows: any[]): string[] => {
    const fileColumns = Object.keys(rows[0] || {});
    const requiredColumns = Object.keys(columnMapping);
    return requiredColumns.filter((key) => !fileColumns.includes(key));
  };

  const getNextJobId = async (): Promise<string> => {
    try {
      const snapshot = await firestore().collection("tblTinTuyenDung").get();
      let maxIndex = 0;

      snapshot.forEach((doc) => {
        const jobId = doc.data().sMaTinTuyenDung;
        const index = parseInt(jobId.replace("TTD", ""), 10);
        if (!isNaN(index) && index > maxIndex) {
          maxIndex = index;
        }
      });

      return `TTD${maxIndex + 1}`;
    } catch (error) {
      console.error("Lỗi khi lấy sMaTinTuyenDung cao nhất:", error);
      throw new Error("Không thể lấy sMaTinTuyenDung cao nhất.");
    }
  };

  const handleImportCSV = async () => {
    setLoading(true);
    console.log("Bắt đầu import CSV...");
    try {
      if (!selectedFile) {
        console.log("Không có file được chọn.");
        setDialogContent({
          title: "Lỗi",
          content: "Vui lòng chọn file trước khi đăng tải.",
          isError: true,
        });
        setDialogVisible(true);
        return;
      }

      const filePath = selectedFile.replace("file://", "");
      const fileBuffer = await RNFS.readFile(filePath, "base64");

      const workbook = XLSX.read(fileBuffer, { type: "base64" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      if (!rows || rows.length === 0) {
        console.log("File không chứa dữ liệu hoặc không hợp lệ.");
        setDialogContent({
          title: "Lỗi",
          content: "File không chứa dữ liệu hoặc không hợp lệ.",
          isError: true,
        });
        setDialogVisible(true);
        return;
      }

      const missingColumns = validateFileFormat(rows);
      if (missingColumns.length > 0) {
        setDialogContent({
          title: "Lỗi định dạng",
          content: `Các cột sau bị thiếu hoặc sai tên: ${missingColumns.join(", ")}`,
          isError: true,
        });
        setDialogVisible(true);
        return;
      }

      let nextJobId = await getNextJobId();
      console.log("Mã tin tuyển dụng tiếp theo:", nextJobId);

      const batch = firestore().batch();
      const jobsCollection = firestore().collection("tblTinTuyenDung");

      rows.forEach((row: any) => {
        const jobData: any = {};

        Object.keys(columnMapping).forEach((key) => {
          const firestoreField = columnMapping[key];
          jobData[firestoreField] = row[key] || "";
        });

        jobData.sMaTinTuyenDung = nextJobId;
        jobData.sMaDoanhNghiep = userId;
        jobData.sMucLuongToiDa = parseInt(jobData.sMucLuongToiDa, 10) || 0;
        jobData.sMucLuongToiThieu = parseInt(jobData.sMucLuongToiThieu, 10) || 0;
        jobData.sSoLuongTuyenDung = parseInt(jobData.sSoLuongTuyenDung, 10) || 0;
        jobData.sSoNamKinhNghiem = parseInt(jobData.sSoNamKinhNghiem, 10) || 0;
        jobData.sThoiGianDangBai = jobData.sThoiGianDangBai
          ? new Date(jobData.sThoiGianDangBai)
          : null;
        jobData.sThoiHanTuyenDung = jobData.sThoiHanTuyenDung
          ? new Date(jobData.sThoiHanTuyenDung)
          : null;
        jobData.sCoKhoa = 1;

        const docRef = jobsCollection.doc(nextJobId);
        batch.set(docRef, jobData);

        const currentIndex = parseInt(nextJobId.replace("TTD", ""), 10);
        nextJobId = `TTD${currentIndex + 1}`;
      });

      console.log("Bắt đầu commit batch...");
      await batch.commit();
      console.log("Batch commit thành công!");
      setDialogContent({
        title: "Thành công",
        content: "Import file CSV thành công!",
        isError: false,
      });
      setDialogVisible(true);
    } catch (error) {
      console.error("Error in handleImportCSV:", error);
      setDialogContent({
        title: "Lỗi",
        content: "Đã xảy ra lỗi khi import file. Vui lòng thử lại.",
        isError: true,
      });
      setDialogVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithIcons
        title="Nhập nhiều công việc"
        onBackPress={navigation.goBack}
        style={styles.header}
      />
      <ScrollView contentContainerStyle={styles.containerChild}>
        <Text style={styles.title}>Nhập file CSV</Text>

        <TouchableOpacity style={styles.filePicker} onPress={handleChooseFile}>
          <Text style={styles.filePickerText}>
            {selectedFile ? `File đã chọn: ${selectedFile.split("/").pop()}` : "Chọn file CSV"}
          </Text>
        </TouchableOpacity>

        <Button title="Đăng tải" onPress={handleImportCSV} disabled={!selectedFile} />

        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL(
              "https://firebasestorage.googleapis.com/v0/b/careersfinal-3dd5f.appspot.com/o/template.xlsx?alt=media&token=9c53e0d9-897a-4b50-ad13-4614fd0c6e56"
            )
          }
        >
          Xem định dạng mẫu
        </Text>
      </ScrollView>

      <Dialog
        visible={dialogVisible}
        title={dialogContent.title}
        content={dialogContent.content}
        failure={dialogContent.isError}
        confirm={{
          text: "Đóng",
          onPress: () => setDialogVisible(false),
        }}
      />

      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flexGrow: 1 },
  containerChild: { padding: 20, paddingBottom: 150 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  header: { marginBottom: 10 },
  filePicker: {
    borderWidth: 1,
    borderColor: "#BEBEBE",
    backgroundColor: "#EDEDED",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  filePickerText: { fontSize: 14, color: "#333" },
  link: {
    color: "#002366",
    fontSize: 16,
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 15,
  },
});

export default ImportCSVScreen;