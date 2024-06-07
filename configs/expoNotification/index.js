import { Expo } from 'expo-server-sdk';

let expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: true,
});

export const sendNotificationByExpo = async (token, title, content) => {
    expo.sendPushNotificationsAsync([
        {
            to: token,
            sound: 'default',
            title: title,
            body: content,
        }
    ]);
}