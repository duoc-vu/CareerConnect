import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, ActivityIndicator, Avatar } from 'react-native-paper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const ApplyJob = ({ route, navigation }: any) => {
    const { jobId, userId, userType, idCompany } = route.params;
    const [intro, setIntro] = useState('');
    const [pdfUri, setPdfUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState<any>(null);
    const [tenJob, setTenJob] = useState<any>(null);

    const fileName = `/${idCompany}/${jobId}/${userId}.pdf`;

    const fbJobDetail = firestore().collection('tblChiTietJob');
    const fbCompany = firestore().collection('tblCompany');

    // Function to pick PDF from device's library
    const pickPdf = async () => {
        try {
            const pickerResult = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.pdf],
            });
            await setPdfUri(pickerResult.uri);
        } catch (e) {
            console.log(e);
        }
    };

    // Function to upload application with PDF and introduction
    const uploadFile = async () => {
        if (userType !== '1') {
            Alert.alert('Thông báo', 'Bạn không phải là ứng viên');
            return;
        }

        if (!pdfUri) {
            Alert.alert('Thông báo', 'Vui lòng chọn tệp PDF trước khi nộp đơn.');
            return;
        }

        try {
            setUploading(true); // Start uploading, show uploading indicator

            const storageRef = storage().ref(fileName);
            await storageRef.putFile(pdfUri); // Upload PDF file

            await firestore().collection('tblAppJob').add({
                jobId,
                userId,
                intro,
            }); // Save application information to Firestore

            setUploading(false); // Finish uploading, hide uploading indicator
            Alert.alert('Thông báo', 'Nộp đơn thành công');
            navigation.goBack();
        } catch (error) {
            console.error('Lỗi khi tải lên tệp:', error);
            setUploading(false); // Finish uploading with error, hide uploading indicator
            Alert.alert('Thông báo', 'Đã xảy ra lỗi khi nộp đơn. Vui lòng thử lại.');
        }
    };

    // Fetch company image based on jobId
    useEffect(() => {
        const getImageCompany = async () => {
            try {
                const jobDoc = await fbJobDetail.doc(jobId).get();
                if (jobDoc.exists) {
                    const jobData: any = jobDoc.data();
                    const companyDoc = await fbCompany.doc(jobData.idCT).get();
                    setTenJob(jobData.tenJob)
                    if (companyDoc.exists) {
                        const companyData: any = companyDoc.data();
                        const storageRef = storage().ref(`images/${companyData.id}.jpg`);
                        const downloadUrl: string = await storageRef.getDownloadURL();
                        setImage(downloadUrl);
                    } else {
                        console.log('Không có bản ghi công ty nào với id', jobData.idCT);
                    }
                } else {
                    console.log('Không có bản ghi nào với id', jobId);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin chi tiết công việc:', error);
            }
        };

        getImageCompany();
    }, [jobId]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                    <Avatar.Image size={80} source={{ uri: image}} />
                    <Text style={styles.headerTitle}>Ứng tuyển công việc</Text>
                    <Text style={styles.headerContent}>{tenJob}</Text>
                </View>
            

            <TouchableOpacity onPress={pickPdf}>
                <View style={styles.pdfContainer}>
                    <Text>{pdfUri ? "Đã chọn" : 'Chọn file PDF' }</Text>
                </View>
            </TouchableOpacity>
            <TextInput
                label="Giới thiệu"
                value={intro}
                onChangeText={setIntro}
                style={styles.input}
                multiline
                numberOfLines={4}
                theme={{ colors: { primary: '#1E90FF' } }}
            />
            <Button
                mode="contained"
                onPress={uploadFile}
                disabled={!pdfUri || uploading}
                style={[styles.button, { backgroundColor: !pdfUri || uploading ? '#BDBDBD' : '#1E90FF' }]} // Dynamic background color based on disabled state
            >
                {uploading ? 'Đang tải lên...' : 'Nộp đơn'}
            </Button>
            {uploading && <ActivityIndicator style={styles.loadingIndicator} />}
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
        marginBottom: 20,
        textAlign: 'center',
        // flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        color: '#1E90FF',
        fontWeight: 'bold',
    },
    headerContent:{
        fontSize: 20,
    },
    pdfContainer: {
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 20,
        backgroundColor: 'white',
    },
    button: {
        marginVertical: 20,
        backgroundColor: '#1E90FF',
        borderRadius: 15,
        paddingVertical: 10,
    },
    
    loadingIndicator: {
        marginTop: 20,
    },
    
});

export default ApplyJob;
