import { createContext } from "react";

export type UserContextType = {
	name: string;
	id: string;
};

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);
