import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLoading, useTheme } from "../../../context/themeContext";
import firestore from "@react-native-firebase/firestore";
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
  const { loading, setLoading } = useLoading();
  const { userId, userType } = useUser();

  useEffect(() => {
    const getJobDetail = async () => {
      setLoading(true);
      try {
        const jobQuerySnapshot = await fbJobDetail
          .where("sMaTinTuyenDung", "==", sMaTinTuyenDung)
          .get();


        if (!jobQuerySnapshot.empty) {
          const jobDoc = jobQuerySnapshot.docs[0];
          const jobData: any = jobDoc.data();
          setJob(jobData);

          if (jobData.sMaDoanhNghiep) {
            const companySnapshot = await fbCT
              .where("sMaDoanhNghiep", "==", jobData.sMaDoanhNghiep)
              .get();

            if (!companySnapshot.empty) {
              const companyDoc = companySnapshot.docs[0];
              const companyData = companyDoc.data();
              setCompanyDetail(companyData);
            } else {
              console.warn("⚠️ Không tìm thấy công ty với mã:", jobData.sMaDoanhNghiep);
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

  const isApplyButtonDisabled = userType === 2;
  const jobDescriptions = job?.sMoTaCongViec?.split("/n") || [];
  return (
    <View style={[styles.wrapper, { backgroundColor: theme.bG }]}>
      <HeaderWithIcons title="Tin tuyển dụng" onBackPress={() => navigation.goBack()} />

      {loading ? (
        <Loading />
      ) : !job || !companyDetail || !jobDescriptions ? (
        <Loading />
      ) : (
        <>
          <ScrollView style={styles.container}>
            <View style={styles.card}>
              <JobCard
                companyLogo={companyDetail.sAnhDaiDien || ""}
                companyName={companyDetail.sTenDoanhNghiep}
                jobTitle={job.sViTriTuyenDung}
                jobType="On-site"
                location={job.sDiaChiLamViec}
                onPress={() => { }}
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => console.log("Lưu công việc")}
            >
              <Image
                source={require("../../../../asset/images/img_save_bottom.png")}
                style={styles.saveIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, isApplyButtonDisabled && styles.applyButtonDisabled]}
              disabled={isApplyButtonDisabled}
              onPress={() => navigation.navigate("apply-job", { sMaTinTuyenDung })}
            >
              <Text style={styles.applyText}>Ứng tuyển ngay</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    fontFamily: Fonts.medium.fontFamily,
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
    fontFamily: Fonts.semiBold.fontFamily,
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#002366",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    width: 50,
    height: 50,
  },
  saveIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  applyButton: {
    backgroundColor: "#002366",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  applyText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  applyButtonDisabled: {
    backgroundColor: "#A9A9A9",
    opacity: 0.8,
  },
});

export default JobDetail;
