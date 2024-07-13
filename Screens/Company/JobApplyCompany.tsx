import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Avatar, ActivityIndicator, IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as Animatable from 'react-native-animatable';


const { width, height } = Dimensions.get('window');
const JobFiles = ({ navigation, route }: any) => {
    const { idCT, idJob } = route.params;
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);

                // Get job title (tenJob) from tblChiTietJob
                const jobDoc = await firestore().collection('tblChiTietJob').doc(idJob).get();
                const tenJob = jobDoc.exists ? jobDoc.data()?.tenJob : 'Tên công việc không tồn tại';

                // Get applications for this job
                const appDocs = await firestore().collection('tblAppJob').where('jobId', '==', idJob).get();
                const appList: any = [];
                await Promise.all(
                    appDocs.docs.map(async (doc) => {
                        const appData = doc.data();
                        const userId = appData.userId;

                        // Get user information from tblUserInfo
                        const userDoc = await firestore().collection('tblUserInfo').doc(userId).get();
                        const tenuser = userDoc.exists ? userDoc.data()?.name : 'Người dùng không tồn tại';

                        // Get avatar from storage
                        const avtRef = storage().ref(`images/${userId}.jpg`);
                        const avtUrl = await avtRef.getDownloadURL();

                        // Construct application item
                        const applicationItem = {
                            userId,
                            tenuser,
                            tenJob,
                            avt: avtUrl,
                        };

                        appList.push(applicationItem);
                    })
                );

                setApplications(appList);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách ứng viên:', error);
                setLoading(false);
            }
        };

        fetchApplications();
    }, [idCT, idJob]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }

    const handleViewApplication = (item: any) => {
        // Navigate to application details screen passing userId and other necessary data
        navigation.navigate('ApplicationDetails', {
            userId: item.userId,
            idCT: idCT,
            idJob: idJob,
            avt: item.avt,
        });
    };

    const renderApplication = ({ item }: any) => (
        <TouchableOpacity style={styles.notificationItem} onPress={() => handleViewApplication(item)}>
            <Avatar.Image size={50} source={{ uri: item.avt }} />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.notificationText}>
                    <Text style={{ fontWeight: 'bold' }}>{item.tenuser}</Text> đã ứng tuyển <Text style={{ fontWeight: 'bold' }}>{item.tenJob}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeIn" duration={1500} style={styles.headerContainer}>
                <IconButton
                    icon="arrow-left"
                    iconColor="#1E90FF"
                    size={30}
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left:0 , top: 20 }}
                />
                <Text style={styles.header}>Thông báo ứng tuyển</Text>
            </Animatable.View>
            <FlatList
                data={applications}
                renderItem={renderApplication}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F7',
    },
    headerContainer: {
        width: '100%',
        height: height * 0.115,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        marginRight: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E90FF',
        textAlign: 'center',
        flex: 1, // To allow header text to expand
        marginTop:30
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 25,
        elevation: 2,
        marginHorizontal:10
    },
    notificationText: {
        fontSize: 16,
    },
});

export default JobFiles;
