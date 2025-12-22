import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { getDayData } from '../data/substances';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permission for notifications
export async function requestNotificationPermission() {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// Schedule morning notification for a journey
export async function scheduleMorningNotification(journey) {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;

  // Cancel any existing notifications for this journey
  await cancelNotificationsForJourney(journey.id);

  // Schedule for 8 AM local time every day
  const trigger = {
    hour: 8,
    minute: 0,
    repeats: true,
  };

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌅 Good morning, warrior",
      body: "Your daily insight is ready. You're doing great.",
      data: { journeyId: journey.id },
    },
    trigger,
  });

  return notificationId;
}

// Cancel notifications for a journey
export async function cancelNotificationsForJourney(journeyId) {
  const allNotifications = await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of allNotifications) {
    if (notification.content.data?.journeyId === journeyId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

// Cancel all notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get a motivational message for the day
export function getMorningMessage(substanceId, dayNumber) {
  const dayData = getDayData(substanceId, dayNumber);

  if (!dayData) {
    return {
      title: `Day ${dayNumber}`,
      body: "You're still free. That's what matters.",
    };
  }

  return {
    title: dayData.title,
    body: dayData.reminder,
  };
}
