import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { getSubstance } from '../data/substances';

export default function HomeScreen({ navigation }) {
  const { journeys, getDayCount } = useApp();

  const activeJourneys = journeys.filter((j) => j.hasReadIntro);
  const pendingJourneys = journeys.filter((j) => !j.hasReadIntro);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Habit Stopper</Text>
          <Text style={styles.subtitle}>Your path to freedom</Text>
        </View>

        {/* Active Journeys */}
        {activeJourneys.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Journeys</Text>
            {activeJourneys.map((journey) => {
              const substance = getSubstance(journey.substanceId);
              const dayCount = getDayCount(journey);

              return (
                <TouchableOpacity
                  key={journey.id}
                  style={[
                    styles.journeyCard,
                    { borderLeftColor: substance.color },
                  ]}
                  onPress={() =>
                    navigation.navigate('Daily', { journeyId: journey.id })
                  }
                >
                  <View style={styles.journeyHeader}>
                    <Text style={styles.journeyIcon}>{substance.icon}</Text>
                    <View style={styles.journeyInfo}>
                      <Text style={styles.journeyName}>
                        {substance.name} Freedom
                      </Text>
                      <Text style={styles.journeyDays}>
                        Day {dayCount}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.journeyHint}>
                    Tap for today's insight →
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Pending Introductions */}
        {pendingJourneys.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Setup</Text>
            {pendingJourneys.map((journey) => {
              const substance = getSubstance(journey.substanceId);

              return (
                <TouchableOpacity
                  key={journey.id}
                  style={[styles.pendingCard]}
                  onPress={() =>
                    navigation.navigate('Onboarding', { journeyId: journey.id })
                  }
                >
                  <Text style={styles.pendingIcon}>{substance.icon}</Text>
                  <Text style={styles.pendingText}>
                    Read the {substance.name} freedom guide
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Start New Journey */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('SelectSubstance')}
        >
          <Text style={styles.addButtonText}>+ Start a New Journey</Text>
        </TouchableOpacity>

        {/* Empty State */}
        {journeys.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔓</Text>
            <Text style={styles.emptyTitle}>Ready to be free?</Text>
            <Text style={styles.emptyText}>
              This isn't about willpower.{'\n'}
              It's about understanding the trap{'\n'}
              and walking out of it.
            </Text>
          </View>
        )}
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
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  journeyCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  journeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  journeyIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  journeyInfo: {
    flex: 1,
  },
  journeyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  journeyDays: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4ADE80',
    marginTop: 4,
  },
  journeyHint: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  pendingCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  pendingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  pendingText: {
    fontSize: 16,
    color: '#888888',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
  },
});
