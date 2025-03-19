import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import SettingsList from '../../components/SettingsList';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../../context/UserContext';
import HeaderWithIcons from '../../components/Header';
import { View } from 'react-native-animatable';
import ProfileCard from '../../components/ProfileCard';
import storage from '@react-native-firebase/storage';
import { useLoading } from '../../../context/themeContext';
import Loading from '../../components/Loading';

const SettingScreen: React.FC = ({ navigation }: any) => {
  const { userId, userType, userInfo, userEmail } = useUser();
  const [image, setImage] = useState('');
  const { loading, setLoading } = useLoading();
  const isGuest = userType === 2 || userType === 1;

  const fetchUserData = async () => {
    const storageRef = userType === 1
      ? storage().ref(`tblUngVien/${userId}.png`)
      : storage().ref(`tblDoanhNghiep/${userId}.png`);
    try {
      const downloadUrl = await storageRef.getDownloadURL();
      setImage(downloadUrl);
    } catch (error) {
      console.log('Không tìm thấy ảnh:', error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchUserData();
  }, []);

  const removeFCMToken = async (userId: any) => {
    try {
      if (!userId) {
        console.error("userId không hợp lệ!");
        return;
      }

      const querySnapshot = await firestore()
        .collection('tblTaiKhoan')
        .where('sMaTaiKhoan', '==', userId)
        .get();

      if (querySnapshot.empty) {
        console.error(" Không tìm thấy tài khoản với sMaTaiKhoan:", { userId });
        return;
      }

      querySnapshot.forEach(async (doc) => {
        await doc.ref.update({ sFCMToken: firestore.FieldValue.delete() });
        console.log(" Xóa FCM Token thành công!");
      });
    } catch (error) {
      console.error("Lỗi khi xóa FCM Token:", error);
    }
  };

  const handleLogout = async () => {
    await removeFCMToken(userId);
    navigation.navigate("login")
  };
  const UserName = userType === 1 ? userInfo?.sHoVaTen : userInfo?.sTenDoanhNghiep;
  const location = userType === 1 ? userInfo?.sDiaChi : userInfo?.sDiaDiem;
  let data: any = [
    {
      id: '1',
      title: userType === 1
        ? 'Hồ sơ tài khoản'
        : userType === 2
          ? 'Hồ sơ doanh nghiệp'
          : 'Hồ sơ cá nhân',
      onPress: () => {
        if (userType === 1) {
          navigation.navigate("user-profile");
        } else if (userType === 2) {
          navigation.navigate("");
        } else {
          navigation.navigate("login");
        }
      },
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '2',
      title: userType === 1
        ? 'Công việc đã lưu'
        : userType === 2
          ? 'Quản lý tin tuyển dụng'
          : 'Công việc đã lưu',
          onPress: () => {
            if (userType === 1) {
              navigation.navigate("");
            } else if (userType === 2) {
              navigation.navigate("");
            } else {
              navigation.navigate("login");
            }
          },
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '3',
      title: 'Chính sách',
      onPress: () => console.log('Go to Change Password'),
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '4',
      title: 'Về chúng tôi',
      onPress: () => console.log('Go to detail'),
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '5',
      title: 'Đổi mật khẩu',
      onPress: () => console.log('Go to Đổi mật khẩu'),
      icon: require('../../../../asset/images/right-arrow.png')
    },
  ];
  if (userType === 1 || userType === 2) {
    data.push({
      id: '6',
      title: 'Đăng xuất',
      onPress: () => handleLogout(),
      icon: require('../../../../asset/images/logout.png')
    });
  } 

  return (
    <View style={styles.container}>
      <HeaderWithIcons
        title='Hồ sơ tài khoản'
        onBackPress={() => { navigation.goBack() }}
        backgroundColor="#F0F4F7"
      />
      <ScrollView style={styles.containerScroll}>
        <ProfileCard
          avatar={image}
          name={UserName}
          location={location}
          email={userEmail}
          style={styles.profileCard}
          isGuest = {!isGuest}
        />
        <SettingsList style={{ width: "100%", paddingHorizontal: 5, marginTop: 10 }} data={data} />
      </ScrollView>
      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F7',
    paddingHorizontal: 20,
  },
  profileCard: {
    marginTop: 20,
    width: "100%"
  },
  containerScroll: {
    flexGrow: 1,
    paddingHorizontal: 10
  },
});

export default SettingScreen;
