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

export default function TimelineScreen({ route, navigation }) {
  const { journeyId } = route.params;
  const { getJourney, getDayCount } = useApp();

  const journey = getJourney(journeyId);
  const substance = journey ? getSubstance(journey.substanceId) : null;
  const currentDay = journey ? getDayCount(journey) : 0;

  if (!journey || !substance) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Journey not found</Text>
      </SafeAreaView>
    );
  }

  const { timeline } = substance;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Recovery Timeline</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Current Status */}
        <View style={[styles.statusCard, { borderColor: substance.color }]}>
          <Text style={styles.statusIcon}>{substance.icon}</Text>
          <Text style={styles.statusLabel}>You are on</Text>
          <Text style={[styles.statusDay, { color: substance.color }]}>
            Day {currentDay}
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {timeline.map((milestone, index) => {
            const isPast = currentDay >= milestone.day;
            const isCurrent = currentDay === milestone.day;
            const isNext =
              currentDay < milestone.day &&
              (index === 0 || currentDay >= timeline[index - 1]?.day);

            return (
              <View key={milestone.day} style={styles.milestoneContainer}>
                {/* Line connecting milestones */}
                {index > 0 && (
                  <View
                    style={[
                      styles.connectorLine,
                      isPast && { backgroundColor: substance.color },
                    ]}
                  />
                )}

                {/* Milestone */}
                <View style={styles.milestone}>
                  {/* Day marker */}
                  <View
                    style={[
                      styles.dayMarker,
                      isPast && { backgroundColor: substance.color },
                      isCurrent && styles.currentMarker,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayMarkerText,
                        isPast && styles.dayMarkerTextComplete,
                      ]}
                    >
                      {isPast ? '✓' : milestone.day}
                    </Text>
                  </View>

                  {/* Content */}
                  <View
                    style={[
                      styles.milestoneContent,
                      isCurrent && styles.currentContent,
                      isNext && styles.nextContent,
                    ]}
                  >
                    <View style={styles.milestoneHeader}>
                      <Text
                        style={[
                          styles.milestoneTitle,
                          !isPast && !isCurrent && styles.futureText,
                        ]}
                      >
                        {milestone.title}
                      </Text>
                      {isCurrent && (
                        <View style={[styles.badge, { backgroundColor: substance.color }]}>
                          <Text style={styles.badgeText}>TODAY</Text>
                        </View>
                      )}
                      {isNext && (
                        <View style={styles.nextBadge}>
                          <Text style={styles.nextBadgeText}>NEXT</Text>
                        </View>
                      )}
                    </View>

                    {/* Show details for current and past milestones */}
                    {(isPast || isCurrent) && (
                      <View style={styles.milestoneDetails}>
                        <Text style={styles.detailLabel}>Physical</Text>
                        <Text style={styles.detailText}>{milestone.physical}</Text>

                        <Text style={styles.detailLabel}>Mental</Text>
                        <Text style={styles.detailText}>{milestone.mental}</Text>

                        <View style={styles.reframeBox}>
                          <Text style={styles.reframeLabel}>Key Insight</Text>
                          <Text style={styles.reframeText}>{milestone.reframe}</Text>
                        </View>
                      </View>
                    )}

                    {/* Preview for future milestones */}
                    {!isPast && !isCurrent && (
                      <Text style={styles.previewText}>
                        {milestone.day - currentDay} days away
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Encouragement */}
        <View style={styles.encouragement}>
          <Text style={styles.encouragementText}>
            Every day free is a victory.{'\n'}
            You're not giving up anything.{'\n'}
            You're gaining everything.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 32,
  },
  statusIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statusDay: {
    fontSize: 48,
    fontWeight: '700',
  },
  timeline: {
    marginLeft: 8,
  },
  milestoneContainer: {
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    left: 15,
    top: -20,
    width: 2,
    height: 20,
    backgroundColor: '#333333',
  },
  milestone: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dayMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  currentMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  dayMarkerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888888',
  },
  dayMarkerTextComplete: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  milestoneContent: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
  },
  currentContent: {
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#333333',
  },
  nextContent: {
    borderWidth: 1,
    borderColor: '#333333',
    borderStyle: 'dashed',
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  futureText: {
    color: '#666666',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#333333',
  },
  nextBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888888',
  },
  milestoneDetails: {
    marginTop: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  reframeBox: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  reframeLabel: {
    fontSize: 12,
    color: '#4ADE80',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  reframeText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 24,
    fontWeight: '500',
  },
  previewText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  encouragement: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    marginTop: 12,
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
