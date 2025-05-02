import React, { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ProfileCard from '../../components/ProfileCard';
import CustomText from '../../components/CustomText';
import { Image } from 'react-native-animatable';
import SkillTags from '../../components/SkillTags';
import HeaderWithIcons from '../../components/Header';
import { useLoading } from '../../../context/themeContext';
import Loading from '../../components/Loading';
import DialogInterview from '../../components/DialogInterview';
import Dialog from '../../components/Dialog';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import API_URL from '../../../config/apiConfig';

// const API_URL = 'http://192.168.102.24:3000/api/send-email';

const ApplicantionDetail = ({ route, navigation }: any) => {
    const { sMaUngVien, sMaTinTuyenDung } = route.params;
    const userInfo = useUser();
    const { loading, setLoading } = useLoading();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogInterviewVisible, setDialogInterviewVisible] = useState(false);
    const [dialogContent, setDialogContent] = useState({
        title: "",
        message: "",
        failure: false,
    });
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
        introduction: '',
        cvName: '',
        sNgayTao: '',
        fFileCV: ''
    });
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const userQuery = await firestore()
                .collection('tblUngVien')
                .where('sMaUngVien', '==', sMaUngVien)
                .get();

            if (!userQuery.empty) {
                const userData = userQuery.docs[0].data();

                const accountQuery = await firestore()
                    .collection('tblTaiKhoan')
                    .where('sMaTaiKhoan', '==', sMaUngVien)
                    .get();

                let userEmail = 'No Email';
                if (!accountQuery.empty) {
                    userEmail = accountQuery.docs[0].data().sEmailLienHe || 'No Email';
                }

                const applicationQuery = await firestore()
                    .collection('tblDonUngTuyen')
                    .where('sMaUngVien', '==', sMaUngVien)
                    .where('sMaTinTuyenDung', '==', route.params.sMaTinTuyenDung)
                    .get();

                let fFileCV = '';
                let introduction = '';
                let sNgayTao = null;
                if (!applicationQuery.empty) {
                    const applicationData = applicationQuery.docs[0].data();
                    fFileCV = applicationData.fFileCV || 'Không có CV nào được đăng tải';
                    introduction = applicationData.sGioiThieu || 'Không có lời giới thiệu.';
                    sNgayTao = applicationData.sNgayTao || null;
                }

                const cvName = fFileCV.split('/').pop() || 'Không có tên CV';
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
                    introduction,
                    fFileCV,
                    cvName,
                    sNgayTao,
                });
            } else {
                console.log('Không có ứng viên với ID:', sMaUngVien);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin ứng viên:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmInterview = async (data: { date: Date; message: string }) => {
        setLoading(true);
        var sTieuDe = '';
        var sTenDoanhNghiep = '';
        try {
            const companyQuery = await firestore()
                .collection('tblDoanhNghiep')
                .where('sMaDoanhNghiep', '==', userInfo?.userId)
                .get();

            if (!companyQuery.empty) {
                sTenDoanhNghiep = companyQuery.docs[0].data().sTenDoanhNghiep || 'Không có tên công ty';
            } else {
                sTenDoanhNghiep = 'Không tìm thấy công ty';
            }

            const existingScheduleQuery = await firestore()
                .collection('tblLichHenPhongVan')
                .where('sMaDoanhNghiep', '==', userInfo?.userId)
                .where('sMaUngVien', '==', sMaUngVien)
                .get();

            if (!existingScheduleQuery.empty) {
                const scheduleDocId = existingScheduleQuery.docs[0].id;
                await firestore().collection('tblLichHenPhongVan').doc(scheduleDocId).update({
                    sThoiGianPhongVan: data.date.toISOString(),
                    sLoiNhan: data.message,
                });
            } else {
                const scheduleSnapshot = await firestore().collection('tblLichHenPhongVan').get();
                const newScheduleId = `LH${(scheduleSnapshot.size + 1).toString().padStart(3, '0')}`;

                const jobSnapshot = await firestore()
                    .collection('tblTinTuyenDung')
                    .where('sMaTinTuyenDung', '==', sMaTinTuyenDung)
                    .get();

                if (jobSnapshot.empty) {
                    setDialogContent({
                        title: "Lỗi",
                        message: "Không tìm thấy thông tin tin tuyển dụng.",
                        failure: true,
                    });
                    setDialogVisible(true);
                    return;
                }

                const jobData = jobSnapshot.docs[0].data();
                sTieuDe = jobData.sViTriTuyenDung || "Không có tiêu đề";

                await firestore().collection('tblLichHenPhongVan').doc(newScheduleId).set({
                    sMaLichHenPhongVan: newScheduleId,
                    sMaDoanhNghiep: userInfo?.userId,
                    sMaUngVien: sMaUngVien,
                    sMaTinTuyenDung: sMaTinTuyenDung,
                    sDiaDiem: user.sDiaChi || "TP.HCM",
                    sThoiGianPhongVan: data.date.toISOString(),
                    sLoiNhan: data.message,
                    sTieuDe: sTieuDe,
                });

                setDialogContent({
                    title: "Thành công",
                    message: "Đã gửi lời mời phỏng vấn thành công và email đã được gửi.",
                    failure: false,
                });
                setDialogVisible(true);
            }

            const accountQuery = await firestore()
                .collection('tblTaiKhoan')
                .where('sMaTaiKhoan', '==', sMaUngVien)
                .get();

            if (accountQuery.empty) {
                setDialogContent({
                    title: "Lỗi",
                    message: "Không tìm thấy email của ứng viên.",
                    failure: true,
                });
                setDialogVisible(true);
                return;
            }

            const accountData = accountQuery.docs[0].data();
            const sEmailLienHe = accountData.sEmailLienHe || "Không có email";

            const emailPayload = {
                to: sEmailLienHe,
                subject: `Lịch hẹn phỏng vấn - ${sTieuDe}`,
                message: data.message,
                candidateName: user.sHoVaTen || "Ứng viên",
                scheduleTime: data.date.toISOString(),
                location: user.sDiaChi || "",
                companyName: sTenDoanhNghiep,
            };

            await axios.post(`${API_URL}/send-email`, emailPayload);

            setDialogContent({
                title: "Thành công",
                message: "Đã gửi lời mời phỏng vấn thành công và email đã được gửi.",
                failure: false,
            });
            setDialogVisible(true);
        } catch (error) {
            console.error("Lỗi khi lưu lịch hẹn phỏng vấn:", error);
            setDialogContent({
                title: "Lỗi",
                message: "Không thể lưu lịch hẹn phỏng vấn. Vui lòng thử lại.",
                failure: true,
            });
            setDialogVisible(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [sMaUngVien]);

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [sMaUngVien])
    );

    return (
        <View style={styles.container}>
            <HeaderWithIcons
                title='Thông tin ứng viên'
                onBackPress={() => { navigation.goBack() }}
            />
            <ScrollView style={styles.scrollContainer}>
                <ProfileCard
                    avatar={user.sAnhDaiDien}
                    name={user.sHoVaTen || 'Unknown User'}
                    email={user.sEmailLienHe || 'No Email'}
                    location={user.sDiaChi || 'No Address'}
                    buttonType="create-appointment"
                    onPress={() => setDialogInterviewVisible(true)}
                    style={{ width: "100%" }}
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
                        <CustomText style={styles.sectionTitle}>Lời giới thiệu</CustomText>
                        <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    <CustomText style={styles.description}>{user.introduction || 'Không có lời giới thiệu.'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Đơn ứng tuyển</CustomText>
                        <Image source={require('../../../../asset/images/img_edit.png')} />
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
                                <CustomText style={styles.cvDate}>{user.sNgayTao}</CustomText>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <CustomText style={styles.description}>Không có CV nào được đăng tải</CustomText>
                    )}
                </View>
            </ScrollView>
            <DialogInterview
                visible={dialogInterviewVisible}
                onClose={() => setDialogInterviewVisible(false)}
                onConfirm={handleConfirmInterview}
            />
            <Dialog
                visible={dialogVisible}
                title={dialogContent.title}
                content={dialogContent.message}
                failure={dialogContent.failure}
                dismiss={{
                    text: "Đóng",
                    onPress: () => setDialogVisible(false),
                }} />
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

export default ApplicantionDetail;
