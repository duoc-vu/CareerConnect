import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import JobCard from '../../components/JobCard';
import SearchBar from '../../components/SearchBar';
import { useLoading } from '../../../context/themeContext';
import Pagination from '../../components/Pagination';
import { theme } from '../../../theme/theme';
import { Fonts } from '../../../theme/font';
import UploadButton from '../../components/UploadButton';
import { useUser } from '../../../context/UserContext';
const fbJob = firestore().collection('tblTinTuyenDung');
const fbCT = firestore().collection('tblDoanhNghiep');

const PAGE_SIZE = 5;

const Home = ({ jobs, navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  const { userId, userType, userInfo } = useUser();

  useEffect(() => {
    filterJobs(searchQuery);
  }, [searchQuery, jobs]);

  const handleUploadPress = () => {
    navigation.navigate("post-job", userId);
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
            companyLogo={item.sAnhDaiDien}
            companyName={item.sTenDoanhNghiep}
            jobTitle={item.sViTriTuyenDung}
            salaryMax={item.sMucLuongToiDa ? item.sMucLuongToiDa : 0}
            jobType="On-site"
            location={item.sDiaChiLamViec}
            onPress={() =>
              navigation.navigate('job-detail', { sMaTinTuyenDung: item.sMaTinTuyenDung })
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
        <View style={{ width: "100%" , flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly" }}>
          <SearchBar style={{ width: "80%" }} value={searchQuery} onChangeText={setSearchQuery} />
          <Image
            source={userInfo?.sAnhDaiDien ? { uri: userInfo?.sAnhDaiDien } : require('../../../../asset/images/img_ellipse_3.png')}
            style={styles.avatar}
          />
        </View>
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 10,
    width: "100%"
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
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
