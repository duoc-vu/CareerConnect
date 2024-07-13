import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar, Card, ActivityIndicator } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable'; // Import Animatable

const AppliedJobs = ({ navigation, route }: any) => {
    const { userId } = route.params;
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animationKey, setAnimationKey] = useState(0);

    const fetchAppliedJobs = async () => {
        try {
            setLoading(true);

            // Get applications for this user
            const appDocs = await firestore().collection('tblAppJob').where('userId', '==', userId).get();
            if (appDocs.empty) {
                setAppliedJobs([]);
                setLoading(false);
                return;
            }

            const jobList: any = [];
            const jobPromises = appDocs.docs.map(async (doc) => {
                const appData = doc.data();
                const idJob = appData.jobId;

                // Get job details from tblChiTietJob
                const jobDoc = await firestore().collection('tblChiTietJob').doc(idJob).get();
                if (!jobDoc.exists) return;

                const jobData: any = jobDoc.data();
                const tenJob = jobData.tenJob;
                const idCT = jobData.idCT;

                // Get company details from tblCompany
                const companyDoc = await firestore().collection('tblCompany').doc(idCT).get();
                if (!companyDoc.exists) return;

                const companyData: any = companyDoc.data();
                const tenCT = companyData.name;

                // Get company avatar from storage
                const avtUrl = await storage().ref(`images/${idCT}.jpg`).getDownloadURL();

                // Construct job item
                const jobItem = {
                    idJob,
                    idCT,
                    tenJob,
                    tenCT,
                    companyAvatar: avtUrl,
                };

                jobList.push(jobItem);
            });

            await Promise.all(jobPromises);
            setAppliedJobs(jobList);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách công việc đã ứng tuyển:', error);
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAppliedJobs();
            setAnimationKey(prevKey => prevKey + 1); // Reset animation
        }, [userId])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }

    if (appliedJobs.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Công việc đã ứng tuyển</Text>
                <Text style={styles.noJobsText}>Bạn chưa ứng tuyển công việc nào</Text>
            </View>
        );
    }

    const handleDetail = (item: any) => {
        navigation.navigate('AppDetails', {
            userId: userId,
            idCT: item.idCT,
            idJob: item.idJob,
            avt: item.companyAvatar,
        });
    };

    const renderJob = ({ item }: any) => (
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => handleDetail(item)}>
                <Card style={styles.card}>
                    <Card.Title
                        title={item.tenJob}
                        left={(props) => <Avatar.Image {...props} source={{ uri: item.companyAvatar }} />}
                    />
                    <Card.Content>
                        <Text>Bạn đã ứng tuyển vào công ty {item.tenCT}</Text>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        </Animatable.View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Công việc đã ứng tuyển</Text>
            <FlatList
                data={appliedJobs}
                renderItem={renderJob}
                keyExtractor={(item: any) => item.idJob.toString()}
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
    list: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
        elevation: 3,
    },
    itemContainer: {
        marginBottom: 10,
    },
    noJobsText: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default AppliedJobs;
