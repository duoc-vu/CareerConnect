import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../context/UserContext';

const SplashScreen = () => {
  const navigation : any = useNavigation();
  const { setUser } = useUser();
  useEffect(() => {
    const checkSession = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const storedSession = await AsyncStorage.getItem('session');
        // console.log("🔹 Session after delay:", storedSession);
  
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          if (sessionData?.expiresAt && Date.now() < sessionData.expiresAt) {
            setUser(sessionData.userId, sessionData.userType, sessionData.userInfo, sessionData.userEmail);
            navigation.replace('bottom'); 
          } else {
            await AsyncStorage.removeItem('session');
            navigation.replace('bottom');
          }
        } else {
          navigation.replace('bottom'); 
        }
      } catch (error) {
        console.log(" Error checking session:", error);
        navigation.replace('bottom');
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
