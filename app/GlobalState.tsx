import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

import {
  PROFILE_PORTFORLIO_BACKEND_GET_INFO,
  SOCKET_NEWS_ROOM,
  BACKEND_WS_SERVER_URL,
} from "@/lib/constants/backend";

// Define the shape of the global state
interface GlobalState {
  value: number;
  userPortfolio: any;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  fetchUserPortfolio: (address?: string) => Promise<void>;
}

// Define the type for the socket instance
interface ISocketContext {
  socket: Socket | null;
}

// Create the context with a default value (can be undefined initially)
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

// Create the Socket context
const SocketContext = createContext<ISocketContext>({ socket: null });

// Define a provider component
interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}) => {
  const [value, setValue] = useState<number>(0); // State managed here
  const [userPortfolio, setUserPortfolio] = useState({
    createdTokens: [],
    holds: [],
    profile: { handle: "" },
    trades: [],
  });

  const fetchUserPortfolio = useCallback(async (address?: string) => {
    if (!address) {
      setUserPortfolio({
        createdTokens: [],
        holds: [],
        profile: { handle: "" },
        trades: [],
      });

      return;
    }

    const res = await axios.get(
      `${PROFILE_PORTFORLIO_BACKEND_GET_INFO}/${address}`
    );

    if (res.status == 200) {
      setUserPortfolio((prev) => {
        return { ...prev, ...res.data };
      });
    }
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{ value, userPortfolio, setValue, fetchUserPortfolio }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to consume the global state
export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);

  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  return context;
};

// Create a provider to manage the socket connection
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(BACKEND_WS_SERVER_URL, {
      transports: ["websocket", "polling"],
    });
    newSocket.emit("joinRoom", { room: SOCKET_NEWS_ROOM });

    setSocket(newSocket);

    return () => {
      // Disconnect the socket on component unmount
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket instance
export const useSocket = () => {
  return useContext(SocketContext);
};
