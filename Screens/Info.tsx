import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Info = ({route} :any) => {
    const { userId } = route.params;
    const [name, setName] = useState('');
    const [hometown, setHometown] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (
            name.trim() === '' ||
            hometown.trim() === '' ||
            age.trim() === '' ||
            phone.trim() === '' ||
            specialty.trim() === '' ||
            dateOfBirth.trim() === '' ||
            email.trim() === ''
        ) {
            Alert.alert(
                'Thông báo',
                'Vui lòng điền đầy đủ thông tin cá nhân.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
            Alert.alert(
                'Thông báo',
                'Định dạng ngày sinh không hợp lệ. Vui lòng nhập đúng định dạng DD/MM/YYYY.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            Alert.alert(
                'Thông báo',
                'Địa chỉ email không hợp lệ. Vui lòng nhập lại.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        // Ở đây bạn có thể thêm logic để lưu thông tin người dùng vào database hoặc thực hiện các hành động khác
        console.log('Thông tin người dùng:', {
            name,
            hometown,
            age,
            phone,
            specialty,
            dateOfBirth,
            email,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin cá nhân</Text>
            <Text>{userId}</Text>
            <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Ngày sinh"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Quê quán"
                value={hometown}
                onChangeText={setHometown}
            />


            <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Sở trường"
                value={specialty}
                onChangeText={setSpecialty}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Lưu thông tin</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Info;