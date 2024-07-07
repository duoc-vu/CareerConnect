import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Component/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Info from './Screens/User/Info';
import Bottom_Tab from './Screens/Component/Bottom_Tab';
import UserInfoScreen from './Screens/User/UserInfoScreen';
import CV_Profile from './Screens/User/CV_Profile';
import JobDetail from './Screens/JobDetail';
import CompanyInfo from './Screens/Company/CompanyInfo';
import CompanyInfoScreen from './Screens/Company/CompanyInfoScreen';
import ApplyJob from './Screens/ApplyJob';


const Stack = createNativeStackNavigator();



const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login}  options={{ headerShown: false}}/>
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='bottom' component={Bottom_Tab} options={{ headerShown: false}}/>
        <Stack.Screen name='Info' component={Info}  options={{ headerShown: false}}/>
        <Stack.Screen name='If' component={UserInfoScreen}  options={{ headerShown: false}}/>
        <Stack.Screen name='JobDetail' component={JobDetail}  options={{ headerShown: false}}/>
        <Stack.Screen name='CompanyInfo' component={CompanyInfo}  options={{ headerShown: false}}/>
        <Stack.Screen name='CompanyIf' component={CompanyInfoScreen}  options={{ headerShown: false}}/>
        <Stack.Screen name='ApplyJob' component={ApplyJob}  options={{ headerShown: false}}/>
        {/* <Stack.Screen name='Home' component={Home}  options={{ headerShown: false}}/>  */}
        {/* <Stack.Screen name='cv' component={CV_Profile} options={{ headerShown: false}}/> */}
        

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;