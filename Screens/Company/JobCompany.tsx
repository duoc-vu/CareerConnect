import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions,  Alert } from 'react-native';
import { Text, Card, ActivityIndicator, Button,} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const fbJobDetail = firestore().collection('tblChiTietJob');

const JobCompany = ({ route, navigation }: any) => {
    const { userId } = route.params;
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const fetchJobs = async () => {
        try {
            setLoading(true);
            const jobDocs = await fbJobDetail.where('idCT', '==', userId).get();
            const jobList: any = await Promise.all(
                jobDocs.docs.map(async doc => {
                    const jobData = doc.data();
                    const idJob = doc.id;
                    const storageRef = storage().ref(`/${userId}/${idJob}`);
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
    const handleUpdate = (idJob : string) => {
        navigation.navigate('EditJob', {userId, idJob});
    }
    const handleDelete = (idJob: string) => {
        Alert.alert(
            "Xóa công việc",
            "Bạn có chắc chắn muốn xóa công việc này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            await fbJobDetail.doc(idJob).delete();
                            fetchJobs(); // Refresh the list after deletion
                        } catch (error) {
                            console.error('Lỗi khi xóa công việc:', error);
                            setError('Lỗi khi xóa công việc. Vui lòng thử lại');
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text>{error}</Text>
            </View>
        );
    }


    const renderJob = ({ item }: any) => (
        <Card style={styles.card} onPress={() => navigation.navigate('JobApplyCompany', { idCT: userId, idJob: item.id })}>
            <Card.Title title={item.tenJob} subtitle={item.tenCongTy} />
            <Card.Content>
                {/* <Text>{item.moTa}</Text> */}
                <Text style={styles.fileCount}>Số lượng người ứng tuyển: {item.fileCount}</Text>
                <View style={styles.buttonContainer}>
                    <Button mode="contained" buttonColor='#1E90FF' onPress={() => handleUpdate(item.id)} style={styles.button}>
                        Sửa
                    </Button>
                    {/* <Button mode="contained" buttonColor='#1E90FF'  onPress={() => handleDelete(item.id)} style={styles.button} color="red">
                        Xóa
                    </Button> */}
                </View>
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
        fontSize: 16,
        color: 'gray',
    },
    list: {
        paddingBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent : 'flex-end',
        marginTop : 10,
    },
    button: {
        width: '22%',
        marginLeft : 10,
        height : 40,
    },
});

export default JobCompany;