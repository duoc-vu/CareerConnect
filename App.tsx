import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/presentation/screens/components/Home'
import Login from './src/presentation/screens/Login';
import Register from './src/presentation/screens/Register';
import Info from './src/presentation/screens/User/Info';
import BottomBar from './src/navigation/BottomBar';
import UserInfoScreen from './src/presentation/screens/User/UserInfoScreen';
import CV_Profile from './src/presentation/screens/User/CV_Profile';
import JobDetail from './src/presentation/screens/components/JobDetail';
import CompanyInfo from './src/presentation/screens/Company/CompanyInfo';
import CompanyInfoScreen from './src/presentation/screens/Company/CompanyInfoScreen';
import ApplyJob from './src/presentation/screens/User/ApplyJob';
import JobApplyCompany from './src/presentation/screens/Company/JobApplyCompany';
import ApplicationDetails from './src/presentation/screens/Company/ApplicationDetails';
import AppliedJobs from './src/presentation/screens/User/AppliedJobs';
import AppDetails from './src/presentation/screens/User/AppDetails';
import EditJob from './src/presentation/screens/Company/EditJob';
import PostJob from './src/presentation/screens/Company/PostJob';
import { LoadingProvider } from './src/theme/themeContext'; 
import { ThemeProvider } from './src/theme/themeContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <NavigationContainer >
            <Stack.Navigator>
              <Stack.Screen name="bottom" component={BottomBar} options={{ headerShown: false }} />
              <Stack.Screen name='Home' component={Home}  options={{ headerShown: false}}/> 
              <Stack.Screen name='Login' component={Login}  options={{ headerShown: false}} />
              <Stack.Screen name='Register' component={Register} options={{ headerShown: false}} />
              <Stack.Screen name='Info' component={Info}  options={{ headerShown: false}}/>
              <Stack.Screen name='If' component={UserInfoScreen}  options={{ headerShown: false}}/>
              <Stack.Screen name='JobDetail' component={JobDetail}  options={{ headerShown: false}}/>
              <Stack.Screen name='CompanyInfo' component={CompanyInfo}  options={{ headerShown: false}}/>
              <Stack.Screen name='CompanyIf' component={CompanyInfoScreen}  options={{ headerShown: false}}/>
              <Stack.Screen name='ApplyJob' component={ApplyJob}  options={{ headerShown: false}}/>
              <Stack.Screen name='JobApplyCompany' component={JobApplyCompany}  options={{ headerShown: false}}/>
              <Stack.Screen name='cv' component={CV_Profile} options={{ headerShown: false}}/>
              <Stack.Screen name='ApplicationDetails' component={ApplicationDetails}  options={{ headerShown: false}}/>
              <Stack.Screen name='AppDetails' component={AppDetails}  options={{ headerShown: false}}/>
              <Stack.Screen name='EditJob' component={EditJob}  options={{ headerShown: false}}/>
              <Stack.Screen name="PostJob" component={PostJob}  options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </LoadingProvider>
    </ThemeProvider>
  )
}

export default App;