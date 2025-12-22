import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { getSubstance, getDayData, getNextMilestone } from '../data/substances';

export default function DailyScreen({ route, navigation }) {
  const { journeyId } = route.params;
  const { getJourney, getDayCount, deleteJourney } = useApp();
  const [expandedSection, setExpandedSection] = useState('reframe');

  const journey = getJourney(journeyId);
  const substance = journey ? getSubstance(journey.substanceId) : null;
  const dayCount = journey ? getDayCount(journey) : 0;
  const dayData = substance ? getDayData(substance.id, dayCount) : null;
  const nextMilestone = substance ? getNextMilestone(substance.id, dayCount) : null;

  if (!journey || !substance) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Journey not found</Text>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Journey',
      'Are you sure? This will delete all your progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteJourney(journeyId);
            navigation.replace('Home');
          },
        },
      ]
    );
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Day Counter */}
        <View style={[styles.dayCard, { borderColor: substance.color }]}>
          <Text style={styles.dayIcon}>{substance.icon}</Text>
          <Text style={styles.dayLabel}>{substance.name} Freedom</Text>
          <Text style={[styles.dayNumber, { color: substance.color }]}>
            Day {dayCount}
          </Text>
          {dayData && (
            <Text style={styles.dayTitle}>{dayData.title}</Text>
          )}
        </View>

        {/* Your Reason */}
        <View style={styles.reasonCard}>
          <Text style={styles.reasonLabel}>Your Reason</Text>
          <Text style={styles.reasonText}>"{journey.reason}"</Text>
        </View>

        {/* Today's Insight */}
        {dayData && (
          <View style={styles.insightSection}>
            <Text style={styles.insightHeader}>Today's Insight</Text>

            {/* Reframe - The Key Mindset Shift */}
            <TouchableOpacity
              style={[
                styles.insightCard,
                expandedSection === 'reframe' && styles.insightCardExpanded,
              ]}
              onPress={() => toggleSection('reframe')}
            >
              <View style={styles.insightCardHeader}>
                <Text style={styles.insightCardIcon}>💡</Text>
                <Text style={styles.insightCardTitle}>Reframe Your Thinking</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === 'reframe' ? '−' : '+'}
                </Text>
              </View>
              {expandedSection === 'reframe' && (
                <Text style={styles.insightCardContent}>{dayData.reframe}</Text>
              )}
            </TouchableOpacity>

            {/* Physical */}
            <TouchableOpacity
              style={[
                styles.insightCard,
                expandedSection === 'physical' && styles.insightCardExpanded,
              ]}
              onPress={() => toggleSection('physical')}
            >
              <View style={styles.insightCardHeader}>
                <Text style={styles.insightCardIcon}>🫀</Text>
                <Text style={styles.insightCardTitle}>What Your Body Is Doing</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === 'physical' ? '−' : '+'}
                </Text>
              </View>
              {expandedSection === 'physical' && (
                <Text style={styles.insightCardContent}>{dayData.physical}</Text>
              )}
            </TouchableOpacity>

            {/* Mental */}
            <TouchableOpacity
              style={[
                styles.insightCard,
                expandedSection === 'mental' && styles.insightCardExpanded,
              ]}
              onPress={() => toggleSection('mental')}
            >
              <View style={styles.insightCardHeader}>
                <Text style={styles.insightCardIcon}>🧠</Text>
                <Text style={styles.insightCardTitle}>What Your Mind Is Doing</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === 'mental' ? '−' : '+'}
                </Text>
              </View>
              {expandedSection === 'mental' && (
                <Text style={styles.insightCardContent}>{dayData.mental}</Text>
              )}
            </TouchableOpacity>

            {/* Daily Reminder */}
            <View style={[styles.reminderCard, { borderLeftColor: substance.color }]}>
              <Text style={styles.reminderLabel}>Remember</Text>
              <Text style={styles.reminderText}>{dayData.reminder}</Text>
            </View>
          </View>
        )}

        {/* Next Milestone */}
        {nextMilestone && (
          <View style={styles.nextMilestone}>
            <Text style={styles.nextMilestoneLabel}>Next Milestone</Text>
            <Text style={styles.nextMilestoneTitle}>
              Day {nextMilestone.day}: {nextMilestone.title.split(': ')[1]}
            </Text>
            <Text style={styles.nextMilestoneDistance}>
              {nextMilestone.day - dayCount} days away
            </Text>
          </View>
        )}

        {/* Timeline Button */}
        <TouchableOpacity
          style={styles.timelineButton}
          onPress={() => navigation.navigate('Timeline', { journeyId })}
        >
          <Text style={styles.timelineButtonText}>View Full Timeline →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: '#888888',
  },
  deleteText: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  dayCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 20,
  },
  dayIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 14,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  dayNumber: {
    fontSize: 64,
    fontWeight: '700',
  },
  dayTitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
    textAlign: 'center',
  },
  reasonCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  reasonLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  insightSection: {
    marginBottom: 24,
  },
  insightHeader: {
    fontSize: 14,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  insightCardExpanded: {
    backgroundColor: '#222222',
  },
  insightCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  expandIcon: {
    fontSize: 24,
    color: '#666666',
  },
  insightCardContent: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 26,
    marginTop: 16,
  },
  reminderCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    marginTop: 8,
  },
  reminderLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 28,
    fontWeight: '500',
  },
  nextMilestone: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  nextMilestoneLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  nextMilestoneTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  nextMilestoneDistance: {
    fontSize: 14,
    color: '#4ADE80',
  },
  timelineButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  timelineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
