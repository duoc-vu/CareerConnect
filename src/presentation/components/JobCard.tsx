import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Fonts } from "../../theme/font";
import { theme } from "../../theme/theme";

interface JobCardProps {
  companyLogo: string;
  companyName: string;
  jobTitle: string;
  location: string;
  jobType: string;
  salaryMax: number;
  onPress: () => void;
  style?: any;
  sCoKhoa?: number;
}

const JobCard: React.FC<JobCardProps> = ({
  companyLogo,
  companyName,
  jobTitle,
  location,
  salaryMax,
  jobType,
  onPress,
  style,
  sCoKhoa,
}) => {
  const formatSalary = (max: number) => {
    return `Up to ${max.toLocaleString()} VND`;
  };

  const getStatusText = (sCoKhoa: number | undefined) => {
    switch (sCoKhoa) {
      case 1:
        return "Đã duyệt"; 
      case 2:
        return "Chờ duyệt"; 
      case 3:
        return "Từ chối"; 
      case 4:
        return "Hết hạn"; 
      default:
        return ""; 
    }
  };


  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {sCoKhoa ? (
        <Text style={styles.statusText}>{getStatusText(sCoKhoa)}</Text>
      ) : (
        <TouchableOpacity>
          <Image
            source={require("../../../asset/images/save_job.png")}
            style={styles.saveIcon}
          />
        </TouchableOpacity>
      )}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={
              typeof companyLogo === "string" && companyLogo.startsWith("http")
                ? { uri: companyLogo }
                : require("../../../asset/images/img_splash.png")
            }
            style={styles.logo}
          />
          <View>
            <Text style={styles.jobTitle} numberOfLines={1} ellipsizeMode="tail">{jobTitle}</Text>
            <Text style={styles.companyName} numberOfLines={1} ellipsizeMode="tail">{companyName}</Text>
          </View>
        </View>
        
      </View>
      <View style={styles.footer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{jobType}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{location}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{formatSalary(salaryMax)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    minHeight: 120,
    width: "100%",
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8, 
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 20,
    marginHorizontal: 8, 
    marginTop:-10
  },
  companyName: {
    fontSize: 12,
    ...Fonts.regular, 
    color: "#000000", 
    marginBottom: 12, 
  },
  jobTitle: {
    fontSize: 14,
    ...Fonts.semiBold, 
    color: "#000000",
    marginTop:8,
    width: 220,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tag: {
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#1F3C88", 
    backgroundColor: "#FFFFFF", 
    marginRight: 10, 
  },
  tagText: {
    fontSize: 12,
    ...Fonts.regular,
    color: "#1F3C88",
  },
  saveIcon: {
    position: "absolute",
    resizeMode: "contain",
    right:8,
    top: 1,
  },
  statusText: {
    position: "absolute",
    right: 10,
    top: 16,
    fontSize: 12,
    color: theme.template.biru,
    ...Fonts.medium,
  },
});

export default JobCard;