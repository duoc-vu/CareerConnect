import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity, PermissionsAndroid, Alert } from 'react-native';
import firestore, { updateDoc } from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';


const UserInfoScreen = ({ navigation, route }: any) => {
    const { userId } = route.params;
    const fbInfo = firestore().collection('infoUser');
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [introduction, setIntroduction] = useState('');
  
    const [Img, setImg] = useState('');
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
          const result: any = await launchImageLibrary({ mediaType: 'photo' });
          setImage(result.assets[0].uri);
          setUserInfo((prevState) => ({ ...prevState, avtUri: result.assets[0].uri }));
        } else {
          Alert.alert('Bạn đã từ chối quyền truy cập vào thư viện ảnh.');
        }
      };


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userDoc:any = await fbInfo.doc(userId).get();
                if (userDoc.exists) {
                   await setUserInfo(userDoc.data());
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    useEffect(() =>{
        if(userInfo.avtUri)
            setImage(userInfo.avtUri);
    })


    const handleSaveUserInfo = async () => {
        try {
            await fbInfo.doc(userId).set(userInfo);
            console.log('User info saved successfully.');
            navigation.navigate('bottom', {userId});
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    const handleUpdateUserInfo = async () => {
        try {
            await fbInfo.doc(userId).update(userInfo);
            console.log('User info saved successfully.');
            navigation.navigate('bottom', {userId});
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    return (
        <View style={styles.container}>
                <TouchableOpacity onPress={pickImage}>
                <View style={styles.imageContainer}>
                    {image ? (
                    <Image source={{ uri: userInfo.avtUri }} style={styles.image} />
                    ) : (
                    <Image source={require('../asset/default.png')} style={styles.image} />
                    )}
                </View>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={userInfo.name}
                    onChangeText={(text) => setUserInfo((prevState) => ({ ...prevState, name: text }))}
                    placeholder="Name"
                />
                <TextInput
                    style={styles.input}
                    value={userInfo.email}
                    onChangeText={(text) => setUserInfo((prevState) => ({ ...prevState, email: text }))}
                    placeholder="Email"
                />
                <TextInput
                    style={styles.input}
                    value={userInfo.birthDate}
                    onChangeText={(text) => setUserInfo((prevState) => ({ ...prevState, birthDate: text }))}
                    placeholder="Ngày sinh"
                />
                <TextInput
                    style={styles.input}
                    value={userInfo.phone}
                    onChangeText={(text) => setUserInfo((prevState) => ({ ...prevState, phone: text }))}
                    placeholder="Số điện thoại"
                />
                <TextInput
                    style={styles.input}
                    value={userInfo.address}
                    onChangeText={(text) => setUserInfo((prevState) => ({ ...prevState, address: text }))}
                    placeholder="Địa chỉ"
                />
                <TextInput
                    style={styles.input}
                    value={userInfo.introduction}
                    onChangeText={(text) => setUserInfo((prevState) => ({ ...prevState, introduction: text }))}
                    placeholder="Giới thiệu"
                />
                {userInfo ? (
                    <Button title="Save" onPress={handleSaveUserInfo} />
                ) : (
                    <Button title="Save" onPress={handleUpdateUserInfo} />
                )}
                
            </View >
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 8,
    },
    error: {
        color: 'red',
        marginVertical: 4,
    },
});

export default UserInfoScreen;