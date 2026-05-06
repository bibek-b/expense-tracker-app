import NetInfo from "@react-native-community/netinfo";
import { useExpensesStore } from "./store/useExpensesStore";

/**
 * Starts background sync:
 * - Syncs once when the device becomes online
 * - Then syncs every `intervalMs` while online
 */
export function startAutoSync(intervalMs = 30_000) {
  let online = false;
  let timer: ReturnType<typeof setInterval> | null = null;

  const startTimer = () => {
    if (timer) return;
    timer = setInterval(() => {
      if (online) void useExpensesStore.getState().syncNow();
    }, intervalMs);
  };

  const stopTimer = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  const unsubscribe = NetInfo.addEventListener((state) => {
    const nowOnline = !!state.isConnected && (state.isInternetReachable ?? true);
    if (nowOnline && !online) {
      online = true;
      void useExpensesStore.getState().syncNow();
      startTimer();
    } else if (!nowOnline && online) {
      online = false;
      stopTimer();
    }
  });

  // Initial fetch to set correct state quickly
  void NetInfo.fetch().then((state) => {
    online = !!state.isConnected && (state.isInternetReachable ?? true);
    if (online) {
      void useExpensesStore.getState().syncNow();
      startTimer();
    }
  });

  return () => {
    stopTimer();
    unsubscribe();
  };
}

