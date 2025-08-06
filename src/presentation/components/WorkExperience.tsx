import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

interface Experience {
  role: string;
  type: string;
  duration: string;
}

interface WorkExperienceCardProps {
  experiences: Experience[];
}

const { width } = Dimensions.get('window');

const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({ experiences }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Work Experiences</Text>
      {experiences.map((exp, index) => (
        <View key={index} style={styles.experienceContainer}>
          <View style={styles.timelineContainer}>
            {index === 0 ? (
              <Image source={require('../../../asset/images/work_experiences.png')} style={styles.icon} />
            ) : (
              <View style={styles.dot} />
            )}
            {index < experiences.length - 1 && <View style={styles.verticalLine} />}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.role}>{exp.role}</Text>
            <Text style={styles.detail}>{exp.type} • {exp.duration}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: width * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  experienceContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineContainer: {
    width: 40,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    marginBottom: 2,
    marginTop: 2,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#888',
    marginTop: 4,
  },
  textContainer: {
    flexShrink: 1,
    paddingLeft: 10,
  },
  role: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  detail: {
    fontSize: 14,
    color: '#777',
  },
});

export default WorkExperienceCard;
