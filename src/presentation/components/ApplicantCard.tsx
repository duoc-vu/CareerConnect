import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ApplicantCard = ({
  applicantId,
  applicantCode, 
  applicationDate, 
  status,
  cvUrl, 
  onViewCV, 
  onAccept, 
  onReject, 
}:any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusStyle = (status:any) => {
    switch (status) {
      case 'Chờ duyệt':
        return { dotColor: '#F59E0B', textColor: '#F59E0B' }; 
      case 'Đã duyệt':
        return { dotColor: '#22C55E', textColor: '#22C55E' };
      case 'Từ chối':
        return { dotColor: '#EF4444', textColor: '#EF4444' }; 
      default:
        return { dotColor: '#6B7280', textColor: '#6B7280' };
    }
  };

  const statusStyle = getStatusStyle(status);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand}>
        <Text style={styles.applicantName}>Đơn ứng tuyển {applicantCode}</Text>
        <Icon
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#6B7280"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Ngày ứng tuyển</Text>
            <Text style={styles.value}>{applicationDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Trạng thái</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: statusStyle.dotColor }]} />
              <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
                {status}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>File CV</Text>
            <TouchableOpacity onPress={() => onViewCV(cvUrl)}>
              <Image
                source={require('../../../asset/images/view.png')} 
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => onAccept(applicantId)}
                disabled={status !== 'Chờ duyệt'}
              >
                <Image
                  source={require('../../../asset/images/accept.png')}
                  style={[
                    styles.actionImage,
                    status !== 'Chờ duyệt' && styles.disabledImage,
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onReject(applicantId)}
                disabled={status !== 'Chờ duyệt'}
                style={styles.actionIcon}
              >
                <Image
                  source={require('../../../asset/images/rejected.png')} 
                  style={[
                    styles.actionImage,
                    status !== 'Chờ duyệt' && styles.disabledImage,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    alignContent:"center",
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: "auto",
  },
  actionIcon: {
    marginLeft: 15,
  },
  actionImage: {
    width: 40,
    height: 40,
  },
  disabledImage: {
    opacity: 0.3, // Làm mờ ảnh khi disabled
  },
});

export default ApplicantCard;