import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
import DocumentPicker from 'react-native-document-picker';
import Dialog from '../../components/Dialog';
import RNFS from 'react-native-fs';

const fbDoanhNghiep = firestore().collection('tblDoanhNghiep');

const EditEmployerProfile = ({ navigation }: any) => {
    const { userId } = useUser();
    const { loading, setLoading } = useLoading();

    const initialState = {
        sAnhDaiDien: '',
        sTenDoanhNghiep: '',
        sDiaChi: '',
        sLinhVuc: '',
        sSoLuongNhanVien: 0,
        sMoTaChiTiet: '',
        sGiayPhepKinhDoanh: ''
    };
    const [initialFormData, setInitialFormData] = useState(initialState);
    const [formData, setFormData] = useState(initialState);
    const [docId, setDocId] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogContent, setDialogContent] = useState({
        title: '',
        content: '',
        confirm: null as null | { text: string; onPress: () => void },
        dismiss: null as null | { text: string; onPress: () => void },
        failure: false, 
    });

    useEffect(() => {
        if (userId) {
            fetchCompanyData();
        }
    }, [userId]);

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            const querySnapshot = await fbDoanhNghiep
                .where('sMaDoanhNghiep', '==', userId)
                .get();

            if (!querySnapshot.empty) {
                const doc: any = querySnapshot.docs[0];
                setDocId(doc.id);
                const data = doc.data();
                setFormData(data);
                setInitialFormData(data); 

                const avatarPath = `tblDoanhNghiep/${userId}.png`;
                const avatarRef = storage().ref(avatarPath);
                try {
                    const avatarUrl = await avatarRef.getDownloadURL();
                    setFormData(prev => ({ ...prev, sAnhDaiDien: avatarUrl }));
                } catch (error) {
                    console.warn(`⚠️ Không tìm thấy ảnh đại diện: ${avatarPath}`);
                }
            } else {
                console.warn('❌ Không tìm thấy doanh nghiệp với mã:', userId);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu doanh nghiệp:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: any, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleChooseLicenseFile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images], 
            });

            if (result && result[0].uri) {
                const uri = result[0].uri;
                await uploadLicenseFile(uri);
            }
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                setDialogContent({
                    title: 'Thông báo',
                    content: 'Bạn đã hủy chọn file.',
                    confirm: {
                        text: 'Đóng',
                        onPress: () => setDialogVisible(false),
                    },
                    dismiss: null,
                    failure: false,
                });
                setDialogVisible(true);
            } else {
                console.error('Lỗi DocumentPicker:', error);

                setDialogContent({
                    title: 'Lỗi',
                    content: 'Đã xảy ra lỗi khi chọn file. Vui lòng thử lại.',
                    confirm: {
                        text: 'Đóng',
                        onPress: () => setDialogVisible(false),
                    },
                    dismiss: null,
                    failure: true,
                });
                setDialogVisible(true);
            }
        }
    };

    const uploadLicenseFile = async (uri: string) => {
        if (!uri) return;

        setLoading(true);
        try {
            const tempPath = `${RNFS.TemporaryDirectoryPath}/license_${Date.now()}.png`;

            await RNFS.copyFile(uri, tempPath);

            const fileName = `tblDoanhNghiep/${userId}/${userId}_gpkd.png`;
            const reference = storage().ref(fileName);

            await reference.putFile(tempPath);

            const downloadURL = await reference.getDownloadURL();

            setFormData(prev => ({ ...prev, sGiayPhepKinhDoanh: downloadURL }));

            setDialogContent({
                title: 'Thành công',
                content: 'Giấy phép kinh doanh đã được tải lên thành công.',
                confirm: {
                    text: 'Đóng',
                    onPress: () => setDialogVisible(false),
                },
                dismiss: null,
                failure: false,
            });
            setDialogVisible(true);
        } catch (error) {
            console.error('Lỗi khi tải giấy phép kinh doanh lên:', error);

            setDialogContent({
                title: 'Lỗi',
                content: 'Không thể tải giấy phép kinh doanh lên. Vui lòng thử lại.',
                confirm: {
                    text: 'Đóng',
                    onPress: () => setDialogVisible(false),
                },
                dismiss: null,
                failure: true,
            });
            setDialogVisible(true);
        } finally {
            setLoading(false);
        }
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
            const fileName = `tblDoanhNghiep/${userId}.png`;
            const reference = storage().ref(fileName);
            await reference.putFile(uri);
            const downloadURL = await reference.getDownloadURL();

            setFormData(prev => ({ ...prev, sAnhDaiDien: downloadURL }));
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!docId) {
            setDialogContent({
                title: 'Lỗi',
                content: 'Không tìm thấy tài liệu doanh nghiệp để cập nhật!',
                confirm: {
                    text: 'Đóng',
                    onPress: () => setDialogVisible(false),
                },
                dismiss: null,
                failure: true,
            });
            setDialogVisible(true);
            return;
        }

        try {
            setLoading(true);

            const shouldSetInactive = formData.sGiayPhepKinhDoanh !== initialFormData.sGiayPhepKinhDoanh;

            await fbDoanhNghiep.doc(docId).update({
                ...formData,
                ...(shouldSetInactive && { bTrangThai: false }),
            });
            setDialogContent({
                title: 'Thành công',
                content: 'Thông tin doanh nghiệp đã được cập nhật thành công',
                confirm: {
                    text: 'Đóng',
                    onPress: () => {
                        setDialogVisible(false);
                        navigation.replace('employer-profile');
                    },
                },
                dismiss: null,
                failure: false,
            });
            setDialogVisible(true);
        } catch (error) {
            console.error('❌ Lỗi khi cập nhật:', error);
            setDialogContent({
                title: 'Lỗi',
                content: 'Không thể cập nhật thông tin, vui lòng thử lại.',
                confirm: {
                    text: 'Đóng',
                    onPress: () => setDialogVisible(false),
                },
                dismiss: null,
                failure: true,
            });
            setDialogVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <HeaderWithIcons
                title="Chỉnh sửa hồ sơ doanh nghiệp"
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={
                            formData.sAnhDaiDien
                                ? { uri: formData.sAnhDaiDien }
                                : require('../../../../asset/images/default_avt.png')
                        }
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editIcon} onPress={handleChoosePhoto}>
                        <Image
                            source={require('../../../../asset/images/img_edit.png')}
                            style={styles.editIconImage}
                        />
                    </TouchableOpacity>
                </View>

                <CustomText style={styles.label}>Tên doanh nghiệp</CustomText>
                <Input
                    placeholder="Nhập tên doanh nghiệp"
                    style={styles.input}
                    value={formData.sTenDoanhNghiep}
                    onChangeText={text => handleChange('sTenDoanhNghiep', text)}
                />

                <CustomText style={styles.label}>Địa chỉ</CustomText>
                <Input
                    placeholder="Nhập địa chỉ"
                    style={styles.input}
                    value={formData.sDiaChi}
                    onChangeText={text => handleChange('sDiaChi', text)}
                />

                <CustomText style={styles.label}>Lĩnh vực</CustomText>
                <Input
                    placeholder="Nhập lĩnh vực"
                    style={styles.input}
                    value={formData.sLinhVuc}
                    onChangeText={text => handleChange('sLinhVuc', text)}
                />

                <CustomText style={styles.label}>Số lượng nhân viên</CustomText>
                <Input
                    placeholder="Nhập số lượng nhân viên"
                    style={styles.input}
                    value={String(formData.sSoLuongNhanVien)}
                    onChangeText={text => handleChange('sSoLuongNhanVien', Number(text))}
                />

                <CustomText style={styles.label}>Giấy phép kinh doanh (PNG)</CustomText>
                <TouchableOpacity style={styles.filePicker} onPress={handleChooseLicenseFile}>
                    <CustomText style={styles.filePickerText}>
                        {formData.sGiayPhepKinhDoanh ? 'Đã chọn file' : 'Chọn file PNG'}
                    </CustomText>
                </TouchableOpacity>

                <CustomText style={styles.label}>Mô tả chi tiết</CustomText>
                <Input
                    placeholder="Nhập mô tả chi tiết"
                    multiline
                    value={formData.sMoTaChiTiet}
                    onChangeText={text => handleChange('sMoTaChiTiet', text)}
                    style={styles.largeInput}
                />
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button
                    title="Lưu thông tin"
                    onPress={handleSave}
                    disabled={loading}
                />
            </View>
            <Dialog
                visible={dialogVisible}
                title={dialogContent.title}
                content={dialogContent.content}
                confirm={dialogContent.confirm}
                dismiss={dialogContent.dismiss}
                failure={dialogContent.failure}
            />
            {loading && <Loading />}
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
    filePicker: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#BEBEBE',
        backgroundColor: '#EDEDED',
        marginBottom: 10,
    },
    filePickerText: {
        color: '#333',
        fontSize: 14,
    },
    fileLink: {
        color: '#007AFF',
        fontSize: 14,
        textDecorationLine: 'underline',
        marginBottom: 10,
    },
});

export default EditEmployerProfile;