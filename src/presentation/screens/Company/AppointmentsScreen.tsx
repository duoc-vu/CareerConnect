import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AppointmentCard from '../../components/AppointmentCard';
import HeaderWithIcons from '../../components/Header';
import { useUser } from '../../../context/UserContext';
import Loading from '../../components/Loading';
import { useLoading } from '../../../context/themeContext';
import DialogInterview from '../../components/DialogInterview';
import axios from 'axios';
import Dialog from '../../components/Dialog';

const API_URL = 'http://192.168.31.242:3000/api/send-email';
const fbLichHenPhongVan = firestore().collection('tblLichHenPhongVan');
const fbUngVien = firestore().collection('tblUngVien');
const fbTaiKhoan = firestore().collection('tblTaiKhoan');

const AppointmentsScreen = ({ navigation }: any) => {
  const { userId } = useUser();
  const [appointments, setAppointments] = useState([]);
  const { loading, setLoading } = useLoading();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogInterviewVisible, setDialogInterviewVisible] = useState(false);
  const handleOpenDialog = (appointment: any) => {
    const date = appointment.sThoiGianPhongVan instanceof firestore.Timestamp
      ? appointment.sThoiGianPhongVan.toDate()
      : new Date(appointment.sThoiGianPhongVan);

    setSelectedAppointment({ ...appointment, sThoiGianPhongVan: date });
    setDialogInterviewVisible(true);
  };
  const [dialogContent, setDialogContent] = useState({
    title: "",
    message: "",
    failure: false,
  });

  const handleCloseDialog = () => {
    setDialogInterviewVisible(false);
  };
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const appointmentsQuerySnapshot = await fbLichHenPhongVan
          .where('sMaDoanhNghiep', '==', userId)
          .get();

        const appointmentsList: any = [];

        for (const doc of appointmentsQuerySnapshot.docs) {
          const appointment = doc.data();
          const sMaUngVien = appointment.sMaUngVien;

          let sSoDienThoai = '';
          let sEmailLienHe = '';

          const ungVienQuery = await fbUngVien
            .where('sMaUngVien', '==', sMaUngVien)
            .limit(1)
            .get();
          if (!ungVienQuery.empty) {
            sSoDienThoai = ungVienQuery.docs[0].data()?.sSoDienThoai || '';
          }

          const taiKhoanQuery = await fbTaiKhoan
            .where('sMaTaiKhoan', '==', sMaUngVien)
            .limit(1)
            .get();
          if (!taiKhoanQuery.empty) {
            sEmailLienHe = taiKhoanQuery.docs[0].data()?.sEmailLienHe || '';
          }
          appointmentsList.push({
            ...appointment,
            id: doc.id,
            sSoDienThoai,
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
    navigation.navigate('job-detail-employer', { sMaTinTuyenDung });

  };

  const handleGoDetailApplicant = (sMaUngVien: any, sMaTinTuyenDung: any) => {
    navigation.navigate('application-detail', {
      sMaUngVien: sMaUngVien,
      sMaTinTuyenDung: sMaTinTuyenDung,
    })
  };

  const handleConfirmInterview = async (data: { date: Date; message: string }, appointment: any) => {
    setLoading(true);
    try {
      const existingScheduleQuery = await firestore()
        .collection('tblLichHenPhongVan')
        .where('sMaDoanhNghiep', '==', userId)
        .where('sMaUngVien', '==', appointment.sMaUngVien)
        .get();

      if (!existingScheduleQuery.empty) {
        const scheduleDocId = existingScheduleQuery.docs[0].id;
        await firestore().collection('tblLichHenPhongVan').doc(scheduleDocId).update({
          sThoiGianPhongVan: data.date.toISOString(),
          sLoiNhan: data.message,
          sDiaDiem: appointment.sDiaDiem,
        });

        setDialogContent({
          title: "Cập nhật thành công",
          message: "Lịch hẹn phỏng vấn đã được cập nhật thành công.",
          failure: false,
        });
        setDialogVisible(true);
      } else {
        setDialogContent({
          title: "Thất bại!",
          message: "Không tìm thấy lịch hẹn phỏng vấn để cập nhật.",
          failure: true,
        });
        setDialogVisible(true);
      }

      const accountQuery = await firestore()
        .collection('tblTaiKhoan')
        .where('sMaTaiKhoan', '==', appointment.sMaUngVien)
        .limit(1)
        .get();

      const candidateQuery = await firestore()
        .collection('tblUngVien')
        .where('sMaUngVien', '==', appointment.sMaUngVien)
        .limit(1)
        .get();

      if (!appointment.sEmailLienHe) {
        setDialogContent({
          title: "Lỗi",
          message: "Không tìm thấy email của ứng viên.",
          failure: true,
        });
        setDialogVisible(true);
        return;
      }

      const accountData = accountQuery.docs[0].data();
      const candidateData = candidateQuery.docs[0].data();


      const emailPayload = {
        to: accountData.sEmailLienHe,
        subject: `Lịch hẹn phỏng vấn - ${appointment.sTieuDe}`,
        message: data.message,
        candidateName: candidateData?.sHoVaTen || "",
        scheduleTime: data.date.toISOString(),
        location: appointment?.sDiaDiem || "",
      };

      await axios.post(API_URL, emailPayload);


      setDialogContent({
        title: "Thành công",
        message: "Cập nhật lịch hẹn phỏng vấn thành công.",
        failure: false,
      });
      setDialogVisible(true);
    } catch (error) {
      console.error("Lỗi khi lưu lịch hẹn phỏng vấn:", error);
      setDialogContent({
        title: "Lỗi",
        message: "Không thể cập nhật lịch hẹn phỏng vấn. Vui lòng thử lại.",
        failure: true,
      });
      setDialogVisible(true);
    } finally {
      setLoading(false);
    }
  };


  const renderItem = ({ item }: any) => (
    <View style={{ overflow: 'hidden' }}>
      <View style={{ backgroundColor: 'transparent' }}>
        <AppointmentCard
          sMaLichHenPhongVan={item.sMaLichHenPhongVan}
          sMaTinTuyenDung={item.sMaTinTuyenDung}
          sThoiGianPhongVan={item.sThoiGianPhongVan}
          sTieuDe={item.sTieuDe}
          sDiaDiem={item.sDiaDiem}
          sLoiNhan={item.sLoiNhan}
          sSDT={item.sSoDienThoai}
          sEmail={item.sEmailLienHe}
          onPressJobDetail={() => handleGoDetailJob(item.sMaTinTuyenDung)}
          onPressApplicantDetail={() => handleGoDetailApplicant(item.sMaUngVien, item.sMaTinTuyenDung)}
          onEdit={() => {
            handleOpenDialog(item)
            setSelectedAppointment(item)
            console.log("Selected appointment: ", item);
          }}

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
      <DialogInterview
        visible={dialogInterviewVisible}
        onClose={handleCloseDialog}
        sThoiGianPhongVan={selectedAppointment?.sThoiGianPhongVan}
        sDiaDiem={selectedAppointment?.sDiaDiem}
        sLoiNhan={selectedAppointment?.sLoiNhan}
        onConfirm={handleConfirmInterview}
        appointment={selectedAppointment}
      />
      <Dialog
        visible={dialogVisible}
        title={dialogContent.title}
        content={dialogContent.message}
        failure={dialogContent.failure}
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

export default AppointmentsScreen;