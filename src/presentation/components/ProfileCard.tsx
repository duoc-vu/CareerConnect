import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface ProfileCardProps {
  avatar?: string | null;
  name?: string | null;
  email?: string | null;
  location?: string | null;
  isGuest?: boolean;
  onPress?: () => void;
  style?: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ avatar, name, email, location, onPress, style, isGuest }) => {
  const navigation: any = useNavigation();
  const avatarSource =
    avatar && avatar.startsWith("http")
      ? { uri: avatar }
      : require("../../../asset/images/default_avt.png");

  return isGuest ? (
    <View>
      <View style={[{
        width: "100%",
        height: 175,
        borderRadius: 12,
        backgroundColor: "#012A74",
        padding: 16, flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
      }]} >
        <View style={styles.avatarContainer}>
          <Image source={avatarSource} style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 1,
            borderColor: "white",
          }} />
        </View>
        <View style={{ width: "60%", flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity style={{
            backgroundColor: "white",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }} onPress={() => { navigation.navigate('login') }}>
            <Text style={styles.editButtonText}>{"Đăng nhập"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#FFF"
          }} onPress={() => { navigation.navigate('login') }}>
            <Text style={{ color: "#FFF" }}>{"Đăng ký"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
    : (
      <View style={[styles.card, style]} >
        {onPress && (
          <Image source={require("../../../asset/images/img_setting.png")} style={styles.settingIcon} />
        )}
        <View style={styles.avatarContainer}>
          <Image source={avatarSource} style={styles.avatar} />
        </View>

        {name && <Text style={styles.name}>{name}</Text>}

        <View style={styles.detailsContainer}>
          {email && (
            <View style={styles.detailItem}>
              <Image source={require("../../../asset/images/img_email.png")} />
              <Text style={styles.detailText}>{email}</Text>
            </View>
          )}
          {location && (
            <View style={[styles.detailItem, { marginLeft: 12 }]}>
              <Image source={require("../../../asset/images/img_location.png")} />
              <Text style={styles.detailText}>{location}</Text>
            </View>
          )}
        </View>
        {onPress && (
          <TouchableOpacity style={styles.editButton} onPress={onPress}>
            <Text style={styles.editButtonText}>{isGuest ? "Login" : "Edit profile"}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  card: {
    width: 397,
    height: 175,
    borderRadius: 12,
    backgroundColor: "#012A74",
    padding: 16,
    alignItems: "flex-start",
  },
  settingIcon: {
    position: "absolute",
    right: 20,
    top: 10,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "white",
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    justifyContent: "flex-start",
    width: "100%",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    color: "white",
    marginLeft: 6,
    fontSize: 13,
  },
  editButton: {
    position: "absolute",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    right: 10,
    bottom: 10,
  },
  editButtonText: {
    fontSize: 13,
    color: "black",
    fontWeight: "bold",
  },
});

export default ProfileCard;
