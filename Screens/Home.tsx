import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import firestore, { onSnapshot, query } from '@react-native-firebase/firestore';

const fbInfo = firestore().collection('infoUser');
const Home = ({ route }: any) => {

    if(!route){
        return(
            <View>
                <Text>Vui lòng đăng nhập</Text>
            </View>
        )
    }else{
        const { userId } = route.params;
        console.log(userId);
        const [user, setUser] = useState('');
    
        useEffect(() => {
            const getUser = async () => {
                try {
                    const userDoc = await fbInfo.doc(userId).get();
                    if (userDoc.exists) {
                        const userData:any = userDoc.data();
                        setUser(userData.name);
                        console.log(userData.name);
                    } else {
                        console.log('Không có bản ghi nào với id', userId);
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin người dùng:', error);
                }
            };
    
            getUser();
        }, [userId]);
    
    
    
        return (
            <View>
                <Text>Xin chào {user}</Text>
            </View>
        )
    }
    
}

export default Home;