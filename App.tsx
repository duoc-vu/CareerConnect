import React,{useEffect, useState} from 'react';
import { StatusBar, Text, View } from 'react-native';
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
import Toast from 'react-native-toast-message';
import { SafeAreaView, StyleSheet, ScrollView  } from 'react-native';
import { Fonts } from './src/theme/font';

import CustomText from './src/presentation/components/CustomText';
import Button from './src/presentation/components/Button';
import CheckBox from './src/presentation/components/CheckBox';
import Input from './src/presentation/components/Input';
import SearchBar from './src/presentation/components/SearchBar';
import JobCard from './src/presentation/components/JobCard';
import { theme } from './src/theme/theme';
import { ThemeProvider } from './src/theme/themeContext';
import ProfileCard from './src/presentation/components/ProfileCard';

const Stack = createNativeStackNavigator();



const App = () => {
  const [checked, setChecked] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [inputValue, setInputValue] = useState('');

  return (
    // <SafeAreaView style={styles.container}>
    //   {/* Test CustomText */}
    //   <CustomText style={[styles.title, Fonts.semiBold]}>Welcome to Job Finder</CustomText>
      
    //   {/* Test Search Bar */}
    //   <SearchBar value={searchText} onChangeText={setSearchText} />

    //   {/* Test Input Field */}
    //   <Input placeholder="Enter your email" value={inputValue} onChangeText={setInputValue} />

    //   {/* Test Checkbox */}
    //   <CheckBox label="Accept Terms" checked={checked} onToggle={() => setChecked(!checked)} />

    //   {/* Test Button */}
    //   <Button title="Apply Now" onPress={() => console.log("Button Pressed")} />

    //   {/* Test Job Card */}
      
    //   <SafeAreaView style={styles.container}>
    //     <ProfileCard
    //       title="User Profile"
    //       details={[
    //         { label: 'Name', value: 'John Doe' },
    //         { label: 'Email', value: 'john.doe@example.com' },
    //         { label: 'Location', value: 'New York, USA' },
    //       ]}
    //     />
    //   </SafeAreaView>
    //   <ScrollView>
    //     <JobCard
    //       company="Google LLC"
    //       jobTitle="UI/UX Designer"
    //       salary="$10,000 - $20,000 / Month"
    //       jobType="Full Time"
    //       logo={require('./asset/images/img_google.png')}
    //       workType="Onsite"
    //     />
    //     <JobCard
    //       company="Apple"
    //       jobTitle="Sales and Marketing"
    //       salary="$8,000 - $20,000 / Month"
    //       jobType="Half Time"
    //       logo={require('./asset/images/img_apple.png')}
    //       workType="Remote"
    //     />
    //   </ScrollView>
          <ThemeProvider>
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
          <Toast />
        </NavigationContainer>
          </ThemeProvider>
    // </SafeAreaView>
    
    
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.light, // Sử dụng màu theme
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
});

export default App;