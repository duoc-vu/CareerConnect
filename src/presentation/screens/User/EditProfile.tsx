import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Button from '../../components/Button';
import Input from '../../components/Input';
import CustomText from '../../components/CustomText';
import { useUser } from '../../../context/UserContext';
import { View } from 'react-native-animatable';
import { Image } from 'react-native';
import HeaderWithIcons from '../../components/Header';
import { useLoading } from '../../../context/themeContext';
import Loading from '../../components/Loading';
import { Fonts } from '../../../theme/font';
import Dialog from '../../components/Dialog';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const fbUV = firestore().collection('tblUngVien');

const EditProfile = ({ navigation }: any) => {
    const { userId } = useUser();
    const { loading, setLoading } = useLoading();
    const [cvFile, setCvFile] = useState<string | null>(null);
    const initialState = {
        sAnhDaiDien: '',
        sChuyenNganh: '',
        sLinhVuc: '',
        sDiaChi: '',
        sHoVaTen: '',
        sKiNang: '',
        sKinhNghiem: '',
        sMoTaChiTiet: '',
        sSoDienThoai: '',
        sSoThich: '',
        fFileCV: ''
    };


    const [formData, setFormData] = useState(initialState);
    const [docId, setDocId] = useState<string | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogContent, setDialogContent] = useState({
        title: "",
        message: "",
        isSuccess: false,
    });

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const querySnapshot = await fbUV.where("sMaUngVien", "==", userId).get();

            if (!querySnapshot.empty) {
                const doc: any = querySnapshot.docs[0];
                setDocId(doc.id);
                setFormData(doc.data());

                const avatarPath = `tblUngVien/${userId}.png`;
                const avatarRef = storage().ref(avatarPath);
                try {
                    const avatarUrl = await avatarRef.getDownloadURL();
                    setFormData(prev => ({ ...prev, sAnhDaiDien: avatarUrl }));
                } catch (error) {
                    console.warn(`⚠️ Không tìm thấy ảnh đại diện: ${avatarPath}`);
                }
            } else {
                console.warn('❌ Không tìm thấy ứng viên với mã:', userId);
                setDocId(null);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu ứng viên:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };
    const handleChoosePhoto = () => {
        const options: any = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('Người dùng hủy chọn ảnh');
            } else if (response.errorCode) {
                console.error('Lỗi ImagePicker:', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                await uploadImage(uri);
            }
        });
    };

    const uploadImage = async (uri: any) => {
        if (!uri) return;

        setLoading(true);
        try {
            const fileName = `tblUngVien/${userId}.png`;
            const reference = storage().ref(fileName);
            await reference.putFile(uri);
            const downloadURL = await reference.getDownloadURL();

            setFormData(prev => ({ ...prev, sAnhDaiDien: downloadURL }));
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên:', error);
        } finally {
            setLoading(false);
        }
    }

    const isFormValid = () => {
        return (
            (formData.sHoVaTen || '').trim() !== '' &&
            (formData.sChuyenNganh || '').trim() !== '' &&
            (formData.sLinhVuc || '').trim() !== '' &&
            (formData.sDiaChi || '').trim() !== '' &&
            (formData.sSoDienThoai || '').trim() !== '' &&
            (formData.sKiNang || '').trim() !== '' &&
            (formData.sKinhNghiem || '').trim() !== '' &&
            (formData.sSoThich || '').trim() !== '' &&
            (formData.sMoTaChiTiet || '').trim() !== ''
        );
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            if (!docId) {
                await fbUV.add({
                    ...formData,
                    sMaUngVien: userId,
                    fFileCV: cvFile || "",
                });
                setDialogContent({
                    title: "Thành công",
                    message: "Thông tin của bạn đã được lưu thành công!",
                    isSuccess: true,
                });
                setDialogVisible(true);
            } else {
                await fbUV.doc(docId).update({
                    ...formData,
                    fFileCV: cvFile || "",
                });
                setDialogContent({
                    title: "Thành công",
                    message: "Thông tin của bạn đã được cập nhật thành công!",
                    isSuccess: true,
                });
                setDialogVisible(true);
            }
        } catch (error) {
            console.error('❌ Lỗi khi lưu thông tin:', error);
            setDialogContent({
                title: "Lỗi",
                message: "Không thể lưu thông tin, vui lòng thử lại.",
                isSuccess: false,
            });
            setDialogVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChooseCV = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            if (result && result[0].uri) {
                const uri = result[0].uri;
                await uploadCV(uri);
            }
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log('Người dùng hủy chọn file');
            } else {
                console.error('Lỗi DocumentPicker:', error);
            }
        }
    };

    const uploadCV = async (uri: string) => {
        if (!uri || !userId) {
            Alert.alert('Lỗi', 'Thiếu thông tin để upload file. Vui lòng kiểm tra lại.');
            return;
        }

        setLoading(true);
        try {
            const fileName = `tblUngVien/${userId}/${userId}.pdf`; // Đường dẫn lưu file trong Firebase Storage
            const reference = storage().ref(fileName);

            // Sao chép file vào bộ nhớ tạm
            const tempPath = `${RNFS.TemporaryDirectoryPath}/${userId}_cv.pdf`;
            await RNFS.copyFile(uri, tempPath);

            // Upload file từ bộ nhớ tạm
            await reference.putFile(tempPath);
            const downloadURL = await reference.getDownloadURL();

            setCvFile(downloadURL);
            setFormData((prev) => ({ ...prev, fFileCV: downloadURL }));

            setDialogContent({
                title: "Thành công",
                message: "File CV đã được tải lên thành công!",
                isSuccess: true,
            });
            setDialogVisible(true);

            await RNFS.unlink(tempPath);
        } catch (error: any) {
            console.error('Lỗi khi tải file lên:', error);
            setDialogContent({
                title: "Lỗi",
                message: "Không thể tải file lên, vui lòng thử lại.",
                isSuccess: false,
            });
            setDialogVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.wrapper}>
            <HeaderWithIcons
                title='Chỉnh sửa hồ sơ'
                onBackPress={() => { navigation.goBack() }}
            />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={formData.sAnhDaiDien ? { uri: formData.sAnhDaiDien } : require('../../../../asset/images/default_avt.png')}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editIcon} onPress={handleChoosePhoto}>
                        <Image
                            source={require('../../../../asset/images/img_edit.png')}
                            style={styles.editIconImage}
                        />
                    </TouchableOpacity>
                </View>

                <CustomText style={styles.label}>Họ và tên</CustomText>
                <Input placeholder="Nhập họ tên" style={styles.input} value={formData.sHoVaTen} onChangeText={text => handleChange('sHoVaTen', text)} />

                <CustomText style={styles.label}>Lĩnh Vực</CustomText>
                <Input placeholder="Nhập chuyên ngành" style={styles.input} value={formData.sLinhVuc} onChangeText={text => handleChange('sLinhVuc', text)} />

                <CustomText style={styles.label}>Vị trí</CustomText>
                <Input placeholder="Nhập chuyên ngành" style={styles.input} value={formData.sChuyenNganh} onChangeText={text => handleChange('sChuyenNganh', text)} />

                <CustomText style={styles.label}>Địa chỉ</CustomText>
                <Input placeholder="Nhập địa chỉ" style={styles.input} value={formData.sDiaChi} onChangeText={text => handleChange('sDiaChi', text)} />

                <CustomText style={styles.label}>Số điện thoại</CustomText>
                <Input placeholder="Nhập số điện thoại" style={styles.input} value={formData.sSoDienThoai} onChangeText={text => handleChange('sSoDienThoai', text)} />

                <CustomText style={styles.label}>Kỹ năng</CustomText>
                <Input placeholder="Nhập kỹ năng" style={styles.input} value={formData.sKiNang} onChangeText={text => handleChange('sKiNang', text)} />

                <CustomText style={styles.label}>Kinh nghiệm</CustomText>
                <Input placeholder="Nhập kinh nghiệm" style={styles.input} value={formData.sKinhNghiem} onChangeText={text => handleChange('sKinhNghiem', text)} />

                <CustomText style={styles.label}>Sở thích</CustomText>
                <Input placeholder="Nhập sở thích" style={styles.input} value={formData.sSoThich} onChangeText={text => handleChange('sSoThich', text)} />

                <CustomText style={styles.label}>Mô tả chi tiết</CustomText>
                <Input placeholder="Nhập mô tả" multiline value={formData.sMoTaChiTiet} onChangeText={text => handleChange('sMoTaChiTiet', text)} style={styles.largeInput} />

                <CustomText style={styles.label}>File CV cá nhân (PDF)</CustomText>
                <TouchableOpacity style={styles.filePicker} onPress={handleChooseCV}>
                    <CustomText style={styles.filePickerText}>
                        {cvFile ? "File đã chọn" : "Chọn file PDF"}
                    </CustomText>
                </TouchableOpacity>
                {cvFile ? (
                    <CustomText style={styles.fileLink}>{cvFile}</CustomText>
                ) : null}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button
                    title="Lưu thông tin"
                    onPress={handleSave}
                    disabled={loading || !isFormValid()}
                />
            </View>
            <Dialog
                visible={dialogVisible}
                title={dialogContent.title}
                content={dialogContent.message}
                confirm={{
                    text: "Đóng",
                    onPress: () => setDialogVisible(false), 
                }}
                failure={!dialogContent.isSuccess} 
            />
            {loading && <Loading />}
        </View>

    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        fontFamily: Fonts.medium.fontFamily,
    },
    container: { padding: 20, backgroundColor: '#fff', flexGrow: 1, paddingBottom: 130 },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 20,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: '40%',
        backgroundColor: '#007AFF',
        borderRadius: 15,
        padding: 5,
    },
    editIconImage: {
        width: 20,
        height: 20,
        tintColor: '#fff',
    },
    input: { borderColor: "#BEBEBE", backgroundColor: "#EDEDED" },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 10, marginBottom: 10 },
    largeInput: { height: 100, textAlignVertical: 'top', marginBottom: 10, borderColor: "#BEBEBE", backgroundColor: "#EDEDED" },
    buttonContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: "#fff"
    },
    filePicker: {
        borderWidth: 1,
        borderColor: "#BEBEBE",
        backgroundColor: "#EDEDED",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    filePickerText: {
        fontSize: 14,
        color: "#333",
    },
    fileLink: {
        fontSize: 12,
        color: "#007AFF",
        marginBottom: 10,
    },
});

export default EditProfile;
