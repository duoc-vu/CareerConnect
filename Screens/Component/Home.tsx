import { onSnapshot, query } from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Card } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const fbInfo = firestore().collection('tblUserInfo');
const fbCT = firestore().collection('tblCompany');
const fbJob = firestore().collection('tblChiTietJob');

const Home = ({ navigation, route }: any) => {
    const [jobs, setJobs] = useState([]);
    const [user, setUser] = useState('');
    const [com, setCom] = useState('');

    const { userId ,userType} = route.params;

    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = fbJob.onSnapshot(querySnapshot => {
                const listJob: any = [];
                const promises: Promise<void>[] = [];

                querySnapshot.forEach(doc => {
                    const jobData = doc.data();
                    const promise = fbCT
                        .doc(jobData.idCT)
                        .get()
                        .then(companyDoc => {
                            const companyData = companyDoc.data();
                            listJob.push({
                                idJob: jobData.idJob,
                                jobName: jobData.tenJob,
                                companyName: companyData ? companyData.name : 'Unknown Company',
                                avt: jobData.avt,
                            });
                        })
                        .catch(error => {
                            console.error('Error getting company data: ', error);
                            listJob.push({
                                idJob: jobData.idJob,
                                jobName: jobData.tenJob,
                                companyName: 'Unknown Company',
                                avt: jobData.avt,
                            });
                        });

                    promises.push(promise);
                });

                Promise.all(promises).then(() => {
                    setJobs(listJob);
                });
            });

            return () => unsubscribe();
        }, [userId])
    );

    useEffect(() => {
        const getUser = async () => {
            try {
                const userDoc = await fbInfo.doc(userId).get();
                if (userDoc.exists) {
                    const userData: any = userDoc.data();
                    setUser(userData.name);
                } else {
                    const userComDoc = await fbCT.doc(userId).get();
                    if (userComDoc.exists) {
                        const userComData: any = userComDoc.data();
                        if (userComData) {
                            setCom(userComData.name);
                        } else {
                            console.log('Không có bản ghi nào với id', userId);
                        }
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            }
        };

        if (userId) {
            getUser();
        }
    }, [userId]);

    if (!route) {
        return (
            <View>
                <Text>Vui lòng đăng nhập</Text>
            </View>
        );
    } else {
        const renderItem = ({ item }: any) => (
            <Animatable.View animation="fadeInUp" duration={1500}>
                <TouchableOpacity onPress={() => navigation.navigate('JobDetail', { jobId: item.idJob ,userId, userType })}>
                    <Card style={styles.card}>
                        <Card.Title
                            title={item.jobName}
                            titleStyle={styles.jobName}
                            subtitle={item.companyName}
                            subtitleStyle={styles.companyName}
                            left={() =>
                                <View>
                                    <Image source={{ uri: item.avt }} style={styles.avatar} />
                                </View>}
                        />
                    </Card>
                </TouchableOpacity>
            </Animatable.View>
        );

        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>Xin chào {user ? user : com}</Text>
                <Animatable.View animation="bounceIn" duration={1500} style={styles.header}>
                    <Text style={styles.title}>Danh Sách Công Việc</Text>
                </Animatable.View>
                <FlatList
                    data={jobs}
                    renderItem={renderItem}
                    // keyExtractor={item => item.idJob}
                    contentContainerStyle={styles.list}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 18,
        marginVertical: 10,
        color: '#1E90FF',
    },
    header: {
        marginVertical: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E90FF',
    },
    list: {
        width: '90%',
    },
    card: {
        width: 385,
        marginVertical: 10,
        borderRadius: 15,
        elevation: 5,
        padding: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: -12
    },
    jobName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E90FF',
    },
    companyName: {
        fontSize: 16,
        color: '#888',
    },
});

export default Home;
