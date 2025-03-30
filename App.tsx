import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/presentation/screens/components/Home'
import Login from './src/presentation/screens/Login';
import Register from './src/presentation/screens/Register';
import Info from './src/presentation/screens/User/Info';
import BottomBar from './src/navigation/BottomBar';
import CV_Profile from './src/presentation/screens/User/CV_Profile';
import JobDetail from './src/presentation/screens/components/JobDetail';
import EditEmployerProfile from './src/presentation/screens/Company/EditEmployerProfile';
import CompanyInfoScreen from './src/presentation/screens/Company/CompanyInfoScreen';
import ApplyJob from './src/presentation/screens/User/ApplyJob';
import JobApplyCompany from './src/presentation/screens/Company/ApplicantsScreen';
import ApplicationDetail from './src/presentation/screens/Company/ApplicationDetails';
import AppliedJobs from './src/presentation/screens/User/AppliedJobs';
import AppDetails from './src/presentation/screens/User/AppDetails';
import EditJob from './src/presentation/screens/Company/EditJob';
import PostJob from './src/presentation/screens/Company/PostJob';
import { LoadingProvider } from './src/context/themeContext';
import { ThemeProvider } from './src/context/themeContext';
import { UserProvider } from './src/context/UserContext';
import SettingScreen from './src/presentation/screens/components/SettingScreen';
import { LogBox } from 'react-native';
import SplashScreen from './src/presentation/screens/components/SplashScreen';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import EditProfile from './src/presentation/screens/User/EditProfile';
import ProfileCandidate from './src/presentation/screens/User/ProfileCandidate';
import ProfileEmployer from './src/presentation/screens/Company/ProfileEmployer';
import FeedbackScreen from './src/presentation/screens/components/FeedbackScreen';
import ApplicantsScreen from './src/presentation/screens/Company/ApplicantsScreen';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import CVPreview from './src/presentation/screens/components/CVPreview';

const Stack = createNativeStackNavigator();

const App = () => {
  LogBox.ignoreAllLogs();
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
      console.log("New FCM Token:", newToken);
      await AsyncStorage.setItem('fcmToken', newToken);

      const storedSession = await AsyncStorage.getItem('session');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        if (sessionData?.userId) {
          await firestore()
            .collection('tblTaiKhoan')
            .where('sMaTaiKhoan', '==', sessionData.userId)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                doc.ref.update({ sFCMToken: newToken });
              });
            });

          sessionData.fcmToken = newToken;
          await AsyncStorage.setItem('session', JSON.stringify(sessionData));
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserProvider>
      <ThemeProvider>
        <LoadingProvider>
          <NavigationContainer >
            <Stack.Navigator >
              < Stack.Screen name="splash" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="bottom" component={BottomBar} options={{ headerShown: false }} />
              <Stack.Screen name='home' component={Home} options={{ headerShown: false }} />
              <Stack.Screen name='register' component={Register} options={{ headerShown: false }} />
              {/* <Stack.Screen name='Info' component={Info}  options={{ headerShown: false}}/> */}
              <Stack.Screen name='employer-profile' component={ProfileEmployer} options={{ headerShown: false }} />
              <Stack.Screen name='edit-candidate-profile' component={EditProfile} options={{ headerShown: false }} />
              <Stack.Screen name='job-detail' component={JobDetail} options={{ headerShown: false }} />
              <Stack.Screen name='edit-employer-profile' component={EditEmployerProfile} options={{ headerShown: false }} />
              {/* <Stack.Screen name='CompanyIf' component={CompanyInfoScreen}  options={{ headerShown: false}}/> */}
              <Stack.Screen name='apply-job' component={ApplyJob} options={{ headerShown: false }} />
              <Stack.Screen name='list-apply-job' component={JobApplyCompany} options={{ headerShown: false }} />
              <Stack.Screen name='cv-detail' component={CV_Profile} options={{ headerShown: false }} />
              <Stack.Screen name='application-detail' component={ApplicationDetail} options={{ headerShown: false }} />
              <Stack.Screen name='app-detail' component={AppDetails} options={{ headerShown: false }} />
              <Stack.Screen name='edit-job' component={EditJob} options={{ headerShown: false }} />
              <Stack.Screen name="post-job" component={PostJob} options={{ headerShown: false }} />
              <Stack.Screen name="setting" component={SettingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="candidate-profile" component={ProfileCandidate} options={{ headerShown: false }} />
              <Stack.Screen name="applicant-list" component={ApplicantsScreen} options={{ headerShown: false }} />
              <Stack.Screen name='feedback' component={FeedbackScreen} options={{ headerShown: false }} />
              <Stack.Screen name='cv-preview' component={CVPreview} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </LoadingProvider>
      </ThemeProvider>
    </UserProvider>
  )
}

export default App;