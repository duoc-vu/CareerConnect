import React, { useState, useEffect} from "react";
import { View, StyleSheet, Image, ScrollView, StatusBar, TouchableOpacity, Dimensions, Text } from 'react-native';
import Button from '../components/Button';
import CheckBox from '../components/CheckBox';
import CustomText from '../components/CustomText';
import Input from '../components/Input';
import Loading from "../components/Loading";
import firestore from '@react-native-firebase/firestore';
import { theme } from '../../theme/theme';
import { useLoading } from '../../theme/themeContext';

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

    const handleLogin = async () => {
        setLoading(true);
        try {
            const normalizedEmail = email.toLowerCase();

            const userDoc = await fb.where('sEmailLienHe', '==', normalizedEmail).limit(1).get();
            
            if (!email || !password) {
                setLoading(false);
                return;
            } else if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();

                if (userData.sMatKhau === password) {
                    const userType = userData.sLoaiTaiKhoan;
                    const userId = userData.sMaTaiKhoan;

                    console.log(userType);
                    console.log(userId);

                    if (userType === 1) {
                        const userInfo = await fbInfo.where('sMaUngVien', '==', userId).limit(1).get();
                        if (!userInfo.empty) {
                            navigation.navigate('bottom', { userId, userType });
                        } else {
                            navigation.navigate('Info', { userId, userType });
                        }
                    } else if (userType === 2) {
                        const userInfo = await fbInfoCom.where('sMaDoanhNghiep', '==', userId).limit(1).get();
                        if (!userInfo.empty) {
                            navigation.navigate('bottom', { userId, userType });
                        } else {
                            navigation.navigate('company-info', { userId, userType });
                        }
                    }
                    setLoading(false);
                } else {
                    setLoading(false);
                    setError("Sai tài khoản hoặc mật khẩu.")
            }
            } else {
                setLoading(false);
                setError("Sai tài khoản hoặc mật khẩu.")
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra User:', error);
            setLoading(false);
            setError("Lỗi khi đăng nhập")
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setEmail('');
            setPassword('');
            setLoading(false);
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <CustomText style={styles.title}>Welcome Back To</CustomText>
            <CustomText style={styles.appName}>Jobify</CustomText>

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
                <CustomText style={styles.forgotPassword}>Forgot your password?</CustomText>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
                <CustomText>Don't Have An Account? </CustomText>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <CustomText style={styles.signupLink}>Sign Up</CustomText>
                </TouchableOpacity>
            </View>
            {loading && <Loading />}
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
