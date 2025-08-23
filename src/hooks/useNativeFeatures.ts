import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { toast } from '@/hooks/use-toast';

export const useNativeFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    setPlatform(Capacitor.getPlatform());
  }, []);

  const showNativeToast = (message: string) => {
    if (isNative) {
      // Em um app nativo, poderia usar plugins nativos para toast
      toast({
        title: "Notificação Nativa",
        description: message,
      });
    } else {
      toast({
        title: "Modo Web",
        description: message,
      });
    }
  };

  const getDeviceInfo = () => {
    return {
      platform,
      isNative,
      userAgent: navigator.userAgent,
      language: navigator.language,
    };
  };

  return {
    isNative,
    platform,
    showNativeToast,
    getDeviceInfo,
  };
};