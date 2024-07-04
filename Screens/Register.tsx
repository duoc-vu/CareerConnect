import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Dropdown } from 'react-native-element-dropdown';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const fb = firestore().collection('tblTaiKhoan');

const userTypes = [
    { label: 'Ứng viên', value: '1' },
    { label: 'Doanh nghiệp', value: '2' },
];

const Register = ({ navigation }:any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('1');
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!emailRegex.test(email)) {
            setError('Địa chỉ email không hợp lệ');
            return;
        }

        if (!passwordRegex.test(password)) {
            setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường và một số');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        try {
            const newUserRef = await fb.add({
                email: email,
                password: password,
                userType: userType
            });

            const newUserId = newUserRef.id;

            await newUserRef.update({
                id: newUserId
            });

            console.log('Đã tạo user mới với ID:', newUserId);
            Alert.alert('Đăng ký thành công');
        } catch (error) {
            console.error('Lỗi khi tạo user:', error);
            setError('Đã xảy ra lỗi');
        }

        setError('');
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="bounceIn" duration={1500} style={styles.logoContainer}>
                <Image source={require('../asset/logo2.png')} style={styles.logo} />
            </Animatable.View>
            <Animatable.View animation="fadeInUp" duration={1500} style={styles.formContainer}>
                <Text style={styles.title}>Đăng Ký</Text>
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
                <TextInput
                    label="Xác Nhận Mật Khẩu"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                    theme={{ colors: { primary: '#1E90FF' } }}
                />
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={userTypes}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Chọn loại người dùng' : '...'}
                    searchPlaceholder="Tìm kiếm..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                        setUserType(item.value);
                        setIsFocus(false);
                    }}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Button mode="contained" onPress={handleRegister} style={styles.button}>
                    Đăng Ký
                </Button>
                <Button onPress={() => navigation.navigate('Login')} color="#1E90FF">
                    Đã có tài khoản? Đăng Nhập
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
    dropdown: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 15,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    error: {
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

export default Register;
