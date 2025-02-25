import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '../../theme/themeContext';

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình

interface JobCardProps {
  company: string;
  jobTitle: string;
  salary: string;
  jobType: string;
  logo: any;
  workType: string;
}

const JobCard: React.FC<JobCardProps> = ({ company, jobTitle, salary, jobType, logo, workType }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.bG, borderColor: theme.primary }]}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={[styles.company, { color: theme.primary }]}>{company}</Text>
        <Text style={[styles.jobType, { color: theme.surface }]}>{jobType}</Text>
      </View>
      <Text style={[styles.jobTitle, { color: theme.surface }]}>{jobTitle}</Text>
      <Text style={[styles.salary, { color: theme.surface }]}>{salary}</Text>
      <View style={styles.footer}>
        <Text style={[styles.workType, { backgroundColor: theme.onPrimary, color: theme.surface }]}>
          {workType}
        </Text>
        <Image source={require('../../../asset/images/img_bookmark.png')} style={styles.bookmark} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9, // Chiếm 90% chiều rộng màn hình
    padding: width * 0.04,
    borderRadius: width * 0.05,
    borderWidth: 1.5,
    marginVertical: width * 0.03,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.1, // 10% chiều rộng màn hình
    height: width * 0.1,
    resizeMode: 'contain',
    marginRight: width * 0.03,
  },
  company: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    flex: 1,
  },
  jobType: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  jobTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: width * 0.02,
  },
  salary: {
    fontSize: width * 0.04,
    marginTop: width * 0.01,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: width * 0.03,
  },
  workType: {
    paddingVertical: width * 0.01,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.02,
    fontSize: width * 0.035,
  },
  bookmark: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },
});

export default JobCard;
