import React, { useCallback, useEffect, useMemo, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ProfileCard from '../../components/ProfileCard';
import CustomText from '../../components/CustomText';
import { Image } from 'react-native-animatable';
import Loading from '../../components/Loading';
import HeaderWithIcons from '../../components/Header';
import JobCard from '../../components/JobCard';

const CompanyDetail = ({ navigation, route }: any) => {
    const [loading, setLoading] = useState(false);
    const { sMaDoanhNghiep } = route.params;
    const [employer, setEmployer] = useState({
        sAnhDaiDien: '',
        sTenDoanhNghiep: '',
        sEmailLienHe: '',
        sDiaChi: '',
        sLinhVuc: '',
        sSoLuongNhanVien: 0,
        sMoTaChiTiet: '',
    });
    const [jobList, setJobList] = useState<any[]>([]);

    const fetchEmployerData = async () => {
        setLoading(true);
        console.log("Employer ID gửi sang", sMaDoanhNghiep);

        try {
            const employerQuery = await firestore()
                .collection('tblDoanhNghiep')
                .where('sMaDoanhNghiep', '==', sMaDoanhNghiep)
                .get();

            if (!employerQuery.empty) {
                const employerData = employerQuery.docs[0].data();

                const accountQuery = await firestore()
                    .collection('tblTaiKhoan')
                    .where('sMaTaiKhoan', '==', sMaDoanhNghiep)
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
                console.log('Không có doanh nghiệp với ID:', sMaDoanhNghiep);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin doanh nghiệp:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupedRecommendedJobs = useMemo(() => {
        const chunkArray = (array: any[], size: number) => {
            const chunked = [];
            for (let i = 0; i < array.length; i += size) {
                chunked.push(array.slice(i, i + size));
            }
            return chunked;
        };
        return chunkArray(jobList || [], 2);
    }, [jobList]);

    const renderHorizontalItem = ({ item }: any) => (
        <View style={styles.horizontalGroup}>
            {item.map((job: any, index: number) => (
                <JobCard
                    key={index}
                    companyLogo={employer.sAnhDaiDien}
                    companyName={employer.sTenDoanhNghiep}
                    jobTitle={job.sViTriTuyenDung}
                    salaryMax={job.sMucLuongToiDa || 0}
                    jobType="On-site"
                    location={job.sDiaChiLamViec}
                    onPress={() => navigation.navigate('job-detail', { sMaTinTuyenDung: job.sMaTinTuyenDung })}
                    style={styles.jobCard}
                />
            ))}
        </View>
    );

    const fetchJobList = async () => {
        setLoading(true);
        try {
            const jobQuery = await firestore()
                .collection('tblTinTuyenDung')
                .where('sMaDoanhNghiep', '==', sMaDoanhNghiep)
                .get();

            if (!jobQuery.empty) {
                const jobs = jobQuery.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setJobList(jobs);
            } else {
                console.log('Không có tin tuyển dụng nào.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tin tuyển dụng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployerData();
        fetchJobList()
    }, [sMaDoanhNghiep]);

    useFocusEffect(
        useCallback(() => {
            fetchEmployerData();
        }, [sMaDoanhNghiep])
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
                title='Chi tiết doanh nghiệp'
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView style={styles.scrollContainer}>
                <ProfileCard
                    avatar={employer.sAnhDaiDien}
                    name={employer.sTenDoanhNghiep || 'Unknown employer'}
                    email={employer.sEmailLienHe || 'No Email'}
                    location={employer.sDiaChi || 'No Address'}
                    style={{ width: "100%" }}
                />
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Lĩnh Vực</CustomText>
                         
                            <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    <CustomText style={styles.description}>{employer.sLinhVuc || 'Chưa có thông tin'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Số lượng nhân viên</CustomText>
                         
                            <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    <CustomText style={styles.description}>{employer.sSoLuongNhanVien || 'Chưa có thông tin'}</CustomText>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Giới thiệu doanh nghiệp</CustomText>
                            <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    {renderDescriptionWithLineBreaks(employer.sMoTaChiTiet)}
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CustomText style={styles.sectionTitle}>Tin tuyển dụng</CustomText>
                         
                            <Image source={require('../../../../asset/images/img_edit.png')} />
                    </View>
                    {groupedRecommendedJobs.length > 0 ? (
                        <FlatList
                            data={groupedRecommendedJobs}
                            renderItem={renderHorizontalItem}
                            keyExtractor={(item, index) => `group-${index}`}
                            contentContainerStyle={styles.horizontalList}
                            decelerationRate={'normal'}
                        />
                    ) : (
                        <CustomText style={styles.noJobsText}>Không có tin tuyển dụng nào.</CustomText>
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
    },
    jobList: {
        paddingVertical: 1,
    },
    jobRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    horizontalList: {
    },
    horizontalGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    jobCard: {
    },
    noJobsText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#333',
        marginTop: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
});

export default CompanyDetail;