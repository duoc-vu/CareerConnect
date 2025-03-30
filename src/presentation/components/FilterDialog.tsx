import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { theme } from '../../theme/theme';
import Button from './Button';

const FilterDialog = ({ visible, onClose, onApply }: any) => {
    const [salaryRange, setSalaryRange] = useState([0, 100000]);
    const [jobType, setJobType] = useState<string | null>(null);

    const handleApply = () => {
        onApply({ salaryRange, jobType });
        onClose();
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            style={styles.modal}
        >
            <View style={styles.dialog}>
                <View style={styles.handle} />
                <Text style={styles.title}>Filter</Text>

                <Text style={styles.sectionTitle}>Trạng thái</Text>
                <View style={styles.optionsContainer}>
                    {['Đã duyệt', 'Chờ duyệt', 'Từ chối', 'Hết hạn'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.option,
                                jobType === type && styles.optionSelected,
                            ]}
                            onPress={() => setJobType(type)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    jobType === type && styles.optionTextSelected,
                                ]}
                            >
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title='Áp dụng'
                        style={styles.applyButton}
                        onPress={handleApply} />
                    <TouchableOpacity style={styles.clearButton} onPress={onClose}>
                        <Text style={styles.clearButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    dialog: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: theme.colors.titleJob.primary,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        color: theme.colors.titleJob.third,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    option: {
        borderWidth: 1,
        borderColor: theme.template.biru,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
        margin: 5,
    },
    optionSelected: {
        backgroundColor: theme.template.biru,
        borderColor: theme.colors.text.primary,
    },
    optionText: {
        fontSize: 14,
        color: '#000',
    },
    optionTextSelected: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    clearButton: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    clearButtonText: {
        color: '#ccc',
        fontWeight: 'bold',
    },
    applyButton: {
        width: 290,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default FilterDialog;