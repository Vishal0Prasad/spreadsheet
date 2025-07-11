import React, { useState, useMemo, useCallback } from "react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import MemoizedSpreadsheetCellWrapper from "./SpreadsheetCell";

import { generateSheetData } from "../utils/generateData";
import { SpreadsheetContext } from "../context/SpreadsheetContext";

type SelectedCell = { row: number; col: string };

const Spreadsheet = () => {
	const initialData = useMemo(() => generateSheetData(), []);
	const [data, setData] = useState(initialData);
	const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

	const handleArrowKeyNav = useCallback(
		(event: React.KeyboardEvent, row: number, col: string) => {
			console.log(row, col);
			const currentRow = row;
			const currentCol = col.charCodeAt(0) - 65;

			let newRow = currentRow;
			let newCol = currentCol;

			switch (event.key) {
				case "ArrowDown":
					newRow = Math.min(currentRow + 1, data.length - 1);
					break;
				case "ArrowUp":
					newRow = Math.max(currentRow - 1, 0);
					break;
				case "ArrowRight":
				case "Tab":
					newCol = Math.min(currentCol + 1, 25);
					break;
				case "ArrowLeft":
					newCol = Math.max(currentCol - 1, 0);
					break;
				case "Enter":
					newRow = Math.min(currentRow + 1, data.length - 1);
					break;
				default:
					return;
			}

			event.preventDefault();
			console.log(newRow, String.fromCharCode(65 + newCol));
			setSelectedCell({ row: newRow, col: String.fromCharCode(65 + newCol) });
		},
		[data.length]
	);

	const columns = useMemo<ColumnDef<unknown>[]>(
		() =>
			Array.from({ length: 26 }, (_, i) => {
				const colKey = String.fromCharCode(65 + i); // A-Z
				return {
					accessorKey: colKey,
					header: () => colKey,
					cell: ({ row, column }) => {
						const rowIndex = row.index;
						const colId = column.id;
						if (rowIndex === selectedCell?.row && selectedCell.col === colId)
							console.log(
								rowIndex,
								colId,
								selectedCell?.row,
								selectedCell?.col
							);
						return (
							<MemoizedSpreadsheetCellWrapper
								rowIndex={rowIndex}
								colId={colId}
							/>
							// <SpreadsheetCell
							// 	value={data[rowIndex][colId]}
							// 	isSelected={
							// 		selectedCell?.row === rowIndex && selectedCell?.col === colId
							// 	}
							// 	onChange={(newValue) => {
							// 		if (data[rowIndex][colId] !== newValue) {
							// 			const updatedRow = { ...data[rowIndex], [colId]: newValue };
							// 			const newData = [...data];
							// 			newData[rowIndex] = updatedRow;
							// 			setData(newData);
							// 		}
							// 	}}
							// 	onKeyDown={(e) => handleArrowKeyNav(e, rowIndex, colId)}
							// 	onClick={() => {
							// 		console.log("Clicked row and column", rowIndex, colId);
							// 		setSelectedCell({ row: rowIndex, col: colId });
							// 	}}
							// />
						);
					},
				};
			}),
		[]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-auto max-w-screen bg-white border">
			<SpreadsheetContext.Provider
				value={{
					data,
					setData,
					selectedCell,
					setSelectedCell,
					handleArrowKeyNav,
				}}
			>
				{/* table here */}

				<table className="min-w-full border-collapse table-auto text-sm">
					<thead className="bg-gray-100 sticky top-0 z-10">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								<th className="sticky left-0 bg-gray-100 border border-gray-300 text-left px-2">
									#
								</th>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="border border-gray-300 px-2 py-1 text-left"
									>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row, rowIndex) => (
							<tr key={row.id}>
								<td className="sticky left-0 bg-gray-50 border border-gray-300 px-2 font-mono">
									{rowIndex + 1}
								</td>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="border border-gray-300 px-1">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</SpreadsheetContext.Provider>
		</div>
	);
};

export default Spreadsheet;
