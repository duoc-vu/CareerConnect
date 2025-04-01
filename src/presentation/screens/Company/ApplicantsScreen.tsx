import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ApplicantCard from '../../components/ApplicantCard';
import HeaderWithIcons from '../../components/Header';
import { useUser } from '../../../context/UserContext';
import Loading from '../../components/Loading';
import { useLoading } from '../../../context/themeContext';

const fbDonUngTuyen = firestore().collection('tblDonUngTuyen');

const ApplicantsScreen = ({ navigation }: any) => {
  const {userId} = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const {loading, setLoading} = useLoading();

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
          setLoading(false);
          return;
        }
  
        const applicantQuerySnapshot = await fbDonUngTuyen
          .where('sMaTinTuyenDung', 'in', jobIds)
          .get();
  
        const applicantsList: any = [];
        applicantQuerySnapshot.forEach(doc => {
          applicantsList.push({
            ...doc.data(),
            id: doc.id,
          });
        });
  
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
    filterApplicants(searchQuery);
  }, [searchQuery, applicants]);

  const filterApplicants = (query: any) => {
    if (!query.trim()) {
      setFilteredApplicants(applicants);
      return;
    }

    const filtered = applicants.filter((applicant: any) =>
      applicant.sMaUngVien?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredApplicants(filtered);
  };

  const updateStatus = async (applicantId: any, newStatus: any) => {
    try {
      await firestore()
        .collection('tblDonUngTuyen')
        .doc(applicantId)
        .update({
          sTrangThai: newStatus,
        });
      Alert.alert('Thành công', `Đã cập nhật trạng thái thành "${newStatus}".`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const handleAccept = (applicantId: any) => {
    const applicant: any = applicants.find((app: any) => app.id === applicantId);
    if (applicant.sTrangThai !== 'Chờ duyệt') {
      Alert.alert('Thông báo', 'Đơn này đã được xử lý.');
      return;
    }
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn chấp nhận đơn ứng tuyển này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Chấp nhận', onPress: () => updateStatus(applicantId, 'Đã duyệt') },
      ]
    );
  };

  const handleReject = (applicantId: any) => {
    const applicant: any = applicants.find((app: any) => app.id === applicantId);
    if (applicant.sTrangThai !== 'Chờ duyệt') {
      Alert.alert('Thông báo', 'Đơn này đã được xử lý.');
      return;
    }
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn từ chối đơn ứng tuyển này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Từ chối', onPress: () => updateStatus(applicantId, 'Từ chối') },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={{ overflow: 'hidden' }}>
        <View style={{ backgroundColor: 'transparent' }}>
            <ApplicantCard
                applicantId={item.id}
                applicantCode={item.sMaUngVien} 
                applicationDate={item.sNgayTao}
                status={item.sTrangThai}
                cvUrl={item.fFileCV}
                onViewCV={() =>
                    navigation.navigate('application-detail', {
                        sMaUngVien: item.sMaUngVien,
                        sMaTinTuyenDung: item.sMaTinTuyenDung,
                    })
                }
                onAccept={handleAccept}
                onReject={handleReject}
            />
        </View>
    </View>
);

  return (
    <View style={styles.container}>
      <HeaderWithIcons
       title='Quản lý tin tuyển dụng '
       backgroundColor='#f2f2f2'
       onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={filteredApplicants}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id || Math.random().toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.noApplicantsText}>
            {loading ? 'Đang tải...' : 'Chưa có ứng viên nào ứng tuyển.'}
          </Text>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
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

export default ApplicantsScreen;