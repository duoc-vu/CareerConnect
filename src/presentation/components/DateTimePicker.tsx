import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';

interface DateTimePickerProps {
  label?: string;
  date: Date;
  setDate: (date: Date) => void;
  style?: any;
  showSeconds?: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  date,
  setDate,
  style,
  showSeconds = false
}) => {
  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: "date",
      display: "calendar",
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setDate(selectedDate);
          showTimePicker(selectedDate);
        }
      },
    });
  };

  const showTimePicker = (selectedDate: Date) => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: "time",
      is24Hour: false,
      display: "clock",
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          setDate(selectedTime);
        }
      },
    });
  };

  const formatDateTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: showSeconds ? 'numeric' : undefined,
      hour12: true,
      timeZoneName: 'short'
    };

    return date.toLocaleString('en-US', options);
  };

  const dateToFirestoreTimestamp = (date: Date) => {
    return firestore.Timestamp.fromDate(date);
  };

  const firestoreTimestampToDate = (timestamp: any) => {
    if (timestamp instanceof firestore.Timestamp) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  };

  return (
    <View style={[styles.datePickerContainer, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
        <Text>{formatDateTime(date)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    marginBottom: 10
  },
  label: {
    marginBottom: 5,
    fontWeight: "500"
  },
  dateInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#BEBEBE",
    backgroundColor: "#EDEDED"
  },
});

export default DateTimePicker;

export const dateToFirestoreTimestamp = (date: Date) => {
  return firestore.Timestamp.fromDate(date);
};

export const firestoreTimestampToDate = (timestamp: any) => {
  if (timestamp instanceof firestore.Timestamp) {
    return timestamp.toDate();
  } else if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
  }
  return new Date(timestamp);
};
