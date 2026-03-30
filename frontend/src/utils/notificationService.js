// src/utils/notificationService.js
export const addNotification = (type, title, message, action = null, metadata = {}) => {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  
  const newNotification = {
    id: Date.now(),
    type: type,
    title: title,
    message: message,
    time: "Just now",
    read: false,
    action: action,
    metadata: metadata,
    createdAt: new Date().toISOString()
  };
  
  notifications.unshift(newNotification);
  const updatedNotifications = notifications.slice(0, 50);
  localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  
  window.dispatchEvent(new Event("storage"));
  
  return newNotification;
};