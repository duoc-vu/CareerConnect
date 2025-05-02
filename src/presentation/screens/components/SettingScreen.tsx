import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import SettingsList from '../../components/SettingsList';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../../context/UserContext';
import { View } from 'react-native-animatable';
import ProfileCard from '../../components/ProfileCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from '../../components/Dialog';
import CustomText from '../../components/CustomText';
import { theme } from '../../../theme/theme';

const SettingScreen = ({ navigation }: any) => {
  const { userId, userType, userInfo, userEmail } = useUser();
  const isGuest = userType === 2 || userType === 1;
  const [dialogContent, setDialogContent] = React.useState({
    title: '',
    content: '',
    visible: false,
    confirm: {
      text: '',
      onPress: () => { },
    },
    dismiss: {
      text: '',
      onPress: () => { },
    },
    request: false
  });
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
          navigation.navigate("candidate-profile");
        } else if (userType === 2) {
          navigation.navigate("employer-profile");
        } else {
          setDialogContent({
            title: 'Thông báo',
            content: 'Bạn cần đăng nhập để thực hiện hành động này.',
            visible: true,
            confirm: {
              text: 'Đăng nhập',
              onPress: () => {
                setDialogContent(prev => ({ ...prev, visible: false }));
                navigation.navigate('login');
              },
            },
            dismiss: {
              text: 'Hủy',
              onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
            },
            request: true
          });
        }
      },
      icon: require('../../../../asset/images/right-arrow.png'),
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
          navigation.navigate("edit-candidate-profile");
        } else if (userType === 2) {
          navigation.navigate("edit-employer-profile");
        } else {
          setDialogContent({
            title: 'Thông báo',
            content: 'Bạn cần đăng nhập để thực hiện hành động này.',
            visible: true,
            confirm: {
              text: 'Đăng nhập',
              onPress: () => {
                setDialogContent(prev => ({ ...prev, visible: false }));
                navigation.navigate('login');
              },
            },
            dismiss: {
              text: 'Hủy',
              onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
            },
            request: true
          });
        }
      },
      icon: require('../../../../asset/images/right-arrow.png'),
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
          navigation.navigate("saved-jobs");
        } else if (userType === 2) {
          navigation.navigate("applicant-list");
        } else {
          setDialogContent({
            title: 'Thông báo',
            content: 'Bạn cần đăng nhập để thực hiện hành động này.',
            visible: true,
            confirm: {
              text: 'Đăng nhập',
              onPress: () => {
                setDialogContent(prev => ({ ...prev, visible: false }));
                navigation.navigate('login');
              },
            },
            dismiss: {
              text: 'Hủy',
              onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
            },
            request: true
          });
        }
      },
      icon: require('../../../../asset/images/right-arrow.png'),
    },
    {
      id: '4',
      title: 'Quản lý lịch hẹn phỏng vấn',
      onPress: () => {
        if (userType === 1 || userType === 2) {
          navigation.navigate(userType === 1 ? "appointments-candidate" : "appointments");
        } else {
          setDialogContent({
            title: 'Thông báo',
            content: 'Bạn cần đăng nhập để thực hiện hành động này.',
            visible: true,
            confirm: {
              text: 'Đăng nhập',
              onPress: () => {
                setDialogContent(prev => ({ ...prev, visible: false }));
                navigation.navigate('login');
              },
            },
            dismiss: {
              text: 'Hủy',
              onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
            },
            request: true
          });
        }
      },
      icon: require('../../../../asset/images/right-arrow.png'),
    },
    {
      id: '5',
      title: 'Chính sách',
      onPress: () => handlePolicy(),
      icon: require('../../../../asset/images/right-arrow.png'),
    },
    {
      id: '6',
      title: 'Phản hồi và góp ý',
      onPress: () => navigation.navigate("feedback"),
      icon: require('../../../../asset/images/right-arrow.png'),
    },
  ];
  if (userType === 1 || userType === 2) {
    data.push(
      {
        id: '7',
        title: 'Đổi mật khẩu',
        onPress: () => console.log('Go to Đổi mật khẩu'),
        icon: require('../../../../asset/images/right-arrow.png')
      },
      {
        id: '8',
        title: 'Đăng xuất',
        onPress: () => handleLogout(),
        icon: require('../../../../asset/images/logout.png')
      });
  }

  const handlePolicy = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('tblChinhSach')
        .where('bTrangThai', '==', true)
        .get();

      if (!querySnapshot.empty) {
        const policy = querySnapshot.docs[0].data();
        if (policy.sNoiDung) {
          navigation.navigate('policy-preview', { url: policy.sNoiDung }); // Điều hướng đến PolicyPreview
        } else {
          setDialogContent({
            title: 'Thông báo',
            content: 'Không tìm thấy nội dung chính sách.',
            visible: true,
            confirm: {
              text: 'Đóng',
              onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
            },
            dismiss: {
              text: 'Đóng',
              onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
            },
            request: false
          });
        }
      } else {
        setDialogContent({
          title: 'Thông báo',
          content: 'Không có chính sách nào đang hoạt động.',
          visible: true,
          confirm: {
            text: 'Đóng',
            onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
          },
          dismiss: {
            text: 'Đóng',
            onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
          },
          request: false
        });
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra chính sách:', error);
      setDialogContent({
        title: 'Lỗi',
        content: 'Đã xảy ra lỗi khi kiểm tra chính sách. Vui lòng thử lại.',
        visible: true,
        confirm: {
          text: 'Đóng',
          onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
        },
        dismiss: {
          text: 'Đóng',
          onPress: () => setDialogContent(prev => ({ ...prev, visible: false })),
        },
        request: false
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Cài đặt</CustomText>
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
      <Dialog
        visible={dialogContent.visible}
        title={dialogContent.title}
        content={dialogContent.content}
        confirm={dialogContent.confirm}
        dismiss={dialogContent.dismiss}
        request={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F7',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 15, 
    color: theme.template.biru
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
