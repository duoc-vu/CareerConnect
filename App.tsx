import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Info from './Screens/Info';
import Bottom_Tab from './Screens/Bottom_Tab';


const Stack = createNativeStackNavigator();



const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name='Register' component={Register} /> */}
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='bottom' component={Bottom_Tab} options={{ headerShown: false}}/>
        {/* <Stack.Screen name='Home' component={Home} />  */}
        <Stack.Screen name='Info' component={Info}/>
        

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;