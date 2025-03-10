import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../../theme/themeContext";
import { Fonts } from "../../../theme/font";
import  Button  from "../../../presentation/components/Button";
import  JobCard  from "../../../presentation/components/JobCard"; 
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

const fbJobDetail = firestore().collection("tblTinTuyenDung");
const fbCT = firestore().collection("tblDoanhNghiep");

const JobDetail = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { jobId } = route.params;

  const [jobDetail, setJobDetail] = useState<any>(null);
  const [companyDetail, setCompanyDetail] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const getJobDetail = async () => {
      try {
        const jobQuerySnapshot = await fbJobDetail.where("sMaTinTuyenDung", "==", jobId).get();
        if (!jobQuerySnapshot.empty) {
          const jobDoc = jobQuerySnapshot.docs[0];
          const jobData: any = jobDoc.data();
          setJobDetail(jobData);

          // Lấy thông tin công ty
          const companySnapshot = await fbCT.where("sMaDoanhNghiep", "==", jobData.sMaDoanhNghiep).get();
          if (!companySnapshot.empty) {
            const companyDoc = companySnapshot.docs[0];
            const companyData = companyDoc.data();
            setCompanyDetail(companyData);

            // Lấy ảnh công ty từ Firebase Storage
            try {
              const avatarRef = storage().ref(`Avatar_Cong_Ty/${jobData.sMaDoanhNghiep}.png`);
              const imageUrl = await avatarRef.getDownloadURL();
              setImage(imageUrl);
            } catch {
              setImage(null); // Nếu không có ảnh thì để null
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin chi tiết công việc:", error);
      }
    };

    getJobDetail();
  }, [jobId]);

  if (!jobDetail || !companyDetail) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bG }]}>
        <Text style={[styles.loadingText, { color: theme.surface }]}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bG }]}>
      {/* Job Card */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Image source={image ? { uri: image } : require("../../../../asset/images/defaultNoData.png")} style={styles.logo} />
          <Text style={[styles.companyName, { color: theme.surface }]}>{companyDetail.sTenDoanhNghiep}</Text>
          <Text style={[styles.jobType, { color: theme.primary }]}>{jobDetail.sTrangThai}</Text>
        </View>

        <Text style={[styles.jobTitle, { color: theme.surface }]}>{jobDetail.sViTriTuyenDung}</Text>
        <Text style={[styles.salary, { color: theme.surface }]}>
          {jobDetail.sMucLuongToiThieu} - {jobDetail.sMucLuongToiDa} / Tháng
        </Text>
        <Text style={[styles.endDate, { color: theme.surface }]}>
          Hạn nộp: {jobDetail.sNgayHetHan}
        </Text>
      </View>

      {/* Job Summary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.surface }]}>Job Summary:</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.surface }]}>Job Level:</Text>
          <Text style={[styles.value, { color: theme.primary }]}>{jobDetail.sCapBac ?? "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.surface }]}>Experience:</Text>
          <Text style={[styles.value, { color: theme.primary }]}>{jobDetail.sSoNamKinhNghiem ?? "N/A"} Years</Text>
        </View>
      </View>

      {/* Job Description */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.surface }]}>Job Description:</Text>
        <Text style={[styles.description, { color: theme.surface }]}>{jobDetail.sMota ?? "Không có mô tả"}</Text>
      </View>

      {/* Apply Button */}
      <Button title="Apply" onPress={() => navigation.navigate("Home")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  companyName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  jobType: {
    fontSize: 14,
    fontWeight: "bold",
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  salary: {
    fontSize: 16,
    marginTop: 5,
  },
  endDate: {
    fontSize: 14,
    marginTop: 5,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default JobDetail;
