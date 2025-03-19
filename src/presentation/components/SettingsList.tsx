import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, TextStyle, StyleProp } from 'react-native';
import { theme } from '../../theme/theme';
import { Fonts } from '../../theme/font';

const { width } = Dimensions.get('window');

// Đường dẫn đến ảnh mặc định
const defaultIcon = require('../../../asset/images/right-arrow.png'); 

interface SettingItem {
  id: string;
  title: string;
  icon?: string;
  description?: string;
  onPress: () => void;
}

interface SettingsListProps {
  data: SettingItem[];
  style?: StyleProp<TextStyle>;
}

const SettingsList: React.FC<SettingsListProps> = ({ data ,style}) => {
  return (
    <View style={[styles.listContainer, style]}>
      {data.map((item) => (
        <View key={item.id} style={styles.section}>
          <TouchableOpacity style={styles.item} onPress={item.onPress}>
            <Text style={[styles.itemText, Fonts.medium]}>{item.title}</Text>
            {item.icon ? (
              typeof item.icon === 'string' && item.icon.includes('http') ? (
                <Image source={{ uri: item.icon }} style={styles.icon} />
              ) : (
                <Image source={item.icon} style={styles.icon} />
              )
            ) : null}
          </TouchableOpacity>
          {item.description && <Text style={styles.description}>{item.description}</Text>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.primary.light,
  },
  itemText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 5,
  },
});

export default SettingsList;
