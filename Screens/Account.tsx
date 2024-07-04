import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';

const Account = ({ navigation, route }: any) => {
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState('');
    const { userId } = route.params;
    const [user, setUser] = useState({
        avtUri: '',
        name: '',
        email: '',
        birthDate: '',
        phone: '',
        address: '',
        introduction: '',
    });

    useEffect(() => {
        const getUser = async () => {
            try {
                const userDoc = await firestore().collection('tblUserInfo').doc(userId).get();
                if (userDoc.exists) {
                    const userData: any = userDoc.data();
                    setUser({
                        avtUri: userData.avtUri,
                        name: userData.name,
                        email: userData.email,
                        birthDate: userData.birthDate,
                        phone: userData.phone,
                        address: userData.address,
                        introduction: userData.introduction,
                    });
                    setImage(userData.avtUri);
                    setUploading(false);
                } else {
                    console.log('Không có bản ghi nào với id', userId);
                    setUploading(true);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                setUploading(true);
            }
        };

        getUser();
    }, [userId]);

    const handleUpdate = () => {
        if (!route) {
            navigation.navigate('Login');
        } else {
            navigation.navigate('If', { userId });
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="bounceIn" duration={1500} style={styles.profileContainer}>
                <Image source={image ? { uri: image } : require('../asset/default.png')} style={styles.profileImage} />
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
            <Animatable.View animation="fadeIn" duration={2000} style={styles.buttonContainer}>
                <TouchableHighlight
                    style={styles.button}
                    onPress={handleUpdate}
                    underlayColor="#1E90FF"
                >
                    <Text style={styles.buttonText}>{uploading ? 'Đăng nhập' : 'Cập nhật thông tin'}</Text>
                </TouchableHighlight>
            </Animatable.View>
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
});

export default Account;
