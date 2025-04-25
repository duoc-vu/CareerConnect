import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
} from 'react-native';
import JobCard from '../../components/JobCard';
import SearchBar from '../../components/SearchBar';
import { theme } from '../../../theme/theme';
import { Fonts } from '../../../theme/font';
import { useUser } from '../../../context/UserContext';

const Home = ({ fetchJobData, bestJobs, recommendedJobs, navigation }: any) => {
  const { userType, userInfo } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBestJobs, setFilteredBestJobs] = useState(bestJobs || []);
  const [filteredRecommendedJobs, setFilteredRecommendedJobs] = useState(recommendedJobs || []);

  const groupedRecommendedJobs = useMemo(() => {
    const chunkArray = (array: any[], size: number) => {
      const chunked = [];
      for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
      }
      return chunked;
    };
    return chunkArray(filteredRecommendedJobs || [], 2);
  }, [filteredRecommendedJobs]);

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

  useEffect(() => {
    filterJobs(searchQuery);
  }, [searchQuery, bestJobs, recommendedJobs]);

  const renderHorizontalItem = ({ item }: any) => (
    <View style={styles.horizontalGroup}>
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
      style={styles.verticalJobCard}
    />
  );
  const renderHeader = () => (
    <View>
      {userType === 1 && filteredRecommendedJobs && filteredRecommendedJobs.length > 0 && (
        <View style={styles.recommendedJobsContainer}>
          <Text style={styles.recommendedJobsTitle}>Việc làm dành cho bạn</Text>
          <FlatList
            data={groupedRecommendedJobs}
            renderItem={renderHorizontalItem}
            keyExtractor={(item, index) => `group-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            nestedScrollEnabled
            ListEmptyComponent={() => <Text style={styles.noJobsText}>Không tìm thấy công việc nào.</Text>}
          />
        </View>
      )}
      <Text style={styles.sectionTitle}>Việc làm tốt nhất</Text>
    </View>
  );
  return (
    <>
      <View style={styles.header}>
        <SearchBar style={styles.searchBar} value={searchQuery} onChangeText={setSearchQuery} />
        <Image
          source={userInfo?.sAnhDaiDien ? { uri: userInfo?.sAnhDaiDien } : require('../../../../asset/images/img_ellipse_3.png')}
          style={styles.avatar}
        />
      </View>
      <FlatList
        data={filteredBestJobs}
        renderItem={renderVerticalItem}
        keyExtractor={(item: any) => item.sMaTinTuyenDung}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        contentContainerStyle={styles.verticalList}
        onEndReached={() => fetchJobData(true)}
        onEndReachedThreshold={0.9}
        ListEmptyComponent={() => (
          <Text style={styles.noJobsText}>Không tìm thấy công việc nào.</Text>
        )}
        ListHeaderComponent={renderHeader}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 70,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    marginHorizontal: 20,
    marginTop: 10
  },
  searchBar: {
    width: '80%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  recommendedJobsContainer: {
    height: 370,
    paddingBottom: 20,
    backgroundColor: theme.template.biru,
    borderRadius: 10,
  },
  recommendedJobsTitle: {
    color: theme.template.abu,
    marginLeft: 20,
    fontFamily: Fonts.medium.fontFamily,
    fontSize: 18,
    marginVertical: 10,
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  horizontalGroup: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  sectionTitle: {
    fontFamily: Fonts.medium.fontFamily,
    fontSize: 18,
    color: theme.colors.titleJob.third,
    marginVertical: 10,
    marginLeft: 10,
  },
  verticalList: {
    paddingHorizontal: 10,
  },
  verticalJobCard: {
    marginVertical: 10,
  },
  noJobsText: {
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.titleJob.primary,
    marginTop: 10,
  },
});

export default Home;