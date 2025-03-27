import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Button from '../../components/Button';
import Input from '../../components/Input';
import CustomText from '../../components/CustomText';
import HeaderWithIcons from '../../components/Header';
import { useUser } from '../../../context/UserContext';
import { useLoading } from '../../../context/themeContext';
import Loading from '../../components/Loading';
import Dialog from '../../components/Dialog';

const fbFeedback = firestore().collection('tblPhanHoi');

const FeedbackScreen = ({ navigation }:any) => {
    const { userInfo, userType } = useUser();
    const { loading, setLoading } = useLoading();
    
    const initialState = {
        sEmail: userInfo?.sEmailLienHe || '',
        sHoVaTen: userInfo?.sHoVaTen || '',
        sMaPhanHoi: '',
        sNoiDung: '',
        sTieuDe: '',
    };

    const [formData, setFormData] = useState(initialState);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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
                Alert.alert('Lỗi', 'Không thể tạo mã phản hồi, vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        generateFeedbackId();
    }, []);

    const handleChange = (key:any, value:any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.sTieuDe || !formData.sNoiDung) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            setLoading(true);
            await fbFeedback.add(formData);
            setShowSuccessDialog(true);
            sendFeedback(formData.sEmail);
        } catch (error) {
            console.error('Lỗi khi gửi phản hồi:', error);
            Alert.alert('Lỗi', 'Không thể gửi phản hồi, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const sendFeedback = async (email:any) => {
        if (!email) {
          Alert.alert("Lỗi", "Vui lòng nhập email và nội dung phản hồi.");
          return;
        }
    
        try {
          const templateParams = {
            to_email: email,
            message: `Cảm ơn bạn đã gửi phản hồi! Chúng tôi đã nhận được phản hồi của bạn. Chúng tôi sẽ xem xét xử lý và phản hồi lại bạn trong thời gian ngắn nhất.`,
          };
    
        //   await emailjs.send("service_5hx0gfs", "template_ua45s7t", templateParams, "rA95CaZxb-7tBUNex");
          
          Alert.alert("Thành công", "Phản hồi đã được gửi và email cảm ơn đã được gửi!");
        } catch (error) {
          console.error("Lỗi khi gửi phản hồi:", error);
          Alert.alert("Lỗi", "Không thể gửi phản hồi.");
        }
      };

    return (
        <View style={styles.mainContainer}>
            <HeaderWithIcons title="Gửi phản hồi" onBackPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.container}>
                <CustomText style={styles.label}>Họ về tên</CustomText>
                <Input placeholder="Nhập tên" value={formData.sHoVaTen} onChangeText={text => handleChange('sHoVaTen', text)} />

                <CustomText style={styles.label}>Email liên hệ</CustomText>
                <Input placeholder="Nhập email liên hệ" value={formData.sEmail} onChangeText={text => handleChange('sEmailLienHe', text)} />

                <CustomText style={styles.label}>Tiêu đề</CustomText>
                <Input placeholder="Nhập tiêu đề" value={formData.sTieuDe} onChangeText={text => handleChange('sTieuDe', text)} />

                <CustomText style={styles.label}>Nội dung</CustomText>
                <Input placeholder="Nhập nội dung phản hồi" multiline style={styles.largeInput} value={formData.sNoiDung} onChangeText={text => handleChange('sNoiDung', text)} />
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title="Gửi phản hồi" onPress={handleSubmit} disabled={loading} />
            </View>
            {loading && <Loading />}
            <Dialog
                visible={showSuccessDialog}
                title="Thành công"
                content="Phản hồi của bạn đã được gửi thành công. Chúng tôi sẽ xem xét và phản hồi sớm nhất."
                confirm={{
                    text: "Đóng",
                    onPress: () => {
                        setShowSuccessDialog(false);
                        navigation.goBack();
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
