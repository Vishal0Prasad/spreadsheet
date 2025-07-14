import { getCoreRowModel } from "@tanstack/react-table";

export const generateSheetData = () => {
	return Array.from({ length: 100 }, (_, i) => {
		const row: Record<string, string> = { id: String(i) }; // <== Add ID here
		for (let j = 0; j < 26; j++) {
			const col = String.fromCharCode(65 + j);
			row[col] = ""; // or initial value
		}
		return row;
	});
};

export const sparseToDenseFormat = (
	cellData: Record<string, string>,
	columns: string[],
	rowCount: number
) => {
	return Array.from({ length: rowCount }, (_, rowIndex) => {
		const row: Record<string, string> = { id: String(rowIndex) };
		for (const col of columns) {
			const key = `${col}-${rowIndex}`;
			if (key in cellData) {
				row[col] = cellData[key];
			}
		}
		return row;
	});
};

export const denseToSparseFormat = (
	sortedRows: Record<string, string>[],
	columns: string[]
): Record<string, string> => {
	const sparse: Record<string, string> = {};

	sortedRows.forEach((row, newRowIndex) => {
		for (const col of columns) {
			const value = row[col];
			if (value && value.trim() !== "") {
				const key = `${col}-${newRowIndex}`;
				sparse[key] = value;
			}
		}
	});

	return sparse;
};

export function sortRowsByColumn(
	rows: Record<string, string>[],
	column: string,
	ascending: boolean = true
) {
	return [...rows].sort((a, b) => {
		const valA = a[column]?.trim() ?? "";
		const valB = b[column]?.trim() ?? "";

		const isEmptyA = valA === "";
		const isEmptyB = valB === "";

		// 🟡 Handle empty values explicitly
		if (isEmptyA && !isEmptyB) return 1;
		if (!isEmptyA && isEmptyB) return -1;
		if (isEmptyA && isEmptyB) return 0;

		const numA = Number(valA);
		const numB = Number(valB);

		const isNumA = !isNaN(numA);
		const isNumB = !isNaN(numB);

		let result: number = 0;

		if (isNumA && isNumB) {
			result = numA - numB;
		} else if (isNumA) result = -1; // numbers before text
		else if (isNumB) result = 1;
		else valA.localeCompare(valB);

		return ascending ? result : -result;
	});
}
