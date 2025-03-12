import React, { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import ProfileHeader from '../../components/ProfileHeader';
import Highlights from '../../components/Highlight';
import WorkExperienceCard from '../../components/WorkExperience';
import { theme } from '../../../theme/theme';

const { width, height } = Dimensions.get('window');

const Account = ({ navigation, route }: any) => {
    const [highlights, setHighlights] = useState({
        text: 'Marian has received Google Certification',
        subtitle: 'Google Project Management Certificate',
    });  
    
    const [workExperience, setWorkExperience] = useState([
        { role: 'Project Manager', type: 'Full-time', duration: '10 months' },
        { role: 'Junior Project Manager', type: 'Full-time', duration: '10 months' },
        { role: 'Project Manager Intern', type: 'Full-time', duration: '10 months' },
    ]);

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
        }, [userId])
    );

    const handleUpdate = () => {
        navigation.navigate('If', { userId, userType });
    };

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    return (
        // <View style={styles.container}>
        //     <Animatable.View key={`profile-${animationKey}`} animation="bounceIn" duration={1500} style={styles.profileContainer}>
        //         <Image source={image ? { uri: image } : require('../../../../asset/default.png')} style={styles.profileImage} />
        //         <Text style={styles.name}>{user.name}</Text>
        //     </Animatable.View>
        //     <Animatable.View animation="fadeInUp" duration={1500} style={styles.infoContainer}>
        //         <View style={styles.infoRow}>
        //             <Text style={styles.infoLabel}>Email:</Text>
        //             <Text style={styles.infoValue}>{user.email}</Text>
        //         </View>
        //         <View style={styles.infoRow}>
        //             <Text style={styles.infoLabel}>Số điện thoại:</Text>
        //             <Text style={styles.infoValue}>{user.phone}</Text>
        //         </View>
        //         <View style={styles.infoRow}>
        //             <Text style={styles.infoLabel}>Địa chỉ:</Text>
        //             <Text style={styles.infoValue}>{user.address}</Text>
        //         </View>
        //         <View style={styles.infoRow}>
        //             <Text style={styles.infoLabel}>Ngày sinh:</Text>
        //             <Text style={styles.infoValue}>{user.birthDate}</Text>
        //         </View>
        //         <View style={styles.infoRow}>
        //             <Text style={styles.infoLabel}>Giới thiệu:</Text>
        //             <Text style={styles.infoValue}>{user.introduction}</Text>
        //         </View>
        //     </Animatable.View>
        //     <View style={styles.buttonContainer}>
        //         <TouchableHighlight
        //             style={styles.button}
        //             onPress={handleUpdate}
        //             underlayColor="#1E90FF"
        //         >
        //             <Text style={styles.buttonText}>{uploading ? 'Đang tải...' : 'Cập nhật thông tin'}</Text>
        //         </TouchableHighlight>
        //         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        //             <Text style={styles.logoutText}>Đăng xuất</Text>
        //         </TouchableOpacity>
        //     </View>
        // </View>
        <ScrollView style={styles.container}>
        <View style={styles.headerBackground} />
        <View style={styles.contentWrapper}>
            <ProfileHeader
                avatarUrl={image || 'https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg'}
                name={user.name || 'Marian Hart'}
                position="Director of Project Management GoldenPhase Solar"
                university="Syracuse University - New York"
                location="Greater San Diego Area / 500+ connections"
            />
            <Highlights
                logoUrl="https://cdn.geekwire.com/wp-content/uploads/2015/09/Screen-Shot-2015-09-01-at-9.03.40-AM.png"
                title={highlights.text}
                description={highlights.subtitle}
            />
            <WorkExperienceCard
                experiences={workExperience}
            />
        </View>
    </ScrollView>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#F0F4F7',
    //     padding: 20,
    //   },
    // profileContainer: {
    //     alignItems: 'center',
    //     marginBottom: 30,
    // },
    // profileImage: {
    //     width: 100,
    //     height: 100,
    //     borderRadius: 50,
    //     marginBottom: 10,
    // },
    // name: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    // },
    // infoContainer: {
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     borderRadius: 8,
    //     padding: 20,
    //     marginTop: 20,
    //     width: '100%',
    //     backgroundColor: 'white',
    // },
    // infoRow: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 10,
    // },
    // infoLabel: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     marginRight: 10,
    //     color: '#1E90FF',
    // },
    // infoValue: {
    //     fontSize: 16,
    //     flex: 1,
    // },
    // buttonContainer: {
    //     width: '100%',
    //     marginTop: 20,
    //     alignItems: 'center',
    // },
    // button: {
    //     marginVertical: 10,
    //     backgroundColor: '#1E90FF',
    //     borderRadius: 15,
    //     paddingVertical: 10,
    //     paddingHorizontal: 20,
    // },
    // buttonText: {
    //     color: 'white',
    //     fontWeight: 'bold',
    //     textAlign: 'center',
    // },
    // logoutButton: {
    //     marginTop: 10,
    // },
    // logoutText: {
    //     color: '#1E90FF',
    //     fontWeight: 'bold',
    //     fontSize: 16,
    // },

    container: {
        flex: 1,
        backgroundColor: '#F0F4F7',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        width: width,
        height: height * 0.3,
        backgroundColor: theme.colors.primary.dark,
        borderBottomRightRadius: 100,
    },
    contentWrapper: {
        marginTop: height * 0.15,
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center'
    },
});

export default Account;
