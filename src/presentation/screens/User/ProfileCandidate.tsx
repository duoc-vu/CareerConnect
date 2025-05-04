import React, { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ProfileCard from '../../components/ProfileCard';
import CustomText from '../../components/CustomText';
import { Image } from 'react-native-animatable';
import SkillTags from '../../components/SkillTags';
import { useUser } from '../../../context/UserContext';
import { useLoading } from '../../../context/themeContext';
import Loading from '../../components/Loading';
import HeaderWithIcons from '../../components/Header';

const ProfileCandidate = ({ navigation }: any) => {

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
        fFileCV: '',
    });

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const userQuery = await firestore()
                .collection('tblUngVien')
                .where('sMaUngVien', '==', userId)
                .get();

            if (!userQuery.empty) {
                const userData = userQuery.docs[0].data();

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
                    sSoThich: userData.sSoThich,
                    fFileCV: userData.fFileCV || '',
                });
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
                onBackPress={() => { navigation.goBack() }}
            />
            <ScrollView style={styles.scrollContainer}>
                <ProfileCard
                    avatar={user.sAnhDaiDien}
                    name={user.sHoVaTen || 'Unknown User'}
                    email={user.sEmailLienHe || 'No Email'}
                    location={user.sDiaChi || 'No Address'}
                    style={{ width: "100%" }}
                    onPress={() => navigation.navigate('edit-candidate-profile', { userId })}
                />
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Vị trí công việc</CustomText>
                    </View>
                    <CustomText style={styles.description}>{user.sChuyenNganh || 'Chưa có thông tin'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Kinh Nghiệm Làm Việc</CustomText>
                    </View>
                    <CustomText style={styles.description}>{user.sKinhNghiem ? `${user.sKinhNghiem} năm kinh nghiệm` : 'Chưa có kinh nghiệm'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Kĩ năng</CustomText>
                    </View>
                    <SkillTags
                        skills={user.sKiNang || 'Không có kĩ năng nào'}
                        onEdit={() => { }}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Sở Thích</CustomText>
                    </View>
                    <CustomText style={styles.description}>{user.sSoThich || 'Không có sở thích.'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Giới thiệu bản thân</CustomText>
                    </View>
                    <CustomText style={styles.description}>{user.sMoTaChiTiet || 'Không có mô tả chi tiết nào.'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>CV</CustomText>
                    </View>
                    {user.fFileCV.startsWith('http') ? (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('cv-preview', { cvUrl: user.fFileCV })
                            }
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
                        >
                            <Image
                                source={require('../../../../asset/images/img_CV.png')}
                                style={{ width: 24, height: 24, marginRight: 10 }}
                            />
                            <View>
                                <CustomText style={styles.cvName}>CV</CustomText>
                                <CustomText style={styles.cvDate}>Đã tải lên</CustomText>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <CustomText style={styles.description}>Không có CV nào được đăng tải</CustomText>
                    )}
                </View>
            </ScrollView>
            {loading && <Loading />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    // infoContainer: {
    //     flex: 1,
    //     marginLeft: 12,
    // },
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
    // editButton: {
    //     backgroundColor: '#fff',
    //     paddingVertical: 6,
    //     paddingHorizontal: 12,
    //     borderRadius: 6,
    // },
    editButtonText: {
        color: '#1E3A8A',
        fontWeight: 'bold',
    },
    section: {
        paddingVertical: 16,
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
    cvName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#012A74',
    },
    cvDate: {
        fontSize: 12,
        color: '#6B7280',
    },
});

export default ProfileCandidate;
