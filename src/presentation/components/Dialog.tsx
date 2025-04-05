import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CustomText from './CustomText';

const Dialog = ({
    visible,
    request = false,
    title,
    content,
    confirm,
    dismiss,
    failure = false,
}: any) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={confirm?.onPress}
        >
            <View style={styles.overlay}>
                <View style={styles.dialogContainer}>
                    {request ? <View></View> : <View style={styles.iconContainer}>
                        <Image
                            source={failure ? require('../../../asset/images/img_failer.png') : require('../../../asset/images/img_success.png')}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                    </View>
                    }
                    <CustomText style={styles.title}>{title}</CustomText>

                    <CustomText style={styles.content}>{content}</CustomText>

                    <View style={styles.buttonContainer}>
                        {confirm && (
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={confirm.onPress}
                            >
                                <CustomText style={styles.buttonText}>{confirm.text}</CustomText>
                            </TouchableOpacity>
                        )}

                        {/* Nút Dismiss (Next) */}
                        {dismiss && (
                            <TouchableOpacity
                                style={[styles.button, styles.dismissButton]}
                                onPress={dismiss.onPress}
                            >
                                <CustomText style={[styles.buttonText, styles.dismissButtonText]}>
                                    {dismiss.text}
                                </CustomText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    iconContainer: {
        borderRadius: 50,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    content: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    confirmButton: {
        backgroundColor: '#E6E6E6',
    },
    dismissButton: {
        backgroundColor: '#4A90E2',
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
    },
    dismissButtonText: {
        color: '#fff',
    },
});

export default Dialog;