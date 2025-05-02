import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import HeaderWithIcons from '../../components/Header';

const PolicyPreview = ({ route, navigation }: any) => {
  const { url } = route.params; 

  return (
    <View style={styles.container}>
      <HeaderWithIcons
        title="Xem Chính Sách"
        onBackPress={() => navigation.goBack()} 
      />
      <Pdf
        source={{ uri: url, cache: true }} 
        trustAllCerts={false}
        style={styles.pdf}
        onError={(error) => {
          console.error('Lỗi khi tải PDF:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PolicyPreview;