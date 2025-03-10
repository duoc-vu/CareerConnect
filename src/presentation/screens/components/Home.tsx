import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Button
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useFocusEffect } from '@react-navigation/native';
import JobCard from '../../components/JobCard';
import SearchBar from '../../components/SearchBar';

const fbJob = firestore().collection('tblTinTuyenDung');
const fbCT = firestore().collection('tblDoanhNghiep');

const Home = ({ navigation, route }: any) => {
  const [jobs, setJobs] = useState<any>([]);
  const [user, setUser] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  const params = route?.params ?? {};
  const userId = params.userId ?? null;
  const userType = params.userType ?? 0;

  const fetchJobs = async () => {
    try {
      const querySnapshot = await fbJob.get();
      const jobList: any = [];

      const promises = querySnapshot.docs.map(async (doc) => {
        const jobData = doc.data();
        let companyName = 'Unknown Company';
        let companyLogo = '';

        if (jobData.sMaDoanhNghiep) {
          try {
            const companySnapshot = await fbCT.where(
              'sMaDoanhNghiep',
              '==',
              jobData.sMaDoanhNghiep
            ).get();

            if (!companySnapshot.empty) {
              const companyDoc = companySnapshot.docs[0];
              const companyData = companyDoc.data();
              companyName = companyData?.sTenDoanhNghiep || 'Unknown Company';
              const avatarRef = storage().ref(
                `Avatar_Cong_Ty/${jobData.sMaDoanhNghiep}.png`
              );
              companyLogo = await avatarRef.getDownloadURL();
            }
          } catch(error) {
            if (error instanceof Error) {
              // crashlytics().recordError(error);
            } else {
              // Handle the case where the error is not of type Error
              // crashlytics().recordError(new Error('An unknown error occurred'));
            }
          }
        }

        jobList.push({
          idJob: jobData.sMaTinTuyenDung,
          jobTitle: jobData.sViTriTuyenDung,
          companyName,
          companyLogo,
          salaryMin: jobData.sMucLuongToiThieu,
          salaryMax: jobData.sMucLuongToiDa,
          jobType: jobData.sTrangThai || 'Full-time',
          location: jobData.sDiaChiLamViec || 'Remote',
        });
      });

      await Promise.all(promises);
      setJobs(jobList);
      setFilteredJobs(jobList); // Hiển thị tất cả lúc đầu
    } catch (error) {
      if (error instanceof Error) {
        // crashlytics().recordError(error);
      } else {
        // Handle the case where the error is not of type Error
        // crashlytics().recordError(new Error('An unknown error occurred'));
      }
      console.error('Error fetching jobs:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [])
  );



  // 🔍 Tạo hàm filterJobs riêng biệt
  const filterJobs = (query: string) => {
    if (!query.trim()) {
      setFilteredJobs(jobs); // Nếu không nhập gì, hiển thị tất cả công việc
      return;
    }
    
    const filtered = jobs.filter((job: any) =>
      job.jobTitle.toLowerCase().includes(query.toLowerCase()) ||
      job.companyName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  // 🔄 Cập nhật danh sách khi `searchQuery` thay đổi
  useEffect(() => {
    filterJobs(searchQuery);
  }, [searchQuery, jobs]);

  const renderItem = ({ item }: any) => (
    <View style={{ overflow: "hidden" }}>
      <View key={`job-${item.idJob}`} style={{ backgroundColor: "transparent" }}>
        <JobCard
          companyLogo={item.companyLogo}
          companyName={item.companyName}
          jobTitle={item.jobTitle}
          salaryMin={item.salaryMin ? item.salaryMin : 0}
          salaryMax={item.salaryMax ? item.salaryMax : 0}
          jobType={item.jobType}
          location={item.location}
          onPress={() => 
            navigation.navigate('JobDetail', { jobId: item.idJob, userId, userType })
          }
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#F0F4F7'} />
      <View style={styles.header}>
        <Image
          source={userAvatar ? { uri: userAvatar } : require('../../../../asset/images/img_ellipse_3.png')}
          style={styles.avatar}
        />
        <Text style={styles.welcomeText}>Welcome Back, <Text style={styles.userName}>{user || "Guest"}</Text></Text>
        <TouchableOpacity>
          <Image source={require('../../../../asset/images/img_notification.png')} style={styles.notificationIcon} />
        </TouchableOpacity>
      </View>
      

      {/* 🔍 Ô tìm kiếm */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Danh sách công việc */}
      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={(item:any) => item.jobId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.noJobsText}>Không tìm thấy công việc nào.</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F7',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "400",
  },
  userName: {
    fontWeight: "700",
  },
  notificationIcon: {
    width: 26,
    height: 26,
  },
  list: {
    paddingBottom: 50,
  },
  noJobsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
    marginTop: 20,
  },
});

export default Home;
