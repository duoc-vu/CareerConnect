import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';

const AccountCompany = ({ navigation, route }: any) => {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [image, setImage] = useState('');
    const { userId } = route.params;
    const [company, setCompany] = useState({
        avtUri: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        detail: '',
    });
    const [animationKey, setAnimationKey] = useState(0);
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordMatching, setIsPasswordMatching] = useState(true);
    const [error, setError] = useState('');


    const fetchUserData = async () => {
        setUploading(true);
        try {
            const userDoc = await firestore().collection('tblCompany').doc(userId).get();
            if (userDoc.exists) {
                const userData: any = userDoc.data();
                const storageRef = storage().ref(`images/${userId}.jpg`);
                const downloadUrl = await storageRef.getDownloadURL();

                setCompany({
                    avtUri: downloadUrl,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address,
                    detail: userData.detail,
                });
                setImage(downloadUrl);
            } else {
                console.log('Không có bản ghi nào với id', userId);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
        setUploading(false);
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
            setAnimationKey(prevKey => prevKey + 1); // Reset animation
        }, [userId])
    );

    const handleUpdate = () => {
        navigation.navigate('CompanyIf', { userId });
    };
    const handleLogout = () => {
        // Implement your logout logic here
        // Example: Clear authentication state, navigate to login screen, etc.
        // For demo purposes, navigate back to the login screen
        navigation.navigate('Login');
    };


    const handleChangePasswordConfirm = () => {
        if (!isPasswordMatching) {
            setError('Mật khẩu không khớp');
            return
        } 
        const documentRef = firestore().collection('tblTaiKhoan').doc(userId);
        console.log(newPassword);
        documentRef.update({
            password: newPassword,
        })
            .then(() => Alert.alert('Đổi mật khẩu thành công'))
            .catch(error => console.log('Lỗi trong quá trình update', error));
        navigation.goBack();
    };
    return (
        <View style={styles.container}>
            <Animatable.View key={`profile-${animationKey}`} animation="bounceIn" duration={1500} style={styles.profileContainer}>
                <Image source={image ? { uri: image } : require('../../../../asset/default.png')} style={styles.profileImage} />
                <Text style={styles.name}>{company.name}</Text>
            </Animatable.View>
            <Animatable.View key={`info-${animationKey}`} animation="fadeInUp" duration={1500} style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{company.email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Số điện thoại:</Text>
                    <Text style={styles.infoValue}>{company.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Địa chỉ:</Text>
                    <Text style={styles.infoValue}>{company.address}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Giới thiệu:</Text>
                    <Text style={styles.infoValue}>{company.detail}</Text>
                </View>
            </Animatable.View>
            <View style={styles.buttonContainer}>
                <TouchableHighlight
                    style={styles.button}
                    onPress={handleUpdate}
                    underlayColor="#1E90FF"
                >
                    <Text style={styles.buttonText}>{uploading ? 'Đang tải...' : 'Cập nhật thông tin'}</Text>
                </TouchableHighlight>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F7',
        paddingHorizontal: 20,
        paddingVertical: 40,
        alignItems: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 20,
        marginTop: 20,
        width: '100%',
        backgroundColor: 'white',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#1E90FF',
    },
    infoValue: {
        fontSize: 16,
        flex: 1,
    },
    buttonContainer: {
        width: '60%',
        marginHorizontal: '20%',
        marginTop: 50,
    },
    button: {
        backgroundColor: '#1E90FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    logoutButton: {
        marginTop: 10,
        marginHorizontal:'auto'
    },
    logoutText: {
        color: '#1E90FF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AccountCompany;
