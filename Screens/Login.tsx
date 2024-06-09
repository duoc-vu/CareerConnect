import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore, { onSnapshot, query } from '@react-native-firebase/firestore';

const userTypes = [
    { label: 'Ứng viên', value: '1' },
    { label: 'Doanh nghiệp', value: '2' },
];

// Lấy reference đến collection "users"
const fb = firestore().collection('users');
const fbInfo = firestore().collection('infoUser');

    

const Login = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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
                    if (userInfo.empty)
                        navigation.navigate('Home', { userId });
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
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    dropdown: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
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
        marginVertical: 10,
    },
});

export default Login;