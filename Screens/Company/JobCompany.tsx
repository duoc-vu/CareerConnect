import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const { width } = Dimensions.get('window');

const fbJobDetail = firestore().collection('tblChiTietJob');

const JobCompany = ({ route, navigation }: any) => {
    const { userId } = route.params;
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const jobDocs = await fbJobDetail.where('idCT', '==', userId).get();
            const jobList: any = await Promise.all(
                jobDocs.docs.map(async doc => {
                    const jobData = doc.data();
                    const idJob = doc.id;
                    const storageRef = storage().ref(`${userId}/${idJob}`);
                    let fileCount = 0;
                    try {
                        const listResult = await storageRef.listAll();
                        fileCount = listResult.items.length;
                    } catch (err: any) {
                        if (err.code === 'storage/object-not-found') {
                            fileCount = 0;
                        } else {
                            throw err;
                        }
                    }
                    return { id: idJob, fileCount, ...jobData };
                })
            );
            setJobs(jobList);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách công việc:', error);
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchJobs();
        }, [userId])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }

    const renderJob = ({ item }: any) => (
        <Card style={styles.card} onPress={() => navigation.navigate('JobApplyCompany', { idCT: userId, idJob: item.id })}>
            <Card.Title title={item.tenJob} subtitle={item.tenCongTy} />
            <Card.Content>
                {/* <Text>{item.moTa}</Text> */}
                <Text style={styles.fileCount}>Số lượng người ứng tuyển: {item.fileCount}</Text>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Danh sách công việc đã đăng tuyển</Text>
            <FlatList
                data={jobs}
                renderItem={renderJob}
                // keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F7',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 10,
    },
    fileCount: {
        marginTop: 10,
        fontSize: 16,
        color: 'gray',
    },
    list: {
        paddingBottom: 20,
    },
});

export default JobCompany;
