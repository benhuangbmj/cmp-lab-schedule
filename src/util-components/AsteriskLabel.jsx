export default function AsteriskLabel({ id, style, className, children }) {
	return (
		<label htmlFor={id} style={style} className={className}>
			{children}
			<sup style={{ color: "red" }}>*</sup>
		</label>
	);
}
