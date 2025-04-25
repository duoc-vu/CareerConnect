import React, { useState, useEffect} from "react";
import { View, StyleSheet, Image, ScrollView, StatusBar, TouchableOpacity, Dimensions, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import CheckBox from '../components/CheckBox';
import CustomText from '../components/CustomText';
import Input from '../components/Input';
import firestore from '@react-native-firebase/firestore';
import { theme } from '../../theme/theme';
import { useLoading } from '../../context/themeContext';
import messaging from '@react-native-firebase/messaging';
import { useUser } from "../../context/UserContext";
import axios from 'axios';

const API_URL = 'http://192.168.102.24:3000/api/notify';
const { width } = Dimensions.get('window');

const fb = firestore().collection('tblTaiKhoan');
const fbInfo = firestore().collection('tblUngVien');
const fbInfoCom = firestore().collection('tblDoanhNghiep');

const Login = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const {loading, setLoading} = useLoading();
    const [error, setError] = useState('');
    const { setUser } = useUser();
    const updateFCMToken = async (userId:any) => {
        try {
            const token = await messaging().getToken(); 
            if (token) {
                await firestore().collection('tblTaiKhoan')
                    .where('sMaTaiKhoan', '==', userId) 
                    .get()
                    .then(querySnapshot => {
                        if (!querySnapshot.empty) {
                            querySnapshot.forEach(doc => {
                                doc.ref.update({ sFCMToken: token }); 
                            });
                        }
                    });
            }
            await axios.post(API_URL, {
                fcmToken: token,
                title: 'Đăng nhập thành công!',
                body: `Chào mừng bạn quay lại Jobify 👋`,
            });
        } catch (error) {
            console.error("Error updating FCM Token:", error);
        }
    };
    
    const handleLogin = async () => {
        if (!loading) setLoading(true);
        try {
            const normalizedEmail = email.toLowerCase();
            const userDoc = await fb.where('sEmailLienHe', '==', normalizedEmail).limit(1).get();
            
            if (!email || !password) {
                if (loading) setLoading(false);
                return;
            } else if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                const userId = userData.sMaTaiKhoan;
    
                if (userData.sMatKhau === password) {
                    const userType = userData.sLoaiTaiKhoan;
                    const userEmail = userData.sEmailLienHe;
                    const userStatus = userData.sTrangThai;

                    await updateFCMToken(userId);
    
                    let userInfo = null;
                    if (userType === 1) {
                        const userInfoDoc = await fbInfo.where('sMaUngVien', '==', userId).limit(1).get();
                        if (!userInfoDoc.empty) {
                            userInfo = userInfoDoc.docs[0].data();
                        }
                    } else if (userType === 2) {
                        const userInfoDoc = await fbInfoCom.where('sMaDoanhNghiep', '==', userId).limit(1).get();
                        if (!userInfoDoc.empty) {
                            userInfo = userInfoDoc.docs[0].data();
                        }
                    }
                    userInfo = { ...userInfo, sTrangThai: userStatus };

                    setUser(userId, userType, userInfo, userEmail);
                    const sessionData = {
                        userId,
                        userType,
                        userInfo,
                        userEmail,
                        expiresAt: Date.now() + 3 * 24 * 60 * 60 * 1000, 
                    };
                    await AsyncStorage.setItem('session', JSON.stringify(sessionData));
    
                    navigation.navigate("bottom");
                } else {
                    setError("Sai tài khoản hoặc mật khẩu.");
                }
            } else {
                setError("Sai tài khoản hoặc mật khẩu.");
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra User:', error);
        } finally {
            if (loading) setLoading(false);
        }
    };


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setEmail('');
            setPassword('');
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <CustomText style={styles.title}>Welcome Back To</CustomText>
            <CustomText style={styles.appName}>Career Connect</CustomText>

            <Input
                placeholder="Email Or Phone Number"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <CheckBox
                label="Remember Me"
                checked={rememberMe}
                onToggle={() => setRememberMe(!rememberMe)}
                style={styles.rememberContainer}
            />

            <View style={styles.loginOptionsContainer}>
                <Button title="Login" onPress={handleLogin} />

                <CustomText style={styles.orText}>Or</CustomText>

                <TouchableOpacity style={styles.socialIconContainer}>
                    <Image source={require('../../../asset/images/img_google.png')} style={styles.socialIcon} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <CustomText style={styles.forgotPassword}>Quên mật khẩu?</CustomText>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
                <CustomText>Bạn chưa có tài khoản? </CustomText>
                <TouchableOpacity onPress={() => navigation.navigate('register')}>
                <CustomText style={styles.signupLink}>Đăng ký</CustomText>
                </TouchableOpacity>
            </View>
        </ScrollView>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#000',
        marginBottom: 4,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 100,
    },
    input: {
        width: '90%',
        height: 60,
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    rememberContainer: {
        alignSelf: 'center',
        marginVertical: 10,
        marginTop: 40,
        borderWidth: 0
    },
    loginOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: width * 0.8,
        marginVertical: 40,
    },
    orText: {
        color: '#aaa',
        fontSize: 16,
    },
    socialIconContainer: {
        borderWidth: 1, 
        borderRadius: 20,
        padding: 12,
        borderColor: '#ccc',
    },
    socialIcon: {
        width: 30,
        height: 30,
    },
    forgotPassword: {
        color: '#000959',
        fontSize: 14,
        marginBottom: 15,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupLink: {
        color: '#000959',
        fontWeight: 'bold',
    },
    error: {
        color: theme.colors.error.dark,  
        fontSize: 12,  
        marginTop: 5,  
        textAlign: 'center',
    },
});

export default Login;
