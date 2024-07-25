import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity ,TextInput, StatusBar} from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this import is correctly set up

const fbInfo = firestore().collection('tblUserInfo');
const fbCT = firestore().collection('tblCompany');
const fbJob = firestore().collection('tblChiTietJob');

const Home = ({ navigation, route }: any) => {
    const [jobs, setJobs] = useState<any>([]);
    const [user, setUser] = useState('');
    const [com, setCom] = useState('');
    const [animationKey, setAnimationKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredJobs, setFilteredJobs] = useState([]);

    const { userId, userType } = route.params;

    const fetchJobs = async () => {
        try {
            const querySnapshot = await fbJob.get();
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
                setFilteredJobs(listJob); // Initialize filtered jobs
            });
        } catch (error) {
            console.error('Error fetching jobs: ', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchJobs();
            setAnimationKey(prevKey => prevKey + 1); // Reset animation
        }, [])
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
                            console.log('No record found with id', userId);
                        }
                    }
                }
            } catch (error) {
                console.error('Error getting user info: ', error);
            }
        };

        if (userId) {
            getUser();
        }
    }, [userId]);

    const handleSearch = () => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = jobs.filter((job:any) => {
            return (
                job.jobName.toLowerCase().includes(lowerCaseQuery) ||
                job.companyName.toLowerCase().includes(lowerCaseQuery)
            );
        });
        setFilteredJobs(filtered);
    };

    const renderItem = ({ item }: any) => (
        <Animatable.View key={`job-${item.id}-${animationKey}`} animation="fadeInUp" duration={1500}>
            <TouchableOpacity onPress={() => navigation.navigate('JobDetail', { jobId: item.idJob, userId, userType })}>
                <Card style={styles.card}>
                    <Card.Title
                        title={item.jobName}
                        titleStyle={styles.jobName}
                        subtitle={item.companyName}
                        subtitleStyle={styles.companyName}
                        left={() => <Image source={{ uri: item.avt }} style={styles.avatar} />}
                    />
                </Card>
            </TouchableOpacity>
        </Animatable.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#F0F4F7"}/>
            <Animatable.View animation="bounceIn" duration={1500} style={styles.header}>
                <Text style={styles.title}>Danh Sách Công Việc</Text>
            </Animatable.View>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder='Tìm kiếm...'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.inputSearch}
                    // right={<TextInput.Icon name="magnify" onPress={handleSearch} />}
                />
                <Button mode="contained" onPress={handleSearch} style={styles.searchButton}>
                    <Icon name='search' size={22}/>
                </Button>
            </View>
            
            <Animatable.View animation="fadeIn" duration={2000} style={styles.listContainer}>
                <FlatList
                    data={filteredJobs}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            </Animatable.View>
            {userType === '2' && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('PostJob', { userId })}
                >
                    <Icon name="add" size={30} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
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
    listContainer: {
        flex: 1,
        width: '100%',
    },
    list: {
        paddingHorizontal: 10,
    },
    card: {
        marginVertical: 10,
        borderRadius: 1,
        elevation: 3,
        overflow: 'visible',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
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
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        backgroundColor: '#1E90FF',
        borderRadius: 30,
        elevation: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    inputSearch: {
        flex: 1,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        height:50,
        paddingLeft:20
    },
    searchButton: {
        height: 50,
        justifyContent: 'center',
        borderRadius: 20,
        marginLeft: 10,
        backgroundColor:'#1E90FF'
        
    },
});

export default Home;
