import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLoading, useTheme } from "../../../context/themeContext";
import firestore from "@react-native-firebase/firestore";
import { Fonts } from "../../../theme/font";
import JobCard from "../../components/JobCard";
import Loading from "../../components/Loading";
import HeaderWithIcons from "../../components/Header";
import { useUser } from "../../../context/UserContext";
import Dialog from "../../components/Dialog";
import { theme } from "../../../theme/theme";

const fbJobDetail = firestore().collection("tblTinTuyenDung");
const fbCT = firestore().collection("tblDoanhNghiep");

const JobDetail = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { sMaTinTuyenDung } = route.params;
  const [job, setJob] = useState<any>(null);
  const [companyDetail, setCompanyDetail] = useState<any>(null);
  const { loading, setLoading } = useLoading();
  const { userId, userType } = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [recommendedCandidates, setRecommendedCandidates] = useState<any[]>([]);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    content: '',
    confirm: null as null | { text: string; onPress: () => void },
    dismiss: null as null | { text: string; onPress: () => void },
    visible: false,
  });
  useEffect(() => {
    if (userType === 2 && job) {
      setIsOwner(job.sMaDoanhNghiep === userId);
    }
  }, [userType, job, userId]);

  useEffect(() => {
    if (job) {
      setIsLocked(job.sCoKhoa === 2);
    }
  }, [job]);

  useEffect(() => {
    const checkIfJobIsSaved = async () => {
      if (userType === 2) {
        if (job?.sMaDoanhNghiep === userId) {
          setIsOwner(true);
        }
        return;
      }
      if (userType !== 1) return;
      try {
        setLoading(true);

        const candidateSnapshot = await firestore()
          .collection("tblUngVien")
          .where("sMaUngVien", "==", userId)
          .get();

        if (!candidateSnapshot.empty) {
          const candidateDoc = candidateSnapshot.docs[0];
          const candidateData = candidateDoc.data();

          const savedJobs = candidateData.sCongViecDaLuu || [];
          if (savedJobs.includes(sMaTinTuyenDung)) {
            setIsSaved(true);
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái lưu công việc:", error);
      } finally {
        setLoading(false);
      }
    };

    checkIfJobIsSaved();
  }, [sMaTinTuyenDung, userId, userType]);

  const [isOwner, setIsOwner] = useState(false);
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

  const handleSaveJob = async () => {
    if (!userId || (userType !== 1 && userType !== 2)) {
      setDialogContent({
        title: 'Thông báo',
        content: 'Bạn cần đăng nhập để lưu công việc này.',
        confirm: {
          text: 'Đăng nhập',
          onPress: () => {
            setDialogContent(prev => ({ ...prev, visible: false }));
            navigation.navigate('login');
          },
        },
        dismiss: {
          text: 'Hủy',
          onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
        },
        visible: true,
      });
      return;
    }

    try {
      setLoading(true);

      const candidateSnapshot = await firestore()
        .collection("tblUngVien")
        .where("sMaUngVien", "==", userId)
        .get();

      if (candidateSnapshot.empty) {
        setDialogContent({
          title: 'Thông báo',
          content: 'Bạn cần đăng ký thông tin để lưu công việc này.',
          confirm: {
            text: 'Đăng ký thông tin',
            onPress: () => {
              setDialogContent(prev => ({ ...prev, visible: false }));
              navigation.navigate('edit-candidate-profile');
            },
          },
          dismiss: {
            text: 'Hủy',
            onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
          },
          visible: true,
        });
        return;
      }

      const candidateDoc = candidateSnapshot.docs[0];
      const candidateData = candidateDoc.data();

      if (!candidateData) {
        setDialogContent({
          title: 'Thông báo',
          content: 'Bạn cần đăng ký thông tin để lưu công việc này.',
          confirm: {
            text: 'Đăng ký thông tin',
            onPress: () => {
              setDialogContent(prev => ({ ...prev, visible: false }));
              navigation.navigate('edit-candidate-profile');
            },
          },
          dismiss: {
            text: 'Hủy',
            onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
          },
          visible: true,
        });
        return;
      }
      const savedJobs = candidateData.sCongViecDaLuu || [];

      if (isSaved) {
        const updatedJobs = savedJobs.filter((jobId: string) => jobId !== sMaTinTuyenDung);

        await firestore()
          .collection("tblUngVien")
          .doc(candidateDoc.id)
          .update({ sCongViecDaLuu: updatedJobs });
        setIsSaved(false);
      } else {
        savedJobs.push(sMaTinTuyenDung);

        await firestore()
          .collection("tblUngVien")
          .doc(candidateDoc.id)
          .update({ sCongViecDaLuu: savedJobs });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Lỗi khi lưu hoặc xóa công việc:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async () => {
    setDialogContent({
      title: isLocked ? 'Xác nhận mở khóa bài đăng' : 'Xác nhận khóa bài đăng',
      content: isLocked
        ? 'Bạn có chắc chắn muốn mở khóa bài đăng không?'
        : 'Bạn có chắc chắn muốn khóa bài đăng không? Các ứng viên sẽ không thể thấy được bài đăng của bạn.',
      confirm: {
        text: 'Xác nhận',
        onPress: async () => {
          try {
            setLoading(true);

            if (job) {
              const newStatus = isLocked ? 1 : 2;
              await firestore()
                .collection('tblTinTuyenDung')
                .doc(job.id)
                .update({ sCoKhoa: newStatus });

              setIsLocked(!isLocked);
            }
          } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái khóa/mở:', error);
          } finally {
            setLoading(false);
            setDialogContent(prev => ({ ...prev, visible: false }));
          }
        },
      },
      dismiss: {
        text: 'Hủy',
        onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
      },
      visible: true,
    });
  };

  const jobDescriptions = job?.sMoTaCongViec?.split("/n") || [];
  const handleApply = async () => {
    if (!userId || (userType !== 1 && userType !== 2)) {
      setDialogContent({
        title: 'Thông báo',
        content: 'Bạn cần đăng nhập để ứng tuyển công việc này.',
        confirm: {
          text: 'Đăng nhập',
          onPress: () => {
            setDialogContent(prev => ({ ...prev, visible: false }));
            navigation.navigate('login');
          },
        },
        dismiss: {
          text: 'Hủy',
          onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
        },
        visible: true,
      });
      return;
    }
    try {
      setLoading(true);
      const querySnapshot = await firestore()
        .collection("tblUngVien")
        .where("sMaUngVien", "==", userId)
        .get();

      if (!querySnapshot.empty) {
        navigation.navigate("apply-job", { sMaTinTuyenDung });
      } else {
        setDialogContent({
          title: 'Thông báo',
          content: 'Bạn chưa đăng ký thông tin ứng viên. Vui lòng đăng ký để tiếp tục ứng tuyển.',
          confirm: {
            text: 'Đăng ký thông tin',
            onPress: () => {
              setDialogContent(prev => ({ ...prev, visible: false }));
              navigation.navigate('edit-candidate-profile');
            },
          },
          dismiss: {
            text: 'Hủy',
            onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
          },
          visible: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra thông tin ứng viên:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedCandidates = async () => {
    try {
      if (!job?.sLinhVucTuyenDung) return;

      const candidatesSnapshot = await firestore()
        .collection("tblUngVien")
        .where("sLinhVuc", "==", job.sLinhVucTuyenDung)
        .get();

      if (!candidatesSnapshot.empty) {
        const candidates = candidatesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const shuffled = candidates.sort(() => 0.5 - Math.random());
        const selectedCandidates = shuffled.slice(0, 3);

        setRecommendedCandidates(selectedCandidates);
      } else {
        console.log("Không tìm thấy ứng viên phù hợp.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ứng viên phù hợp:", error);
    }
  };
  useEffect(() => {
    if (job) {
      fetchRecommendedCandidates();
    }
  }, [job]);
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
                onPress={() => navigation.navigate("company-detail-candidate", { sMaDoanhNghiep: job.sMaDoanhNghiep })}
                salaryMax={job.sMucLuongToiThieu}
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
              <View style={styles.section}>
                <Text style={[styles.recommendedJobsTitle, Fonts.semiBold]}>
                  Ứng viên phù hợp
                </Text>
                {recommendedCandidates.length > 0 ? (
                  recommendedCandidates.map((candidate, index) => (
                    <JobCard
                      key={index}
                      companyLogo={candidate.sAnhDaiDien || ""}
                      companyName={candidate.sHoVaTen || "Ứng viên ẩn danh"}
                      jobTitle={candidate.sChuyenNganh || "Chưa cập nhật"}
                      location={candidate.sDiaChi || "Không rõ địa chỉ"}
                      salaryMax={candidate.sKinhNghiem || "0"}
                      jobType="Ứng viên"
                      onPress={() =>
                        navigation.navigate("application-detail", { sMaUngVien: candidate.sMaUngVien, sMaTinTuyenDung: sMaTinTuyenDung })
                      }
                      style={styles.jobCard}
                    />
                  ))
                ) : (
                  <Text style={styles.noJobsText}>Không có ứng viên phù hợp.</Text>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            {userType === 1 && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveJob}
              >
                <Image
                  source={
                    isSaved
                      ? require("../../../../asset/images/img_save_bottom_active.png")
                      : require("../../../../asset/images/img_save_bottom.png")
                  }
                  style={styles.saveIcon}
                />
              </TouchableOpacity>
            )}

            {userType === 2 && isOwner && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleToggleLock}
              >
                <Image
                  source={
                    isLocked
                      ? require("../../../../asset/images/img_unlock1.png")
                      : require("../../../../asset/images/img_lock.png")
                  }
                  style={styles.saveIcon}
                />
              </TouchableOpacity>
            )}

            {userType !== 1 && userType !== 2 && (
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setDialogContent({
                    title: 'Thông báo',
                    content: 'Bạn cần đăng nhập để thực hiện hành động này.',
                    confirm: {
                      text: 'Đăng nhập',
                      onPress: () => {
                        setDialogContent(prev => ({ ...prev, visible: false }));
                        navigation.navigate('login');
                      },
                    },
                    dismiss: {
                      text: 'Hủy',
                      onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
                    },
                    visible: true,
                  });
                }}
              >
                <Text style={styles.applyText}>Đăng nhập để tiếp tục</Text>
              </TouchableOpacity>
            )}

            {(userType === 1 || (userType === 2 && isOwner)) && (
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  if (isOwner) {
                    navigation.navigate("edit-job", { sMaTinTuyenDung });
                  } else {
                    handleApply();
                  }
                }}
              >
                <Text style={styles.applyText}>
                  {isOwner ? "Chỉnh sửa bài đăng" : "Ứng tuyển ngay"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
      <Dialog
        visible={dialogContent.visible}
        title={dialogContent.title}
        content={dialogContent.content}
        confirm={dialogContent.confirm}
        dismiss={dialogContent.dismiss}
        request={true}
      />
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
  recommendedJobsTitle: {
    fontFamily: Fonts.medium.fontFamily,
    fontSize: 18,
    color: theme.colors.titleJob.third,
    marginVertical: 10,
  },
  jobCard: {
    marginBottom: 16,
  },
  noJobsText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    marginTop: 10,
  },
});

export default JobDetail;
