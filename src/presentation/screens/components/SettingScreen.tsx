import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import SettingsList from '../../components/SettingsList';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../../context/UserContext';
import HeaderWithIcons from '../../components/Header';
import { View } from 'react-native-animatable';
import ProfileCard from '../../components/ProfileCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = ({ navigation }: any) => {
  const { userId, userType, userInfo, userEmail } = useUser();
  const isGuest = userType === 2 || userType === 1;

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
        console.error("Không tìm thấy tài khoản với sMaTaiKhoan:", userId);
        return;
      }

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          await doc.ref.update({ sFCMToken: firestore.FieldValue.delete() });
        })
      );

      console.log("✅ Xóa FCM Token thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa FCM Token:", error);
    }
  };

  const handleLogout = async () => {
    await removeFCMToken(userId);
    await AsyncStorage.removeItem('session');
    navigation.reset({
      index: 0,
      routes: [{ name: "login" }],
    });
  };
  const UserName = userType === 1 ? userInfo?.sHoVaTen : userInfo?.sTenDoanhNghiep;
  const location = userType === 1 ? userInfo?.sDiaChi : userInfo?.sDiaDiem;
  const logo = userInfo?.sAnhDaiDien;
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
          navigation.navigate("candidate-profile", navigation);
        } else if (userType === 2) {
          navigation.navigate("employer-profile", navigation);
        } else {
          navigation.replace("login");
        }
      },
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '2',
      title: userType === 1
        ? 'Đăng ký thông tin'
        : userType === 2
          ? 'Đăng ký thông tin doanh nghiệp'
          : 'Đăng ký thông tin',
      onPress: () => {
        if (userType === 1) {
          navigation.navigate("edit-user-profile", navigation);
        } else if (userType === 2) {
          navigation.navigate("edit-employer-profile", navigation);
        } else {
          navigation.replace("login");
        }
      },
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '3',
      title: userType === 1
        ? 'Công việc đã lưu'
        : userType === 2
          ? 'Quản lý đơn ứng tuyển'
          : 'Công việc đã lưu',
      onPress: () => {
        if (userType === 1) {
          navigation.navigate("");
        } else if (userType === 2) {
          navigation.navigate("applicant-list");
        } else {
          navigation.navigate("login");
        }
      },
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '4',
      title: 'Quản lý lịch hẹn phỏng vấn',
      onPress: () => navigation.navigate("appointments"),
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '5',
      title: 'Chính sách',
      onPress: () => navigation.navigate("feedback", navigation),
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '6',
      title: 'Phản hồi và góp ý',
      onPress: () => console.log('Go to detail'),
      icon: require('../../../../asset/images/right-arrow.png')
    },
    {
      id: '7',
      title: 'Đổi mật khẩu',
      onPress: () => console.log('Go to Đổi mật khẩu'),
      icon: require('../../../../asset/images/right-arrow.png')
    },
  ];
  if (userType === 1 || userType === 2) {
    data.push({
      id: '8',
      title: 'Đăng xuất',
      onPress: () => handleLogout(),
      icon: require('../../../../asset/images/logout.png')
    });
  }

  return (
    <View style={styles.container}>
      <HeaderWithIcons
        title='Cài đặt'
        onBackPress={() => { navigation.goBack() }}
        backgroundColor="#F0F4F7"
      />
      <ScrollView style={styles.containerScroll}>
        <ProfileCard
          avatar={logo}
          name={UserName}
          location={location}
          email={userEmail}
          style={styles.profileCard}
          isGuest={!isGuest}
          onPress={() =>
            userType === 1
              ? navigation.navigate("edit-candidate-profile")
              : userType === 2
                ? navigation.navigate("edit-employer-profile")
                : navigation.replace('login')
          }
        />
        <SettingsList style={{ width: "100%", paddingHorizontal: 5, marginTop: 10 }} data={data} />
      </ScrollView>
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
