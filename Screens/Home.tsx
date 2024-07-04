import { onSnapshot, query } from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList, Touchable, TouchableOpacity, Alert } from 'react-native';
import { Text, Card } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const fbInfo = firestore().collection('tblUserInfo');
const fbCT = firestore().collection('tblCompany');
const fbJob = firestore().collection('tblChiTietJob');

const Home = ({ navigation,route }: any) => {
    const [jobs, setJobs] = useState([]);
    

    useEffect(() => {
        fbJob.onSnapshot(querySnapshot => {
            const listJob: any = [];
            const promises: Promise<void>[] = [];

            querySnapshot.forEach(doc => {
                const promise = fbCT
                    .where('id', '==', doc.data().idCT)
                    .limit(1)
                    .get()
                    .then(querySnapshot => {
                        if (!querySnapshot.empty) {
                            const companyData = querySnapshot.docs[0].data();
                            listJob.push({
                                idJob: doc.data().idJob,
                                idCT: doc.data().idCT,
                                jobName: doc.data().tenJob,
                                companyName: companyData.name,
                                avt: companyData.avt,
                            });
                        } else {
                            listJob.push({
                                idJob: doc.data().idJob,
                                idCT: doc.data().idCT,
                                jobName: doc.data().tenJob,
                                companyName: null,
                                avt: null,
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error getting documents: ', error);
                        listJob.push({
                            idJob: doc.data().idJob,
                            idCT: doc.data().idCT,
                            jobName: doc.data().tenJob,
                            companyName: null,
                            avt: null,
                        });
                    });

                promises.push(promise);
            });

            Promise.all(promises).then(() => {
                setJobs(listJob);
            });
        });
    }, []);

    if (!route) {
        return (
            <View>
                <Text>Vui lòng đăng nhập</Text>
            </View>
        )
    } else {
        const { userId } = route.params;
        const [user, setUser] = useState('');

        useEffect(() => {
            const getUser = async () => {
                try {
                    const userDoc = await fbInfo.doc(userId).get();
                    if (userDoc.exists) {
                        const userData: any = userDoc.data();
                        setUser(userData.name);
                    } else {
                        console.log('Không có bản ghi nào với id', userId);
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin người dùng:', error);
                }
            };

            getUser();
        }, [userId]);

        const renderItem = ({ item }: any) => (
            <Animatable.View animation="fadeInUp" duration={1500}>
                <TouchableOpacity onPress={() => navigation.navigate('JobDetail',{jobId: item.idJob})}>
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
                <Text style={styles.greeting}>Xin chào {user}</Text>
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
        )
    }
}

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
