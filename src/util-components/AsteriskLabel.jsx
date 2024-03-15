export default function AsteriskLabel({ text, id, style }) {
	return (
		<label htmlFor={id} style={style}>
			{text}
			<sup style={{ color: "red" }}>*</sup>
		</label>
	);
}
