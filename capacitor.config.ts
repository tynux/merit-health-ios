import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meritgame.ios',
  appName: '功德圆满',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    LocalNotifications: {},
    PushNotifications: {},
  },
};

export default config;
