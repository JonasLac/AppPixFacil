import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export const useBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const handleBackButton = () => {
      // Se estiver na página inicial, minimiza o app ao invés de fechar
      if (location.pathname === '/') {
        App.minimizeApp();
        return;
      }

      // Caso contrário, navega para a página anterior
      navigate(-1);
    };

    // Adiciona o listener para o botão voltar
    App.addListener('backButton', handleBackButton);

    // Cleanup: remove o listener quando o componente desmontar
    return () => {
      App.removeAllListeners();
    };
  }, [navigate, location.pathname]);
};