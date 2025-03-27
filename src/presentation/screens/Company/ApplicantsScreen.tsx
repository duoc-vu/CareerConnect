import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ApplicantCard from '../../components/ApplicantCard';
import SearchBar from '../../components/SearchBar';
import { useUser } from '../../../context/UserContext';
import { theme } from '../../../theme/theme';
import { Fonts } from '../../../theme/font';

const fbDonUngTuyen = firestore().collection('tblDonUngTuyen');

const ApplicantsScreen = ({ route, navigation }: any) => {
  const { sMaTinTuyenDung } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId, userInfo } = useUser();

  useEffect(() => {
    const subscriber = fbDonUngTuyen
      .where('sMaTinTuyenDung', '==', sMaTinTuyenDung)
      .onSnapshot(
        (querySnapshot) => {
          const applicantsList: any = [];
          querySnapshot.forEach((documentSnapshot) => {
            applicantsList.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
          setApplicants(applicantsList);
          setFilteredApplicants(applicantsList);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching applicants:', error);
          setLoading(false);
        }
      );

    return () => subscriber();
  }, [sMaTinTuyenDung]);

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

  // Hàm xử lý xem CV
  const handleViewCV = (cvUrl: any) => {
    if (cvUrl) {
      Linking.openURL(cvUrl).catch((err) =>
        console.error('Error opening CV:', err)
      );
    } else {
      Alert.alert('Thông báo', 'Không tìm thấy file CV.');
    }
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
          onViewCV={handleViewCV}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#F0F4F7'} />
      <View style={styles.header}>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <SearchBar
            style={{ width: '80%' }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm kiếm ứng viên..."
          />
          <Image
            source={
              userInfo?.sAnhDaiDien
                ? { uri: userInfo?.sAnhDaiDien }
                : require('../../../../asset/images/img_ellipse_3.png')
            }
            style={styles.avatar}
          />
        </View>
      </View>

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