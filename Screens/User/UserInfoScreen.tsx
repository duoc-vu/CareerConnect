import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Alert, PermissionsAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');
const fbInfo = firestore().collection('tblUserInfo');

const UserInfoScreen = ({ navigation, route }:any) => {
    const { userId, userType } = route.params;

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileName = `${userId}.jpg`;
    const [userInfo, setUserInfo] = useState({
        id: userId,
        avtUri: '',
        name: '',
        email: '',
        birthDate: '',
        phone: '',
        address: '',
        introduction: '',
    });

    const pickImage = async () => {
        let checkCam = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

        if (checkCam === PermissionsAndroid.RESULTS.GRANTED) {
            const result:any = await launchImageLibrary({ mediaType: 'photo' });
            if (result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
                const imageUrl = result.assets[0].uri;
                const storageRef = storage().ref(`images/${fileName}`);

                setUploading(true);
                try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    await storageRef.put(blob);
                    const downloadUrl = await storageRef.getDownloadURL();
                    setUserInfo((prevState) => ({ ...prevState, avtUri: downloadUrl }));
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
                setUploading(false);
            }
        } else {
            Alert.alert('Bạn đã từ chối quyền truy cập vào thư viện ảnh.');
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userDoc:any = await fbInfo.doc(userId).get();
                if (userDoc.exists) {
                    setUserInfo(userDoc.data());
                    const storageRef = storage().ref(`images/${userId}.jpg`);
                    const downloadUrl:any = await storageRef.getDownloadURL();
                    setImage(downloadUrl);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    const handleChangeText = (key:any, text:any) => {
        setUserInfo((prevState) => ({
            ...prevState,
            [key]: text
        }));
    };

    const handleSaveUserInfo = async () => {
        try {
            await fbInfo.doc(userId).set(userInfo);
            console.log('User info saved successfully.');
            navigation.navigate('bottom', { userId, userType });
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeIn" duration={1500} style={styles.header}>
            <IconButton
                    icon="arrow-left"
                    iconColor="white"
                    size={30}
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left: 16, top: 20 }}
                />
                <Text style={styles.headerText}>Thông Tin Cá Nhân</Text>
            </Animatable.View>

            {/* Form Container */}
            <Animatable.View animation="fadeInUp" duration={1500} style={styles.formContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <View style={styles.imageContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.image} />
                        ) : (
                            <Image source={require('../../asset/default.png')} style={styles.image} />
                        )}
                    </View>
                </TouchableOpacity>
                <TextInput
                    label="Họ và tên"
                    value={userInfo.name}
                    onChangeText={(text) => handleChangeText('name', text)}
                    style={styles.input}
                />
                <TextInput
                    label="Ngày sinh"
                    value={userInfo.birthDate}
                    onChangeText={(text) => handleChangeText('birthDate', text)}
                    style={styles.input}
                />
                <TextInput
                    label="Số điện thoại"
                    value={userInfo.phone}
                    onChangeText={(text) => handleChangeText('phone', text)}
                    style={styles.input}
                />
                <TextInput
                    label="Địa chỉ"
                    value={userInfo.address}
                    onChangeText={(text) => handleChangeText('address', text)}
                    style={styles.input}
                />
                <TextInput
                    label="Giới thiệu"
                    value={userInfo.introduction}
                    onChangeText={(text) => handleChangeText('introduction', text)}
                    style={styles.input}
                />
                <Button
                    mode="contained"
                    onPress={handleSaveUserInfo}
                    disabled={uploading}
                    style={styles.button}
                    loading={uploading}
                >
                    {uploading ? 'Đang tải lên...' : 'Lưu thông tin'}
                </Button>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F7',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: height * 0.115,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E90FF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    formContainer: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#1E90FF',
    },
});

export default UserInfoScreen;
