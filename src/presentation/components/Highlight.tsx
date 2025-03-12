import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

interface HighlightCardProps {
  logoUrl: string;
  title: string;
  description: string;
}

const { width } = Dimensions.get('window');

const HighlightCard: React.FC<HighlightCardProps> = ({ logoUrl, title, description }) => {
  return (
    <View style={styles.highlightCard}>
      <Text style={styles.highlightTitle}>Highlights</Text>
      <View style={styles.highlightContent}>
        <Image source={{ uri: logoUrl }} style={styles.highlightLogo} />
        <View style={styles.highlightTextContainer}>
          <Text style={styles.highlightText} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          <Text style={styles.highlightDescription} numberOfLines={2} ellipsizeMode="tail">{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  highlightCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  highlightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  highlightTextContainer: {
    flexShrink: 1,
  },
  highlightText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlightDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default HighlightCard;