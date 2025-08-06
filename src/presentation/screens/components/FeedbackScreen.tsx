import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Button from '../../components/Button';
import Input from '../../components/Input';
import CustomText from '../../components/CustomText';
import HeaderWithIcons from '../../components/Header';
import { useUser } from '../../../context/UserContext';
import { useLoading } from '../../../context/themeContext';
import Loading from '../../components/Loading';
import Dialog from '../../components/Dialog';
import axios from 'axios';
import API_URL from '../../../config/apiConfig';

const fbFeedback = firestore().collection('tblPhanHoi');
// const API_URL = 'http://192.168.102.24:3000/api/send-simple-email';

const FeedbackScreen = ({ navigation }: any) => {
    const { userInfo, userEmail} = useUser();
    const { loading, setLoading } = useLoading();
    const [dialogContent, setDialogContent] = useState({
        title: '',
        content: '',
        visible: false,
    });

    const initialState = {
        sEmailLienHe: userEmail || '',
        sHoVaTen: userInfo?.sHoVaTen || '',
        sMaPhanHoi: '',
        sNoiDung: '',
        sTieuDe: '',
    };

    const [formData, setFormData] = useState(initialState);
    useEffect(() => {
        const generateFeedbackId = async () => {
            try {
                setLoading(true);
                const snapshot = await fbFeedback.get();
                const count = snapshot.size + 1;
                const newId = `PH${String(count).padStart(3, '0')}`;
                setFormData(prev => ({ ...prev, sMaPhanHoi: newId }));
            } catch (error) {
                console.error('Lỗi khi tạo mã phản hồi:', error);
            } finally {
                setLoading(false);
            }
        };

        generateFeedbackId();
    }, []);

    const handleChange = (key: any, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.sTieuDe || !formData.sNoiDung) {
            setDialogContent({
                title: 'Lỗi',
                content: 'Vui lòng điền đầy đủ thông tin trước khi gửi phản hồi.',
                visible: true,
            });
            return;
        }

        try {
            setLoading(true);
            await fbFeedback.add(formData);
            sendFeedback(formData.sEmailLienHe, formData.sTieuDe);
            setDialogContent({
                title: 'Thành công',
                content: 'Phản hồi của bạn đã được gửi thành công. Chúng tôi sẽ xem xét và phản hồi sớm nhất.',
                visible: true,
            });
        } catch (error) {
            console.error('Lỗi khi gửi phản hồi:', error);
            setDialogContent({
                title: 'Lỗi',
                content: 'Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại sau.',
                visible: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const sendFeedback = async (email: string, feedbackContent: string) => {
        if (!email) {
            return;
        }

        try {
            const templateParams = {
                to: email,
                subject: "[CAREER CONNECT] Cảm ơn bạn đã góp ý để phát triển hệ thống",
                message: feedbackContent,
            };
            await axios.post(`${API_URL}/send-simple-email`, templateParams);

        } catch (error) {
            console.error("Lỗi khi gửi phản hồi:", error);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <HeaderWithIcons title="Gửi phản hồi" onBackPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.container}>
                <CustomText style={styles.label}>Họ về tên</CustomText>
                <Input placeholder="Nhập tên" style={styles.input} value={formData.sHoVaTen} onChangeText={text => handleChange('sHoVaTen', text)} editable={true}/>

                <CustomText style={styles.label}>Email liên hệ</CustomText>
                <Input placeholder="Nhập email liên hệ" style={styles.input} value={formData.sEmailLienHe} onChangeText={text => handleChange('sEmailLienHe', text)} editable={true}              />

                <CustomText style={styles.label}>Tiêu đề</CustomText>
                <Input placeholder="Nhập tiêu đề" value={formData.sTieuDe} style={styles.input} onChangeText={text => handleChange('sTieuDe', text)} />

                <CustomText style={styles.label}>Nội dung</CustomText>
                <Input placeholder="Nhập nội dung phản hồi" multiline style={styles.largeInput} value={formData.sNoiDung} onChangeText={text => handleChange('sNoiDung', text)} />
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title="Gửi phản hồi" onPress={handleSubmit} disabled={loading} />
            </View>
            {loading && <Loading />}
            <Dialog
                visible={dialogContent.visible}
                title={dialogContent.title}
                content={dialogContent.content}
                confirm={{
                    text: "Đóng",
                    onPress: () => {
                        setDialogContent(prev => ({ ...prev, visible: false }));
                        if (dialogContent.title === 'Thành công') {
                            navigation.goBack(); 
                        }
                    },
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingBottom: 100,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
        marginBottom: 10,
    },
    input:{
        borderColor: '#BEBEBE',
        backgroundColor: '#EDEDED',
    },
    largeInput: {
        height: 100,
        textAlignVertical: 'top',
        borderColor: '#BEBEBE',
        backgroundColor: '#EDEDED',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#fff',
    },
});

export default FeedbackScreen;
