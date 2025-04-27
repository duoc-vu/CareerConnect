import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import HeaderWithIcons from '../../components/Header';

const LicensePreview = ({ route, navigation }: any) => {
  const { licenseUrl } = route.params;
  console.log('URL của file PDF:', licenseUrl);
  return (
    <View style={styles.container}>
      <HeaderWithIcons
        title="Xem Giấy Phép"
        onBackPress={() => navigation.goBack()} 
      />
      <Image
        source={{ uri: licenseUrl }}
        style={styles.image}
        resizeMode="contain" 
        onError={(error) => {
          console.error('Lỗi khi tải ảnh:', error);
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
  image: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default LicensePreview;