import React, { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import ProfileCard from '../../components/ProfileCard';
import CustomText from '../../components/CustomText';
import { Image } from 'react-native-animatable';
import SkillTags from '../../components/SkillTags';
import { useUser } from '../../../context/UserContext';
import { useLoading } from '../../../context/themeContext';
import Loading from '../../components/Loading';
import HeaderWithIcons from '../../components/Header';

const Account = ({ navigation }: any) => {

    const [image, setImage] = useState('');
    const { userId, userType } = useUser();
    const { loading, setLoading } = useLoading();
    const [user, setUser] = useState({
        sAnhDaiDien: '',
        sHoVaTen: '',
        sEmailLienHe: '',
        sSoDienThoai: '',
        sChuyenNganh: '',
        sKinhNghiem: '',
        sDiaChi: '',
        sKiNang: '',
        sSoThich: '',
        sMoTaChiTiet: '',
    });

    const fetchUserData = async () => {
        setLoading(true);

        console.log("User ID gửi sang", userId);

        try {
            const userQuery = await firestore()
                .collection('tblUngVien')
                .where('sMaUngVien', '==', userId)
                .get();

            if (!userQuery.empty) {
                const userData = userQuery.docs[0].data();

                // Lấy email từ bảng tblTaiKhoan
                const accountQuery = await firestore()
                    .collection('tblTaiKhoan')
                    .where('sMaTaiKhoan', '==', userId)
                    .get();

                let userEmail = 'No Email';
                if (!accountQuery.empty) {
                    userEmail = accountQuery.docs[0].data().sEmailLienHe || 'No Email';
                }

                setUser({
                    sAnhDaiDien: userData.sAnhDaiDien || '',
                    sHoVaTen: userData.sHoVaTen || '',
                    sKinhNghiem: userData.sKinhNghiem || '',
                    sEmailLienHe: userEmail,
                    sChuyenNganh: userData.sChuyenNganh || '',
                    sSoDienThoai: userData.sSoDienThoai || '',
                    sDiaChi: userData.sDiaChi || '',
                    sMoTaChiTiet: userData.sMoTaChiTiet || '',
                    sKiNang: userData.sKiNang,
                    sSoThich: userData.sSoThich
                });

                const storageRef = storage().ref(`tblUngVien/${userId}.png`);
                try {
                    const downloadUrl = await storageRef.getDownloadURL();
                    setImage(downloadUrl);
                } catch (error) {
                    console.log('Không tìm thấy ảnh:', error);
                }
            } else {
                console.log('Không có ứng viên với ID:', userId);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin ứng viên:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [userId])
    );

    return (
        <View style={styles.container}>
            <HeaderWithIcons
                title='Hồ sơ tài khoản'
                onBackPress={() => {navigation.goBack()}}
            />
            <ScrollView style={styles.scrollContainer}>
                <ProfileCard
                    avatar={image}
                    name={user.sHoVaTen || 'Unknown User'}
                    email={user.sEmailLienHe || 'No Email'}
                    location={user.sDiaChi || 'No Address'}
                    style={{width:"100%"}}
                    onPress={() => navigation.navigate('EditProfile', { userId })}
                />
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Lĩnh Vực</CustomText>
                        <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    <CustomText style={styles.description}>{user.sChuyenNganh || 'Chưa có thông tin'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Kinh Nghiệm Làm Việc</CustomText>
                        <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    <CustomText style={styles.description}>{user.sKinhNghiem || 'Chưa có kinh nghiệm'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Kĩ năng</CustomText>
                        <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    <SkillTags
                        skills={user.sKiNang || 'Không có kĩ năng nào'}
                        onEdit={() => { }}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Sở Thích</CustomText>
                        <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    <CustomText style={styles.description}>{user.sSoThich || 'Không có sở thích.'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Giới thiệu bản thân</CustomText>
                        <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    <CustomText style={styles.description}>{user.sMoTaChiTiet || 'Không có mô tả chi tiết nào.'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>CV</CustomText>
                        <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    <CustomText style={styles.description}>{user.sChuyenNganh || 'Không có CV nào được đăng tải'}</CustomText>
                </View>
            </ScrollView>
            {loading && <Loading />}
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,  // ✅ Đảm bảo View cha có flex: 1
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },
    profileCard: {
        backgroundColor: '#1E3A8A',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    email: {
        fontSize: 10,
        color: '#ddd',
    },
    location: {
        fontSize: 102,
        color: '#ddd',
    },
    editButton: {
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    editButtonText: {
        color: '#1E3A8A',
        fontWeight: 'bold',
    },
    section: {
        padding: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        color: "#012A74",
        fontSize: 16,
        fontWeight: "bold",
    },
    description: {
        fontSize: 14,
        color: '#333',
    },
});

export default Account;
