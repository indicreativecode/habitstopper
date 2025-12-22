import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { substances } from '../data/substances';

export default function SelectSubstanceScreen({ navigation }) {
  const { startJourney } = useApp();
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(1);

  const substanceList = Object.values(substances);

  const handleSelectSubstance = (substance) => {
    setSelectedSubstance(substance);
    setStep(2);
  };

  const handleStart = () => {
    if (!selectedSubstance || !reason.trim()) return;

    const journey = startJourney(selectedSubstance.id, reason.trim());
    navigation.replace('Onboarding', { journeyId: journey.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step === 2) {
              setStep(1);
              setSelectedSubstance(null);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {step === 1 && (
          <>
            <Text style={styles.title}>What do you want{'\n'}to be free from?</Text>
            <Text style={styles.subtitle}>
              Choose the substance. We'll help you understand the trap and escape it.
            </Text>

            <View style={styles.options}>
              {substanceList.map((substance) => (
                <TouchableOpacity
                  key={substance.id}
                  style={[
                    styles.optionCard,
                    { borderColor: substance.color },
                  ]}
                  onPress={() => handleSelectSubstance(substance)}
                >
                  <Text style={styles.optionIcon}>{substance.icon}</Text>
                  <Text style={styles.optionName}>{substance.name}</Text>
                </TouchableOpacity>
              ))}

              {/* Coming Soon */}
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonText}>
                  More coming soon: Nicotine, Cannabis, Gambling, Sugar...
                </Text>
              </View>
            </View>
          </>
        )}

        {step === 2 && selectedSubstance && (
          <>
            <Text style={styles.title}>
              Why do you want{'\n'}to quit {selectedSubstance.name.toLowerCase()}?
            </Text>
            <Text style={styles.subtitle}>
              Write your personal reason. You'll see this when you need a reminder.
            </Text>

            <TextInput
              style={styles.reasonInput}
              placeholder="I want to quit because..."
              placeholderTextColor="#666666"
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
              textAlignVertical="top"
            />

            <Text style={styles.hint}>
              Be specific. "I want to be present for my kids" is more powerful than "I want to be healthier."
            </Text>

            <TouchableOpacity
              style={[
                styles.startButton,
                { backgroundColor: selectedSubstance.color },
                !reason.trim() && styles.startButtonDisabled,
              ]}
              onPress={handleStart}
              disabled={!reason.trim()}
            >
              <Text style={styles.startButtonText}>Begin My Freedom</Text>
            </TouchableOpacity>
          </>
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
  backButton: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: '#888888',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 32,
    lineHeight: 24,
  },
  options: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 16,
  },
  optionIcon: {
    fontSize: 40,
    marginRight: 20,
  },
  optionName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  comingSoon: {
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
  },
  reasonInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 120,
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 32,
    lineHeight: 20,
  },
  startButton: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
