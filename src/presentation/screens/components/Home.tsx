import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  StatusBar,
  ScrollView
} from 'react-native';
// import firestore from '@react-native-firebase/firestore';
import JobCard from '../../components/JobCard';
import SearchBar from '../../components/SearchBar';
// import Pagination from '../../components/Pagination';
import { theme } from '../../../theme/theme';
import { Fonts } from '../../../theme/font';
import { useUser } from '../../../context/UserContext';
// const fbJob = firestore().collection('tblTinTuyenDung');
// const fbCT = firestore().collection('tblDoanhNghiep');

// const PAGE_SIZE = 5;

const Home = ({ bestJobs, recommendedJobs, navigation }: any) => {
  const { userInfo } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBestJobs, setFilteredBestJobs] = useState(bestJobs || []);
  const [filteredRecommendedJobs, setFilteredRecommendedJobs] = useState(recommendedJobs || []);

  const chunkArray = (array: any[], size: number) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };
  const groupedRecommendedJobs = chunkArray(filteredRecommendedJobs || [], 2);
  useEffect(() => {
    filterJobs(searchQuery);
  }, [searchQuery, bestJobs, recommendedJobs]);

  const filterJobs = (query: string) => {
    if (!query.trim()) {
      setFilteredBestJobs(bestJobs);
      setFilteredRecommendedJobs(recommendedJobs);
      return;
    }

    const filter = (jobs: any[]) =>
      jobs.filter((job: any) =>
        job.sViTriTuyenDung.toLowerCase().includes(query.toLowerCase()) ||
        job.sTenDoanhNghiep.toLowerCase().includes(query.toLowerCase())
      );

    setFilteredBestJobs(filter(bestJobs));
    setFilteredRecommendedJobs(filter(recommendedJobs));
  };

  const renderHorizontalItem = ({ item }: any) => (
    <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginHorizontal: 5 }}>
      {item.map((job: any, index: number) => (
        <JobCard
          key={index}
          companyLogo={job.sAnhDaiDien}
          companyName={job.sTenDoanhNghiep}
          jobTitle={job.sViTriTuyenDung}
          salaryMax={job.sMucLuongToiDa || 0}
          jobType="On-site"
          location={job.sDiaChiLamViec}
          onPress={() => navigation.navigate('job-detail', { sMaTinTuyenDung: job.sMaTinTuyenDung })}
        />
      ))}
    </View>
  );
  const renderVerticalItem = ({ item }: any) => (
    <JobCard
      companyLogo={item.sAnhDaiDien}
      companyName={item.sTenDoanhNghiep}
      jobTitle={item.sViTriTuyenDung}
      salaryMax={item.sMucLuongToiDa || 0}
      jobType="On-site"
      location={item.sDiaChiLamViec}
      onPress={() => navigation.navigate('job-detail', { sMaTinTuyenDung: item.sMaTinTuyenDung })}
      style={{ marginVertical: 10 }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#F0F4F7'} />
      <View style={styles.header}>
        <SearchBar style={{ width: "80%" }} value={searchQuery} onChangeText={setSearchQuery} />
        <Image
          source={userInfo?.sAnhDaiDien ? { uri: userInfo?.sAnhDaiDien } : require('../../../../asset/images/img_ellipse_3.png')}
          style={styles.avatar}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: groupedRecommendedJobs.length > 0 ? 350 : 100 }}>
          <Text style={styles.sectionTitle}>Việc làm dành cho bạn</Text>
          <FlatList
            data={(groupedRecommendedJobs)}
            renderItem={renderHorizontalItem}
            keyExtractor={(item, index) => `group-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            nestedScrollEnabled={true}
            ListEmptyComponent={() => (
              <Text style={styles.noJobsText}>Không tìm thấy công việc nào.</Text>
            )}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Việc làm tốt nhất</Text>
          <FlatList
            data={filteredBestJobs}
            renderItem={renderVerticalItem}
            keyExtractor={(item: any) => item.sMaTinTuyenDung}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            nestedScrollEnabled={true}
            windowSize={10}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <Text style={styles.noJobsText}>Không tìm thấy công việc nào.</Text>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 70,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontFamily: Fonts.medium.fontFamily,
    fontSize: 18,
    color: theme.colors.titleJob.third,
    marginVertical: 10,
    marginLeft: 10,
  },
  noJobsText: {
    textAlign: "center",
    marginHorizontal: 0,
    fontSize: 14,
    color: theme.colors.titleJob.primary,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    },
});
export default Home;
