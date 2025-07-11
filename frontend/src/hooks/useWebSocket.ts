// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url: string) => {
	const socketRef = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [lastMessage, setLastMessage] = useState<string | null>(null);

	const send = (message: string) => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(message);
		}
	};

	useEffect(() => {
		const socket = new WebSocket(url);
		socketRef.current = socket;

		socket.onopen = () => {
			setIsConnected(true);
			console.log("🟢 WebSocket connected");
		};

		socket.onmessage = (event) => {
			setLastMessage(event.data);
		};

		socket.onclose = () => {
			setIsConnected(false);
			console.log("🔌 WebSocket disconnected");
		};

		socket.onerror = (error) => {
			console.error("❌ WebSocket error", error);
		};

		return () => {
			socket.close();
		};
	}, [url]);

	return {
		isConnected,
		lastMessage,
		send,
	};
};
