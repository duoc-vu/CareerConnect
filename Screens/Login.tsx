import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ActivityIndicator, StatusBar } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const fb = firestore().collection('tblTaiKhoan');
const fbInfo = firestore().collection('tblUserInfo');
const fbInfoCom = firestore().collection('tblCompany');

const Login = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const userDoc = await fb.where('email', '==', email).limit(1).get();
            if (!email || !password) {
                setError('Vui lòng nhập email và password');
                setLoading(false);
                return;
            } else if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                if (userData.password === password) {
                    const userType = userData.userType;
                    const userId = userDoc.docs[0].id;
                    if (userData.userType === '1') {
                        const userInfo = await fbInfo.where('id', '==', userId).limit(1).get();
                        if (!userInfo.empty) {
                            navigation.navigate('bottom', { userId, userType });
                            Toast.show({
                                type: 'success',
                                text1: 'Đăng nhập thành công',
                                text2: 'Chào mừng bạn đến với ứng dụng của chúng tôi!',
                            });
                        } else {
                            navigation.navigate('Info', { userId, userType });
                            Toast.show({
                                type: 'success',
                                text1: 'Đăng nhập thành công',
                                text2: 'Chào mừng bạn đến với ứng dụng của chúng tôi!',
                                
                            });
                        }
                    } else if (userData.userType === '2') {
                        const userInfo = await fbInfoCom.where('id', '==', userId).limit(1).get();
                        if (!userInfo.empty) {
                            navigation.navigate('bottom', { userId, userType });
                            Toast.show({
                                type: 'success',
                                text1: 'Đăng nhập thành công',
                                text2: 'Chào mừng bạn đến với ứng dụng của chúng tôi!',
                            });
                        } else {
                            navigation.navigate('CompanyInfo', { userId, userType });
                            Toast.show({
                                type: 'success',
                                text1: 'Đăng nhập thành công',
                                text2: 'Chào mừng bạn đến với ứng dụng của chúng tôi!',
                            });
                        }
                    }
                    setLoading(false);
                } else {
                    setError('Mật khẩu không chính xác');
                    setLoading(false);
                }
            } else {
                setError('Thông tin đăng nhập không chính xác');
                setLoading(false);
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra User:', error);
            setError('Đã xảy ra lỗi');
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setEmail('');
            setPassword('');
            setError('');
            setLoading(false);
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#F0F4F7"}/>
            <Animatable.View animation="bounceIn" duration={1500} style={styles.logoContainer}>
                <Image source={require('../asset/logo2.png')} style={styles.logo} />
            </Animatable.View>
            <Animatable.View animation="fadeInUp" duration={1500} style={styles.formContainer}>
                <Text style={styles.title}>Đăng Nhập</Text>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    theme={{ colors: { primary: '#1E90FF' } }}
                />
                <TextInput
                    label="Mật Khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    theme={{ colors: { primary: '#1E90FF' } }}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Đăng Nhập'}
                </Button>
                <Button onPress={() => navigation.navigate('Register')} color="#1E90FF">
                    Chưa có tài khoản? Đăng Ký
                </Button>
            </Animatable.View>
            <Animatable.View animation="fadeIn" duration={2000} style={styles.footer}>
                <Text style={styles.footerText}>Welcome to our app</Text>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
    },
    formContainer: {
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#1E90FF',
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 15,
    },
    button: {
        marginBottom: 15,
        backgroundColor: '#1E90FF',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#1E90FF',
    },
});

export default Login;
