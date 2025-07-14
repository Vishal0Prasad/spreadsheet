import React from "react";
import { useWebSocket } from "../hooks/useWebSocket";

export const Header = () => {
	const { isConnected, lastMessage } = useWebSocket();
	return (
		<div className="p-4">
			<h1 className="text-xl font-bold">WebSocket Root Init</h1>
			<p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
			<p>Last Message: {lastMessage}</p>
		</div>
	);
};
