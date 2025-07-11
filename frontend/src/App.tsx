import { useState } from "react";

import WebSocketClient from "./socket/WebsocketClient";

import "./App.css";

function App() {
	return (
		<div>
			<WebSocketClient />
		</div>
	);
}

export default App;
