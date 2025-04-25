import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import Button from '../../components/Button';
import Input from '../../components/Input';
import CustomText from '../../components/CustomText';
import { useUser } from '../../../context/UserContext';
import { View } from 'react-native-animatable';
import HeaderWithIcons from '../../components/Header';
import { useLoading } from '../../../context/themeContext';
import Loading from '../../components/Loading';
import Dialog from '../../components/Dialog';

const fbDonUngTuyen = firestore().collection('tblDonUngTuyen');
const fbTinTuyenDung = firestore().collection('tblTinTuyenDung');
const fbUngVien = firestore().collection('tblUngVien');

const ApplyJob = ({ route, navigation }: any) => {
    const { userId } = useUser();
    const { loading, setLoading } = useLoading();
    const { sMaTinTuyenDung } = route.params;

    const initialState = {
        sMaDonUngTuyen: '',
        sMaTinTuyenDung: sMaTinTuyenDung || '',
        sMaUngVien: userId || '',
        sNgayTao: '',
        sTrangThai: 2,
        fFileCV: '',
        sHoVaTen: '',
        sChuyenNganh: '',
        sDiaChi: '',
        sSoDienThoai: '',
        sKiNang: '',
        sKinhNghiem: '',
        sSoThich: '',
        sMoTaChiTiet: '',
        sGioiThieu: ""
    };

    const [formData, setFormData] = useState(initialState);
    const [sMaDoanhNghiep, setSMaDoanhNghiep] = useState('');
    const [docId, setDocId] = useState(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, sNgayTao: formattedDate }));

        const generateApplicationId = async () => {
            try {
                setLoading(true);
                const snapshot = await fbDonUngTuyen.get();
                const count = snapshot.size + 1;
                const newId = `DUT${String(count).padStart(3, '0')}`;
                setFormData(prev => ({ ...prev, sMaDonUngTuyen: newId }));
            } catch (error) {
                console.error('Lỗi khi tạo mã đơn ứng tuyển:', error);
                Alert.alert('Lỗi', 'Không thể tạo mã đơn ứng tuyển, vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        const fetchJobData = async () => {
            try {
                setLoading(true);
                const jobQuerySnapshot = await fbTinTuyenDung
                    .where('sMaTinTuyenDung', '==', sMaTinTuyenDung)
                    .get();

                if (!jobQuerySnapshot.empty) {
                    const jobDoc = jobQuerySnapshot.docs[0];
                    const jobData = jobDoc.data();
                    setSMaDoanhNghiep(jobData.sMaDoanhNghiep || '');
                } else {
                    console.warn('❌ Không tìm thấy tin tuyển dụng với mã:', sMaTinTuyenDung);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu tin tuyển dụng:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userQuerySnapshot = await fbUngVien
                    .where('sMaUngVien', '==', userId)
                    .get();

                if (!userQuerySnapshot.empty) {
                    const userDoc: any = userQuerySnapshot.docs[0];
                    setDocId(userDoc.id);
                    const userData = userDoc.data();
                    setFormData(prev => ({
                        ...prev,
                        sHoVaTen: userData.sHoVaTen || '',
                        sChuyenNganh: userData.sChuyenNganh || '',
                        sDiaChi: userData.sDiaChi || '',
                        sSoDienThoai: userData.sSoDienThoai || '',
                        sKiNang: userData.sKiNang || '',
                        sKinhNghiem: userData.sKinhNghiem || '',
                        sSoThich: userData.sSoThich || '',
                        sMoTaChiTiet: userData.sMoTaChiTiet || '',
                    }));
                } else {
                    console.warn('❌ Không tìm thấy ứng viên với mã:', userId);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu ứng viên:', error);
            } finally {
                setLoading(false);
            }
        };

        generateApplicationId();
        fetchJobData();
        fetchUserData();
    }, [sMaTinTuyenDung, userId]);

    const handleChange = (key: any, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleChooseFile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            if (result && result[0].uri) {
                const uri = result[0].uri;
                await uploadFile(uri);
            }
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log('Người dùng hủy chọn file');
            } else {
                console.error('Lỗi DocumentPicker:', error);
            }
        }
    };

    const uploadFile = async (uri: any) => {
        if (!uri || !sMaDoanhNghiep || !sMaTinTuyenDung || !userId) {
            Alert.alert('Lỗi', 'Thiếu thông tin để upload file. Vui lòng kiểm tra lại.');
            return;
        }

        setLoading(true);
        try {
            const fileName = `tblDoanhNghiep/${sMaDoanhNghiep}/${sMaTinTuyenDung}/${userId}.pdf`;
            const reference = storage().ref(fileName);

            // Sao chép file vào bộ nhớ tạm
            const tempPath = `${RNFS.TemporaryDirectoryPath}/${userId}_cv.pdf`;
            await RNFS.copyFile(uri, tempPath);

            // Upload file từ bộ nhớ tạm
            await reference.putFile(tempPath);
            const downloadURL = await reference.getDownloadURL();

            setFormData(prev => ({ ...prev, fFileCV: downloadURL }));

            await RNFS.unlink(tempPath);
        } catch (error: any) {
            console.error('Lỗi khi tải file lên:', error);
            if (error.code === 'storage/unauthorized') {
                Alert.alert('Lỗi', 'Không có quyền upload file. Vui lòng kiểm tra quyền Firebase Storage.');
            } else if (error.code === 'storage/unknown') {
                Alert.alert('Lỗi', 'Lỗi không xác định khi upload file. Vui lòng thử lại.');
            } else {
                Alert.alert('Lỗi', 'Không thể tải file lên, vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            await fbDonUngTuyen.add({
                sMaDonUngTuyen: formData.sMaDonUngTuyen,
                sMaTinTuyenDung: formData.sMaTinTuyenDung,
                sMaUngVien: formData.sMaUngVien,
                sNgayTao: formData.sNgayTao,
                sTrangThai: formData.sTrangThai,
                fFileCV: formData.fFileCV || '',
            });

            if (docId) {
                await fbUngVien.doc(docId).update({
                    sHoVaTen: formData.sHoVaTen,
                    sChuyenNganh: formData.sChuyenNganh,
                    sDiaChi: formData.sDiaChi,
                    sSoDienThoai: formData.sSoDienThoai,
                    sKiNang: formData.sKiNang,
                    sKinhNghiem: formData.sKinhNghiem,
                    sSoThich: formData.sSoThich,
                    sMoTaChiTiet: formData.sMoTaChiTiet,
                    sGioiThieu: formData.sGioiThieu,
                });
            }
            setShowSuccessDialog(true);
        } catch (error) {
            console.error('❌ Lỗi khi gửi đơn ứng tuyển:', error);
            Alert.alert('Lỗi', 'Không thể gửi đơn ứng tuyển, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <HeaderWithIcons
                title="Ứng tuyển công việc"
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.container}>
                <CustomText style={styles.sectionTitle}>Thông tin đơn ứng tuyển</CustomText>

                <CustomText style={styles.label}>Họ và tên</CustomText>
                <Input
                    placeholder="Họ và tên"
                    style={styles.input}
                    value={formData.sHoVaTen}
                    onChangeText={text => handleChange('sHoVaTen', text)}
                />

                <CustomText style={styles.label}>Chuyên ngành</CustomText>
                <Input
                    placeholder="Chuyên ngành"
                    style={styles.input}
                    value={formData.sChuyenNganh}
                    onChangeText={text => handleChange('sChuyenNganh', text)}
                />

                <CustomText style={styles.label}>Địa chỉ</CustomText>
                <Input
                    placeholder="Địa chỉ"
                    style={styles.input}
                    value={formData.sDiaChi}
                    onChangeText={text => handleChange('sDiaChi', text)}
                />

                <CustomText style={styles.label}>Số điện thoại</CustomText>
                <Input
                    placeholder="Số điện thoại"
                    style={styles.input}
                    value={formData.sSoDienThoai}
                    onChangeText={text => handleChange('sSoDienThoai', text)}
                />

                <CustomText style={styles.label}>Kỹ năng</CustomText>
                <Input
                    placeholder="Kỹ năng"
                    style={styles.input}
                    value={formData.sKiNang}
                    onChangeText={text => handleChange('sKiNang', text)}
                />

                <CustomText style={styles.label}>Kinh nghiệm (Số năm)</CustomText>
                <Input
                    placeholder="Kinh nghiệm (Số năm)"
                    style={styles.input}
                    value={formData.sKinhNghiem}
                    onChangeText={text => handleChange('sKinhNghiem', text)}
                />

                <CustomText style={styles.label}>Sở thích</CustomText>
                <Input
                    placeholder="Sở thích"
                    style={styles.input}
                    value={formData.sSoThich}
                    onChangeText={text => handleChange('sSoThich', text)}
                />

                <CustomText style={styles.label}>Mô tả chi tiết</CustomText>
                <Input
                    placeholder="Mô tả chi tiết"
                    multiline
                    style={styles.largeInput}
                    value={formData.sMoTaChiTiet}
                    onChangeText={text => handleChange('sMoTaChiTiet', text)}
                />

                <CustomText style={styles.label}>Giới thiệu bản thân</CustomText>
                <Input
                    placeholder="Giới thiệu bản thân"
                    multiline
                    style={styles.largeInput}
                    value={formData.sGioiThieu}
                    onChangeText={text => handleChange('sGioiThieu', text)}
                />

                <CustomText style={styles.sectionTitle}>File CV</CustomText>

                <CustomText style={styles.label}>File CV (PDF)</CustomText>
                <TouchableOpacity style={styles.filePicker} onPress={handleChooseFile}>
                    <CustomText style={styles.filePickerText}>
                        {formData.fFileCV ? 'File đã chọn' : 'Chọn file PDF'}
                    </CustomText>
                </TouchableOpacity>
                {formData.fFileCV ? (
                    <CustomText style={styles.fileLink}>{formData.fFileCV}</CustomText>
                ) : null}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button
                    title="Gửi đơn ứng tuyển"
                    onPress={handleSubmit}
                    disabled={loading || !formData.fFileCV}
                />
            </View>
            {loading && <Loading />}
            <Dialog
                visible={showSuccessDialog}
                title="Thành công!"
                content="Đơn ứng tuyển của bạn đã được gửi đến cho nhà tuyển dụng. Kết quả sẽ được trả lại qua email hoặc số điện thoại mà bạn đã cung cấp."
                confirm={{
                    text: "Close",
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
        paddingBottom: 130,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        borderColor: '#BEBEBE',
        backgroundColor: '#EDEDED',
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
        marginBottom: 10,
        borderColor: '#BEBEBE',
        backgroundColor: '#EDEDED',
    },
    filePicker: {
        borderWidth: 1,
        borderColor: '#BEBEBE',
        backgroundColor: '#EDEDED',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    filePickerText: {
        fontSize: 14,
        color: '#333',
    },
    fileLink: {
        fontSize: 12,
        color: '#007AFF',
        marginBottom: 10,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#fff',
    },
});

export default ApplyJob;