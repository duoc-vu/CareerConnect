import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import Login from './Screens/Login';


const Stack = createNativeStackNavigator();



const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name='Home' component={Home}/> */}
        <Stack.Screen name='Login' component={Login}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;