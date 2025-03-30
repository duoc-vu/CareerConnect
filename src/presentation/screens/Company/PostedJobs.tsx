import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import JobCard from '../../components/JobCard';
import SearchBar from '../../components/SearchBar';
import { useUser } from '../../../context/UserContext';
import UploadButton from '../../components/UploadButton';
import FilterDialog from '../../components/FilterDialog';

const fbJob = firestore().collection('tblTinTuyenDung');

const PostedJobs = ({ navigation }:any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [postedJobs, setPostedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { userId, userInfo } = useUser();
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false); 
  const [isFilterActive, setIsFilterActive] = useState(false); 

  useEffect(() => {
    const subscriber = fbJob
      .where('sMaDoanhNghiep', '==', userId)
      .onSnapshot(
        (querySnapshot) => {
          const jobs:any = [];
          querySnapshot.forEach((documentSnapshot) => {
            jobs.push({
              ...documentSnapshot.data(),
            });
          });
          setPostedJobs(jobs);
          setFilteredJobs(jobs);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching posted jobs:', error);
          setLoading(false);
        }
      );

    return () => subscriber();
  }, [userId]);

  useEffect(() => {
    filterJobs(searchQuery);
  }, [searchQuery, postedJobs]);

  const filterJobs = (query:any) => {
    if (!query.trim()) {
      setFilteredJobs(postedJobs);
      return;
    }

    const filtered = postedJobs.filter((job:any) =>
      job.sViTriTuyenDung?.toLowerCase().includes(query.toLowerCase()) ||
      job.sTenDoanhNghiep?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleUploadPress = () => {
    navigation.navigate("post-job", { userId });
  };

  const handleApplyFilters = (filters: any) => {
    const { jobType } = filters; 
    const filtered = postedJobs.filter((job: any) => {
      const matchesStatus = jobType
        ? (job.sCoKhoa === 1 && jobType === 'Đã duyệt') ||
          (job.sCoKhoa === 2 && jobType === 'Chờ duyệt') ||
          (job.sCoKhoa === 3 && jobType === 'Từ chối') ||
          (job.sCoKhoa === 4 && jobType === 'Hết hạn')
        : true; 
      return matchesStatus;
    });
  
    setFilteredJobs(filtered);
    setIsFilterActive(true); 
  };

  const renderItem = ({ item }:any) => (
    <View style={{ overflow: 'hidden' }}>
      <View style={{ backgroundColor: 'transparent' }}>
        <JobCard
          companyLogo={item.sAnhDaiDien}
          companyName={userInfo?.sTenDoanhNghiep}
          jobTitle={item.sViTriTuyenDung}
          salaryMax={item.sMucLuongToiDa || 0}
          jobType="On-site"
          location={item.sDiaChiLamViec}
          sCoKhoa={item.sCoKhoa}
          onPress={() =>
            navigation.navigate('applicant-list', { sMaTinTuyenDung: item.sMaTinTuyenDung })
          }
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
            style={{ width: '85%' }} 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
            placeholder="Tìm kiếm công việc đã đăng..."
          />
          <TouchableOpacity
            onPress={() => setFilterVisible(true)} 
          >
            <Image
              source={
                isFilterActive
                  ? require('../../../../asset/images/img_filter_active.png') 
                  : require('../../../../asset/images/img_filter.png') 
              }
              style={styles.filter}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={(item:any) => item.sMaTinTuyenDung || Math.random().toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.noJobsText}>
            {loading ? 'Đang tải...' : 'Chưa có tin tuyển dụng nào.'}
          </Text>
        )}
      />
      <UploadButton onPress={handleUploadPress} />
      <FilterDialog
        visible={filterVisible}
        onClose={() => setFilterVisible(false)} 
        onApply={handleApplyFilters} 
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
  filter: {
    width: 45,
    height: 45,
    marginLeft: 10,
    resizeMode: 'contain', 
  },
  list: {
    paddingBottom: 50,
  },
  noJobsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 20,
  },
});

export default PostedJobs;