import { io } from "socket.io-client";

const resolveSocketUrl = () => {
  return (
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_BACK_END_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  );
};

export const socket = io(resolveSocketUrl(), {
  withCredentials: true,
});

export default socket;

