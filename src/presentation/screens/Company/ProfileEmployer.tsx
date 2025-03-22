import React, { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ProfileCard from '../../components/ProfileCard';
import CustomText from '../../components/CustomText';
import { Image } from 'react-native-animatable';
import { useUser } from '../../../context/UserContext';
import Loading from '../../components/Loading';
import HeaderWithIcons from '../../components/Header';

const ProfileEmployer = ({ navigation }: any) => {
    const { userId } = useUser();
    const [loading, setLoading] = useState(false);
    const [employer, setEmployer] = useState({
        sAnhDaiDien: '',
        sTenDoanhNghiep: '',
        sEmailLienHe: '',
        sDiaChi: '',
        sLinhVuc: '',
        sSoLuongNhanVien: 0,
        sMoTaChiTiet: '',
    });

    const fetchEmployerData = async () => {
        setLoading(true);
        console.log("Employer ID gửi sang", userId);

        try {
            const employerQuery = await firestore()
                .collection('tblDoanhNghiep')
                .where('sMaDoanhNghiep', '==', userId)
                .get();

            if (!employerQuery.empty) {
                const employerData = employerQuery.docs[0].data();

                const accountQuery = await firestore()
                    .collection('tblTaiKhoan')
                    .where('sMaTaiKhoan', '==', userId)
                    .get();

                let employerEmail = 'No Email';
                if (!accountQuery.empty) {
                    employerEmail = accountQuery.docs[0].data().sEmailLienHe || 'No Email';
                }

                setEmployer({
                    sAnhDaiDien: employerData.sAnhDaiDien || '',
                    sTenDoanhNghiep: employerData.sTenDoanhNghiep || '',
                    sEmailLienHe: employerEmail,
                    sDiaChi: employerData.sDiaChi || '',
                    sLinhVuc: employerData.sLinhVuc || '',
                    sSoLuongNhanVien: employerData.sSoLuongNhanVien || 0,
                    sMoTaChiTiet: employerData.sMoTaChiTiet || '',
                });
            } else {
                console.log('Không có doanh nghiệp với ID:', userId);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin doanh nghiệp:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployerData();
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            fetchEmployerData();
        }, [userId])
    );

    const renderDescriptionWithLineBreaks = (text: any) => {
        if (!text) return <CustomText style={styles.description}>Không có mô tả chi tiết nào.</CustomText>;

        const normalizedText: any = text
            .replace(/\\n/g, '\n')
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n');

        const lines: any = normalizedText.split('\n').filter((line: any) => line.trim() !== '');

        if (lines.length === 0) {
            return <CustomText style={styles.description}>Không có mô tả chi tiết nào.</CustomText>;
        }

        return lines.map((line: any, index: any) => (
            <View key={index}>
                <CustomText style={styles.description}>
                    {line}
                </CustomText>
                {index < lines.length - 1 && <View style={styles.lineBreak} />}
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <HeaderWithIcons
                title='Hồ sơ tài khoản'
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.scrollContainer}>
                <ProfileCard
                    avatar={employer.sAnhDaiDien}
                    name={employer.sTenDoanhNghiep || 'Unknown employer'}
                    email={employer.sEmailLienHe || 'No Email'}
                    location={employer.sDiaChi || 'No Address'}
                    style={{ width: "100%" }}
                    onPress={() => navigation.navigate('EditemployerProfile', { userId })}
                />
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Lĩnh Vực</CustomText>
                        <TouchableOpacity onPress={() => navigation.navigate("edit-employer-profile")}>
                            <Image source={require('../../../../asset/images/img_edit.png')} />
                        </TouchableOpacity>
                    </View>
                    <CustomText style={styles.description}>{employer.sLinhVuc || 'Chưa có thông tin'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Số lượng nhân viên</CustomText>
                        <TouchableOpacity onPress={() => navigation.navigate("edit-employer-profile")}>
                            <Image source={require('../../../../asset/images/img_edit.png')} />
                        </TouchableOpacity>
                    </View>
                    <CustomText style={styles.description}>{employer.sSoLuongNhanVien || 'Chưa có thông tin'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Giới thiệu doanh nghiệp</CustomText>
                        <TouchableOpacity onPress={() => navigation.navigate("edit-employer-profile")}>
                            <Image source={require('../../../../asset/images/img_edit.png')} />
                        </TouchableOpacity>
                    </View>
                    {renderDescriptionWithLineBreaks(employer.sMoTaChiTiet)}
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Tin tuyển dụng</CustomText>
                        <TouchableOpacity onPress={() => navigation.navigate("edit-employer-profile")}>
                            <Image source={require('../../../../asset/images/img_edit.png')} />
                        </TouchableOpacity>
                    </View>
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
    section: {
        paddingVertical: 16,
        paddingHorizontal: 8,
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
    lineBreak: {
        height: 14,
    }
});

export default ProfileEmployer;