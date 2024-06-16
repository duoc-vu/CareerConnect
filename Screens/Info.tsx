import React, { useState, useEffect } from 'react';
import { Alert, Button, Image, PermissionsAndroid, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';

const Info = ({navigation,route}:any) => {

  const { userId } = route.params;

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [introduction, setIntroduction] = useState('');

  const pickImage = async () => {
    let checkCam = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

    if (checkCam === PermissionsAndroid.RESULTS.GRANTED) {
      const result: any = await launchImageLibrary({ mediaType: 'photo' });
      setImage(result.assets[0].uri);
    } else {
      Alert.alert('Bạn đã từ chối quyền truy cập vào thư viện ảnh.');
    }
  };

  const uploadImage = async () => {
    setUploading(true);
    try {
      await firestore().collection('infoUser').doc(userId).set({
        id: userId,
        avtUri: image,
        name: name,
        birthDate: birthDate,
        phone: phone,
        address: address,
        introduction: introduction
      });
      setUploading(false);
      navigation.navigate('Home', {userId});
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Xin chào {userId}</Text>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image source={require('../asset/default.png')} style={styles.image} />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Ngày sinh"
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Giới thiệu"
          value={introduction}
          onChangeText={setIntroduction}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={uploading ? 'Uploading...' : 'Lưu thông tin'}
          onPress={uploadImage}
          disabled={uploading}
          color="#4CAF50"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  infoContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '80%',
  },
});

export default Info;