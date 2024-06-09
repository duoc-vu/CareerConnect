import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore, { onSnapshot, query } from '@react-native-firebase/firestore';

const fb = firestore().collection('users');

const userTypes = [
    { label: 'Ứng viên', value: '1' },
    { label: 'Doanh nghiệp', value: '2' },
];


// const list: any = [];
const Register = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('1');
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [error, setError] = useState('');


    // useEffect(() => {
    //     fb.onSnapshot(querySnapshot => {

    //         querySnapshot.forEach((doc) => {
    //             const list: any = [];
    //             list.push({
    //                 id: doc.data().id,
    //                 email: doc.data().email,
    //                 password: doc.data().password,
    //             })
    //         })
    //     })


    // })

    const handleRegister = async () => {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!emailRegex.test(email)) {
            setError('Địa chỉ email không hợp lệ');
            return;
        }

        // Validate password

        else if (!passwordRegex.test(password)) {
            setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường và một số');
            return;
        }

        // Validate confirm password
        else if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        else {
            // const newDocRef = await fb.add({
            //     id: '',
            //     email: email,
            //     password: password
            // });
            // const newDocID = newDocRef.id;

            // await newDocRef.update({
            //     id = newDocID;
            // })

            try {
                // Tạo một document mới
                const newUserRef = await fb.add({
                    email: email,
                    password: password,
                });

                // Lấy ID của document vừa tạo
                const newUserId = newUserRef.id;

                // Cập nhật document với ID của chính nó
                await newUserRef.update({
                    id: newUserId
                });

                console.log('Đã tạo user mới với ID:', newUserId);
            } catch (error) {
                console.error('Lỗi khi tạo user:', error);
            }
            Alert.alert('Đăng ký thành công');
        }
        // Clear error
        setError('');

        // Xử lý đăng ký tại đây

        navigation.navigate('Login')
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
        console.log('User Type:', userType);

    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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

            <Button title="Đăng ký" onPress={handleRegister} />
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

export default Register;