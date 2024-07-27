import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { TextInput, Button, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Pdf from 'react-native-pdf';
import Markdown from 'react-native-markdown-display';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');
const ApplicationDetails = ({ route, navigation }: any) => {
    const { userId, idCT, idJob, avt ,cmt } = route.params;
    const [applicantInfo, setApplicantInfo] = useState<any>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState<string>('');
    const [sendingComment, setSendingComment] = useState<boolean>(false);

    useEffect(() => {
        const fetchApplicantInfo = async () => {
            console.log(cmt);
            try {
                setLoading(true);

                // Fetch applicant info from tblAppJob
                const appJobRef = firestore().collection('tblAppJob');
                const querySnapshot = await appJobRef.where('userId', '==', userId).where('jobId', '==', idJob).get();

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const appJobData = doc.data();

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
            <View style={styles.headerContainer}>
                <IconButton
                    icon="arrow-left"
                    iconColor="#1E90FF"
                    size={30}
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left: 0, top: 20 }}
                />
                <Text style={styles.header}>Chi tiết ứng tuyển</Text>
            </View>
            <Animatable.View animation="fadeInUp" duration={1500} style={styles.container}>
                <View style={styles.headeravt}>
                    <Avatar.Image size={80} source={{ uri: applicantInfo.avatar }} />
                    <Text style={styles.applicantName}>{applicantInfo.name}</Text>
                </View>
                <Card style={styles.card}>
                    <Card.Title title="Thư giới thiệu" />
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
                <TextInput
                    style={styles.textInput}
                    placeholder="Nhận xét"
                    value={cmt}
                    onChangeText={setComment}
                    editable={!sendingComment}
                    mode="outlined"
                    outlineColor="#1E90FF"
                    activeOutlineColor="#1E90FF"
                    theme={{ roundness: 8 }}
                />
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={handleCommentSubmit}
                    disabled={sendingComment}
                    labelStyle={{ color: 'white', fontWeight: 'bold' }}
                    contentStyle={{ height: 50 }}
                >
                    Gửi nhận xét
                </Button>
            </Animatable.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom:20
    },
    headerContainer: {
        width: '100%',
        height: height * 0.115,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    container: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E90FF',
        textAlign: 'center',
        flex: 1,
        marginTop: 30,
    },
    headeravt: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    applicantName: {
        marginVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    card: {
        width: '100%',
        marginBottom: 20,
        borderRadius: 8,
        elevation: 4,
    },
    pdfContainer: {
        width: '100%',
        height: Dimensions.get('window').height / 2,
        marginBottom: 20,
    },
    pdf: {
        flex: 1,
        borderRadius: 8,
    },
    textInput: {
        width: '100%',
        height: 50,
        marginBottom: 20,
        backgroundColor: 'white',
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#1E90FF',
        justifyContent: 'center',
        borderRadius: 8,
    },
});

export default ApplicationDetails;
