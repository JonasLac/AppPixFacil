import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fca6b499f114444dac4f4b6003de5594',
  appName: 'pix-facil-go-47',
  webDir: 'dist',
  server: {
    url: 'https://fca6b499-f114-444d-ac4f-4b6003de5594.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#00D924'
    }
  }
};

export default config;