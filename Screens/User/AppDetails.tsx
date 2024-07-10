import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Text, Avatar, Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Pdf from 'react-native-pdf';
import Markdown from 'react-native-markdown-display';

const AppDetails = ({ route }: any) => {
    const { userId, idCT, idJob, avt } = route.params;
    const [applicantInfo, setApplicantInfo] = useState<any>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState<string>('');
    const [sendingComment, setSendingComment] = useState<boolean>(false);

    useEffect(() => {
        const fetchApplicantInfo = async () => {
            try {
                setLoading(true);

                // Fetch applicant info from tblAppJob
                const appJobRef = firestore().collection('tblAppJob');
                const querySnapshot = await appJobRef.where('userId', '==', userId).where('jobId', '==', idJob).get();
                
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const appJobData = doc.data();
                    setComment(appJobData.comment);
                    // Fetch user info from tblUserInfo
                    const userInfoRef = firestore().collection('tblUserInfo');
                    const userDoc = await userInfoRef.doc(userId).get();
                    const userData: any = userDoc.data();

                    // Fetch PDF file URL from storage
                    const storageRef = storage().ref(`/${idCT}/${idJob}/${userId}.pdf`);
                    const url = await storageRef.getDownloadURL();

                    setApplicantInfo({ avatar: avt, intro: appJobData.intro, name: userData?.name || 'Unknown' });
                    setPdfUrl(url);
                } else {
                    console.log('Không tìm thấy đơn ứng tuyển cho userId:', userId, 'và jobId:', idJob);
                }

                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết đơn ứng tuyển:', error);
                setLoading(false);
            }
        };

        fetchApplicantInfo();
    }, [userId, idCT, idJob]);

    const handleCommentSubmit = async () => {
        try {
            setSendingComment(true);
            const appJobRef = firestore().collection('tblAppJob');
            const querySnapshot = await appJobRef.where('userId', '==', userId).where('jobId', '==', idJob).get();

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                await doc.ref.update({ comment });
                Alert.alert('Nhận xét đã được gửi');
                setComment('');
            } else {
                console.log('Không tìm thấy đơn ứng tuyển để cập nhật');
            }
        } catch (error) {
            console.error('Lỗi khi gửi nhận xét:', error);
        } finally {
            setSendingComment(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E90FF" />
                <Text>Đang tải...</Text>
            </View>
        ); // Xử lý trạng thái loading
    }

    if (!applicantInfo || !pdfUrl) {
        return <Text>Lỗi khi lấy chi tiết đơn ứng tuyển</Text>; // Xử lý trạng thái lỗi
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Avatar.Image size={80} source={{ uri: applicantInfo.avatar }} />
                    <Text style={styles.applicantName}>{applicantInfo.name}</Text>
                </View>
                <Card style={styles.card}>
                    <Card.Title title="Giới thiệu đơn ứng tuyển" />
                    <Card.Content>
                        <Markdown
                            style={{
                                body: {
                                    fontSize: 16,
                                    lineHeight: 24,
                                    color: '#333',
                                },
                            }}
                        >
                            {applicantInfo.intro}
                        </Markdown>
                    </Card.Content>
                </Card>
                <View style={styles.pdfContainer}>
                    <Pdf
                        trustAllCerts={false}
                        source={{
                            uri: pdfUrl,
                            cache: true,
                        }}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`Number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`Current page: ${page}`);
                        }}
                        onError={error => {
                            console.log(error);
                        }}
                        onPressLink={uri => {
                            console.log(`Link pressed: ${uri}`);
                        }}
                        style={styles.pdf}
                    />
                </View>
                <Text style={styles.textInput}>{comment ? comment : "Nhà tuyển dụng chưa có nhận xét nào."} </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    applicantName: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    card: {
        width: '100%',
        marginBottom: 20,
    },
    pdfContainer: {
        width: '100%',
        height: Dimensions.get('window').height / 2, // Adjust height as needed
        marginBottom: 20,
    },
    pdf: {
        flex: 1,
    },
    textInput: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default AppDetails;
