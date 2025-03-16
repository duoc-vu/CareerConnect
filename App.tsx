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
import SettingScreen from './src/presentation/screens/components/SettingScreen';
import Account from './src/presentation/screens/User/Account';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <NavigationContainer >
            <Stack.Navigator>
              <Stack.Screen name='login' component={Login}  options={{ headerShown: false}} />
              <Stack.Screen name="bottom" component={BottomBar} options={{ headerShown: false }} />
              <Stack.Screen name='home' component={Home}  options={{ headerShown: false}}/> 
              <Stack.Screen name='register' component={Register} options={{ headerShown: false}} />
              <Stack.Screen name='Info' component={Info}  options={{ headerShown: false}}/>
              <Stack.Screen name='company-user-profile' component={UserInfoScreen}  options={{ headerShown: false}}/>
              <Stack.Screen name='job-detail' component={JobDetail}  options={{ headerShown: false}}/>
              <Stack.Screen name='company-info' component={CompanyInfo}  options={{ headerShown: false}}/>
              <Stack.Screen name='CompanyIf' component={CompanyInfoScreen}  options={{ headerShown: false}}/>
              <Stack.Screen name='apply-job' component={ApplyJob}  options={{ headerShown: false}}/>
              <Stack.Screen name='list-apply-job' component={JobApplyCompany}  options={{ headerShown: false}}/>
              <Stack.Screen name='cv-detail' component={CV_Profile} options={{ headerShown: false}}/>
              <Stack.Screen name='application-detail' component={ApplicationDetails}  options={{ headerShown: false}}/>
              <Stack.Screen name='app-detail' component={AppDetails}  options={{ headerShown: false}}/>
              <Stack.Screen name='edit-job' component={EditJob}  options={{ headerShown: false}}/>
              <Stack.Screen name="post-job" component={PostJob}  options={{ headerShown: false }} />
              <Stack.Screen name="setting" component={SettingScreen}  options={{ headerShown: false }} />
              <Stack.Screen name="user-profile" component={Account}  options={{ headerShown: false }} />
              </Stack.Navigator>
          </NavigationContainer>
        </LoadingProvider>
    </ThemeProvider>
  )
}

export default App;