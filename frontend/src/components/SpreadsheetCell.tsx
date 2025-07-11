import React, { useEffect, useState, useRef, useContext } from "react";
import { SpreadsheetContext } from "../context/SpreadsheetContext";

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
		console.log(isSelected);
		if (isSelected) {
			inputRef.current?.focus();
			inputRef.current?.select(); // optional: select all text
		}
	}, [isSelected]);

	useEffect(() => {
		console.log("Render:", { value, isSelected });
	}, [value, isSelected]);

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
			value={localValue}
			onChange={handleChange}
			onBlur={handleBlur}
			onKeyDown={onKeyDown}
			onClick={onClick}
		/>
	);
}

function MemoizedSpreadsheetCellWrapper({
	rowIndex,
	colId,
}: {
	rowIndex: number;
	colId: string;
}) {
	const { data, setData, selectedCell, setSelectedCell, handleArrowKeyNav } =
		useContext(SpreadsheetContext);

	return (
		<SpreadsheetCell
			value={data[rowIndex][colId]}
			isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colId}
			onChange={(newValue) => {
				const updatedRow = { ...data[rowIndex], [colId]: newValue };
				const newData = [...data];
				newData[rowIndex] = updatedRow;
				setData(newData);
			}}
			onKeyDown={(e) => handleArrowKeyNav(e, rowIndex, colId)}
			onClick={() => setSelectedCell({ row: rowIndex, col: colId })}
		/>
	);
}

export default React.memo(MemoizedSpreadsheetCellWrapper);
