import React, { useEffect, useReducer, useRef, useState } from "react";
import { v1 } from "uuid";
import {
	sparseToDenseFormat,
	denseToSparseFormat,
	sortRowsByColumn,
} from "../utils/data";
import { SpreadsheetCellV2 } from "./SpreadsheetCellV2";
import { useWebSocket } from "../hooks/useWebSocket";
import { useUser } from "../hooks/useUser";

type SortingState = { [column: string]: "" | "asc" | "desc" };
type DataState = Record<string, string>;
type UserSelection = {
	userId: string;
	name: string;
	color: string;
	cell: { row: number; col: string }; // e.g., { row: 4, col: "B" }
};

export const SpreadsheetV2 = () => {
	const [rows, setRows] = useState(
		Array.from({ length: 100 }, (_, index) => index)
	);
	const columns = Array.from({ length: 26 }, (_, index) =>
		String.fromCharCode(65 + index)
	);
	const dataRef = useRef<DataState>({});

	const [liveCursors, setLiveCursors] = useState<Record<string, UserSelection>>(
		{}
	);
	const [sorting, setSorting] = useState<SortingState>({});
	const { send, lastMessage } = useWebSocket();
	const { id, name } = useUser();
	const [, rerender] = useReducer((x) => x + 1, 0);
	const forceUpdate = rerender;
	// const myUserId = v1();

	const onFocusCell = (colId: string, rowId: number) => {
		const cell = document.getElementById(`${colId}-${rowId}`);
		cell?.focus();
	};

	const handleFocusCell = (colId: string, rowId: number) => {
		const message = {
			type: "cursor",
			userId: id, // generate per user/session
			name: name,
			color: "#f43f5e",
			cell: { row: rowId, col: colId },
		};
		send(message);
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
		handleFocusCell(columns[newCol], newRow);
	};

	const updateData = (col: string, row: number, value: string) => {
		const key = `${col}-${row}`;

		if (value.trim()) {
			dataRef.current[key] = value;
		} else {
			delete dataRef.current[key];
		}
	};

	const fetchCellData = (col: string, row: number) => {
		return dataRef.current[`${col}-${row}`];
	};

	const applySortLocally = (column: string, ascending: boolean) => {
		const denseRows = sparseToDenseFormat(
			{ ...dataRef.current },
			columns,
			rows.length
		);
		const sortedRows = sortRowsByColumn(denseRows, column, ascending);
		const newSparse = denseToSparseFormat(sortedRows, columns);
		dataRef.current = { ...newSparse };
		forceUpdate();
	};

	const handleSort = (col: string) => {
		if (!sorting?.[col]) {
			setSorting((prev) => ({
				...prev,
				[col]: "asc",
			}));
			applySortLocally(col, true);
		} else if (sorting?.[col] === "asc") {
			setSorting((prev) => ({
				...prev,
				[col]: "desc",
			}));
			applySortLocally(col, false);
		} else {
			setSorting((prev) => ({
				...prev,
				[col]: "asc",
			}));
			applySortLocally(col, true);
		}
	};

	// useEffect(() => {
	// 	if (!lastMessage) return;
	// 	try {
	// 		const msg = JSON.parse(lastMessage);
	// 		console.log(msg);
	// 		if (msg.type === "cursor") {
	// 			setLiveCursors((prev) => ({
	// 				...prev,
	// 				[msg.userId]: msg, // userId must be unique per user
	// 			}));
	// 		}
	// 	} catch (e) {
	// 		console.warn("Invalid WS message", lastMessage);
	// 	}
	// }, [lastMessage]);

	return (
		<div>
			<table className="w-full border-collapse table-fixed text-sm">
				<colgroup>
					<col span={1} className="w-[50px] mr-2"></col>
					<col
						span={columns.length}
						className="w-[120px] h-[32px] border-box"
					></col>
				</colgroup>
				<thead className="bg-gray-100 sticky top-0">
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
											key={`${col}-${row}`}
											rowId={row}
											colId={col}
											onKeyDown={handleArrowNavigation}
											onFocusCell={onFocusCell}
											updateCellData={updateData}
											fetchCellData={fetchCellData}
											liveCursors={liveCursors}
											handleFocusCell={handleFocusCell}
											lastMessage={lastMessage || "null"}
											myUserId={id}
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
