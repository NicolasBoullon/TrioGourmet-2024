import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.triogourmet.app',
  appName: 'Trio Gourmet',
  webDir: 'www',
  "plugins": {
    SplashScreen: {
      launchAutoHide: false,  
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    }
  }
};

export default config;
