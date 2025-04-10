import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/theme';

const AppointmentCard = ({
  sMaLichHenPhongVan,
  sMaTinTuyenDung,
  sThoiGianPhongVan,
  sTieuDe,
  sDiaDiem,
  sLoiNhan,
  sSDT,
  sEmail,
  onPressJobDetail,
  onPressApplicantDetail,
  onEdit,
  onDelete,
}: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}h${minutes} ${day}/${month}/${year}`;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand}>
        <Text style={styles.applicantName}>Lịch hẹn phỏng vấn (#{sMaTinTuyenDung})</Text>
        <Icon
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#6B7280"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.details}>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Vị trí:</Text>
            <Text style={styles.value}>{sTieuDe}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Địa điểm phỏng vấn:</Text>
            <Text style={styles.value}>{sDiaDiem}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Thời gian phỏng vấn:</Text>
            <Text style={styles.value}>{formatDateTime(sThoiGianPhongVan)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Lời nhắn:</Text>
            <Text style={styles.value}>{sLoiNhan}</Text>
          </View>
          {sSDT &&
            <View style={styles.detailRow}>
              <Text style={styles.label}>Số điện thoại:</Text>
              <Text style={styles.value}>{sSDT}</Text>
            </View>
          }
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email liên hệ:</Text>
            <Text style={styles.value}>{sEmail}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Chi tiết:</Text>
            <TouchableOpacity onPress={() => onPressJobDetail} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.linkText}>Tin tuyển dụng</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}></Text>
            <TouchableOpacity onPress={() => onPressApplicantDetail}>
              <Text style={styles.linkText}>{sSDT ? "Hồ sơ ứng viên" : "Hồ sơ doanh nghiêp"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => onEdit(sMaLichHenPhongVan)}>
              <Text style={styles.editText}>Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(sMaLichHenPhongVan)}>
              <Text style={styles.deleteText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginVertical: 5,
    padding: 15,
    borderColor: theme.template.biru,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.template.biru,
  },
  details: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    color: theme.template.biru,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: theme.template.biru,
    flex: 1,
    textAlign: 'right',
  },
  linkTextContainer: {
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderColor: '#ffcf30',
    borderWidth: 1,
    padding: 5,
  },
  linkText: {
    color: theme.template.biru,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  editText: {
    width: 100,
    textAlign: 'center',
    color: theme.template.text,
    fontWeight: 'bold',
    fontSize: 14,
    borderRadius: 5,
    backgroundColor: theme.template.edit,
    borderColor: theme.template.edit,
    borderWidth: 1,
    padding: 5,
  },
  deleteText: {
    width: 80,
    textAlign: 'center',
    backgroundColor: theme.template.delete,
    borderRadius: 5,
    borderColor: theme.template.delete,
    borderWidth: 1,
    color: theme.template.text,
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
  },
});

export default AppointmentCard;
