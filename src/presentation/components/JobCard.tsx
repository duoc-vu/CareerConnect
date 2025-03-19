import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../../context/themeContext";
import { TouchableOpacity } from "react-native";
import { theme } from "../../theme/theme";

interface JobCardProps {
  companyLogo: string;
  companyName: string;
  jobTitle: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  deadline?: string;
  onPress: () => void;
  style?: any;
}

const JobCard: React.FC<JobCardProps> = ({
  companyLogo,
  companyName,
  jobTitle,
  location,
  salaryMin,
  salaryMax,
  jobType,
  deadline,
  onPress,
  style
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.card}, style]} onPress={onPress}  activeOpacity={1}>
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

      <Text style={[styles.jobTitle, { color: theme.surface }]}>{jobTitle}</Text>

      <View style={styles.footer}>
        <View>
          <Text style={[styles.salary, { color: theme.surface }]}>
            {salaryMin.toLocaleString()} - {salaryMax.toLocaleString()}đ / tháng
          </Text>
          {deadline && (
            <Text style={[styles.deadline, { color: theme.surface }]}>Hạn nộp: {deadline}</Text>
          )}
        </View>
        <View style={[styles.tag, { backgroundColor: 'rgba(195, 216, 244, 0.4)' }]}>
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
    borderColor: "#A2CEF4", 
    minHeight: 150, 
    alignSelf: "center", 
    width: "90%"
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
    marginVertical: 10,
  },
  salary: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  deadline: {
    fontSize: 13,
    color: theme.colors.text.primary,
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  tag: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    color: theme.colors.primary.light,
    fontSize: 12,
    fontWeight: "bold",
  },
  saveIcon: {
    fontSize: 16,
  },
});

export default JobCard;
