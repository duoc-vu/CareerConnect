import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../../theme/themeContext";
import { TouchableOpacity } from "react-native";
import { theme } from "../../theme/theme";

interface JobCardProps {
  companyLogo: string;
  companyName: string;
  jobTitle: string;
  location: string,
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  onPress: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  companyLogo,
  companyName,
  jobTitle,
  location,
  salaryMin,
  salaryMax,
  jobType,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]} onPress={onPress}  activeOpacity={1}>
      {/* Header */}
      <View style={styles.header}>
      <Image
        source={
          typeof companyLogo === "string" && companyLogo.startsWith("http")
            ? { uri: companyLogo }
            : require('../../../asset/images/img_splash.png')
        }
        style={styles.logo}
      />
        <Text style={[styles.companyName, { color: theme.surface }]}>{companyName}</Text>
        <Text style={[styles.jobType, { color: theme.primary }]}>{jobType}</Text>
      </View>

      {/* Job Info */}
      <Text style={[styles.jobTitle, { color: theme.surface }]}>{jobTitle}</Text>
      <Text style={[styles.salary, { color: theme.surface }]}>
        {salaryMin.toLocaleString()} - {salaryMax.toLocaleString()}đ / tháng
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={[styles.tag, { backgroundColor: theme.primary }]}>
          <Text style={styles.tagText}>{location}</Text>
        </View>
          <Image source={require("../../../asset/images/bookmark_light.png")}></Image>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    backgroundColor: theme.colors.card.light,
    borderWidth: 1, 
    borderColor: "rgba(0, 0, 0, 0.1)", 
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, 
    minHeight: 150, 
    width: "90%", 
    alignSelf: "center", // ✅ Giúp card nằm giữa màn hình
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  companyName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  jobType: {
    fontSize: 14,
    fontWeight: "bold",
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 3,
  },
  salary: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  saveIcon: {
    fontSize: 16,
  },
});

export default JobCard;
