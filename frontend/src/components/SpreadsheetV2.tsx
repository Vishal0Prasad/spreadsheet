import React, { useState } from "react";
import { SpreadsheetCellV2 } from "./SpreadsheetCellV2";

export const SpreadsheetV2 = () => {
	const [rows, setRows] = useState(
		Array.from({ length: 100 }, (_, index) => index)
	);
	const columns = Array.from({ length: 26 }, (_, index) =>
		String.fromCharCode(65 + index)
	);

	const [data, setData] = useState([]);

	const onFocusCell = (colId: string, rowId: number, inst?: string) => {
		const cell = document.getElementById(`${colId}-${rowId}`);
		cell?.focus();
		const [op, classNames] = inst?.split(":") || [];
		if (op === "add") {
			cell?.classList.add(classNames);
		}
		if (op === "remove") {
			cell?.classList.remove(classNames);
		}
	};

	const handleArrowNavigation = (key: string, rowId: string, colId: string) => {
		const row = parseInt(rowId || "0");
		const col = columns.indexOf(colId || "A");

		let newRow = row;
		let newCol = col;

		// console.log(newRow, colId);
		switch (key) {
			case "ArrowDown":
				newRow = Math.min(newRow + 1, rows.length - 1);
				break;
			case "ArrowUp":
				newRow = Math.max(newRow - 1, 0);
				break;
			case "ArrowRight":
			case "Tab":
				newCol = Math.min(newCol + 1, columns.length - 1);
				break;
			case "ArrowLeft":
				newCol = Math.max(newCol - 1, 0);
				break;
			default:
				return;
		}
		onFocusCell(columns[newCol], newRow);
	};

	return (
		<div>
			<table className="min-w-full border-collapse table-auto text-sm">
				<thead className="bg-gray-100 sticky top-0 z-10">
					<tr key={"header"}>
						<th className="sticky left-0 bg-gray-100 border border-gray-300 text-left px-2">
							#
						</th>
						{columns.map((col, index) => {
							return (
								<th
									key={`header-${index}`}
									className="border border-gray-300 px-2 py-1 text-left"
								>
									{col}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, index) => {
						return (
							<tr key={`row-${index}`}>
								<td
									key={`sider-${index}`}
									className="sticky left-0 bg-gray-50 border border-gray-300 px-2 font-mono"
								>
									{index + 1}
								</td>
								{columns.map((col) => {
									return (
										<SpreadsheetCellV2
											rowId={row}
											colId={col}
											onKeyDown={handleArrowNavigation}
											onFocusCell={onFocusCell}
										/>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
