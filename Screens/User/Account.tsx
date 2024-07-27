import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';

const Account = ({ navigation, route }: any) => {
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState('');
    const { userId, userType } = route.params;
    const [user, setUser] = useState({
        avtUri: '',
        name: '',
        email: '',
        birthDate: '',
        phone: '',
        address: '',
        introduction: '',
    });
    const [animationKey, setAnimationKey] = useState(0);

    const fetchUserData = async () => {
        setUploading(true);
        try {
            const userDoc = await firestore().collection('tblUserInfo').doc(userId).get();
            if (userDoc.exists) {
                const userData: any = userDoc.data();
                const storageRef = storage().ref(`images/${userId}.jpg`);
                const downloadUrl = await storageRef.getDownloadURL();

                setUser({
                    avtUri: userData.avtUri,
                    name: userData.name,
                    email: userData.email,
                    birthDate: userData.birthDate,
                    phone: userData.phone,
                    address: userData.address,
                    introduction: userData.introduction,
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
        navigation.navigate('If', { userId, userType });
    };

    const handleLogout = () => {
        // Implement your logout logic here
        // Example: Clear authentication state, navigate to login screen, etc.
        // For demo purposes, navigate back to the login screen
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Animatable.View key={`profile-${animationKey}`} animation="bounceIn" duration={1500} style={styles.profileContainer}>
                <Image source={image ? { uri: image } : require('../../asset/default.png')} style={styles.profileImage} />
                <Text style={styles.name}>{user.name}</Text>
            </Animatable.View>
            <Animatable.View animation="fadeInUp" duration={1500} style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{user.email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Số điện thoại:</Text>
                    <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Địa chỉ:</Text>
                    <Text style={styles.infoValue}>{user.address}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ngày sinh:</Text>
                    <Text style={styles.infoValue}>{user.birthDate}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Giới thiệu:</Text>
                    <Text style={styles.infoValue}>{user.introduction}</Text>
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
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
        marginVertical: 10,
        backgroundColor: '#1E90FF',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    logoutButton: {
        marginTop: 10,
    },
    logoutText: {
        color: '#1E90FF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Account;
