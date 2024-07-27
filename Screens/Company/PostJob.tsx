import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import moment from 'moment';

const { width } = Dimensions.get('window');

const fbJob = firestore().collection('tblChiTietJob');

const PostJob = ({ navigation, route }: any) => {
    const { userId } = route.params;
    const [tenJob, setTenJob] = useState('');
    const [diaDiem, setDiaDiem] = useState('');
    const [mucLuong, setMucLuong] = useState('');
    const [ycCV, setYcCV] = useState('');
    const [moTa, setMoTa] = useState('');
    const [quyenLoi, setQuyenLoi] = useState('');
    const [companyAvtUrl, setCompanyAvtUrl] = useState('');
    const [error, setError] = useState('');
    const [duration, setDuration] = useState(1); // Default to 1 month

    useEffect(() => {
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
    }, [userId]);

    const handlePostJob = async () => {
        if (!tenJob || !diaDiem || !mucLuong || !ycCV || !moTa || !quyenLoi) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const currentDate = moment();
            const endDate = moment().add(duration, 'months').toDate(); // Calculate end date based on selected duration

            const newJobRef = await fbJob.add({
                idCT: userId,
                tenJob: tenJob,
                diaDiem: diaDiem,
                mucLuong: mucLuong,
                ycCV: ycCV,
                moTa: moTa,
                quyenLoi: quyenLoi,
                avt: companyAvtUrl, // Include the avatar URL
                postingEndDate: endDate, // Save the end date
            });

            const newJobId = newJobRef.id;

            await newJobRef.update({
                idJob: newJobId
            });

            console.log('Đã tạo job mới với ID:', newJobId);
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Đăng tin tuyển dụng thành công!',
            });
            navigation.goBack(); // Điều hướng quay lại màn hình trước
        } catch (error) {
            console.error('Lỗi khi tạo job:', error);
            Toast.show({
                type: 'error',
                text1: 'Thất bại',
                text2: 'Đăng tin tuyển dụng thất bại!',
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Đăng Tin Tuyển Dụng</Text>
            {companyAvtUrl ? (
                <Image source={{ uri: companyAvtUrl }} style={styles.avatar} />
            ) : null}
            <TextInput
                label="Tên Công Việc"
                value={tenJob}
                onChangeText={setTenJob}
                style={styles.input}
                theme={{ colors: { primary: '#1E90FF' } }}
            />
            <TextInput
                label="Địa Điểm"
                value={diaDiem}
                onChangeText={setDiaDiem}
                style={styles.input}
                theme={{ colors: { primary: '#1E90FF' } }}
            />
            <TextInput
                label="Mức Lương"
                value={mucLuong}
                onChangeText={setMucLuong}
                style={styles.input}
                theme={{ colors: { primary: '#1E90FF' } }}
            />
            <TextInput
                label="Yêu Cầu Công Việc"
                value={ycCV}
                onChangeText={setYcCV}
                style={styles.input}
                theme={{ colors: { primary: '#1E90FF' } }}
            />
            <TextInput
                label="Mô Tả"
                value={moTa}
                onChangeText={setMoTa}
                style={styles.input}
                theme={{ colors: { primary: '#1E90FF' } }}
            />
            <TextInput
                label="Quyền Lợi"
                value={quyenLoi}
                onChangeText={setQuyenLoi}
                style={styles.input}
                theme={{ colors: { primary: '#1E90FF' } }}
            />
            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Thời Gian Ứng Tuyển</Text>
                <Picker
                    selectedValue={duration}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDuration(itemValue)}
                >
                    <Picker.Item label="1 Tháng" value={1} />
                    <Picker.Item label="2 Tháng" value={2} />
                </Picker>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button mode="contained" onPress={handlePostJob} style={styles.button}>
                Đăng Tin
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F7',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    input: {
        width: width * 0.9,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    pickerContainer: {
        width: width * 0.9,
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: 'white',
    },
    label: {
        fontSize: 16,
        color: '#888',
        marginBottom: 5,
    },
    button: {
        width: width * 0.9,
        marginVertical: 20,
        backgroundColor: '#1E90FF',
        borderRadius: 15,
        paddingVertical: 10,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 15,
    },
});

export default PostJob;
