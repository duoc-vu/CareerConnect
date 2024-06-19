import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Account from './Account';


const Tab = createBottomTabNavigator();
const Bottom_Tab = ({ route }: any) => {
    if(!route){
        return(
            <Tab.Navigator  >
                <Tab.Screen name='Home' component={Home} />
                <Tab.Screen name='Account' component={Account} />
            </Tab.Navigator>
        )
    }else{
        const { userId } = route?.params || {};
        return(
            <Tab.Navigator  >
                <Tab.Screen name='Home' component={Home} initialParams={{ userId }}/>
                <Tab.Screen name='Account' component={Account} initialParams={{ userId }}/>
            </Tab.Navigator>
        )
    }
    
}

export default Bottom_Tab;