import React, { useState, useMemo, useCallback, useEffect } from "react";
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
						console.log(sorting);
						// if (!rowA.getValue(columnId) && rowB.getValue(columnId)) {
						// 	console.log("rowA", rowA.getValue(columnId));
						// 	console.log("rowB", rowB.getValue(columnId));
						// }

						// const a = rowA.original as string | number | null | undefined;
						// const b = rowB.original as string | number | null | undefined;
						const a = rowA.getValue(columnId);
						const b = rowB.getValue(columnId);

						// Empty cells go last in ascending
						// const isEmptyA = a === null || a === undefined || a === "";
						// const isEmptyB = b === null || b === undefined || b === "";

						// if (isEmptyA && isEmptyB) return 0;

						// if (isEmptyB) {
						// 	console.log("A:B--", a, "--", b);
						// 	return 1;
						// } // `b` should come *after* `a`
						// if (isEmptyA) {
						// 	console.log("A:B--", a, "--", b);
						// 	return -1;
						// } // `a` should come *after* `b`

						// // Try numeric comparison first
						// const numA = typeof a === "number" ? a : parseFloat(String(a));
						// const numB = typeof b === "number" ? b : parseFloat(String(b));
						// const isNumA = !isNaN(numA);
						// const isNumB = !isNaN(numB);

						// if (isNumA && isNumB) return numA - numB;

						// Fallback to string comparison
						return String(a).localeCompare(String(b));
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
						const rowIndex = row.index;
						const colId = column.id;
						// console.log(rowIndex, colId);
						return <MemoizedSpreadsheetCellWrapper row={row} colId={colId} />;
					},
				};
			}),
		[]
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		// getRowId: (row) => row.id,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	// useEffect(() => {
	// 	console.log("Sorting", table.getCoreRowModel());
	// }, [sorting]);

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
									{row.index}
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
