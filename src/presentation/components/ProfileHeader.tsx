import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, StyleProp, TextStyle} from 'react-native';

interface ProfileHeaderProps {
  avatarUrl: string;
  name: string;
  position?: string;
  university?: string;
  location?: string;
  style?: StyleProp<TextStyle>;
}

const { width } = Dimensions.get('window');

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  name,
  position,
  university,
  location,
  style
}) => {
  return (
    <View style={[styles.cardWrapper, style]}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>
        <Text style={[styles.name, { marginTop: 60 }]}>{name}</Text>
        <Text style={styles.text}>{position}</Text>
        <Text style={styles.text}>{university}</Text>
        <Text style={styles.text}>{location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'absolute',
    top: -50,
    zIndex: 10,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 25,
    width: width * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingTop: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default ProfileHeader;
