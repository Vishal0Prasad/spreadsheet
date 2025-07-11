import { useEffect, useState } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import Spreadsheet from "./components/Spreadsheet";

import "./App.css";

function App() {
	const { isConnected, lastMessage, send } = useWebSocket(
		"ws://localhost:8000/ws/spreadsheet"
	);

	useEffect(() => {
		if (isConnected) {
			send("Hello from App.tsx");
		}
	}, [isConnected]);

	return (
		<div>
			<div className="p-4">
				<h1 className="text-xl font-bold">WebSocket Root Init</h1>
				<p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
				<p>Last Message: {lastMessage}</p>
			</div>
			<Spreadsheet />
		</div>
	);
}

export default App;
