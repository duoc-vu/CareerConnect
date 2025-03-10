import React, { useState, useEffect } from 'react';
import { Alert, Image, PermissionsAndroid, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';


const { width, height } = Dimensions.get('window');
const fb = firestore().collection('tblTaiKhoan');

const Info = ({ navigation, route }: any) => {
  const { userId,userType } = route.params;
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [introduction, setIntroduction] = useState('');

  const [imageUrl,setImageUrl] = useState(null);

  const pickImage = async () => {
    let checkCam = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

    if (checkCam === PermissionsAndroid.RESULTS.GRANTED) {
      const result: any = await launchImageLibrary({ mediaType: 'photo' });
      if (result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } else {
      Alert.alert('Bạn đã từ chối quyền truy cập vào thư viện ảnh.');
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userDoc = await fb.doc(userId).get();
        if (userDoc.exists) {
          const userData: any = userDoc.data();
          setEmail(userData.email);
        } else {
          console.log('Không có bản ghi nào với id', userId);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };
    getUser();
  }, [userId]);
  // Hàm lấy ảnh từ Firebase Storage
  


  const uploadImage = async () => {
    setUploading(true);
    const imageUrl: any = image;
    try {
      const fileName = `${userId}.jpg`;
      const storageRef = storage().ref(`images/${fileName}`);

      // Tải hình ảnh từ URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Tải lên Firebase Storage
      await storageRef.put(blob);

      // // Lấy URL của hình ảnh đã tải lên
      // const downloadUrl = await storageRef.getDownloadURL();

      // Cập nhật thông tin người dùng trong Firestore
      await firestore().collection('tblUserInfo').doc(userId).set({
        id: userId,
        avtUri: image,
        name: name,
        email: email,
        birthDate: birthDate,
        phone: phone,
        address: address,
        introduction: introduction
      });

      setUploading(false);
      navigation.navigate('bottom', { userId ,userType});

      // Hiển thị thông báo thành công
      console.log('Tải lên hình ảnh thành công!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);

      // Hiển thị thông báo lỗi
      console.log('Đã có lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại.');
    }
  };

  

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeIn" duration={1500} style={styles.header}>
        <Text style={styles.headerText}>Thông Tin Cá Nhân</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={1500} style={styles.formContainer}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Image source={require('../../../../asset/default.png')} style={styles.image} />
            )}
          </View>
        </TouchableOpacity>
        <TextInput
          label="Họ và tên"
          value={name}
          onChangeText={setName}
          style={styles.input}
          theme={{ colors: { primary: '#1E90FF' } }}
        />
        <TextInput
          label="Ngày sinh"
          value={birthDate}
          onChangeText={setBirthDate}
          style={styles.input}
          theme={{ colors: { primary: '#1E90FF' } }}
        />
        <TextInput
          label="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          theme={{ colors: { primary: '#1E90FF' } }}
        />
        <TextInput
          label="Địa chỉ"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          theme={{ colors: { primary: '#1E90FF' } }}
        />
        <TextInput
          label="Giới thiệu"
          value={introduction}
          onChangeText={setIntroduction}
          style={styles.input}
          theme={{ colors: { primary: '#1E90FF' } }}
        />
        <Button
          mode="contained"
          onPress={uploadImage}
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
    paddingTop: 20,
  },
  header: {
    width: '100%',
    height: height * 0.15,
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

export default Info;
