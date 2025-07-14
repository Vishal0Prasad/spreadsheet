import { createContext } from "react";

export type WebSocketContextType = {
	isConnected: boolean;
	lastMessage: string | null;
	send: (data: unknown) => void;
};

export const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);
