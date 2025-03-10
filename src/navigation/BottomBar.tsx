import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/themeContext';
import { Image, View, StyleSheet } from 'react-native';

// Import các màn hình
import Home from '../presentation/screens/components/Home';
import Account from '../presentation/screens/User/Account';
import AccountCompany from '../presentation/screens/Company/AccountCompany';
import JobCompany from '../presentation/screens/Company/JobCompany';
import AppliedJobs from '../presentation/screens/User/AppliedJobs';

// Import hình ảnh icon từ assets
const homeIcon = require('../../asset/images/img_home.png');
const appliJob = require('../../asset/images/img_bookmark.png');
const notificationsIcon = require('../../asset/images/img_notification.png');
const profileIcon = require('../../asset/images/img_profile.png');

const Tab = createBottomTabNavigator();

const BottomBar = ({ route }: any) => {
  const { theme } = useTheme();
  const { userId = -1, userType = -1} = route?.params || {};

  const screenOptions = ({ route }: any) => ({
    tabBarStyle: [styles.tabBar, { backgroundColor: theme.bG }],
    tabBarIcon: ({ focused }: any) => {
      let iconSource;
      let iconSize = focused ? 22 : 20; // Giảm kích thước icon
      let iconOpacity = focused ? 1 : 0.5; // Làm icon không chọn mờ hơn
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
  });
  const tabs = [
    { name: "Trang chủ", component: Home },
    userType === 1 && { name: "Đã ứng tuyển", component: AppliedJobs },
    userType === 2 && { name: "Đã đăng tải", component: JobCompany },
    userType === 2 ? { name: "Tài khoản công ty", component: AccountCompany } : { name: "Tài khoản", component: Account },
    userType === 0 && { name: "Thông báo", component: () => <View></View> },
  ].filter(Boolean); // Loại bỏ giá trị `false`
  
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {tabs.map(({ name, component }:any) => (
        <Tab.Screen key={name} name={name} component={component} initialParams={{ userId, userType }} options={{ headerShown: false }} />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 65, // Giảm chiều cao của tabBar để gọn hơn
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6, // Giảm khoảng padding trên dưới icon
  },
  underline: {
    width: 20, // Thu gọn gạch chân
    height: 2, // Giảm chiều cao gạch chân
    borderRadius: 5,
    marginTop: 3,
  },
});

export default BottomBar;
