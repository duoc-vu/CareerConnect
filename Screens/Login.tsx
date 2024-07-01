import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Animated } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import firestore, { onSnapshot, query } from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
// import { FontAwesome5 } from '@expo/vector-icons';

const userTypes = [
    { label: 'Ứng viên', value: '1' },
    { label: 'Doanh nghiệp', value: '2' },
];

const fb = firestore().collection('users');
const fbInfo = firestore().collection('infoUser');

const Login = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [opacity] = useState(new Animated.Value(0));
    // useEffect(() => {
    //     fbInfo.onSnapshot(querySnapshot => {

    //         querySnapshot.forEach((doc) => {
    //             const list: any = [];
    //             list.push({
    //                 id: doc.data().id,
    //                 email: doc.data().email,
    //                 name: doc.data().name,
    //                 date: doc.data().date,
    //                 phone: doc.data().phone,
    //             })
    //             console.log(list);
    //         })
    //     })
    // })

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSubmit = async () => {
        try {
            // Tạo query để tìm document với email cụ thể
            const userDoc = await fb.where('email', '==', email).limit(1).get();
            if (!email || !password) {
                setError('Vui lòng nhập email và password');
                return;
            }
            else if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                if (userData.password === password) {
                    setError('Thông tin hợp lệ');
                    const userId = userDoc.docs[0].id;
                    console.log(userId);
                    //kiem tra xem user có thông tin chưa nếu không có bắt đăng kí thông tin
                    const userInfo = await fbInfo.where('id', '==', userId).limit(1).get();
                    if (!userInfo.empty)
                        navigation.navigate('bottom', { userId });
                    else
                        navigation.navigate('Info', { userId });
                } else {
                    setError('Mật khẩu không chính xác');
                }
            } else {
                setError('Thông tin đăng nhập không chính xác');
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra User:', error);
        }
        // Xử lý đăng ký/đăng nhập tại đây
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <View style={styles.container}>
            <View style={styles.backgroundContainer}>
                <LinearGradient
                    colors={['#ADD8E6', '#87CEEB', '#00BFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.background}
                />
                <Animated.View style={[styles.card, { opacity: opacity }]}>
                    <Image source={require('../asset/default.png')} style={styles.logo} />
                    <Text style={styles.title}>Chào mừng đến với ứng dụng</Text>
                    <View style={styles.inputContainer}>
                        {/* <FontAwesome5 name="envelope" size={20} color="#00BFFF" style={styles.icon} /> */}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#87CEEB"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        {/* <FontAwesome5 name="lock" size={20} color="#00BFFF" style={styles.icon} /> */}
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#87CEEB"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Đăng nhập</Text>
                    </TouchableOpacity>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Chưa có tài khoản?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={[styles.footerText, styles.footerLink]}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 30,
        borderRadius: 10,
        width: '80%',
        shadowColor: '#ADD8E6',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logo: {
        marginHorizontal:'auto',
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#00BFFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ADD8E6',
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        color: '#333',
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#00BFFF',
    },
    button: {
        backgroundColor: '#00BFFF',
        paddingVertical: 12,
        borderRadius: 5,
        marginVertical: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#00BFFF',
        marginRight: 5,
    },
    footerLink: {
        color: '#00BFFF',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginVertical: 10,
    },
});

export default Login;