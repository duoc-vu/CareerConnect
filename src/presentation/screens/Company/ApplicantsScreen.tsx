import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ApplicantCard from '../../components/ApplicantCard';
import HeaderWithIcons from '../../components/Header';
import { useUser } from '../../../context/UserContext';
import Loading from '../../components/Loading';
import { useLoading } from '../../../context/themeContext';
import Dialog from '../../components/Dialog';
import { theme } from '../../../theme/theme';

const fbDonUngTuyen = firestore().collection('tblDonUngTuyen');

const STATUS_TEXT_MAPPING: { [key: number]: string } = {
  1: "Đã duyệt",
  2: "Chờ duyệt",
  3: "Từ chối",
};

const ApplicantsScreen = ({ navigation }: any) => {
  const { userId } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [applicants, setApplicants] = useState<any[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);
  const { loading, setLoading } = useLoading();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    content: '',
    confirm: null as null | { text: string; onPress: () => void },
    dismiss: null as null | { text: string; onPress: () => void },
    failure: false,
  });

  const [groupedApplicants, setGroupedApplicants] = useState<any[]>([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const jobQuerySnapshot = await firestore()
          .collection('tblTinTuyenDung')
          .where('sMaDoanhNghiep', '==', userId)
          .get();

        const jobs = jobQuerySnapshot.docs.map(doc => ({
          sMaTinTuyenDung: doc.data().sMaTinTuyenDung,
          sViTriTuyenDung: doc.data().sViTriTuyenDung,
        }));

        if (jobs.length === 0) {
          setGroupedApplicants([]);
          return;
        }

        const applicantQuerySnapshot = await fbDonUngTuyen
          .where('sMaTinTuyenDung', 'in', jobs.map(job => job.sMaTinTuyenDung))
          .get();

        const applicantsList = applicantQuerySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          sMaTinTuyenDung: doc.data().sMaTinTuyenDung || ''
        }));

        const grouped = jobs.map(job => ({
          sMaTinTuyenDung: job.sMaTinTuyenDung,
          sViTriTuyenDung: job.sViTriTuyenDung,
          applicants: applicantsList.filter(applicant => applicant.sMaTinTuyenDung === job.sMaTinTuyenDung),
        }));

        setGroupedApplicants(grouped);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [userId]);

  const renderGroup = ({ item }: any) => (
    <View style={styles.groupContainer}>
      <Text style={styles.groupTitle}>{item.sViTriTuyenDung} (#{item.sMaTinTuyenDung})</Text>
      {item.applicants.length === 0 ? (
        <Text style={styles.noApplicantsText}>Không có đơn ứng tuyển nào</Text>
      ) : (
        <>
          {item.applicants.slice(0, 1).map((applicant: any) => (
            <ApplicantCard
              key={applicant.id}
              applicantCode={applicant.sMaDonUngTuyen}
              applicationDate={applicant.sNgayTao}
              status={STATUS_TEXT_MAPPING[applicant.sTrangThai]}
              cvUrl={applicant.fFileCV}
              onViewCV={() =>
                navigation.navigate('application-detail', {
                  sMaUngVien: applicant.sMaUngVien,
                  sMaTinTuyenDung: applicant.sMaTinTuyenDung,
                })
              }
              onAccept={() => handleAccept(applicant.sMaDonUngTuyen)}
              onReject={() => handleReject(applicant.sMaDonUngTuyen)}
            />
          ))}
          {item.applicants.length > 1 && (
            <Text
              style={styles.viewMore}
              onPress={() =>
                navigation.navigate('job-applicants', {
                  sMaTinTuyenDung: item.sMaTinTuyenDung,
                  sViTriTuyenDung: item.sViTriTuyenDung,
                })
              }
            >
              Xem thêm
            </Text>
          )}
        </>
      )}
    </View>
  );

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const jobQuerySnapshot = await firestore()
          .collection('tblTinTuyenDung')
          .where('sMaDoanhNghiep', '==', userId)
          .get();

        const jobIds = jobQuerySnapshot.docs.map(doc => doc.data().sMaTinTuyenDung);

        if (jobIds.length === 0) {
          setApplicants([]);
          setFilteredApplicants([]);
          return;
        }

        const applicantQuerySnapshot = await fbDonUngTuyen
          .where('sMaTinTuyenDung', 'in', jobIds)
          .get();

        const applicantsList = applicantQuerySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        setApplicants(applicantsList);
        setFilteredApplicants(applicantsList);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [userId]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredApplicants(applicants);
      return;
    }

    const filtered = applicants.filter((applicant: any) =>
      applicant.sMaUngVien?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplicants(filtered);
  }, [searchQuery, applicants]);

  const updateStatus = async (sMaDonUngTuyen: string, newStatus: number) => {
    try {
      const snapshot = await firestore()
        .collection('tblDonUngTuyen')
        .where('sMaDonUngTuyen', '==', sMaDonUngTuyen)
        .get();

      if (snapshot.empty) {
        showDialog('Lỗi', 'Không tìm thấy ứng viên.', true, null, {
          text: 'Đóng',
          onPress: () => setDialogVisible(false),
        });
        return;
      }

      // Lấy ID tài liệu Firestore
      const docId = snapshot.docs[0].id;

      // Cập nhật trạng thái trong Firestore
      await firestore()
        .collection('tblDonUngTuyen')
        .doc(docId)
        .update({ sTrangThai: newStatus });

      // Cập nhật trạng thái trong danh sách `applicants` và `filteredApplicants`
      setApplicants(prev =>
        prev.map(applicant =>
          applicant.sMaDonUngTuyen === sMaDonUngTuyen
            ? { ...applicant, sTrangThai: newStatus }
            : applicant
        )
      );

      setFilteredApplicants(prev =>
        prev.map(applicant =>
          applicant.sMaDonUngTuyen === sMaDonUngTuyen
            ? { ...applicant, sTrangThai: newStatus }
            : applicant
        )
      );

      // Hiển thị thông báo thành công
      showDialog('Thành công', `Đã cập nhật trạng thái thành "${STATUS_TEXT_MAPPING[newStatus]}".`, false, null, {
        text: 'Đóng',
        onPress: () => setDialogVisible(false),
      });
    } catch (error) {
      console.error('Error updating status:', error);
      showDialog('Lỗi', 'Không thể cập nhật trạng thái. Vui lòng thử lại.', true, null, {
        text: 'Đóng',
        onPress: () => setDialogVisible(false),
      });
    }
  };

  const handleAccept = async (applicantId: string) => {
    const applicant = await fetchApplicant(applicantId);
    if (!applicant) return;

    if (applicant.sTrangThai !== 2) {
      showDialog('Thông báo', 'Đơn này đã được xử lý.', true);
      return;
    }

    showDialog(
      'Xác nhận',
      'Bạn có chắc chắn muốn chấp nhận đơn ứng tuyển này?',
      false,
      {
        text: 'Xác nhận',
        onPress: async () => {
          setDialogVisible(false);
          await updateStatus(applicantId, 1);
        },
      },
      { text: 'Hủy', onPress: () => setDialogVisible(false) }
    );
  };

  const handleReject = async (applicantId: string) => {
    const applicant = await fetchApplicant(applicantId);
    if (!applicant) return;

    if (applicant.sTrangThai !== 2) {
      showDialog('Thông báo', 'Đơn này đã được xử lý.', true);
      return;
    }

    showDialog(
      'Xác nhận',
      'Bạn có chắc chắn muốn từ chối đơn ứng tuyển này?',
      false,
      {
        text: 'Từ chối',
        onPress: async () => {
          setDialogVisible(false);
          await updateStatus(applicantId, 3);
        },
      },
      { text: 'Hủy', onPress: () => setDialogVisible(false) }
    );
  };

  const fetchApplicant = async (applicantId: string) => {
    try {
      const snapshot = await firestore()
        .collection('tblDonUngTuyen')
        .where('sMaDonUngTuyen', '==', applicantId)
        .get();

      if (snapshot.empty) {
        showDialog('Lỗi', 'Không tìm thấy ứng viên.', true);
        return null;
      }

      return snapshot.docs[0].data();
    } catch (error) {
      console.error('Error fetching applicant:', error);
      showDialog('Lỗi', 'Đã xảy ra lỗi khi xử lý yêu cầu.', true);
      return null;
    }
  };

  const showDialog = (
    title: string,
    content: string,
    failure: boolean,
    confirm: { text: string; onPress: () => void } | null = null,
    dismiss: { text: string; onPress: () => void } | null = null
  ) => {
    setDialogContent({ title, content, confirm, dismiss, failure });
    setDialogVisible(true);
  };

  const renderItem = ({ item }: any) => (
    <ApplicantCard
      applicantCode={item.sMaDonUngTuyen}
      applicationDate={item.sNgayTao}
      status={STATUS_TEXT_MAPPING[item.sTrangThai]}
      cvUrl={item.fFileCV}
      onViewCV={() =>
        navigation.navigate('application-detail', {
          sMaUngVien: item.sMaUngVien,
          sMaTinTuyenDung: item.sMaTinTuyenDung,
        })
      }
      onAccept={() => handleAccept(item.sMaDonUngTuyen)}
      onReject={() => handleReject(item.sMaDonUngTuyen)}
    />
  );

  return (
    <View style={styles.container}>
      <HeaderWithIcons
        title="Quản lý đơn ứng tuyển"
        backgroundColor="#f2f2f2"
        onBackPress={() => navigation.goBack()}
        style={styles.header}
      />
      <FlatList
        data={groupedApplicants}
        renderItem={renderGroup}
        keyExtractor={(item: any) => item.sMaTinTuyenDung}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.noApplicantsText}>
            {loading ? 'Đang tải...' : 'Chưa có ứng viên nào ứng tuyển.'}
          </Text>
        )}
      />

      <Dialog
        visible={dialogVisible}
        title={dialogContent.title}
        content={dialogContent.content}
        confirm={dialogContent.confirm}
        dismiss={dialogContent.dismiss}
        failure={dialogContent.failure}
      />
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
  header: {
    textAlign: 'center',
    verticalAlign: "middle"
  },
  list: {
    paddingBottom: 50,
  },
  noApplicantsText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 20,
  },
  groupContainer: {
    marginBottom: 20,
    backgroundColor: theme.template.biru,
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  groupList: {
    paddingBottom: 10,
  },
  viewMore: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
  },
});

export default ApplicantsScreen;