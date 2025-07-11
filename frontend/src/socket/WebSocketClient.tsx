import { useEffect, useRef, useState } from "react";

export default function WebSocketClient() {
	const [messages, setMessages] = useState<string[]>([]);
	const socketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		socketRef.current = new WebSocket("ws://localhost:8000/ws/spreadsheet");

		socketRef.current.onopen = () => {
			console.log("WebSocket connected");
			socketRef.current?.send("Hello from React!");
		};

		socketRef.current.onmessage = (event) => {
			setMessages((prev) => [...prev, event.data]);
		};

		socketRef.current.onclose = () => {
			console.log("WebSocket disconnected");
		};

		return () => {
			socketRef.current?.close();
		};
	}, []);

	return (
		<div className="p-4">
			<h2 className="font-bold text-xl">WebSocket Messages</h2>
			<ul className="list-disc ml-4">
				{messages.map((msg, i) => (
					<li key={i}>{msg}</li>
				))}
			</ul>
		</div>
	);
}
