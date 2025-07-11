export const generateSheetData = () => {
	const data = [];

	for (let row = 0; row < 100; row++) {
		const rowData: Record<string, string> = {};
		for (let col = 0; col < 26; col++) {
			const colKey = String.fromCharCode(65 + col); // 'A' to 'Z'
			rowData[colKey] = "";
		}
		data.push(rowData);
	}

	return data;
};
