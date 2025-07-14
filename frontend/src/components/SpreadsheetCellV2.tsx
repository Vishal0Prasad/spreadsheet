import React, { useState, useEffect, useRef } from "react";

const FORMULAS = ["SUM", "AVERAGE", "COUNT"];

export const SpreadsheetCellV2 = ({
	rowId,
	colId,
	onKeyDown,
	onFocusCell,
	updateCellData,
	fetchCellData,
	liveCursors,
	handleFocusCell,
	lastMessage,
	myUserId,
}: {
	rowId: number;
	colId: string;
	onKeyDown: (key: string, rowId: string, colId: string) => void;
	onFocusCell: (colId: string, rowId: number, inst?: string) => void;
	updateCellData: (col: string, row: number, value: string) => void;
	fetchCellData: (col: string, row: number) => string;
	liveCursors: any;
	handleFocusCell: any;
	lastMessage: string;
	myUserId: string;
}) => {
	const [, setLocalValue] = useState("");
	const [editing, setEditing] = useState(false);
	const [showFormulaSuggestions, setShowFormulaSuggestions] = useState(false);
	const [formulae, setFormulae] = useState([...FORMULAS]);

	const tdRef = useRef<HTMLTableCellElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	console.log(lastMessage);
	lastMessage = JSON.parse(lastMessage);

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		colId: string,
		rowId: number
	) => {
		const value = event.target.value;

		// This local value update is only to force re render and call fetchCellData method in the value attribute
		setLocalValue(value);
		updateCellData(colId, rowId, event.target.value);
		// if (value.startsWith("=")) {
		// 	const formulaQuery = value.slice(1).toUpperCase();
		// 	setShowFormulaSuggestions(true);
		// 	setFormulae([...FORMULAS.filter((f) => f.startsWith(formulaQuery))]);
		// }
		// setShowFormulaSuggestions(value.startsWith("="));
	};

	const handleDoubleClick = () => {
		setEditing(true);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
		const eventKey = event.key;
		const col = event.currentTarget.dataset.col;
		const row = event.currentTarget.dataset.row;

		if (editing && eventKey !== "Enter") return;
		if (eventKey === "Enter") {
			event.preventDefault(); // prevent new line or form submit
			if (editing) {
				// Exit edit mode and move to cell below
				setEditing(false);
				onFocusCell(col || "A", parseInt(row || "0") + 1);
			} else {
				setEditing(true);
				onFocusCell(col || "A", parseInt(row || "0"));
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

	const handleFormulaClick = (formula: string) => {
		const newValue = `=${formula}()`;
		setLocalValue(newValue);
		updateCellData(colId, rowId, newValue);
		setShowFormulaSuggestions(false);
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	};

	console.log("live cursors", lastMessage?.userId, myUserId);

	useEffect(() => {
		if (editing && tdRef.current) {
			tdRef.current.style.outline = "2px solid rgba(59, 130, 246, 0.8)";
			tdRef.current.style.boxShadow = "inset 0 0 2px rgba(59,130,246,0.6)";
			tdRef.current.style.backgroundColor = "#eff6ff"; // Tailwind's bg-blue-50
		} else if (tdRef.current) {
			tdRef.current.style.outline = "";
			tdRef.current.style.boxShadow = "";
			tdRef.current.style.backgroundColor = "";
		}
	}, [editing]);

	return (
		<td
			key={`${colId}-${rowId}`}
			ref={tdRef}
			id={`${colId}-${rowId}`}
			data-row={rowId}
			data-col={colId}
			tabIndex={0}
			className={`relative border border-gray-300 focus:outline focus:ring-2 focus:ring-blue-400`}
			onKeyDown={handleKeyDown}
			onDoubleClick={handleDoubleClick}
		>
			{editing ? (
				<input
					id={`${colId}_${rowId}`}
					autoFocus
					value={fetchCellData(colId, rowId) ?? ""}
					className="w-full h-full p-0 m-0 px-1 border-none outline-none bg-transparent"
					onBlur={() => {
						// setTimeout(() => {
						setEditing(false);
						// setShowFormulaSuggestions(false);
						// }, 100);
					}}
					// onClick={() => handleFocusCell(colId, rowId)}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(e, colId, rowId);
					}}
					style={{
						boxSizing: "border-box",
					}}
				/>
			) : (
				<span
					key={`static-cell-${colId}-${rowId}`}
					className="w-full h-full px-1 truncate text-sm"
				>
					{fetchCellData(colId, rowId)}
				</span>
			)}
			{/* {showFormulaSuggestions && (
				<div className="absolute left-0 top-full mt-1 w-max bg-white border border-gray-300 z-0 shadow rounded text-sm">
					{formulae.map((f) => (
						<div
							key={f}
							className="px-2 py-1 hover:bg-blue-300 cursor-pointer border-b-2"
							//onMouseDown={(e) => e.preventDefault()}
							//onClick={() => handleFormulaClick(f)}
						>
							={f}(...)
						</div>
					))}
				</div>
			)} */}
			{myUserId != lastMessage?.userId &&
				(lastMessage?.cell?.row === rowId &&
				lastMessage?.cell?.col === colId ? (
					<div
						key={lastMessage?.userId}
						className="absolute top-0 left-0 w-full h-full border-2"
						style={{ borderColor: lastMessage?.color }}
					>
						<span className="text-xs bg-white px-1 text-black">
							{lastMessage?.name}
						</span>
					</div>
				) : null)}
		</td>
	);
};
