import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './src/context/AppContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SelectSubstanceScreen from './src/screens/SelectSubstanceScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DailyScreen from './src/screens/DailyScreen';
import TimelineScreen from './src/screens/TimelineScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0F0F0F' },
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
