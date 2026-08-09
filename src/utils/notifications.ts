import type { BookingRequest } from '../types/booking';

// Live delivery without a backend: BroadcastChannel pushes messages
// instantly to every open tab/window of this app on the same browser and
// origin — e.g. a Customer tab booking a service and a Labour tab open at
// the same time. It does NOT reach other devices or a real backend/push
// service; wiring that up requires a server (WebSocket/FCM) once one exists.
const CHANNEL_NAME = 'rozgarmitra-booking-requests';

type BookingRequestListener = (request: BookingRequest) => void;

const openChannel = (): BroadcastChannel | null =>
    typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null;

export const publishBookingRequest = (request: BookingRequest): void => {
    const channel = openChannel();
    channel?.postMessage(request);
    channel?.close();
};

export const subscribeToBookingRequests = (listener: BookingRequestListener): (() => void) => {
    const channel = openChannel();
    if (!channel) return () => {};

    const handleMessage = (event: MessageEvent<BookingRequest>) => listener(event.data);
    channel.addEventListener('message', handleMessage);

    return () => {
        channel.removeEventListener('message', handleMessage);
        channel.close();
    };
};

export const requestNotificationPermission = (): void => {
    if ('Notification' in window && Notification.permission === 'default') {
        void Notification.requestPermission();
    }
};

export const notifyNativeIfPermitted = (title: string, body: string): void => {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
    }
};
