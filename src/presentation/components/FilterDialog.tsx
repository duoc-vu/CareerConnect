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

const FilterDialog = ({ visible, onClose, onApply, fields = [] }: any) => {
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);


  const salaryRanges = [
    { label: '0 - 10 triệu', value: [0, 10000000] },
    { label: '10 - 20 triệu', value: [10000000, 20000000] },
    { label: '20 - 30 triệu', value: [20000000, 30000000] },
    { label: 'Trên 30 triệu', value: [30000000, Infinity] },
  ];

  const locations = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Bắc Ninh', 'Bình Dương', 'Khánh Hòa', 'Quảng Ninh', 'Huế',
    'Nam Định', 'Lâm Đồng',
  ];

  const handleApply = () => {
    const selectedSalary = salaryRanges.find((range: any) => range.value === selectedSalaryRange);
    onApply({
      salaryRange: selectedSalary ? selectedSalary.value : null,
      location: selectedLocation,
      jobType: selectedJobType,
    });
    onClose();
  };
  
  const handleClose = () => {
    setSelectedSalaryRange(null);
    setSelectedLocation(null);
    setSelectedJobType(null);
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
        <Text style={styles.title}>Lọc công việc</Text>

        {/* Địa chỉ làm việc */}
        {fields.includes('location') && (
          <>
            <Text style={styles.sectionTitle}>Địa chỉ làm việc</Text>
            <View style={styles.optionsContainer}>
              {locations.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.option,
                    selectedLocation === loc && styles.optionSelected,
                  ]}
                  onPress={() => setSelectedLocation(loc)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedLocation === loc && styles.optionTextSelected,
                    ]}
                  >
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Mức lương */}
        {fields.includes('salaryRange') && (
          <>
            <Text style={styles.sectionTitle}>Mức lương</Text>
            <View style={styles.optionsContainer}>
              {salaryRanges.map((range: any) => (
                <TouchableOpacity
                  key={range.label}
                  style={[
                    styles.option,
                    JSON.stringify(selectedSalaryRange) === JSON.stringify(range.value) && styles.optionSelected,
                  ]}
                  onPress={() => setSelectedSalaryRange(range.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      JSON.stringify(selectedSalaryRange) === JSON.stringify(range.value) && styles.optionTextSelected,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        {fields.includes('jobType') && (
          <>
            <Text style={styles.sectionTitle}>Trạng thái</Text>
            <View style={styles.optionsContainer}>
              {['Đã duyệt', 'Bị khóa', 'Hết hạn'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.option,
                    selectedJobType === status && styles.optionSelected, // Sử dụng selectedJobType
                  ]}
                  onPress={() => setSelectedJobType(status)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedJobType === status && styles.optionTextSelected, // Sử dụng selectedJobType
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Áp dụng"
            style={styles.applyButton}
            onPress={handleApply}
          />
          <TouchableOpacity style={styles.clearButton} onPress={handleClose}>
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
    // maxHeight: '50%',
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
  scrollContainer: {
    maxHeight: 200,
    marginBottom: 20,
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