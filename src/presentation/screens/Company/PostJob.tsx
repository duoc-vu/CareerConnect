import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Button from '../../components/Button';
import Input from '../../components/Input';
import CustomText from '../../components/CustomText';
import DatePicker from '../../components/DatePicker';
import { useUser } from '../../../context/UserContext';
import Dialog from '../../components/Dialog';

const fbJob = firestore().collection('tblTinTuyenDung');

const PostJob = ({ navigation }: any) => {
    const { userId, userInfo } = useUser()

    const initialState = {
        sMaTinTuyenDung: '',
        sDiaChiLamViec: '',
        sLinhVucTuyenDung: '',
        sViTriTuyenDung: '',
        sMoTaCongViec: '',
        sMucLuongToiThieu: '',
        sMucLuongToiDa: '',
        sSoLuongTuyenDung: '',
        sSoNamKinhNghiem: '',
        sThoiGianDangBai: new Date(),
        sThoiHanTuyenDung: new Date(),
        sTrangThai: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogContent, setDialogContent] = useState({
        title: '',
        content: '',
        confirm: null as null | { text: string; onPress: () => void },
        dismiss: null as null | { text: string; onPress: () => void },
        failure: false,
    });

    useEffect(() => {
        if (userInfo?.sTrangThai === false) {
            setDialogVisible(true);
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo?.sTrangThai === false) {
            setDialogContent({
                title: 'Tài khoản bị khóa',
                content: 'Tài khoản của bạn đang bị khóa. Bạn có muốn cập nhật lại thông tin không?',
                confirm: {
                    text: 'Cập nhật',
                    onPress: () => {
                        setDialogVisible(false);
                        navigation.replace('edit-employer-profile');
                    },
                },
                dismiss: {
                    text: 'Đóng',
                    onPress: () => {
                        setDialogVisible(false);
                        navigation.goBack();
                    },
                },
                failure: true,
            });
            setDialogVisible(true);
        }
    }, [userInfo]);

    useEffect(() => {
        const generateJobCode = async () => {
            const count = (await fbJob.get()).size + 1;
            setFormData(prev => ({ ...prev, sMaTinTuyenDung: `TTD${count}` }));
        };
        generateJobCode();
    }, [userId]);

    const handleChange = (key: string, value: string | Date) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const isNumber = (value: string) => /^\d+$/.test(value);


    const handlePostJob = async () => {
        try {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const ngayDang = new Date(formData.sThoiGianDangBai);
            const hanTuyen = new Date(formData.sThoiHanTuyenDung);


            if (isNaN(ngayDang.getTime()) || isNaN(hanTuyen.getTime())) {
                setError("Ngày đăng hoặc hạn tuyển không hợp lệ!");
                return;
            }

            if (ngayDang < currentDate) {
                setError("Ngày đăng bài phải lớn hơn hoặc bằng ngày hiện tại!");
                return;
            }

            if (hanTuyen <= ngayDang) {
                setError("Hạn tuyển phải lớn hơn ngày đăng bài!");
                return;
            }

            const minSalaryRaw = formData.sMucLuongToiThieu.replace(/\./g, "").trim();
            const maxSalaryRaw = formData.sMucLuongToiDa.replace(/\./g, "").trim();

            if (!isNumber(minSalaryRaw) || !isNumber(maxSalaryRaw)) {
                setError("Mức lương phải là số hợp lệ!");
                return;
            }

            if (!isNumber(formData.sSoLuongTuyenDung) || !isNumber(formData.sSoNamKinhNghiem)) {
                setError("Số lượng tuyển và số năm kinh nghiệm phải là số hợp lệ!");
                return;
            }

            await fbJob.add({
                ...formData,
                sMaDoanhNghiep: userId,
                sThoiGianDangBai: formData.sThoiGianDangBai.toISOString().split("T")[0],
                sThoiHanTuyenDung: formData.sThoiHanTuyenDung.toISOString().split("T")[0],
                sCoKhoa: 1
            });

            resetForm();
            navigation.goBack();
            setDialogContent({
                title: 'Thành công',
                content: 'Tin tuyển dụng đã được đăng thành công!',
                confirm: {
                    text: 'Đóng',
                    onPress: () => {
                        setDialogVisible(false);
                        navigation.goBack();
                    },
                },
                dismiss: null,
                failure: false,
            });
            setDialogVisible(true);
        } catch (error: any) {
            console.error('Lỗi khi đăng tin tuyển dụng:', error);
            setDialogContent({
                title: 'Lỗi',
                content: 'Đã xảy ra lỗi khi đăng tin tuyển dụng. Vui lòng thử lại.',
                confirm: {
                    text: 'Đóng',
                    onPress: () => setDialogVisible(false),
                },
                dismiss: null,
                failure: true,
            });
            setDialogVisible(true);
        }
    };

    const resetForm = () => {
        setFormData(initialState);
        setError('');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomText style={styles.title}>Đăng tin tuyển dụng</CustomText>

            <CustomText style={styles.label}>Vị trí tuyển dụng</CustomText>
            <Input placeholder="" value={formData.sViTriTuyenDung} onChangeText={text => handleChange('sViTriTuyenDung', text)} style={styles.input} />

            <CustomText style={styles.label}>Lĩnh vực tuyển dụng</CustomText>
            <Input placeholder="" value={formData.sLinhVucTuyenDung} onChangeText={text => handleChange('sLinhVucTuyenDung', text)} style={styles.input} />

            <CustomText style={styles.label}>Địa điểm</CustomText>
            <Input placeholder="" value={formData.sDiaChiLamViec} onChangeText={text => handleChange('sDiaChiLamViec', text)} style={styles.input} />

            <CustomText style={styles.label}>Mức lương tối thiểu</CustomText>
            <Input placeholder="" value={formData.sMucLuongToiThieu} onChangeText={text => handleChange('sMucLuongToiThieu', text)} style={styles.input} />

            <CustomText style={styles.label}>Mức lương tối đa</CustomText>
            <Input placeholder="" value={formData.sMucLuongToiDa} onChangeText={text => handleChange('sMucLuongToiDa', text)} style={styles.input} />

            <CustomText style={styles.label}>Số lượng tuyển</CustomText>
            <Input placeholder="" value={formData.sSoLuongTuyenDung} onChangeText={text => handleChange('sSoLuongTuyenDung', text)} style={styles.input} />

            <CustomText style={styles.label}>Kinh nghiệm (Số năm)</CustomText>
            <Input placeholder="" value={formData.sSoNamKinhNghiem} onChangeText={text => handleChange('sSoNamKinhNghiem', text)} style={styles.input} />

            <CustomText style={styles.label}>Ngày bắt đầu tuyển</CustomText>
            <DatePicker label="" date={formData.sThoiGianDangBai} setDate={(date: any) => handleChange('sThoiGianDangBai', date)} />

            <CustomText style={styles.label}>Hạn tuyển</CustomText>
            <DatePicker label="" date={formData.sThoiHanTuyenDung} setDate={(date: any) => handleChange('sThoiHanTuyenDung', date)} />

            <CustomText style={styles.label}>Mô tả công việc</CustomText>
            <Input placeholder="" multiline value={formData.sMoTaCongViec} onChangeText={text => handleChange('sMoTaCongViec', text)} style={styles.largeInput} />

            {error ? <CustomText style={styles.error}>{error}</CustomText> : null}

            <Button title="Post Job" onPress={handlePostJob} style={styles.button} />
            <Dialog
                visible={dialogVisible}
                title={dialogContent.title}
                content={dialogContent.content}
                confirm={dialogContent.confirm}
                dismiss={dialogContent.dismiss}
                failure={dialogContent.failure}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    input: { marginBottom: 10, borderColor: "#BEBEBE", backgroundColor: "#EDEDED" },
    largeInput: { height: 100, textAlignVertical: 'top', marginBottom: 10, borderColor: "#BEBEBE", backgroundColor: "#EDEDED" },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
    error: { color: 'red', textAlign: 'center', marginVertical: 5 },
    button: {}
});

export default PostJob;
