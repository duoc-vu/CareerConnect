import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SkillTags = ({ skills }: { skills: string; onEdit: () => void }) => {
    const skillArray = skills
    ? skills.replace(/\\n/g, "\n").split(/\r?\n/).map(skill => skill.trim()).filter(skill => skill !== "")
    : [];
    
    return (
        <View style={styles.container}>
            <View style={styles.tagContainer}>
            {skillArray.length > 0 ? (
            skillArray.map((skill, index) => (
                <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{skill}</Text>
                </View>
            ))
            ) : (
            <Text style={styles.noSkillText}>Chưa có kĩ năng</Text>
            )}
      </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#012A74",
    },
    editIcon: {
      width: 16,
      height: 16,
    },
    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
    },
    tag: {
      borderWidth: 1,
      borderColor: "#012A74",
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontSize: 14,
      color: "#012A74",
    },
    noSkillText: {
      fontSize: 14,
      color: "gray",
      fontStyle: "italic",
    },
  });
  

export default SkillTags;
