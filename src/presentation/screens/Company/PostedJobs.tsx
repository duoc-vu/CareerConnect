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
import Dialog from '../../components/Dialog';

const fbJob = firestore().collection('tblTinTuyenDung');

const PostedJobs = ({ navigation }:any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [postedJobs, setPostedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { userId, userInfo } = useUser();
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false); 
  const [isFilterActive, setIsFilterActive] = useState(false); 
  const [companyDetail, setCompanyDetail] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    content: '',
    confirm: null as null | { text: string; onPress: () => void },
    dismiss: null as null | { text: string; onPress: () => void },
    failure: false, // Xác định trạng thái thành công hay thất bại
  });


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

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        const companySnapshot = await firestore()
          .collection('tblDoanhNghiep')
          .where('sMaDoanhNghiep', '==', userId)
          .get();
  
        if (!companySnapshot.empty) {
          const companyData = companySnapshot.docs[0].data();
          setCompanyDetail(companyData);
        } else {
          console.error('Không tìm thấy thông tin doanh nghiệp.');
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };
  
    fetchCompanyDetail();
  }, []);

  const handleUploadPress = async () => {
  try {
    const companySnapshot = await firestore()
      .collection('tblDoanhNghiep')
      .where('sMaDoanhNghiep', '==', userId)
      .get();

    if (!companySnapshot.empty) {
      navigation.navigate("post-job");
    } else {
      setDialogContent({
        title: 'Thông báo',
        content: 'Doanh nghiệp của bạn chưa đăng ký thông tin. Vui lòng đăng ký thông tin doanh nghiệp trước khi đăng tin tuyển dụng.',
        confirm: {
          text: 'Đăng ký ngay',
          onPress: () => {
            setDialogVisible(false);
            navigation.navigate('edit-employer-profile'); 
          },
        },
        dismiss: {
          text: 'Hủy',
          onPress: () => setDialogVisible(false),
        },
        failure: true,
      });
      setDialogVisible(true);
    }
  } catch (error) {
    console.error('Error checking company details:', error);
    setDialogContent({
      title: 'Lỗi',
      content: 'Không thể kiểm tra thông tin doanh nghiệp. Vui lòng thử lại.',
      confirm: {
        text: 'Đóng',
        onPress: () => setDialogVisible(false),
      },
      dismiss: null,
      failure: true,
    });
    setDialogVisible(true);
  }
};

  const handleApplyFilters = (filters: any) => {
    const { jobType } = filters; 
    const filtered = postedJobs.filter((job: any) => {
      const matchesStatus = jobType
        ? (job.sCoKhoa === 1 && jobType === 'Đã duyệt') ||
          (job.sCoKhoa === 3 && jobType === 'Bị khóa') ||
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
          companyLogo={companyDetail?.sAnhDaiDien}
          companyName={userInfo?.sTenDoanhNghiep}
          jobTitle={item.sViTriTuyenDung}
          salaryMax={item.sMucLuongToiDa || 0}
          jobType="On-site"
          location={item.sDiaChiLamViec}
          sCoKhoa={item.sCoKhoa}
          onPress={() =>
            navigation.navigate('job-detail-employer', { sMaTinTuyenDung: item.sMaTinTuyenDung })
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
      <Dialog
        visible={dialogVisible}
        title={dialogContent.title}
        content={dialogContent.content}
        confirm={dialogContent.confirm}
        dismiss={dialogContent.dismiss}
        failure={dialogContent.failure}
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