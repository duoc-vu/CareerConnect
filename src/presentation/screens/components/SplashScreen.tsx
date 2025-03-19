import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation : any = useNavigation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setTimeout(() => {
          // if (storedUserId) {
          //   navigation.replace('bottom'); 
          // } else {
          //   navigation.replace('bottom'); 
          // }
          navigation.replace('bottom'); 
        }, 2000); 
      } catch (error) {
        console.log('Error checking session:', error);
      }
    };

    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../../../asset/images/img_splash.png')} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    width: 100,
    height: 100,
  },
});

export default SplashScreen;
