import React, { useState, useEffect } from 'react'; 
import {  StyleSheet, Dimensions, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import Button from '../../components/Button';
import Input from '../../components/Input';
import CustomText from '../../components/CustomText';
import DatePicker from '../../components/DatePicker';

const { width } = Dimensions.get('window');

const fbJob = firestore().collection('tblTinTuyenDung');

const PostJob = ({ navigation, route }: any) => {
    const params = route?.params ?? {};
    const userId = params.userId ?? null;
    const userType = params.userType ?? 0;
    const [sMaTinTuyenDung, setSMaTinTuyenDung] = useState('');
    const [sMaDoanhNghiep, setSMaDoanhNghiep] = useState('');
    const [sDiaChiLamViec, setSDiaChiLamViec] = useState('');
    const [sLinhVucTuyenDung, setSLinhVucTuyenDung] = useState('');
    const [sViTriTuyenDung, setSViTriTuyenDung] = useState('');
    const [sMoTaCongViec, setSMoTaCongViec] = useState('');
    const [sMucLuongToiThieu, setSMucLuongToiThieu] = useState('');
    const [sMucLuongToiDa, setSMucLuongToiDa] = useState('');
    const [sSoLuongTuyenDung, setSSoLuongTuyenDung] = useState('');
    const [sSoNamKinhNghiem, setSSoNamKinhNghiem] = useState('');
    const [sThoiGianDangBai, setSThoiGianDangBai] = useState(new Date());
    const [sThoiHanTuyenDung, setSThoiHanTuyenDung] = useState(new Date());
    const [sTrangThai, setSTrangThai] = useState('');
    const [error, setError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const generateJobCode = async () => {
            const count = (await fbJob.get()).size + 1;
            setSMaTinTuyenDung(`TTD${count}`);
        };
        generateJobCode();
    }, [userId]);

    useEffect(() => {
        const checkFormValidity = () => {
            if (
                sMaDoanhNghiep && sDiaChiLamViec && sLinhVucTuyenDung && sViTriTuyenDung &&
                sMoTaCongViec && sMucLuongToiThieu && sMucLuongToiDa && sSoLuongTuyenDung &&
                sSoNamKinhNghiem && sThoiGianDangBai && sThoiHanTuyenDung && sTrangThai
            ) {
                setIsFormValid(true);
            } else {
                setIsFormValid(false);
            }
        };
        checkFormValidity();
    }, [
        sMaDoanhNghiep, sDiaChiLamViec, sLinhVucTuyenDung, sViTriTuyenDung,
        sMoTaCongViec, sMucLuongToiThieu, sMucLuongToiDa, sSoLuongTuyenDung,
        sSoNamKinhNghiem, sThoiGianDangBai, sThoiHanTuyenDung, sTrangThai
    ]);

    const handlePostJob = async () => {
        try {
            await fbJob.add({
                sMaTinTuyenDung,
                sMaDoanhNghiep : 1,
                sDiaChiLamViec,
                sLinhVucTuyenDung,
                sViTriTuyenDung,
                sMoTaCongViec,
                sMucLuongToiThieu,
                sMucLuongToiDa,
                sSoLuongTuyenDung,
                sSoNamKinhNghiem,
                sThoiGianDangBai,
                sThoiHanTuyenDung,
                sTrangThai,
                sCoKhoa : 2
            });
            console.log({
                sMaTinTuyenDung,
                sMaDoanhNghiep,
                sDiaChiLamViec,
                sLinhVucTuyenDung,
                sViTriTuyenDung,
                sMoTaCongViec,
                sMucLuongToiThieu,
                sMucLuongToiDa,
                sSoLuongTuyenDung,
                sSoNamKinhNghiem,
                sThoiGianDangBai,
                sThoiHanTuyenDung,
                sTrangThai
            });
            Toast.show({ type: 'success', text1: 'Job posted successfully!' });
            navigation.goBack();
        } catch (error) {
            console.error('Lỗi khi đăng tin tuyển dụng:', error);
            Toast.show({ type: 'error', text1: 'Failed to post job' });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomText style={styles.title}>Đăng tin tuyển dụng</CustomText>
            <CustomText style={styles.label}>Vị trí tuyển dụng</CustomText>
            <Input placeholder='' value={sViTriTuyenDung} onChangeText={setSViTriTuyenDung} style={styles.input} />
            <CustomText style={styles.label}>Lĩnh vực tuyển dụng</CustomText>
            <Input placeholder='' value={sLinhVucTuyenDung} onChangeText={setSLinhVucTuyenDung} style={styles.input} />
            <CustomText style={styles.label}>Địa điểm</CustomText>
            <Input placeholder='' value={sDiaChiLamViec} onChangeText={setSDiaChiLamViec} style={styles.input} />
            <CustomText style={styles.label}>Mức lương tối thiểu</CustomText>
            <Input placeholder='' value={sMucLuongToiThieu} onChangeText={setSMucLuongToiThieu} style={styles.input} />
            <CustomText style={styles.label}>Mức lương tối đa</CustomText>
            <Input placeholder='' value={sMucLuongToiDa} onChangeText={setSMucLuongToiDa} style={styles.input} />
            <CustomText style={styles.label}>Số lượng</CustomText>
            <Input placeholder='' value={sSoLuongTuyenDung} onChangeText={setSSoLuongTuyenDung} style={styles.input} />
            <CustomText style={styles.label}>Kinh nghiệm (Số năm)</CustomText>
            <Input placeholder='' value={sSoNamKinhNghiem} onChangeText={setSSoNamKinhNghiem} style={styles.input} />
            <CustomText style={styles.label}>Ngày bắt đầu tuyển</CustomText>
            <DatePicker label="" date={sThoiGianDangBai} setDate={setSThoiGianDangBai} />
            <CustomText style={styles.label}>Hạn tuyển</CustomText>
            <DatePicker label="" date={sThoiHanTuyenDung} setDate={setSThoiHanTuyenDung} />
            <CustomText style={styles.label}>Trạng thái</CustomText>
            <Input placeholder='' value={sTrangThai} onChangeText={setSTrangThai} style={styles.input} />
            <CustomText style={styles.label}>Mô tả công việc</CustomText>
            <Input placeholder='' value={sMoTaCongViec} onChangeText={setSMoTaCongViec} style={styles.largeInput} />
            {error ? <CustomText style={styles.error}>{error}</CustomText> : null}
            <Button title="Post Job" onPress={handlePostJob} style={styles.button} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    avatar: { width: 80, height: 80, borderRadius: 40, alignSelf: 'center', marginVertical: 10 },
    input: { marginBottom: 10, borderColor: "#BEBEBE", backgroundColor: "#EDEDED" },
    largeInput: { height: 100, textAlignVertical: 'top', marginBottom: 10,  borderColor: "#BEBEBE", backgroundColor: "#EDEDED" },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
    button: { marginTop: 0 },
    error: { color: 'red', textAlign: 'center', marginVertical: 5 },
});

export default PostJob;