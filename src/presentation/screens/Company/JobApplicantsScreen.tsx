import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ApplicantCard from '../../components/ApplicantCard';
import HeaderWithIcons from '../../components/Header';
import Loading from '../../components/Loading';
import Dialog from '../../components/Dialog';

const STATUS_TEXT_MAPPING: { [key: number]: string } = {
    1: "Đã duyệt",
    2: "Chờ duyệt",
    3: "Từ chối",
};

const JobApplicantsScreen = ({ route, navigation }: any) => {
    const { sMaTinTuyenDung, sViTriTuyenDung } = route.params;
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogContent, setDialogContent] = useState({
        title: '',
        content: '',
        confirm: null as null | { text: string; onPress: () => void },
        dismiss: null as null | { text: string; onPress: () => void },
        failure: false,
    });
  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);

    
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

    useEffect(() => {
        const fetchApplicants = async () => {
            setLoading(true);
            try {
                const applicantQuerySnapshot = await firestore()
                    .collection('tblDonUngTuyen')
                    .where('sMaTinTuyenDung', '==', sMaTinTuyenDung)
                    .get();

                const applicantsList = applicantQuerySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                setApplicants(applicantsList);
            } catch (error) {
                console.error('Error fetching applicants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [sMaTinTuyenDung]);

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

    const updateStatus = async (applicantId: string, newStatus: number) => {
        try {
          await firestore()
            .collection('tblDonUngTuyen')
            .doc(applicantId)
            .update({ sTrangThai: newStatus });
    
          setApplicants(prev =>
            prev.map(applicant =>
              applicant.id === applicantId
                ? { ...applicant, sTrangThai: newStatus }
                : applicant
            )
          );
    
          setFilteredApplicants(prev =>
            prev.map(applicant =>
              applicant.id === applicantId
                ? { ...applicant, sTrangThai: newStatus }
                : applicant
            )
          );
    
          showDialog('Thành công', `Đã cập nhật trạng thái thành "${STATUS_TEXT_MAPPING[newStatus]}".`, false);
        } catch (error) {
          console.error('Error updating status:', error);
          showDialog('Lỗi', 'Không thể cập nhật trạng thái. Vui lòng thử lại.', true);
        }
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

    return (
        <>
        <View style={styles.container}>
            <HeaderWithIcons
                title={`Ứng viên - ${sViTriTuyenDung}`}
                onBackPress={() => navigation.goBack()}
                style={styles.header}
            />
            {loading ? (
                <Loading />
            ) : (
                <FlatList
                    data={applicants}
                    renderItem={renderItem}
                    keyExtractor={(item: any) => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={() => (
                        <Text style={styles.noApplicantsText}>Không có ứng viên nào ứng tuyển.</Text>
                    )}
                />
            )}
        </View>
        <Dialog
        visible={dialogVisible}
        title={dialogContent.title}
        content={dialogContent.content}
        confirm={dialogContent.confirm}
        dismiss={dialogContent.dismiss}
        failure={dialogContent.failure}
      />
      {loading && <Loading />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 15,
    },
    header:{
        backgroundColor: '#f2f2f2',
    },
    list: {
        paddingBottom: 50,
    },
    noApplicantsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#6B7280',
        marginTop: 20,
    },
});

export default JobApplicantsScreen;