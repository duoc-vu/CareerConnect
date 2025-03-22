import React, { useEffect, useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/themeContext';
import { Image, View, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import Home from '../presentation/screens/components/Home';
import AccountCompany from '../presentation/screens/Company/ProfileEmployer';
import JobCompany from '../presentation/screens/Company/JobCompany';
import AppliedJobs from '../presentation/screens/User/AppliedJobs';
import { useLoading } from '../context/themeContext';
import Loading from "../presentation/components/Loading";
import SettingScreen from '../presentation/screens/components/SettingScreen';
import { useUser } from '../context/UserContext';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

const homeIcon = require('../../asset/images/img_home.png');
const appliJob = require('../../asset/images/img_bookmark.png');
const notificationsIcon = require('../../asset/images/img_notification.png');
const profileIcon = require('../../asset/images/img_profile.png');

const Tab = createBottomTabNavigator();

const fbJob = firestore().collection('tblTinTuyenDung');
const fbCT = firestore().collection('tblDoanhNghiep');

const BottomBar = ({ route }: any) => {
  const { theme } = useTheme();
  const { userId, userType} = useUser();
  const { loading, setLoading } = useLoading();
  const [jobs, setJobs] = useState([]);
  const [companyLogos, setCompanyLogos] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation()

  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async () => {

    setLoading(true);
  
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const querySnapshot = await fbJob.where("sCoKhoa", "==", 1).get();
  
      const jobList: any = [];
      const batch = firestore().batch();
  
      const promises = querySnapshot.docs.map(async (doc: any) => {
        const jobData = doc.data();
        let companyName = 'Unknown Company';
        let companyLogo = '';
  
        const ngayBatDau = new Date(jobData.sThoiGianDangBai);
        const hanTuyen = new Date(jobData.sThoiHanTuyenDung);
        let newStatus = jobData.sTrangThai;
        let newCoKhoa = jobData.sCoKhoa;
  
        if (today > hanTuyen) {
          newStatus = "Hết hạn";
          newCoKhoa = 4;
        } else if (today >= ngayBatDau) {
          newStatus = "Đang tuyển";
        }
  
        if (newStatus !== jobData.sTrangThai || newCoKhoa !== jobData.sCoKhoa) {
          batch.update(doc.ref, { sTrangThai: newStatus, sCoKhoa: newCoKhoa });
        }
  
        if (jobData.sMaDoanhNghiep) {
          try {
            const companySnapshot = await fbCT.where('sMaDoanhNghiep', '==', jobData.sMaDoanhNghiep).get();
  
            if (!companySnapshot.empty) {
              const companyDoc = companySnapshot.docs[0];
              const companyData = companyDoc.data();
              companyName = companyData?.sTenDoanhNghiep || 'Unknown Company';
  
              const avatarPath = `Avatar_Cong_Ty/${jobData.sMaDoanhNghiep}.png`;
              const avatarRef = storage().ref(avatarPath);
              try {
                companyLogo = await avatarRef.getDownloadURL();
              } catch (error) {
                console.warn(`⚠️ Không tìm thấy ảnh công ty: ${avatarPath}`);
                companyLogo = require('../../asset/images/img_splash.png');
              } 
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
          jobType: newStatus,
          location: jobData.sDiaChiLamViec || 'Remote',
        });
      });
  
      await Promise.all(promises);
      await batch.commit();
  
      setJobs(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
       setLoading(false)
    }
  };

  const screenOptions = ({ route }: any) => ({
    tabBarStyle: styles.tabBar,
    lazy: false,
    tabBarIcon: ({ focused }: any) => {
      let iconSource;
      let iconSize = focused ? 22 : 20;
      let iconOpacity = focused ? 1 : 0.5;
      let underlineColor = focused ? theme.primary : 'transparent';

      switch (route.name) {
        case 'Trang chủ':
          iconSource = homeIcon;
          break;
        case 'Đã ứng tuyển':
          iconSource = appliJob;
          break;
        case 'Tài khoản':
          iconSource = profileIcon;
          break;
        case 'Đã đăng tải':
          iconSource = notificationsIcon;
          break;
        case 'Tài khoản công ty':
          iconSource = profileIcon;
          break;
        default:
          iconSource = homeIcon;
      }

      return (
        <View style={styles.iconWrapper}>
          <Image source={iconSource} style={{ width: iconSize, height: iconSize, opacity: iconOpacity }} />
          <View style={[styles.underline, { backgroundColor: underlineColor }]} />
        </View>
      );
    },
    tabBarActiveTintColor: theme.primary,
    tabBarInactiveTintColor: theme.surface,
    tabBarShowLabel: false,
    detachInactiveScreens: true,
  });

  

  const tabs = [
    { name: "Trang chủ", component:<Home jobs={jobs} companyLogos={companyLogos} navigation={navigation}/>  },
    userType === 1 && { name: "Thông báo", component:<SettingScreen navigation={navigation}/> },
    userType === 2 && { name: "Cài đặt", component:<SettingScreen navigation={navigation}/> },
    userType === 2 ? { name: "Tài khoản công ty", component:<SettingScreen navigation={navigation}/> } : { name: "Tài khoản", component: SettingScreen },
    userType === 0 && { name: "Thông báo", component:<View></View> },
  ].filter(Boolean);

  return (
    <View style={{ flex: 1 }}>
       {loading  ? (
        <Loading />
      ) : (
        <Tab.Navigator initialRouteName="Trang chủ" screenOptions={screenOptions}>
          {tabs.map(({ name, component }: any) => (
            <Tab.Screen key={name} name={name} options={{ headerShown: false }}>
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
    bottom: 5,
    left: 0,
    right: 0,
    height: 80,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: 'rgba(195, 216, 244, 0.99)', 
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
