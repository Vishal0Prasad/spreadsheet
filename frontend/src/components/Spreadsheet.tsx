import React, { useState, useMemo, useCallback } from "react";
import {
	type ColumnDef,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import MemoizedSpreadsheetCellWrapper from "./SpreadsheetCell";

import { generateSheetData } from "../utils/generateData";
import { SpreadsheetContext } from "../context/SpreadsheetContext";

type SelectedCell = { rowId: number; col: string };

const Spreadsheet = () => {
	const initialData = useMemo(() => generateSheetData(), []);
	const [data, setData] = useState(initialData);
	const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
	const [sorting, setSorting] = useState<SortingState>([]);

	const handleArrowKeyNav = useCallback(
		(event: React.KeyboardEvent, row: number, col: string) => {
			const currentRowIndex = data.findIndex((r) => r.id === row);
			const currentCol = col.charCodeAt(0) - 65;

			let newRow = currentRowIndex;
			let newCol = currentCol;

			switch (event.key) {
				case "ArrowDown":
					newRow = Math.min(currentRowIndex + 1, data.length - 1);
					break;
				case "ArrowUp":
					newRow = Math.max(currentRowIndex - 1, 0);
					break;
				case "ArrowRight":
				case "Tab":
					newCol = Math.min(currentCol + 1, 25);
					break;
				case "ArrowLeft":
					newCol = Math.max(currentCol - 1, 0);
					break;
				case "Enter":
					newRow = Math.min(currentRowIndex + 1, data.length - 1);
					break;
				default:
					return;
			}

			event.preventDefault();

			const newRowId = data[newRow].id;
			setSelectedCell({
				rowId: newRowId,
				col: String.fromCharCode(65 + newCol),
			});
		},
		[data.length]
	);

	const columns = useMemo<ColumnDef<unknown>[]>(
		() =>
			Array.from({ length: 26 }, (_, i) => {
				const colKey = String.fromCharCode(65 + i); // A-Z
				return {
					accessorKey: colKey,
					sortingFn: (rowA, rowB, columnId) => {
						const a = parseFloat(rowA.getValue(columnId) || "0");
						const b = parseFloat(rowB.getValue(columnId) || "0");
						return a - b;
					},
					header: ({ column }) => {
						const isSorted = column.getIsSorted();
						return (
							<div
								onClick={() => column.toggleSorting(isSorted === "asc")}
								className="cursor-pointer flex items-center gap-1"
							>
								{colKey}
								{isSorted === "asc" && <span>▲</span>}
								{isSorted === "desc" && <span>▼</span>}
								{!isSorted && <span className="opacity-20">↕</span>}
							</div>
						);
					},
					enableSorting: true,
					cell: ({ row, column }) => {
						//const rowIndex = row.index;
						const colId = column.id;

						return <MemoizedSpreadsheetCellWrapper row={row} colId={colId} />;
					},
				};
			}),
		[data]
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		getRowId: (row) => row.id,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
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
						{table.getSortedRowModel().rows.map((row, rowIndex) => (
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
