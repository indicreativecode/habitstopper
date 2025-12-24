import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SelectSubstanceScreen from './src/screens/SelectSubstanceScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DailyScreen from './src/screens/DailyScreen';
import TimelineScreen from './src/screens/TimelineScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SelectSubstance" component={SelectSubstanceScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Daily" component={DailyScreen} />
          <Stack.Screen name="Timeline" component={TimelineScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
