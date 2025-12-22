import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { getSubstance } from '../data/substances';
import { scheduleMorningNotification } from '../utils/notifications';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ route, navigation }) {
  const { journeyId } = route.params;
  const { getJourney, markIntroRead } = useApp();
  const [currentSection, setCurrentSection] = useState(0);
  const scrollRef = useRef(null);

  const journey = getJourney(journeyId);
  const substance = journey ? getSubstance(journey.substanceId) : null;

  if (!journey || !substance) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Journey not found</Text>
      </SafeAreaView>
    );
  }

  const { introduction } = substance;
  const sections = introduction.sections;
  const isLastSection = currentSection === sections.length - 1;

  const handleNext = async () => {
    if (isLastSection) {
      // Mark as read and set up notifications
      markIntroRead(journeyId);
      await scheduleMorningNotification(journey);
      navigation.replace('Daily', { journeyId });
    } else {
      setCurrentSection(currentSection + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const section = sections[currentSection];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {sections.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentSection && {
                  backgroundColor: substance.color,
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.headerTitle}>{introduction.title}</Text>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionContent}>{section.content}</Text>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.footer}>
        {currentSection > 0 ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: substance.color }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastSection ? "I'm Ready →" : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333333',
  },
  headerTitle: {
    fontSize: 14,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    lineHeight: 36,
  },
  sectionContent: {
    fontSize: 18,
    color: '#CCCCCC',
    lineHeight: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  backButton: {
    padding: 16,
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 16,
    color: '#888888',
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
