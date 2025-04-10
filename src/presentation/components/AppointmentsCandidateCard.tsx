import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme/theme';

const AppointmentCardCandidate = ({
    sMaLichHenPhongVan,
    sMaTinTuyenDung,
    sThoiGianPhongVan,
    sTieuDe,
    sDiaDiem,
    sLoiNhan,
    sSDT,
    sEmail,
    sTrangThai,
    onPressJobDetail,
    onPressCompanyDetail,
    onAccept,
    onDecline,
}: any) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDateTime = (isoString: string) => {
        if (!isoString) return "Không có thông tin";

        try {
            const date = new Date(isoString);

            if (isNaN(date.getTime())) {
                return "Không có thông tin";
            }

            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZoneName: 'short'
            };

            return date.toLocaleString('en-US', options);
        } catch (error) {
            console.error("Lỗi khi định dạng ngày giờ:", error);
            return "Không có thông tin";
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const renderStatus = () => {
        if (!sTrangThai) return null;

        let statusText = "";
        let statusStyle = {};

        switch (sTrangThai) {
            case 1: // Chờ phản hồi
                statusText = "Chờ phản hồi";
                statusStyle = { color: '#FFA500' };
                break;
            case 2: // Đã chấp nhận
                statusText = "Đã chấp nhận";
                statusStyle = { color: '#008000' };
                break;
            case 3: // Đã từ chối
                statusText = "Đã từ chối";
                statusStyle = { color: '#FF0000' };
                break;
            default:
                statusText = "Chờ phản hồi";
                statusStyle = { color: '#FFA500' };
        }

        return (
            <View style={styles.detailRow}>
                <Text style={styles.label}>Trạng thái:</Text>
                <Text style={[styles.value, statusStyle]}>{statusText}</Text>
            </View>
        );
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.header} onPress={toggleExpand}>
                <Text style={styles.applicantName}>Lịch hẹn phỏng vấn: {sTieuDe}</Text>
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
                    {sSDT && (
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Số điện thoại:</Text>
                            <Text style={styles.value}>{sSDT}</Text>
                        </View>
                    )}
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Email liên hệ:</Text>
                        <Text style={styles.value}>{sEmail}</Text>
                    </View>

                    {renderStatus()}

                    <View style={styles.actionRow}>
                        {onPressJobDetail && (
                            <TouchableOpacity style={styles.actionButton} onPress={onPressJobDetail}>
                                <Text style={styles.actionButtonText}>Xem tin tuyển dụng</Text>
                            </TouchableOpacity>
                        )}

                        {onPressCompanyDetail && (
                            <TouchableOpacity style={styles.actionButton} onPress={onPressCompanyDetail}>
                                <Text style={styles.actionButtonText}>Xem công ty</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {(!sTrangThai || sTrangThai === 1) && (
                        <View style={styles.responseRow}>
                            <TouchableOpacity
                                style={[styles.responseButton, styles.acceptButton]}
                                onPress={() => onAccept && onAccept(sMaLichHenPhongVan)}
                            >
                                <Text style={styles.responseButtonText}>Chấp nhận</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.responseButton, styles.declineButton]}
                                onPress={() => onDecline && onDecline(sMaLichHenPhongVan)}
                            >
                                <Text style={styles.responseButtonText}>Từ chối</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
        backgroundColor: '#fff',
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
        color: theme.template.biru,
        flex: 1,
    },
    details: {
        marginTop: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 5,
    },
    label: {
        fontSize: 14,
        color: theme.template.biru,
        flex: 1,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: theme.template.biru,
        flex: 1,
        textAlign: 'right',
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
    actionButton: {
        backgroundColor: theme.template.biru,
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 5,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    responseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 10,
    },
    responseButton: {
        backgroundColor: theme.template.biru,
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 5,
        flex: 1,
    },
    responseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    acceptButton: {
        backgroundColor: '#008000',
    },
    declineButton: {
        backgroundColor: '#FF0000',
    },
});

export default AppointmentCardCandidate;