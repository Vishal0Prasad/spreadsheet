import React, { useState } from "react";
import { SpreadsheetCellV2 } from "./SpreadsheetCellV2";

type SortingState = { [column: string]: "" | "asc" | "desc" };
type DataState = Record<string, string>;

export const SpreadsheetV2 = () => {
	const [rows, setRows] = useState(
		Array.from({ length: 100 }, (_, index) => index)
	);
	const columns = Array.from({ length: 26 }, (_, index) =>
		String.fromCharCode(65 + index)
	);

	const [data, setData] = useState<DataState>({});
	const [sortedData, setSortedData] = useState([]);
	const [sorting, setSorting] = useState<SortingState>({});

	const onFocusCell = (colId: string, rowId: number, inst?: string) => {
		const cell = document.getElementById(`${colId}-${rowId}`);
		cell?.focus();
	};

	const handleArrowNavigation = (key: string, rowId: string, colId: string) => {
		const row = parseInt(rowId || "0");
		const col = columns.indexOf(colId || "A");

		let newRow = row;
		let newCol = col;

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

	const handleSort = (col: string) => {
		if (!sorting?.[col])
			setSorting((prev) => ({
				...prev,
				[col]: "asc",
			}));
		else if (sorting?.[col] === "asc")
			setSorting((prev) => ({
				...prev,
				[col]: "desc",
			}));
		else {
			setSorting((prev) => ({
				...prev,
				[col]: "asc",
			}));
		}
	};

	return (
		<div>
			<table className="w-full border-collapse table-fixed text-sm">
				<colgroup>
					<col span={1} className="w-[50px]"></col>
					<col
						span={columns.length}
						className="w-[120px] h-[32px] border-box"
					></col>
				</colgroup>
				<thead className="bg-gray-100 sticky top-0 z-10">
					<tr key={"header"}>
						<th className="sticky left-0 bg-gray-100 border border-gray-300 text-left px-2">
							#
						</th>
						{columns.map((col, index) => {
							return (
								<th
									key={`header-${index}`}
									id={`header-${col}`}
									className="sticky top-0 border border-gray-300 px-2 py-1 text-left"
								>
									<div className="flex justify-center items-center relative">
										<span>{col}</span>
										{!sorting?.[col] ? (
											<span
												className="cursor-pointer absolute right-0"
												onClick={() => handleSort(col)}
											>
												<img width={6} height={6} src="/up-arrow.png" />
												<img
													width={6}
													height={6}
													src="/up-arrow.png"
													className="rotate-180"
												/>
											</span>
										) : (
											<img
												src="/up-arrow.png"
												width={10}
												height={10}
												alt="sort icon"
												onClick={() => handleSort(col)}
												className={`absolute right-0 cursor-pointer transition-transform duration-200 ${
													sorting[col] === "desc" ? "rotate-180" : ""
												}`}
											/>
										)}
									</div>
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
									id={`sider-${row}`}
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
											setData={setData}
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
