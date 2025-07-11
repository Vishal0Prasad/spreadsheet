import React, { useState, useMemo } from "react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import SpreadsheetCell from "./SpreadsheetCell";

import { generateSheetData } from "../utils/generateData";

const Spreadsheet = () => {
	const initialData = useMemo(() => generateSheetData(), []);
	const [data, setData] = useState(initialData);

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
						return (
							<SpreadsheetCell
								value={data[rowIndex][colId]}
								onChange={(newValue) => {
									const newData = [...data];
									newData[rowIndex][colId] = newValue;
									setData(newData);
								}}
							/>
						);
					},
				};
			}),
		[data]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-auto max-w-screen bg-white border">
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
		</div>
	);
};

export default Spreadsheet;
