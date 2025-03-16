import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/themeContext';
import { Image, View, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import Home from '../presentation/screens/components/Home';
import AccountCompany from '../presentation/screens/Company/AccountCompany';
import JobCompany from '../presentation/screens/Company/JobCompany';
import AppliedJobs from '../presentation/screens/User/AppliedJobs';
import { useLoading } from './../theme/themeContext';
import Loading from "../presentation/components/Loading";
import SettingScreen from '../presentation/screens/components/SettingScreen';

const homeIcon = require('../../asset/images/img_home.png');
const appliJob = require('../../asset/images/img_bookmark.png');
const notificationsIcon = require('../../asset/images/img_notification.png');
const profileIcon = require('../../asset/images/img_profile.png');

const Tab = createBottomTabNavigator();

const BottomBar = ({ route }: any) => {
  const { theme } = useTheme();
  const { userId = -1, userType = -1 } = route?.params || {};
  const { loading } = useLoading();

  const screenOptions = ({ route }: any) => ({
    tabBarStyle: styles.tabBar,
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
    lazy: true,
    detachInactiveScreens: true,
  });

  const tabs = [
    { name: "Trang chủ", component: Home },
    userType === 1 && { name: "Đã ứng tuyển", component: AppliedJobs },
    userType === 2 && { name: "Đã đăng tải", component: JobCompany },
    userType === 2 ? { name: "Tài khoản công ty", component: AccountCompany } : { name: "Tài khoản", component: SettingScreen },
    userType === 0 && { name: "Thông báo", component: () => <View></View> },
  ].filter(Boolean);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={screenOptions}>
        {tabs.map(({ name, component }: any) => (
          <Tab.Screen key={name} name={name} component={component} initialParams={{ userId, userType }} options={{ headerShown: false }} />
        ))}
      </Tab.Navigator>
      {loading && <Loading />}
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
