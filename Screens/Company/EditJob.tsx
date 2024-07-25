// import { use } from "marked";
import React, { useEffect, useState } from "react";
import { Alert, Animated, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import JobDetail from "../Component/JobDetail";
import { ActivityIndicator, Button, IconButton, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";


const EditJob = ({ route, navigation }: any) => {

    const fbJobDetail = firestore().collection('tblChiTietJob');

    const { userId, idJob } = route.params;
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [wage, setWage] = useState('');
    const [RequestJob, setRequestJob] = useState('');
    const [jobDetail, setJobDetall] = useState('');
    const [benifits, setBenifits] = useState('');
    const [save, setSave] = useState(false);
    const [loading, setLoading] = useState(true);
    const [companyAvtUrl, setCompanyAvtUrl] = useState('');
    const [error, setError] = useState('');


    const [initialValues, setInitialValues] = useState({
        name: '',
        address: '',
        RequestJob: '',
        wage: '',
        jobDetail: '',
        benifits: '',
        companyAvtUrl: ''
    });
    const [formValues, setFormValues] = useState({ ...initialValues });

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const jobDoc = await fbJobDetail.doc(idJob).get();
                if (jobDoc.exists) {
                    const jobData: any = jobDoc.data();
                    setFormValues({
                        name: jobData.tenJob || '',
                        address: jobData.diaDiem || '',
                        wage: jobData.mucLuong || '',
                        RequestJob: jobData.ycCV || '',
                        jobDetail: jobData.moTa || '',
                        benifits: jobData.quyenLoi || '',
                        companyAvtUrl: jobData.avt || '',
                    });
                } else {
                    setError('Không tìm thấy thông tin công việc.');
                }
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết công việc:', error);
                setError('Lỗi khi lấy chi tiết công việc. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };
        fetchJobDetails();
        const fetchCompanyAvatar = async () => {
            try {
                const avatarUrl = await storage().ref(`images/${userId}.jpg`).getDownloadURL();
                setCompanyAvtUrl(avatarUrl);
            } catch (error) {
                console.error('Lỗi khi lấy ảnh đại diện:', error);
                setError('Không thể tải ảnh đại diện của công ty.');
            }
        };
        fetchCompanyAvatar();
    }, [userId, idJob])

    const handleSave = async () => {
        setSave(true);
        try {
            await fbJobDetail.doc(idJob).update({
                tenJob: formValues.name,
                diaDiem: formValues.address,
                mucLuong: formValues.wage,
                ycCV: formValues.RequestJob,
                moTa: formValues.jobDetail,
                quyenLoi: formValues.benifits,
                avt: formValues.companyAvtUrl,
            })
            setSave(false);
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Sửa tin tuyển dụng thành công!',
            });
        } catch {
            console.error('Lỗi khi cập nhật công việc:', error);
            Toast.show({
                type: 'error',
                text1: 'Thất bại',
                text2: 'Sửa tin tuyển dụng thất bại!',
            });
            setSave(false);
            navigation.goBack();
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormValues({ ...formValues, [field]: value });
    };
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ flexDirection: 'column' }}>
                <IconButton
                    icon="arrow-left"
                    iconColor="#1E90FF"
                    size={30}
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left: 0, top: 0, marginRight: 30 }}
                />
                <Text style={styles.header}> Sửa Thông Tin Công Việc </Text>
            </View>

            <View style={styles.content}>
                {companyAvtUrl ? (
                    <Image source={{ uri: companyAvtUrl }} style={styles.avatar} />
                ) : null}
                <TextInput
                    label="Tên công việc"
                    value={formValues.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    style={styles.input}
                    theme={{ colors: { primary: '#1E90FF' } }}
                    mode="outlined"
                />

                <TextInput
                    label="Địa điểm"
                    value={formValues.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                    style={styles.input}
                    theme={{ colors: { primary: '#1E90FF' } }}
                    mode="outlined"
                />

                <TextInput
                    label="Yêu cầu công việc"
                    value={formValues.RequestJob}
                    onChangeText={(text) => handleInputChange('RequestJob', text)}
                    style={styles.input}
                    theme={{ colors: { primary: '#1E90FF' } }}
                    mode="outlined"
                />

                <TextInput
                    label="Mô tả công việc"
                    value={formValues.jobDetail}
                    onChangeText={(text) => handleInputChange('jobDetail', text)}
                    style={styles.input}
                    theme={{ colors: { primary: '#1E90FF' } }}
                    mode="outlined"
                />

                <TextInput
                    label="Quyền lợi được hưởng"
                    value={formValues.benifits}
                    onChangeText={(text) => handleInputChange('benifits', text)}
                    style={styles.input}
                    theme={{ colors: { primary: '#1E90FF' } }}
                    mode="outlined"
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.button}
                    loading={save}
                    disabled={save}
                >
                    {save ? 'Đang lưu...' : 'Lưu'}
                </Button>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F0F4F7',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginTop: 12,
        marginBottom: 20,
        textAlign: 'center',
    },
    content:{
        flexGrow: 1,
        paddingTop:0,
        padding: 20,
        backgroundColor: '#F0F4F7',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#1E90FF'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
})

export default EditJob;