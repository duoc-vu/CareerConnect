import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import firestore, { onSnapshot, query } from '@react-native-firebase/firestore';

const Account = ({navigation, route }: any) => {

    const [uploading, setUploading] = useState(false);
    const [Img, setImg] = useState(false);
    const { userId } = route.params;
    const [user, setUser] = useState({
        image: '',
        name: '',
        email: '',
        birthDate: '',
        phone: '',
        address: '',
        introduction: '',
    });
    const handleUpdate = () => {
        if(!route){
            navigation.navigate('Login');
        }else{
            navigation.navigate('Info' , {userId});
        }
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const userDoc = await firestore().collection('infoUser').doc(userId).get();
                if (userDoc.exists) {
                    const userData: any = userDoc.data();
                    if (!userData.avtUri) setImg(false);
                    else setImg(true);
                    
                    setUser({
                        image: userData.avtUri,
                        name: userData.name,
                        email: userData.email,
                        birthDate: userData.birthDate,
                        phone: userData.phone,
                        address: userData.address,
                        introduction: userData.introduction,
                    });
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
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={Img ? { uri: user.image } :  require('../asset/default.png') } style={styles.profileImage} />
                <Text style={styles.name}>{user.name}</Text>
            </View>
            <View style={styles.infoContainer}>
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
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title={uploading ? 'Đăng nhập' : 'Cập nhật thông tin'}
                    onPress={handleUpdate}
                    color="#4CAF50"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 40,
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

});

export default Account;