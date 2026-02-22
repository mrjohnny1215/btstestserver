import { useEffect, useState } from "react";

export function useTelegram() {
  const [isTelegram, setIsTelegram] = useState(false);
  const [tg, setTg] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram && telegram.initData) {
      setIsTelegram(true);
      setTg(telegram);

      // Initialize Telegram Web App
      telegram.ready();
      telegram.expand();
      
      // Set dark theme
      try {
        telegram.setHeaderColor("#000000");
        telegram.setBackgroundColor("#000000");
      } catch {
        // Older versions might not support this
      }
    }
  }, []);

  const haptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      tg?.HapticFeedback?.impactOccurred(type);
    } catch {
      // Haptic not available
    }
  };

  const hapticNotification = (type: 'success' | 'error' | 'warning' = 'success') => {
    try {
      tg?.HapticFeedback?.notificationOccurred(type);
    } catch {
      // Haptic not available
    }
  };

  return { isTelegram, tg, haptic, hapticNotification };
}
