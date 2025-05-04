import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Button from '../../components/Button';
import Input from '../../components/Input';
import CustomText from '../../components/CustomText';
import DatePicker from '../../components/DatePicker';
import Dialog from '../../components/Dialog';
import { View } from 'react-native-animatable';
import HeaderWithIcons from '../../components/Header';

const fbJob = firestore().collection('tblTinTuyenDung');

const EditJob = ({ navigation, route }: any) => {
    const { sMaTinTuyenDung } = route.params;
    const initialState = {
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
    };

    const [errors, setErrors] = useState({
        sMucLuongToiThieu: '',
        sMucLuongToiDa: '',
        sSoLuongTuyenDung: '',
        sSoNamKinhNghiem: '',
    });

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [successDialogVisible, setSuccessDialogVisible] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const jobDoc = await fbJob.where('sMaTinTuyenDung', '==', sMaTinTuyenDung).get();
                if (!jobDoc.empty) {
                    const jobData = jobDoc.docs[0].data();
                    setFormData({
                        sDiaChiLamViec: jobData.sDiaChiLamViec || '',
                        sLinhVucTuyenDung: jobData.sLinhVucTuyenDung || '',
                        sViTriTuyenDung: jobData.sViTriTuyenDung || '',
                        sMoTaCongViec: jobData.sMoTaCongViec || '',
                        sMucLuongToiThieu: jobData.sMucLuongToiThieu.toString() || '',
                        sMucLuongToiDa: jobData.sMucLuongToiDa.toString() || '',
                        sSoLuongTuyenDung: jobData.sSoLuongTuyenDung.toString() || '',
                        sSoNamKinhNghiem: jobData.sSoNamKinhNghiem.toString() || '',
                        sThoiGianDangBai: new Date(jobData.sThoiGianDangBai) || new Date(),
                        sThoiHanTuyenDung: new Date(jobData.sThoiHanTuyenDung) || new Date(),
                    });
                } else {
                    setError('Không tìm thấy thông tin công việc.');
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết công việc:', error);
                setError('Lỗi khi lấy chi tiết công việc. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [sMaTinTuyenDung]);

    const handleChange = (key: string, value: string | Date) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        if (['sMucLuongToiThieu', 'sMucLuongToiDa', 'sSoLuongTuyenDung', 'sSoNamKinhNghiem'].includes(key)) {
            if (isNaN(Number(value))) {
                setErrors(prev => ({ ...prev, [key]: 'Giá trị phải là số.' }));
            } else {
                setErrors(prev => ({ ...prev, [key]: '' }));
            }
        }
    };

    const handleSaveConfirmation = () => {
        if (
            isNaN(Number(formData.sMucLuongToiThieu)) ||
            isNaN(Number(formData.sMucLuongToiDa)) ||
            isNaN(Number(formData.sSoLuongTuyenDung)) ||
            isNaN(Number(formData.sSoNamKinhNghiem))
        ) {
            setError('Mức lương, số lượng tuyển, và kinh nghiệm phải là số.');
            return;
        }

        if (Number(formData.sMucLuongToiThieu) > Number(formData.sMucLuongToiDa)) {
            setError('Mức lương tối thiểu không được lớn hơn mức lương tối đa.');
            return;
        }

        setError('');
        setConfirmDialogVisible(true);
    };

    const handleSave = async () => {
        try {
            const jobQuerySnapshot = await fbJob.where('sMaTinTuyenDung', '==', sMaTinTuyenDung).get();
            if (!jobQuerySnapshot.empty) {
                const jobDocId = jobQuerySnapshot.docs[0].id;

                await fbJob.doc(jobDocId).update({
                    ...formData,
                    sThoiGianDangBai: formData.sThoiGianDangBai.toISOString().split('T')[0],
                    sThoiHanTuyenDung: formData.sThoiHanTuyenDung.toISOString().split('T')[0],
                    sCoKhoa: 2,
                });

                setConfirmDialogVisible(false);
                setSuccessDialogVisible(true);
            } else {
                console.error('Không tìm thấy bản ghi với sMaTinTuyenDung:', sMaTinTuyenDung);
                setError('Không tìm thấy bản ghi để cập nhật.');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật công việc:', error);
            setError('Cập nhật tin tuyển dụng thất bại!');
        }
    };

    const handleSuccessDialogClose = () => {
        setSuccessDialogVisible(false);
        navigation.goBack();
    };

    if (loading) {
        return <CustomText style={styles.loading}>Đang tải...</CustomText>;
    }

    return (
        <>
            <View style={styles.container}>
                <HeaderWithIcons
                    title='Chỉnh sửa tin tuyển dụng'
                    style={styles.header}
                    onBackPress={navigation.goBack}
                />
                <ScrollView contentContainerStyle={styles.containerChild} showsVerticalScrollIndicator={false}>

                    <CustomText style={styles.label}>Vị trí tuyển dụng</CustomText>
                    <Input
                        placeholder=""
                        value={formData.sViTriTuyenDung}
                        onChangeText={text => handleChange('sViTriTuyenDung', text)}
                        style={styles.input}
                    />

                    <CustomText style={styles.label}>Lĩnh vực tuyển dụng</CustomText>
                    <Input
                        placeholder=""
                        value={formData.sLinhVucTuyenDung}
                        onChangeText={text => handleChange('sLinhVucTuyenDung', text)}
                        style={styles.input}
                    />

                    <CustomText style={styles.label}>Địa điểm</CustomText>
                    <Input
                        placeholder=""
                        value={formData.sDiaChiLamViec}
                        onChangeText={text => handleChange('sDiaChiLamViec', text)}
                        style={styles.input}
                    />

                    <CustomText style={styles.label}>Mức lương tối thiểu</CustomText>
                    <Input
                        placeholder=""
                        value={formData.sMucLuongToiThieu}
                        onChangeText={text => handleChange('sMucLuongToiThieu', text)}
                        style={styles.input}
                    />
{errors.sMucLuongToiThieu ? <CustomText style={styles.error}>{errors.sMucLuongToiThieu}</CustomText> : null}

                    <CustomText style={styles.label}>Mức lương tối đa</CustomText>
                    <Input
                        placeholder=""
                        value={formData.sMucLuongToiDa}
                        onChangeText={text => handleChange('sMucLuongToiDa', text)}
                        style={styles.input}
                    />
{errors.sMucLuongToiDa ? <CustomText style={styles.error}>{errors.sMucLuongToiDa}</CustomText> : null}

                    <CustomText style={styles.label}>Số lượng tuyển</CustomText>
                    <Input
                        placeholder=""
                        value={formData.sSoLuongTuyenDung}
                        onChangeText={text => handleChange('sSoLuongTuyenDung', text)}
                        style={styles.input}
                    />
{errors.sSoLuongTuyenDung ? <CustomText style={styles.error}>{errors.sSoLuongTuyenDung}</CustomText> : null}

                    <CustomText style={styles.label}>Kinh nghiệm (Số năm)</CustomText>
                    <Input
                        placeholder=""
                        value={formData.sSoNamKinhNghiem}
                        onChangeText={text => handleChange('sSoNamKinhNghiem', text)}
                        style={styles.input}
                    />
{errors.sSoNamKinhNghiem ? <CustomText style={styles.error}>{errors.sSoNamKinhNghiem}</CustomText> : null}
                    <CustomText style={styles.label}>Ngày bắt đầu tuyển</CustomText>
                    <DatePicker
                        label=""
                        date={formData.sThoiGianDangBai}
                        setDate={(date: any) => handleChange('sThoiGianDangBai', date)}
                    />

                    <CustomText style={styles.label}>Hạn tuyển</CustomText>
                    <DatePicker
                        label=""
                        date={formData.sThoiHanTuyenDung}
                        setDate={(date: any) => handleChange('sThoiHanTuyenDung', date)}
                    />

                    <CustomText style={styles.label}>Mô tả công việc</CustomText>
                    <Input
                        placeholder=""
                        multiline
                        value={formData.sMoTaCongViec}
                        onChangeText={text => handleChange('sMoTaCongViec', text)}
                        style={styles.largeInput}
                    />

                    {error ? <CustomText style={styles.error}>{error}</CustomText> : null}

                </ScrollView>
                <View style={styles.button}>
                    <Button title="Lưu" onPress={handleSaveConfirmation} />
                </View>

            </View>
            <Dialog
                visible={confirmDialogVisible}
                title="Xác nhận cập nhật"
                content="Bạn có chắc chắn muốn cập nhật tin tuyển dụng này không?"
                request={true}
                confirm={{
                    text: 'Cập nhật',
                    onPress: handleSave,
                }}
                dismiss={{
                    text: 'Hủy',
                    onPress: () => setConfirmDialogVisible(false),
                }}
            />

            <Dialog
                visible={successDialogVisible}
                request={false}
                title="Thành công"
                content="Tin tuyển dụng đã được cập nhật thành công!"
                confirm={{
                    text: 'OK',
                    onPress: handleSuccessDialogClose,
                }}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', flexGrow: 1 },
    containerChild: { padding: 20, paddingBottom: 140 },
    header: { paddingBottom: 10 },
    input: { marginBottom: 10, borderColor: '#BEBEBE', backgroundColor: '#EDEDED' },
    largeInput: { height: 100, textAlignVertical: 'top', marginBottom: 10, borderColor: '#BEBEBE', backgroundColor: '#EDEDED' },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
    error: { color: 'red', marginVertical: 5 , fontSize: 13},
    button: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#fff',
    },
    loading: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});

export default EditJob;