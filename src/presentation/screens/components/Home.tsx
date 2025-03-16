import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import JobCard from '../../components/JobCard';
import SearchBar from '../../components/SearchBar';
import Loading from "../../components/Loading";
import { useLoading } from '../../../theme/themeContext';
import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import { theme } from '../../../theme/theme';
import { Fonts } from '../../../theme/font';
import UploadButton from '../../components/UploadButton';

const fbJob = firestore().collection('tblTinTuyenDung');
const fbCT = firestore().collection('tblDoanhNghiep');

const PAGE_SIZE = 5;

const Home = ({ navigation, route }: any) => {
  const [jobs, setJobs] = useState<any>([]);
  const [user, setUser] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { loading, setLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const params = route?.params ?? {};
  const userId = params.userId ?? null;
  const userType = params.userType ?? 0;

  useEffect(() => {
    filterJobs(searchQuery);
  }, [searchQuery, jobs]);

  useEffect(() => {
    fetchJobs(currentPage);
    console.log(userId)
  }, [currentPage]);

  const handleUploadPress = () => {
    navigation.navigate("post-job", userId); 
  };

  const fetchJobs = async (page: number) => {
    setLoading(true);
    try {
      const querySnapshot = await fbJob.where("sCoKhoa", "==", 1).get();
      setTotalPages(Math.ceil(querySnapshot.size / PAGE_SIZE));

      const jobList: any = [];

      const promises = querySnapshot.docs.map(async (doc: any) => {
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
          } catch (error) {
            console.error("Error fetching company info:", error);
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

      const totalJobsSnapshot = await fbJob.where("sCoKhoa", "==", 1).get();
      setTotalPages(Math.ceil(totalJobsSnapshot.size / PAGE_SIZE));
      console.log("Total jobs with sCoKhoa == 1:", totalJobsSnapshot.size);
      console.log("Total pages:", Math.ceil(totalJobsSnapshot.size / PAGE_SIZE));

    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = (query: string) => {
    if (!query.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter((job: any) =>
      job.jobTitle.toLowerCase().includes(query.toLowerCase()) ||
      job.companyName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(filtered);
  };



  const renderItem = ({ item }: any) => {
    return (
      <View style={{ overflow: "hidden" }}>
        <View style={{ backgroundColor: "transparent" }}>
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
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#F0F4F7'} />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
          <Image
            source={userAvatar ? { uri: userAvatar } : require('../../../../asset/images/img_ellipse_3.png')}
            style={styles.avatar}
          />
          <View style={styles.welcomeText}>
            <Text style={{ fontSize: 20, ...Fonts.semiBold }}>Welcome Back,</Text>
            <Text style={styles.userName}>{user || "Guest"}</Text>
          </View>

        </View>
        <TouchableOpacity>
          <Image source={require('../../../../asset/images/img_notification.png')} style={styles.notificationIcon} />
        </TouchableOpacity>
      </View>


      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.jobId ? item.jobId.toString() : Math.random().toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.noJobsText}>Không tìm thấy công việc nào.</Text>
        )}
      />
      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        style={styles.paginationContainer}
        buttonStyle={styles.paginationButton}
        textStyle={styles.paginationText}
      /> */}
      <UploadButton onPress={handleUploadPress} />
      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.light,
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
    width: "80%",
    color: "#111827",
    ...Fonts.semiBold,
    marginLeft: 10
  },
  userName: {
    fontSize: 20,
    ...Fonts.semiBold,
  },
  notificationIcon: {
    width: 20,
    height: 20,
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
  paginationContainer: {
    marginTop: 20,
    marginBottom: 50
  },
  paginationButton: {
    backgroundColor: '#f1f1f1',
  },
  paginationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Home;
