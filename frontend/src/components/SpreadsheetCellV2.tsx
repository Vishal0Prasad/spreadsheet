import React, { useState, useEffect, useRef } from "react";

export const SpreadsheetCellV2 = ({
	rowId,
	colId,
	onKeyDown,
	onFocusCell,
}: {
	rowId: number;
	colId: string;
	onKeyDown: (key: string, rowId: string, colId: string) => void;
	onFocusCell: (colId: string, rowId: number, inst?: string) => void;
}) => {
	const [localValue, setLocalValue] = useState("");
	const [editing, setEditing] = useState(false);

	const tdRef = useRef<HTMLTableCellElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalValue(event.target.value);
		console.log(event.target.value);
	};

	const applyEditingStyle = () => {
		if (editing && tdRef.current) {
			tdRef.current.style.outline = "2px solid rgba(59, 130, 246, 0.8)";
			tdRef.current.style.boxShadow = "inset 0 0 6px rgba(59,130,246,0.6)";
			tdRef.current.style.backgroundColor = "#eff6ff"; // Tailwind's bg-blue-50
		} else if (tdRef.current) {
			tdRef.current.style.outline = "none";
			tdRef.current.style.boxShadow = "none";
			tdRef.current.style.backgroundColor = "transparent";
		}
	};

	const handleDoubleClick = () => {
		setEditing(true);
		//applyEditingStyle();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
		const eventKey = event.key;
		if (editing && eventKey !== "Enter") return;
		if (eventKey === "Enter") {
			event.preventDefault(); // prevent new line or form submit
			if (editing) {
				// Exit edit mode and move to cell below
				setEditing(false);
				onFocusCell(
					event.currentTarget.dataset.col || "A",
					parseInt(event.currentTarget.dataset?.row || "0") + 1
					//"add:ring-2 ring-blue-400"
				);
				//applyEditingStyle();
				// tdRef.current?.classList.remove(
				// 	"outline",
				// 	"outline-2",
				// 	"outline-blue-400",
				// 	"shadow-xl",
				// 	"shadow-blue-200"
				// );
			} else {
				setEditing(true);
				onFocusCell(
					event.currentTarget.dataset.col || "A",
					parseInt(event.currentTarget.dataset?.row || "0")
					//"remove:ring-2 ring-blue-400"
				);
				console.log("TDREF", tdRef.current);
				// tdRef.current?.classList.add(
				// 	"outline",
				// 	"outline-2",
				// 	"outline-blue-400",
				// 	"shadow-xl",
				// 	"shadow-blue-200",
				// 	"boxShadow:inset 0 0 6px rgba(59,130,246,0.6)"
				// );
				// tdRef.cur
			}
			// Focus input after the input is visible
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		} else {
			onKeyDown(
				eventKey,
				event.currentTarget.dataset.row || "0",
				event.currentTarget.dataset.col || "A"
			);
		}
	};

	useEffect(() => {
		if (editing && tdRef.current) {
			tdRef.current.style.outline = "2px solid rgba(59, 130, 246, 0.8)";
			tdRef.current.style.boxShadow = "inset 0 0 2px rgba(59,130,246,0.6)";
			tdRef.current.style.backgroundColor = "#eff6ff"; // Tailwind's bg-blue-50
		} else if (tdRef.current) {
			tdRef.current.style.outline = "";
			tdRef.current.style.boxShadow = "";
			// tdRef.current.focus();
			tdRef.current.style.backgroundColor = "";
		}
	}, [editing]);

	return (
		<td
			ref={tdRef}
			key={`${colId}-${rowId}`}
			id={`${colId}-${rowId}`}
			data-row={rowId}
			data-col={colId}
			tabIndex={0}
			className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 z-40"
			onKeyDown={handleKeyDown}
			onDoubleClick={handleDoubleClick}
			// style={{
			// 	boxSizing: "border-box",
			// 	outline: editing ? "2px solid rgba(59,130,246,0.8)" : "none",
			// 	boxShadow: editing ? "inset 0 0 6px rgba(59,130,246,0.6)" : "none",
			// }}
			// 	onFocusCapture={() => {

			// 	}}
		>
			{editing ? (
				<input
					id={`${colId}_${rowId}`}
					autoFocus
					value={localValue}
					className="w-full h-full p-0 m-0 border-none outline-none bg-transparent"
					onBlur={() => setEditing(false)}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
					style={{
						boxSizing: "border-box",
					}}
				/>
			) : (
				<span className="w-full h-full px-1 truncate text-sm">
					{localValue}
				</span>
			)}
		</td>
	);
};
