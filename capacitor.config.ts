import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.triogourmet.app',
  appName: 'trio-gourmet-spatola-boullon-videla',
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
