const NOTIFICATIONS_KEY = 'bharat_sewa_notifications_v1';

function loadNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveNotifications(notifications) {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {}
}

export const notificationService = {
  getNotifications() {
    return loadNotifications();
  },

  addNotification(title, message, type = 'info', dedupeKey = null) {
    const list = loadNotifications();
    
    if (dedupeKey) {
      const existing = list.find((n) => n.dedupeKey === dedupeKey);
      if (existing) {
        return existing; // Prevent duplicate
      }
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      dedupeKey,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString()
    };

    list.unshift(newNotif);
    saveNotifications(list);
    return newNotif;
  },

  markTrackingNotificationRead(id) {
    const list = loadNotifications();
    const notif = list.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      saveNotifications(list);
    }
  },

  markAllApplicationNotificationsRead() {
    const list = loadNotifications();
    list.forEach((n) => { n.read = true; });
    saveNotifications(list);
  },
  
  getUnreadCount() {
    return loadNotifications().filter(n => !n.read).length;
  }
};
