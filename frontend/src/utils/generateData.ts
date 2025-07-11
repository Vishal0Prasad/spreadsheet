export const generateSheetData = () => {
	return Array.from({ length: 100 }, (_, i) => {
		const row: any = { id: i }; // <== Add ID here
		for (let j = 0; j < 26; j++) {
			const colKey = String.fromCharCode(65 + j);
			row[colKey] = ""; // or initial value
		}
		return row;
	});
};
