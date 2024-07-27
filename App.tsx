import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Component/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Info from './Screens/User/Info';
import Bottom_Tab from './Screens/Component/Bottom_Tab';
import UserInfoScreen from './Screens/User/UserInfoScreen';
import CV_Profile from './Screens/User/CV_Profile';
import JobDetail from './Screens/Component/JobDetail';
import CompanyInfo from './Screens/Company/CompanyInfo';
import CompanyInfoScreen from './Screens/Company/CompanyInfoScreen';
import ApplyJob from './Screens/User/ApplyJob';
import JobApplyCompany from './Screens/Company/JobApplyCompany';
import ApplicationDetails from './Screens/Company/ApplicationDetails';
import AppliedJobs from './Screens/User/AppliedJobs';
import AppDetails from './Screens/User/AppDetails';
import EditJob from './Screens/Company/EditJob';
import PostJob from './Screens/Company/PostJob';
import Toast from 'react-native-toast-message';


const Stack = createNativeStackNavigator();



const App = () => {
  return (

    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login}  options={{ headerShown: false}} />
        <Stack.Screen name='Register' component={Register} options={{ headerShown: false}} />
        <Stack.Screen name='bottom' component={Bottom_Tab} options={{ headerShown: false}}/>
        <Stack.Screen name='Info' component={Info}  options={{ headerShown: false}}/>
        <Stack.Screen name='If' component={UserInfoScreen}  options={{ headerShown: false}}/>
        <Stack.Screen name='JobDetail' component={JobDetail}  options={{ headerShown: false}}/>
        <Stack.Screen name='CompanyInfo' component={CompanyInfo}  options={{ headerShown: false}}/>
        <Stack.Screen name='CompanyIf' component={CompanyInfoScreen}  options={{ headerShown: false}}/>
        <Stack.Screen name='ApplyJob' component={ApplyJob}  options={{ headerShown: false}}/>
        <Stack.Screen name='JobApplyCompany' component={JobApplyCompany}  options={{ headerShown: false}}/>
        {/* <Stack.Screen name='Home' component={Home}  options={{ headerShown: false}}/>  */}
        {/* <Stack.Screen name='cv' component={CV_Profile} options={{ headerShown: false}}/> */}
        <Stack.Screen name='ApplicationDetails' component={ApplicationDetails}  options={{ headerShown: false}}/>
        <Stack.Screen name='AppDetails' component={AppDetails}  options={{ headerShown: false}}/>
        <Stack.Screen name='EditJob' component={EditJob}  options={{ headerShown: false}}/>
        <Stack.Screen name="PostJob" component={PostJob}  options={{ headerShown: false }} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  )
}

export default App;