import { WebSocketProvider } from "./context/WebSocketProvider";
import { SpreadsheetV2 } from "./components/SpreadsheetV2";
import { Header } from "./components/Header";
import { UserContextProvider } from "./context/UserContextProvider";

import "./App.css";

function App() {
	return (
		<UserContextProvider>
			<WebSocketProvider url="ws://localhost:8000/ws/spreadsheet">
				<div>
					<Header />
					<SpreadsheetV2 />
				</div>
			</WebSocketProvider>
		</UserContextProvider>
	);
}

export default App;
