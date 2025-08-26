import { io } from "socket.io-client";

let socket;

export const initSocket = (userId, onMessage, onConnect, onDisconnect, onError) => {
  if (!userId) return null;

  socket = io("https://influencerlink-446936445912.asia-south1.run.app", {
    transports: ["websocket"],
    query: { userId }
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    socket.emit("join", userId);
    onConnect && onConnect(socket);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
    onDisconnect && onDisconnect(reason);
  });

  socket.on("receive_message", (data) => {
    console.log("📩 Message received:", data);
    onMessage && onMessage(data);
  });

  socket.on("connect_error", (err) => {
    console.error("⚠️ Socket error:", err.message);
    onError && onError(err);
  });

  return socket;
};

export const sendMessageSocket = (message, callback) => {
  if (socket && socket.connected) {
    socket.emit("send_message", message, callback);
  } else {
    console.warn("⚠️ Socket not connected. Falling back.");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
