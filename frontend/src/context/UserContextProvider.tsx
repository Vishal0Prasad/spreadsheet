import { v1 } from "uuid";

import { UserContext } from "./UserContext";
import { useEffect, useState } from "react";

export const UserContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const id = v1();
	// const name = "Vishal";
	const [name, setUserName] = useState<string>("Vishal");

	useEffect(() => {
		const name = prompt("Enter your name:");
		if (name) setUserName(name);
	}, []);

	return (
		<UserContext.Provider value={{ name, id }}>{children}</UserContext.Provider>
	);
};
