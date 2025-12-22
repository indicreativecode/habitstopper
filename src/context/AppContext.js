import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const STORAGE_KEY = 'habit_stopper_data';

export function AppProvider({ children }) {
  const [journeys, setJourneys] = useState([]); // Array of active quit journeys
  const [loading, setLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever journeys change
  useEffect(() => {
    if (!loading) {
      saveData();
    }
  }, [journeys, loading]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setJourneys(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(journeys));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Start a new quit journey
  const startJourney = (substanceId, reason) => {
    const newJourney = {
      id: Date.now().toString(),
      substanceId,
      reason, // Why they're quitting - their personal reason
      startDate: new Date().toISOString(),
      hasReadIntro: false,
      lastCheckIn: null,
    };

    setJourneys((prev) => [...prev, newJourney]);
    return newJourney;
  };

  // Mark introduction as read
  const markIntroRead = (journeyId) => {
    setJourneys((prev) =>
      prev.map((j) =>
        j.id === journeyId ? { ...j, hasReadIntro: true } : j
      )
    );
  };

  // Record daily check-in
  const recordCheckIn = (journeyId) => {
    setJourneys((prev) =>
      prev.map((j) =>
        j.id === journeyId
          ? { ...j, lastCheckIn: new Date().toISOString() }
          : j
      )
    );
  };

  // Calculate days since starting journey
  const getDayCount = (journey) => {
    const start = new Date(journey.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Day 1 is the first day
  };

  // Delete a journey
  const deleteJourney = (journeyId) => {
    setJourneys((prev) => prev.filter((j) => j.id !== journeyId));
  };

  // Get journey by ID
  const getJourney = (journeyId) => {
    return journeys.find((j) => j.id === journeyId);
  };

  const value = {
    journeys,
    loading,
    startJourney,
    markIntroRead,
    recordCheckIn,
    getDayCount,
    deleteJourney,
    getJourney,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
