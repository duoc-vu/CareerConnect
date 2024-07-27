import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Account from '../User/Account';
import AccountCompany from '../Company/AccountCompany';
import PostJob from '../Company/PostJob';
import JobCompany from '../Company/JobCompany';
import AppliedJobs from '../User/AppliedJobs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();
const Bottom_Tab = ({ route }: any) => {
    const { userId, userType } = route?.params || {};
    
    const screenOptions = ({ route }: any) => ({
        tabBarIcon: ({ focused, color, size }:any) => {
            let iconName;
            if (route.name === 'Trang chủ') {
                iconName = focused ? 'home' : 'home';
                return <AntDesign name={iconName} size={size} color={color} />;
            } else if (route.name === 'Đã ứng tuyển') {
                iconName = focused ? 'documents' : 'documents';
                return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Tài khoản') {
                iconName = focused ? 'user' : 'user-o';
                return <Icon name={iconName} size={size} color={color} />;
            } else if (route.name === 'Đã đăng tải') {
                iconName = focused ? 'documents' : 'documents';
                return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Tài khoản công ty') {
                iconName = focused ? 'user' : 'user-o';
                return <Icon name={iconName} size={size} color={color} />;
            }

            return null;
        },
        tabBarActiveTintColor: '#1E90FF',
        tabBarInactiveTintColor: 'gray',
    });

    if (userType === '1') {
        return (
            <Tab.Navigator screenOptions={screenOptions} >
                <Tab.Screen name="Trang chủ" component={Home} initialParams={{ userId, userType }} options={{ headerShown: false }} />
                <Tab.Screen name="Đã ứng tuyển" component={AppliedJobs} initialParams={{ userId, userType }} options={{ headerShown: false }} />
                <Tab.Screen name="Tài khoản" component={Account} initialParams={{ userId, userType }} options={{ headerShown: false }} />
            </Tab.Navigator>
        );
    } else if (userType === '2') {
        return (
            <Tab.Navigator screenOptions={screenOptions}>
                <Tab.Screen name="Trang chủ" component={Home} initialParams={{ userId, userType }} options={{ headerShown: false }} />
                <Tab.Screen name="Đã đăng tải" component={JobCompany} initialParams={{ userId, userType }} options={{ headerShown: false }} />
                <Tab.Screen name="Tài khoản công ty" component={AccountCompany} initialParams={{ userId, userType }} options={{ headerShown: false }} />
            </Tab.Navigator>
        );
    } else {
        return (
            <Tab.Navigator screenOptions={screenOptions}>
                <Tab.Screen name="Trang chủ" component={Home} />
                <Tab.Screen name="Tài khoản" component={Account} />
            </Tab.Navigator>
        );
    }
}

export default Bottom_Tab;
