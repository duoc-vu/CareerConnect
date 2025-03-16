import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import ProfileHeader from '../../components/ProfileHeader';
import SettingsList from '../../components/SettingsList';

const { height } = Dimensions.get('window');

const SettingScreen: React.FC = ({ navigation, route }: any) => {
  const params = route?.params ?? {};
  const userId = params.userId ?? null;
  const userType = params.userType ?? 0;

  let data = [];
  if (userType == 1) {
    data = [
      {
        id: '1',
        title: 'Hồ sơ tài khoản',
        onPress: () => navigation.navigate("Profile", userId),
        icon: require('../../../../asset/images/right-arrow.png')
      },
      {
        id: '2',
        title: 'Công việc đã lưu',
        onPress: () => console.log('Go to Log Out'),
        icon: require('../../../../asset/images/right-arrow.png')
      },
      {
        id: '3',
        title: 'Đổi mật khẩu',
        onPress: () => console.log('Go to Change Password'),
        icon: require('../../../../asset/images/right-arrow.png')
      },
      {
        id: '4',
        title: 'Chính sách',
        onPress: () => console.log('Go to Privacy Settings'),
        icon: require('../../../../asset/images/right-arrow.png')
      },
      {
        id: '5',
        title: 'Log Out',
        onPress: () => console.log('Go to Log Out'),
        icon: require('../../../../asset/images/logout.png')
      },
    ]
  } else {
    data = [
      {
        id: '1',
        title: 'Hồ sơ tài khoản',
        onPress: () => navigation.navigate("Profile", userId),
        icon: require('../../../../asset/images/right-arrow.png')
      },
      {
        id: '2',
        title: 'Công việc đã lưu',
        onPress: () => console.log('Go to Log Out'),
        icon: require('../../../../asset/images/right-arrow.png')
      },
      {
        id: '3',
        title: 'Đổi mật khẩu',
        onPress: () => console.log('Go to Change Password'),
        icon: require('../../../../asset/images/right-arrow.png')
      },
      {
        id: '4',
        title: 'Chính sách',
        onPress: () => console.log('Go to Privacy Settings'),
        icon: require('../../../../asset/images/right-arrow.png')
      },
      {
        id: '5',
        title: 'Log Out',
        onPress: () => console.log('Go to Log Out'),
        icon: require('../../../../asset/images/logout.png')
      },
    ]
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Settings</Text>
      <ProfileHeader
        avatarUrl="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
        name="Marian Hart"
        style={styles.profileHeaderStyle}
      />
      <SettingsList style={{ marginTop: 100 }} data={data} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F7',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  profileHeaderStyle: {
    marginVertical: 20, 
    height: 100, 
  },
});

export default SettingScreen;
