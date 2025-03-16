import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const DatePicker = ({ label, date, setDate }:any) => {
    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            mode: "date",
            display: "calendar",
            onChange: (event, selectedDate) => {
                if (selectedDate) {
                    setDate(selectedDate);
                }
            },
        });
    };

    return (
        <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
                <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    datePickerContainer: { marginBottom: 10 },
    dateInput: { padding: 10, borderWidth: 1, borderRadius: 5,  borderColor: "#BEBEBE", backgroundColor: "#EDEDED"},
});

export default DatePicker;
