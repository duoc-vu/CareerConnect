import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLoading, useTheme } from "../../../context/themeContext";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { Fonts } from "../../../theme/font";
import JobCard from "../../components/JobCard";
import Loading from "../../components/Loading";
import HeaderWithIcons from "../../components/Header";
import { useUser } from "../../../context/UserContext";

const fbJobDetail = firestore().collection("tblTinTuyenDung");
const fbCT = firestore().collection("tblDoanhNghiep");

const JobDetail = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { sMaTinTuyenDung } = route.params;

  const [job, setJob] = useState<any>(null);
  const [companyDetail, setCompanyDetail] = useState<any>(null);
  const [image, setImage] = useState<string>("");
  const { loading, setLoading } = useLoading();
  const { userId, userType } = useUser();
  useEffect(() => {
    console.log("✅ Cập nhật job:", job);
  }, [job]);
  
  useEffect(() => {
    console.log("✅ Cập nhật companyDetail:", companyDetail);
  }, [companyDetail]);
  
  useEffect(() => {
    console.log("📌 sMaTinTuyenDung từ route:", sMaTinTuyenDung);
  
    const getJobDetail = async () => {
      setLoading(true);
      try {
        // 🔹 Lấy dữ liệu công việc từ Firestore
        const jobQuerySnapshot = await fbJobDetail
          .where("sMaTinTuyenDung", "==", sMaTinTuyenDung)
          .get();
  
        console.log("📌 Firestore trả về jobQuerySnapshot:", jobQuerySnapshot.empty ? "Không có dữ liệu" : jobQuerySnapshot.docs.map(doc => doc.data()));
  
        if (!jobQuerySnapshot.empty) {
          const jobDoc = jobQuerySnapshot.docs[0];
          const jobData: any = jobDoc.data();
          setJob(jobData);
  
          console.log("📌 jobData lấy được:", jobData);
          console.log("📌 sMaDoanhNghiep:", jobData.sMaDoanhNghiep);
  
          if (jobData.sMaDoanhNghiep) {
            const companySnapshot = await fbCT
              .where("sMaDoanhNghiep", "==", jobData.sMaDoanhNghiep)
              .get();
  
            console.log("📌 Firestore trả về companySnapshot:", companySnapshot.empty ? "Không có dữ liệu" : companySnapshot.docs.map(doc => doc.data()));
  
            if (!companySnapshot.empty) {
              const companyDoc = companySnapshot.docs[0];
              const companyData = companyDoc.data();
              setCompanyDetail(companyData);
  
              console.log("✅ Lấy được companyDetail:", companyData);
            } else {
              console.warn("⚠️ Không tìm thấy công ty với mã:", jobData.sMaDoanhNghiep);
            }
          }
  
          // 🔹 Lấy ảnh công ty nếu có
          if (jobData.sMaDoanhNghiep) {
            try {
              const avatarRef = storage().ref(`Avatar_Cong_Ty/${jobData.sMaDoanhNghiep}.png`);
              const companyLogo = await avatarRef.getDownloadURL();
              setImage(companyLogo);
              console.log("📌 Avatar URL:", companyLogo);
            } catch (error: any) {
              console.error("🚨 Lỗi tải logo công ty:", error.code, error.message);
            }
          }
        } else {
          console.warn("⚠️ Không tìm thấy tin tuyển dụng với mã:", sMaTinTuyenDung);
        }
      } catch (error) {
        console.error("🚨 Lỗi khi lấy thông tin chi tiết công việc:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getJobDetail();
  }, [sMaTinTuyenDung]);
  
  const jobDescriptions = job?.sMoTaCongViec?.split("/n") || [];
  return (
    <View style={[styles.wrapper, { backgroundColor: theme.bG }]}>
    <HeaderWithIcons title="Job Details" onBackPress={() => navigation.goBack()} />

    {loading ? (
      <Loading />
    ) : !job || !companyDetail || !jobDescriptions ? (
      <Loading/>
    ) : (
      <>
        <ScrollView style={styles.container}>
          <View style={styles.card}>
            <JobCard
              companyLogo={image}
              companyName={companyDetail.sTenDoanhNghiep}
              jobTitle={job.sViTriTuyenDung}
              jobType="On-site"
              location={job.sDiaChiLamViec}
              onPress={() => {}}
              salaryMax={job.sMucLuongToiThieu}
              salaryMin={job.sMucLuongToiDa}
              deadline={job.sThoiHanTuyenDung}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.surface }, Fonts.semiBold]}>
                Mô tả công việc
              </Text>
              <Text style={[styles.description, { color: theme.surface }, Fonts.regular]}>
                {jobDescriptions[0] || "Không có mô tả"}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.surface }, Fonts.semiBold]}>
                Yêu cầu ứng viên
              </Text>
              <Text style={[styles.description, { color: theme.surface }, Fonts.regular]}>
                {jobDescriptions[1] || "Không có yêu cầu cụ thể"}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.surface }, Fonts.semiBold]}>
                Quyền lợi
              </Text>
              <Text style={[styles.description, { color: theme.surface }, Fonts.regular]}>
                {jobDescriptions[2] || "Không có thông tin"}
              </Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.applyButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.applyText}>Ứng tuyển ngay</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
  },
  applyButton: {
    backgroundColor: "#002366",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 20,
    alignSelf: "center",
    width: "90%",
  },
  applyText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default JobDetail;
