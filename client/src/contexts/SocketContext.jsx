import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { selectSocket } from "../store/slices/socketSlice";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { socket } = useSelector(selectSocket);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);
  if (socket === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
}
