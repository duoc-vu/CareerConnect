import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import Button from '../../components/Button';
import Input from '../../components/Input';
import CustomText from '../../components/CustomText';
import DatePicker from '../../components/DatePicker';

const fbJob = firestore().collection('tblTinTuyenDung');

const PostJob = ({ navigation, route }: any) => {
    const { userId = null } = route?.params ?? {};

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

            let trangThai = "Chờ đăng";
            if (currentDate.getTime() === ngayDang.getTime()) {
                trangThai = "Đang tuyển";
            } else if (currentDate.getTime() > hanTuyen.getTime()) {
                trangThai = "Hết hạn";
            }


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
                sTrangThai: trangThai,
                sCoKhoa: 2
            });

            // console.log({
            //     sMaTinTuyenDung: formData.sMaTinTuyenDung,
            //     sDiaChiLamViec: formData.sDiaChiLamViec,
            //     sLinhVucTuyenDung: formData.sLinhVucTuyenDung,
            //     sViTriTuyenDung: formData.sViTriTuyenDung,
            //     sMoTaCongViec: formData.sMoTaCongViec,
            //     sMucLuongToiThieu: formData.sMucLuongToiThieu, 
            //     sMucLuongToiDa: formData.sMucLuongToiDa,
            //     sMucLuongToiThieuRaw: minSalaryRaw,
            //     sMucLuongToiDaRaw: maxSalaryRaw,
            //     sSoLuongTuyenDung: formData.sSoLuongTuyenDung,
            //     sSoNamKinhNghiem: formData.sSoNamKinhNghiem,
            //     sThoiGianDangBai: formData.sThoiGianDangBai.toISOString().split("T")[0],
            //     sThoiHanTuyenDung: formData.sThoiHanTuyenDung.toISOString().split("T")[0],
            //     sTrangThai: trangThai
            // });

            resetForm();
            navigation.goBack();

        } catch (error: any) {
            console.error('Lỗi khi đăng tin tuyển dụng:', error);
            setError(error.message || "Lỗi không xác định khi đăng tin!");
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
