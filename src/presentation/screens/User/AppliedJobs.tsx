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
import JobCard from '../../components/JobCard';

const fbDonUngTuyen = firestore().collection('tblDonUngTuyen');

const AppliedJobsScreen = ({ navigation }: any) => {
  const { userId } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
        try {
            const applicantQuerySnapshot = await fbDonUngTuyen
            .where('sMaUngVien', '==', userId)
            .get();

        const applicantsList: any = [];
        for (const doc of applicantQuerySnapshot.docs) {
            const applicantData = doc.data();

            // Lấy thông tin từ bảng tblTinTuyenDung dựa trên sMaTinTuyenDung
            const jobQuerySnapshot = await firestore()
                .collection('tblTinTuyenDung')
                .where('sMaTinTuyenDung', '==', applicantData.sMaTinTuyenDung)
                .get();

            if (!jobQuerySnapshot.empty) {
                const jobData = jobQuerySnapshot.docs[0].data();

                const companySnapshot = await firestore()
                    .collection('tblDoanhNghiep')
                    .where('sMaDoanhNghiep', '==', jobData.sMaDoanhNghiep)
                    .get();

                const companyData = !companySnapshot.empty
                    ? companySnapshot.docs[0].data()
                    : { sAnhDaiDien: '', sTenDoanhNghiep: 'Không xác định' };

                applicantsList.push({
                    ...applicantData,
                    id: doc.id,
                    jobTitle: jobData.sViTriTuyenDung || 'Không xác định',
                    sThoiGianUngTuyen: applicantData.sThoiGianUngTuyen || 'Không xác định', 
                    companyLogo: companyData.sAnhDaiDien || '',
                    companyName: companyData.sTenDoanhNghiep || 'Không xác định', 
                    location: jobData.sDiaChiLamViec || 'Không xác định', 
                    salaryMax: jobData.sMucLuongToiDa , 
                    sTrangThai: applicantData.sTrangThai || 2,
                });
            } else {
                applicantsList.push({
                    ...applicantData,
                    id: doc.id,
                    jobTitle: 'Không xác định',
                    sThoiGianUngTuyen: applicantData.sThoiGianUngTuyen || 'Không xác định',
                    companyLogo: '',
                    companyName: 'Không xác định',
                    location: 'Không xác định',
                    salaryMax: 0,
                    sTrangThai: applicantData.sTrangThai || 2,
                });
            }
        }

        setApplicants(applicantsList);
        setFilteredApplicants(applicantsList);
        } catch (error) {
            console.error('Error fetching applicants:', error);
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

  const renderItem = ({ item }: any) => (
    <View style={{ overflow: 'hidden' }}>
        <View style={{ backgroundColor: 'transparent' }}>
            <JobCard
                companyLogo={item.companyLogo} 
                companyName={item.companyName} 
                jobTitle={item.jobTitle} 
                salaryMax={item.salaryMax} 
                jobAppliTime ={item.sNgayTao}
                location={item.location} 
                sCoKhoa={item.sTrangThai}
                onPress={() =>
                    navigation.navigate('job-detail', {
                        sMaTinTuyenDung: item.sMaTinTuyenDung,
                    })
                }
            />
        </View>
    </View>
);

  return (
    <View style={styles.container}>
      <HeaderWithIcons
        title='Danh sách ứng tuyển'
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
                    Chưa có đơn ứng tuyển nào.
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

export default AppliedJobsScreen;