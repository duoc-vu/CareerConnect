import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const { width, height } = Dimensions.get('window');

const fbJobDetail = firestore().collection('tblChiTietJob');
const fbCompany = firestore().collection('tblCompany');

const JobDetail = ({ route, navigation }: any) => {
    const [jobDetail, setJobDetail] = useState<any>(null);
    const [companyDetail, setCompanyDetail] = useState<any>(null);
    const { jobId, userId, userType } = route.params;
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const getJobDetail = async () => {
            try {
                const jobDoc = await fbJobDetail.doc(jobId).get();
                if (jobDoc.exists) {
                    const jobData: any = jobDoc.data();
                    setJobDetail(jobData);

                    const companyDoc = await fbCompany.doc(jobData.idCT).get();
                    if (companyDoc.exists) {
                        const companyData: any = companyDoc.data();
                        setCompanyDetail(companyData);
                        const storageRef = storage().ref(`images/${companyData.id}.jpg`);
                        const downloadUrl: string = await storageRef.getDownloadURL();
                        setImage(downloadUrl);
                    } else {
                        console.log('Không có bản ghi công ty nào với id', jobData.idCT);
                    }
                } else {
                    console.log('Không có bản ghi nào với id', jobId);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin chi tiết công việc:', error);
            }
        };

        getJobDetail();
    }, [jobId]);

    if (!jobDetail || !companyDetail) {
        return (
            <View style={styles.container}>
                <Text>Đang tải...</Text>
            </View>
        );
    }

    const renderTextWithNewLines = (text: string | undefined) => {
        if (!text) return null; // Handle case when text is undefined or empty
        return text.split('/n').map((line, index) => (
            <Text key={index} style={styles.text}>
                {line.trim()}
            </Text>
        ));
    };

    const handleApply = () => {
        if (userType === '1') {
            navigation.navigate('ApplyJob', { jobId, userType, userId });
        } else if (userType === '2') {
            Alert.alert('Thông báo', 'Bạn không phải là 1 ứng viên.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Animatable.View animation="fadeInUp" duration={1500} style={styles.header}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.companyImage} />
                ) : (
                    <Image source={require('../asset/default.png')} style={styles.companyImage} />
                )}
                <Text style={styles.jobName}>{jobDetail.tenJob}</Text>
                <Text style={styles.companyName}>{companyDetail.name}</Text>
            </Animatable.View>
            <Animatable.View animation="fadeInUp" duration={1500} style={styles.content}>
                <View style={styles.infoSection}>
                    <Text style={styles.title}>Địa điểm</Text>
                    <Text style={styles.text}>{jobDetail.diaDiem}</Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.title}>Yêu cầu công việc</Text>
                    {renderTextWithNewLines(jobDetail.ycCV)}
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.title}>Mô tả</Text>
                    {renderTextWithNewLines(jobDetail.moTa)}
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.title}>Quyền lợi</Text>
                    {renderTextWithNewLines(jobDetail.quyenLoi)}
                </View>
                <Button
                    mode="contained"
                    onPress={handleApply}
                    style={styles.applyButton}
                    labelStyle={styles.applyButtonText}
                >
                    Ứng tuyển
                </Button>
            </Animatable.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F7',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 20,
    },
    companyImage: {
        width: width * 0.4,
        height: height * 0.2,
        borderRadius: 15,
        marginBottom: 10,
    },
    jobName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 5,
        textAlign: 'center',
    },
    companyName: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
    },
    content: {
        paddingHorizontal: 20,
    },
    infoSection: {
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
        color: '#888',
        lineHeight: 22,
    },
    applyButton: {
        marginVertical: 20,
        backgroundColor: '#1E90FF',
        borderRadius: 15,
        paddingVertical: 10,
    },
    applyButtonText: {
        fontSize: 18,
        color: '#fff',
    },
});

export default JobDetail;
