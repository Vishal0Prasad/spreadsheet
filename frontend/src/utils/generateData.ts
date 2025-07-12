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
