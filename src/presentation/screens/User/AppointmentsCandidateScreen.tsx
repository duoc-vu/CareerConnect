import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import HeaderWithIcons from '../../components/Header';
import { useUser } from '../../../context/UserContext';
import Loading from '../../components/Loading';
import { useLoading } from '../../../context/themeContext';
import axios from 'axios';
import Dialog from '../../components/Dialog';
import AppointmentCardCandidate from '../../components/AppointmentsCandidateCard';

const API_URL = 'http://192.168.31.242:3000/api/send-email';
const fbLichHenPhongVan = firestore().collection('tblLichHenPhongVan');
const fbDoanhNghiep = firestore().collection('tblDoanhNghiep');
const fbTaiKhoan = firestore().collection('tblTaiKhoan');

const AppointmentsCandidateScreen = ({ navigation }: any) => {
  const { userId } = useUser();
  const [appointments, setAppointments] = useState([]);
  const { loading, setLoading } = useLoading();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [dialogContent, setDialogContent] = useState({
    title: "",
    message: "",
    failure: false,
    isAccept: false
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const appointmentsQuerySnapshot = await fbLichHenPhongVan
          .where('sMaUngVien', '==', userId)
          .get();

        const appointmentsList: any = [];

        for (const doc of appointmentsQuerySnapshot.docs) {
          const appointment = doc.data();
          const sMaDoanhNghiep = appointment.sMaDoanhNghiep;

          let sEmailLienHe = '';

          const taiKhoanQuery = await fbTaiKhoan
            .where('sMaTaiKhoan', '==', sMaDoanhNghiep)
            .limit(1)
            .get();
          if (!taiKhoanQuery.empty) {
            sEmailLienHe = taiKhoanQuery.docs[0].data()?.sEmailLienHe || '';
          }
          appointmentsList.push({
            ...appointment,
            id: doc.id,
            sEmailLienHe,
          });
        }
        setAppointments(appointmentsList);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [userId]);

  const handleGoDetailJob = (sMaTinTuyenDung: any) => {
    navigation.navigate('job-detail', { sMaTinTuyenDung });

  };

  const handleGoDetailCompany = (sMaDoanhNghiep: any) => {
    navigation.navigate('company-detail-candidate', { sMaDoanhNghiep })
  };

  const showConfirmDialog = (appointment: any, isAccept: boolean) => {
    setSelectedAppointment(appointment);
    setDialogContent({
      title: isAccept ? "Xác nhận tham gia phỏng vấn" : "Xác nhận từ chối phỏng vấn",
      message: isAccept
        ? "Bạn có chắc chắn muốn tham gia phỏng vấn này không?"
        : "Bạn có chắc chắn muốn từ chối phỏng vấn này không?",
      failure: false,
      isAccept: isAccept
    });
    setDialogVisible(true);
  };

  const handleConfirmDialog = async () => {
    if (!selectedAppointment) return;

    setDialogVisible(false);

    setLoading(true);
    try {
      const isAccept = dialogContent.isAccept;

      const appointmentQuery = await fbLichHenPhongVan
        .where('sMaLichHenPhongVan', '==', selectedAppointment.sMaLichHenPhongVan)
        .get();

      if (appointmentQuery.empty) {
        throw new Error("Không tìm thấy lịch hẹn");
      }

      const appointmentDocId = appointmentQuery.docs[0].id;
      await fbLichHenPhongVan.doc(appointmentDocId).update({
        sTrangThai: isAccept ? 2 : 3,
      });

      const doanhNghiepQuery = await fbDoanhNghiep
        .where('sMaDoanhNghiep', '==', userId)
        .limit(1)
        .get();

      let tenDoanhNghiep = "Doanh nghiệp";;
      if (!doanhNghiepQuery.empty) {
        tenDoanhNghiep = doanhNghiepQuery.docs[0].data()?.sHoVaTen || "Doanh nghiệp";
      }
      const emailPayload = {
        to: selectedAppointment.sEmailLienHe,
        subject: `${isAccept ? 'Chấp nhận' : 'Từ chối'} lịch hẹn phỏng vấn - ${selectedAppointment.sTieuDe}`,
        message: isAccept
          ? `Ứng viên ${tenDoanhNghiep} đã chấp nhận lịch hẹn phỏng vấn cho vị trí ${selectedAppointment.sTieuDe} vào lúc ${new Date(selectedAppointment.sThoiGianPhongVan).toLocaleString()}.`
          : `Ứng viên ${tenDoanhNghiep} đã từ chối lịch hẹn phỏng vấn cho vị trí ${selectedAppointment.sTieuDe}. Vui lòng liên hệ với ứng viên để biết thêm chi tiết hoặc sắp xếp lịch hẹn khác.`,
        candidateName: tenDoanhNghiep,
        scheduleTime: selectedAppointment.sThoiGianPhongVan,
        location: selectedAppointment.sDiaDiem,
        status: isAccept ? 'accepted' : 'declined'
      };
      await axios.post(API_URL, emailPayload);

      setDialogContent({
        title: "Thành công",
        message: isAccept
          ? "Bạn đã chấp nhận lịch hẹn phỏng vấn. Nhà tuyển dụng đã được thông báo."
          : "Bạn đã từ chối lịch hẹn phỏng vấn. Nhà tuyển dụng đã được thông báo.",
        failure: false,
        isAccept: isAccept
      });

    } catch (error) {
      console.error("Lỗi khi lưu lịch hẹn phỏng vấn:", error);
      setDialogContent({
        title: "Lỗi",
        message: "Không thể xử lý lịch hẹn. Vui lòng thử lại sau.",
        failure: true,
        isAccept: false
      });
    }
    finally {
      setLoading(false);
      setDialogVisible(true);
    }
  }

  const renderItem = ({ item }: any) => (
    <View style={{ overflow: 'hidden' }}>
      <View style={{ backgroundColor: 'transparent' }}>
        <AppointmentCardCandidate
          sMaLichHenPhongVan={item.sMaLichHenPhongVan}
          sMaTinTuyenDung={item.sMaTinTuyenDung}
          sThoiGianPhongVan={item.sThoiGianPhongVan}
          sTieuDe={item.sTieuDe}
          sDiaDiem={item.sDiaDiem}
          sLoiNhan={item.sLoiNhan}
          sSDT={item.sSoDienThoai}
          sEmail={item.sEmailLienHe}
          sTrangThai={item.sTrangThai}
          onPressJobDetail={() => handleGoDetailJob(item.sMaTinTuyenDung)}
          onPressCompanyDetail={() => handleGoDetailCompany(item.sMaDoanhNghiep)}
          onAccept={() => showConfirmDialog(item, true)}
          onDecline={() => showConfirmDialog(item, false)}
        />
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <HeaderWithIcons
        title="Quản lý lịch hẹn"
        backgroundColor="#f2f2f2"
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id || Math.random().toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.noAppointmentsText}>
            {loading ? 'Đang tải...' : 'Chưa có lịch hẹn nào.'}
          </Text>
        )}
      />
      <Dialog
        visible={dialogVisible}
        title={dialogContent.title}
        content={dialogContent.message}
        failure={dialogContent.failure}
        confirm={dialogContent.failure ? undefined : {
          text: "Xác nhận",
          onPress: () => {
            if (!dialogContent.failure) {
              handleConfirmDialog();
            } else {
              setDialogVisible(false);
            }
          },
        }}
        dismiss={{
          text: "Đóng",
          onPress: () => setDialogVisible(false),
        }} />
      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 15,
  },
  list: {
    paddingBottom: 50,
  },
  noAppointmentsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 20,
  },
});

export default AppointmentsCandidateScreen;