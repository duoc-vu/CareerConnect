import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Info from './Screens/Info';
import Bottom_Tab from './Screens/Bottom_Tab';
import UserInfoScreen from './Screens/UserInfoScreen';
import CV_Profile from './Screens/CV_Profile';
import JobDetail from './Screens/JobDetail';


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
        {/* <Stack.Screen name='Home' component={Home}  options={{ headerShown: false}}/>  */}
        {/* <Stack.Screen name='cv' component={CV_Profile} options={{ headerShown: false}}/> */}
        

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;