import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Account from '../User/Account';
import AccountCompany from '../Company/AccountCompany';
import PostJob from '../Company/PostJob';


const Tab = createBottomTabNavigator();
const Bottom_Tab = ({ route }: any) => {
    const { userId, userType } = route?.params || {};
    if (userType === '1') {
        return (
            <Tab.Navigator  >
                <Tab.Screen name='Home' component={Home} initialParams={{ userId ,userType }} options={{ headerShown: false }} />
                <Tab.Screen name='Account' component={Account} initialParams={{ userId ,userType }} options={{ headerShown: false }} />
            </Tab.Navigator>
        )
    } else if (userType === '2') {
        return (
            <Tab.Navigator  >
                <Tab.Screen name='Home' component={Home} initialParams={{ userId ,userType }} options={{ headerShown: false }} />
                <Tab.Screen name='PostJob' component={PostJob} initialParams={{ userId ,userType }} options={{ headerShown: false }} />
                <Tab.Screen name='AccountCompany' component={AccountCompany} initialParams={{ userId, userType }} options={{ headerShown: false }} />
            </Tab.Navigator>
        )
    } else {
        return (
            <Tab.Navigator  >
                <Tab.Screen name='Home' component={Home} />
                <Tab.Screen name='Account' component={Account} />
            </Tab.Navigator>
        )
    }

}

export default Bottom_Tab;