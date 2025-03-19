import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, Text, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import CheckBox from '../components/CheckBox';
import CustomText from '../components/CustomText';
import Input from '../components/Input';
import Loading from "../components/Loading";
import UserOption from "../components/UserOption";
import firestore from '@react-native-firebase/firestore';
import { useLoading } from '../../context/themeContext';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');

const fb = firestore().collection('tblTaiKhoan');

const Register = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { loading, setLoading } = useLoading();
    const [rememberMe, setRememberMe] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(''); 

    const handleSelectOption = (value: string) => {
        setSelectedOption(value);  
    };

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
        if (!emailRegex.test(email)) {
            setError('Địa chỉ email không hợp lệ');
            return;
        }
    
        if (!passwordRegex.test(password)) {
            setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một chữ số và một ký tự đặc biệt');
            return;
        }
    
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
    
        const normalizedEmail = email.toLowerCase(); 
        const emailExists = await fb.where('sEmailLienHe', '==', normalizedEmail).get();
        if (!emailExists.empty) {
            setError('Email này đã được đăng ký, vui lòng chọn email khác');
            return;
        }
    
        setLoading(true);
    
        try {
            const usersSnapshot = await fb.get();
            const userCount = usersSnapshot.size;
    
            const newAccountNumber = `TK${(userCount + 1).toString().padStart(3, '0')}`;
    
            const newUserRef = await fb.add({
                sEmailLienHe: normalizedEmail,  
                sLoaiTaiKhoan: selectedOption,
                sMaTaiKhoan: newAccountNumber, 
                sMatKhau: password,
                sTrangThai: 'Kích hoạt',
            });
    
            const newUserId = newUserRef.id;
    
            await newUserRef.update({
                id: newUserId
            });
    
            console.log('Đã tạo user mới với ID:', newUserId);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Lỗi khi tạo user:', error);
            setError('Đã xảy ra lỗi');
        }
    
        setLoading(false);
    };

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

            <Input
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
            />
            {error && <Text style={styles.error}>{error}</Text>}

            <UserOption selected={selectedOption} onSelect={handleSelectOption} />


            <CheckBox
                label="Remember Me"
                checked={rememberMe}
                onToggle={() => setRememberMe(!rememberMe)}
                style={styles.rememberContainer}
            />

            <View style={styles.loginOptionsContainer}>
                <Button title="Sign In" onPress={handleRegister} />

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
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
        marginTop: 30,
        marginBottom: 4,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 70,
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    rememberContainer: {
        alignSelf: 'center',
        borderWidth: 0
    },
    loginOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: width * 0.8,
        marginBottom: 25,
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

export default Register;