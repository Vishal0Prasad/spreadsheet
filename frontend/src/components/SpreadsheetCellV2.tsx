import React, { useState, useRef } from "react";

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

	const handleDoubleClick = () => {
		setEditing(true);
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
					parseInt(event.currentTarget.dataset?.row || "0") + 1,
					"add:ring-2 ring-blue-400"
				);
			} else {
				setEditing(true);
				onFocusCell(
					event.currentTarget.dataset.col || "A",
					parseInt(event.currentTarget.dataset?.row || "0"),
					"remove:ring-2 ring-blue-400"
				);
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

	return (
		<td
			ref={tdRef}
			key={`${colId}-${rowId}`}
			id={`${colId}-${rowId}`}
			data-row={rowId}
			data-col={colId}
			tabIndex={0}
			className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
			onKeyDown={handleKeyDown}
			onDoubleClick={handleDoubleClick}
		>
			{editing ? (
				<input
					id={`${colId}_${rowId}`}
					autoFocus
					value={localValue}
					className="p-0 border-none outline-none bg-transparent"
					style={{ font: "inherit", width: "20px", height: "inherit" }}
					onBlur={() => setEditing(false)}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
				/>
			) : (
				localValue
			)}
		</td>
	);
};
