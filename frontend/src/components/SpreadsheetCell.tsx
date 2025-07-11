import React, { useEffect, useState, useRef, useContext } from "react";
import { SpreadsheetContext } from "../context/SpreadsheetContext";
import type { Row } from "@tanstack/react-table";

type SpreadsheetCellProps = {
	value: string;
	onChange: (newValue: string) => void;
	isSelected: boolean;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	onClick?: () => void;
};

function SpreadsheetCell({
	value,
	onChange,
	isSelected,
	onKeyDown,
	onClick,
}: SpreadsheetCellProps) {
	if (value) console.log("Local Value", value);
	const [localValue, setLocalValue] = useState(value);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocalValue(e.target.value);
	};

	const handleBlur = () => {
		if (localValue !== value) {
			onChange(localValue);
		}
	};

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		if (isSelected) {
			inputRef.current?.focus();
			inputRef.current?.select(); // optional: select all text
		}
	}, [isSelected]);

	// useEffect(() => {
	// 	console.log("Render:", { value, isSelected });
	// }, [value, isSelected]);

	return (
		<input
			ref={inputRef}
			className={`w-full p-1 outline-none bg-transparent transition-all
                ${
									isSelected
										? "ring-2 ring-blue-500 bg-blue-50"
										: "border border-gray-200"
								}
            `}
			value={localValue ?? ""}
			onChange={handleChange}
			onBlur={handleBlur}
			onKeyDown={onKeyDown}
			onClick={onClick}
		/>
	);
}

function MemoizedSpreadsheetCellWrapper({
	row,
	colId,
}: {
	row: Row<any>;
	colId: string;
}) {
	const { data, setData, selectedCell, setSelectedCell, handleArrowKeyNav } =
		useContext(SpreadsheetContext);
	// const rowIndex = row.index;
	// const rawValue = row.getValue(colId) ?? "";
	// const value =
	// 	rawValue === undefined || rawValue === null ? "" : String(rawValue);
	// // if (value) {
	// // 	console.log("Render cell:", row.id, colId, value);
	// // }
	// // Find the actual index of this row in `data`
	// const originalIndex = data.findIndex((r) => r === row.original);
	const rowId = row.original.id;
	const value = String(row.getValue(colId) ?? "");
	const isSelected =
		selectedCell?.rowId === rowId && selectedCell?.col === colId;
	return (
		<SpreadsheetCell
			value={value}
			isSelected={isSelected}
			onChange={(newValue) => {
				const newData = data.map((r) =>
					r.id === rowId ? { ...r, [colId]: newValue } : r
				);
				setData(newData);
			}}
			onKeyDown={(e) => handleArrowKeyNav(e, rowId, colId)}
			onClick={() => setSelectedCell({ rowId, col: colId })}
		/>
	);
}

export default React.memo(MemoizedSpreadsheetCellWrapper);
