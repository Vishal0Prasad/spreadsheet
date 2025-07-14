import React, { useEffect, useRef, useState } from "react";

import { WebSocketContext } from "./WebSocketContext";

export const WebSocketProvider = ({
	url,
	children,
}: {
	url: string;
	children: React.ReactNode;
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [lastMessage, setLastMessage] = useState<string | null>(null);
	const socket = useRef<WebSocket | null>(null);

	useEffect(() => {
		socket.current = new WebSocket(url);

		socket.current.onopen = () => {
			console.log("WebSocket connected");
			setIsConnected(true);
		};

		socket.current.onclose = () => {
			console.log("WebSocket disconnected");
			setIsConnected(false);
		};

		socket.current.onmessage = (event) => {
			setLastMessage(event.data);
		};

		return () => {
			socket.current?.close();
		};
	}, [url]);

	const send = (data: unknown) => {
		if (socket.current?.readyState === WebSocket.OPEN) {
			socket.current.send(
				typeof data === "string" ? data : JSON.stringify(data)
			);
		}
	};

	return (
		<WebSocketContext.Provider value={{ isConnected, lastMessage, send }}>
			{children}
		</WebSocketContext.Provider>
	);
};
