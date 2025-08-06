import React, { useEffect, useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/themeContext';
import { Image, View, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import Home from '../presentation/screens/components/Home';
import AccountCompany from '../presentation/screens/Company/ProfileEmployer';
import JobCompany from '../presentation/screens/Company/PostedJobs';
import AppliedJobs from '../presentation/screens/User/AppliedJobs';
import { useLoading } from '../context/themeContext';
import Loading from "../presentation/components/Loading";
import SettingScreen from '../presentation/screens/components/SettingScreen';
import { useUser } from '../context/UserContext';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import PostedJobs from '../presentation/screens/Company/PostedJobs';
import JobSaved from '../presentation/screens/User/JobSaved';

const homeIconActive = require('../../asset/images/img_home_active.png');
const homeIcon = require('../../asset/images/img_home.png');
const searchIcon = require('../../asset/images/img_search_bottom.png');
const searchIconActive = require('../../asset/images/img_search_bottom_active.png');
const saveIcon = require('../../asset/images/img_save_bottom.png');
const saveIconActive = require('../../asset/images/img_save_bottom_active.png');
const profileIcon = require('../../asset/images/img_user_bottom.png');
const profileIconActive = require('../../asset/images/img_user_bottom_active.png');
const posted = require('../../asset/images/img_bottom_manager.png');
const postedActive = require('../../asset/images/img_bottom_manager_active.png');

const Tab = createBottomTabNavigator();

const fbJob = firestore().collection('tblTinTuyenDung');
const fbCT = firestore().collection('tblDoanhNghiep');

const BottomBar = () => {
  const { theme } = useTheme();
  const { userId, userType, userInfo } = useUser();
  const { loading, setLoading } = useLoading();
  const [bestJobs, setBestJobs] = useState<any>([]);
  const [recommendedJobs, setRecommendedJobs] = useState();

  const navigation = useNavigation()
  const PAGE_SIZE = 10;
  const [lastVisible, setLastVisible] = useState(null); 
  const [loadingMore, setLoadingMore] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 
  
  useEffect(() => {
    const loadData = async () => {
      await updateJobStatus();
      await fetchRecommendedJobs();
      await fetchJobData();
    };
    loadData();
  }, []);

  const updateJobStatus = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const querySnapshot = await fbJob.get();
      const batch = firestore().batch();

      const promises = querySnapshot.docs.map(async (doc) => {
        const jobData = doc.data();
        let newStatus = jobData.sTrangThai;
        let newCoKhoa = jobData.sCoKhoa;

        const ngayBatDau = new Date(jobData.sThoiGianDangBai);
        const hanTuyen = new Date(jobData.sThoiHanTuyenDung);

        if (today > hanTuyen) {
          newStatus = "Hết hạn";
          newCoKhoa = 4;
        } else if (today >= ngayBatDau) {
          newStatus = "Đang tuyển";
        }

        if (newStatus !== jobData.sTrangThai || newCoKhoa !== jobData.sCoKhoa) {
          console.log(`Updating job ${jobData.sMaTinTuyenDung}: ${jobData.sTrangThai} -> ${newStatus}`);
          batch.update(doc.ref, { sTrangThai: newStatus, sCoKhoa: newCoKhoa });
        }
      });

      await Promise.all(promises);
      await batch.commit();
      console.log("Job statuses updated successfully");
    } catch (error) {
      console.error("Error updating job statuses:", error);
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true); // Hiển thị trạng thái tải
      const recommendedQuery = fbJob
        .where("sCoKhoa", "==", 1)
        .where("sLinhVucTuyenDung", "==", userInfo?.sLinhVuc || "")
        .orderBy("sThoiGianDangBai", "desc");
  
      const querySnapshot = await recommendedQuery.get();
      const recommendedJob: any = [];
  
      const promises = querySnapshot.docs.map(async (doc) => {
        const jobData = doc.data();
        let companyName = 'Unknown Company';
        let companyLogo = '';
  
        if (jobData.sMaDoanhNghiep) {
          try {
            const companySnapshot = await fbCT.where('sMaDoanhNghiep', '==', jobData.sMaDoanhNghiep).get();
            if (!companySnapshot.empty) {
              const companyData = companySnapshot.docs[0].data();
              companyName = companyData?.sTenDoanhNghiep || 'Unknown Company';
              companyLogo = companyData?.sAnhDaiDien || '';
            }
          } catch (error) {
            console.error("Error fetching company info:", error);
          }
        }
  
        const jobItem = {
          sMaTinTuyenDung: jobData.sMaTinTuyenDung,
          sViTriTuyenDung: jobData.sViTriTuyenDung,
          sTenDoanhNghiep: companyName,
          sAnhDaiDien: companyLogo,
          sMucLuongToiThieu: jobData.sMucLuongToiThieu,
          sMucLuongToiDa: jobData.sMucLuongToiDa,
          sTrangThai: jobData.sTrangThai,
          sDiaChiLamViec: jobData.sDiaChiLamViec || 'Remote',
          sLinhVucTuyenDung: jobData.sLinhVucTuyenDung,
        };
  
        recommendedJob.push(jobItem);
      });
  
      await Promise.all(promises);
      setRecommendedJobs(recommendedJob); 
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobData = async (isLoadMore = false) => {
    if (isLoadMore && (!hasMore || loadingMore)) return; 
  
    if (!isLoadMore) setLoading(true); 
    else setLoadingMore(true); 
  
    try {
      let query = fbJob.where("sCoKhoa", "==", 1).orderBy("sThoiGianDangBai", "desc").limit(PAGE_SIZE);
  
      if (isLoadMore && lastVisible) {
        query = query.startAfter(lastVisible);
      }
  
      const querySnapshot:any = await query.get();
      const bestJob: any = [];
  
      const promises = querySnapshot.docs.map(async (doc:any) => {
        const jobData = doc.data();
        let companyName = 'Unknown Company';
        let companyLogo = '';
  
        if (jobData.sMaDoanhNghiep) {
          try {
            const companySnapshot = await fbCT.where('sMaDoanhNghiep', '==', jobData.sMaDoanhNghiep).get();
            if (!companySnapshot.empty) {
              const companyData = companySnapshot.docs[0].data();
              companyName = companyData?.sTenDoanhNghiep || 'Unknown Company';
              companyLogo = companyData?.sAnhDaiDien || '';
            }
          } catch (error) {
            console.error("Error fetching company info:", error);
          }
        }
  
        const jobItem = {
          sMaTinTuyenDung: jobData.sMaTinTuyenDung,
          sViTriTuyenDung: jobData.sViTriTuyenDung,
          sTenDoanhNghiep: companyName,
          sAnhDaiDien: companyLogo,
          sMucLuongToiThieu: jobData.sMucLuongToiThieu,
          sMucLuongToiDa: jobData.sMucLuongToiDa,
          sTrangThai: jobData.sTrangThai,
          sDiaChiLamViec: jobData.sDiaChiLamViec || 'Remote',
          sLinhVucTuyenDung: jobData.sLinhVucTuyenDung,
        };
  
        bestJob.push(jobItem);
      });
  
      await Promise.all(promises);
  
      if (isLoadMore) {
        setBestJobs((prev: any) => {
          const mergedJobs = [...prev, ...bestJob];
          const uniqueJobs = mergedJobs.filter(
            (job, index, self) =>
              index === self.findIndex((j) => j.sMaTinTuyenDung === job.sMaTinTuyenDung)
          );
          return uniqueJobs;
        });
      } else {
        setBestJobs(bestJob);
      }
  
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); 
      setHasMore(!querySnapshot.empty); 
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      if (!isLoadMore) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const screenOptions = ({ route }: any) => ({
    tabBarStyle: styles.tabBar,
    lazy: false,
    tabBarIcon: ({ focused }: any) => {
      let iconSource;
  
      switch (route.name) {
        case 'Trang chủ':
          iconSource = focused ? homeIconActive : homeIcon;
          break;
        case 'Tìm kiếm':
          iconSource = focused ? searchIconActive : searchIcon;
          break;
        case 'Tài khoản':
          iconSource = focused ? profileIconActive : profileIcon;
          break;
        case 'Lưu công việc':
          iconSource = focused ? saveIconActive : saveIcon;
          break;
        case 'Đã đăng tải':
          iconSource = focused ? postedActive : posted;
          break;
        case 'Tài khoản công ty':
          iconSource = focused ? profileIconActive : profileIcon;
          break;
        default:
          iconSource = focused ? homeIconActive : homeIcon;
      }
  
      return (
        <Image
          source={iconSource}
          style={{
            width: 22,
            height: 22,
            opacity: 1, 
            resizeMode: 'contain', 
          }}
        />
      );
    },
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.surface,
    tabBarShowLabel: false,
    detachInactiveScreens: true,
  });

  const tabs = [
    { name: "Trang chủ", component: <Home fetchJobData={fetchJobData} bestJobs={bestJobs} recommendedJobs={recommendedJobs} navigation={navigation} /> },
    userType === 1 && { name: "Tìm kiếm", component: <AppliedJobs navigation={navigation} /> },
    userType === 1 && { name: "Lưu công việc", component: <JobSaved  navigation={navigation}/> },
    userType === 2 && { name: "Đã đăng tải", component: <PostedJobs navigation={navigation} /> },
    userType === 2 ? { name: "Tài khoản công ty", component: <SettingScreen navigation={navigation} /> } : { name: "Tài khoản", component: <SettingScreen navigation={navigation} /> },
    userType === 0 && { name: "Tìm kiếm", component: <View></View> },
    // userType === 2 && { name: "Tìm kiếm", component: <View></View> },
  ].filter(Boolean);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Loading />
      ) : (
        <Tab.Navigator initialRouteName="Trang chủ" screenOptions={screenOptions}>
          {tabs.map(({ name, component }: any) => (
            <Tab.Screen
            key={name}
            name={name}
            options={{ headerShown: false }}
            listeners={({ navigation }) => ({
              tabPress: () => {
                // Khi tab được nhấn, gọi lại hàm tải dữ liệu
                if (name === "Trang chủ") {
                  fetchJobData();
                } else if (name === "Tìm kiếm") {
                  // Gọi hàm tải dữ liệu cho màn hình Tìm kiếm (nếu có)
                } else if (name === "Lưu công việc") {
                  // Gọi hàm tải dữ liệu cho màn hình Lưu công việc (nếu có)
                } else if (name === "Đã đăng tải") {
                  // Gọi hàm tải dữ liệu cho màn hình Đã đăng tải (nếu có)
                } else if (name === "Tài khoản" || name === "Tài khoản công ty") {
                  // Gọi hàm tải dữ liệu cho màn hình Tài khoản (nếu có)
                }
              },
            })}
          >
            {() => component}
          </Tab.Screen>
          ))}
        </Tab.Navigator>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'white',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
    zIndex: 10,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  underline: {
    width: 20,
    height: 2,
    borderRadius: 5,
    marginTop: 4,
  },
});

export default BottomBar;
