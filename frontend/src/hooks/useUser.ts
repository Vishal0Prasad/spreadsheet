import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};
