import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Input from '../../components/Input';
import Button from '../../components/Button';
import CustomText from '../../components/CustomText';
import Dialog from '../../components/Dialog';
import HeaderWithIcons from '../../components/Header';
import { useUser } from '../../../context/UserContext';

const ChangePassword = ({ navigation }: any) => {
    const {  userEmail } = useUser();
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogContent, setDialogContent] = useState({
        title: '',
        content: '',
        confirm: null as null | { text: string; onPress: () => void },
        dismiss: null as null | { text: string; onPress: () => void },
        failure: false,
    });

    useEffect(() => {
        // Tự động điền email từ useUser
        if (userEmail) {
            setFormData(prev => ({ ...prev, email: userEmail }));
        }
    }, [userEmail]);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: '' })); 
    };

    const handleSubmit = async () => {
        const { email, currentPassword, newPassword, confirmPassword } = formData;

        if (!email) {
            setErrors(prev => ({ ...prev, email: 'Vui lòng nhập email.' }));
            return;
        }
        if (!currentPassword) {
            setErrors(prev => ({ ...prev, currentPassword: 'Vui lòng nhập mật khẩu hiện tại.' }));
            return;
        }
        if (!newPassword) {
            setErrors(prev => ({ ...prev, newPassword: 'Vui lòng nhập mật khẩu mới.' }));
            return;
        }
        if (newPassword.length < 6) {
            setErrors(prev => ({ ...prev, newPassword: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }));
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp.' }));
            return;
        }

        try {
            const userSnapshot = await firestore()
                .collection('tblTaiKhoan')
                .where('sEmailLienHe', '==', email)
                .get();

            if (userSnapshot.empty) {
                setErrors(prev => ({ ...prev, email: 'Email không tồn tại trong hệ thống.' }));
                return;
            }

            const userData = userSnapshot.docs[0].data();
            if (userData.sMatKhau !== currentPassword) {
                setErrors(prev => ({ ...prev, currentPassword: 'Mật khẩu hiện tại không đúng.' }));
                return;
            }

            await firestore()
                .collection('tblTaiKhoan')
                .doc(userSnapshot.docs[0].id)
                .update({ sMatKhau: newPassword });

            setDialogContent({
                title: 'Thành công',
                content: 'Mật khẩu của bạn đã được thay đổi thành công!',
                confirm: {
                    text: 'Đóng',
                    onPress: () => setDialogVisible(false),
                },
                dismiss: null,
                failure: false,
            });
            setDialogVisible(true);

            setFormData({
                email: userEmail || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            setDialogContent({
                title: 'Lỗi',
                content: 'Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.',
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

    return (
        <View style={styles.container}>
            <HeaderWithIcons
                title="Đổi mật khẩu"
                onBackPress={() => navigation.goBack()}
                style={styles.header}
            />
            <ScrollView contentContainerStyle={styles.containerChild}>
                <CustomText style={styles.label}>Email</CustomText>
                <Input
                    placeholder="Nhập email"
                    value={formData.email}
                    onChangeText={text => handleChange('email', text)}
                    style={styles.input}
                    editable={false} // Không cho phép chỉnh sửa email
                />
                {errors.email ? <CustomText style={styles.error}>{errors.email}</CustomText> : null}

                <CustomText style={styles.label}>Mật khẩu hiện tại</CustomText>
                <Input
                    placeholder="Nhập mật khẩu hiện tại"
                    value={formData.currentPassword}
                    onChangeText={text => handleChange('currentPassword', text)}
                    secureTextEntry
                    style={styles.input}
                />
                {errors.currentPassword ? <CustomText style={styles.error}>{errors.currentPassword}</CustomText> : null}

                <CustomText style={styles.label}>Mật khẩu mới</CustomText>
                <Input
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
                    onChangeText={text => handleChange('newPassword', text)}
                    secureTextEntry
                    style={styles.input}
                />
                {errors.newPassword ? <CustomText style={styles.error}>{errors.newPassword}</CustomText> : null}

                <CustomText style={styles.label}>Xác nhận mật khẩu</CustomText>
                <Input
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChangeText={text => handleChange('confirmPassword', text)}
                    secureTextEntry
                    style={styles.input}
                />
                {errors.confirmPassword ? <CustomText style={styles.error}>{errors.confirmPassword}</CustomText> : null}
            </ScrollView>
            <View style={styles.button}>
                <Button title="Đổi mật khẩu" onPress={handleSubmit} />
            </View>

            <Dialog
                visible={dialogVisible}
                title={dialogContent.title}
                content={dialogContent.content}
                confirm={dialogContent.confirm}
                dismiss={dialogContent.dismiss}
                failure={dialogContent.failure}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', flexGrow: 1 },
    containerChild: { padding: 20, paddingBottom: 150 },
    header: { marginBottom: 10 },
    input: { marginBottom: 10, borderColor: '#BEBEBE', backgroundColor: '#EDEDED' },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
    error: { color: 'red', marginVertical: 5, fontSize: 13 },
    button: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#fff',
    },
});

export default ChangePassword;