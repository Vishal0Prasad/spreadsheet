import { useEffect, useState } from "react";

type SpreadsheetCellProps = {
	value: string;
	onChange: (newValue: string) => void;
};

export default function SpreadsheetCell({
	value,
	onChange,
}: SpreadsheetCellProps) {
	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocalValue(e.target.value);
	};

	const handleBlur = () => {
		onChange(localValue);
	};

	return (
		<input
			className="w-full p-1 bg-transparent border-none outline-none"
			value={localValue}
			onChange={handleChange}
			onBlur={handleBlur}
		/>
	);
}
