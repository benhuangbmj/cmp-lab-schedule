import { Children, cloneElement } from "react";
export default function FormField({
	formUtil,
	fieldName,
	fieldType,
	formOptions,
	fieldOptions,
	readOnly,
}) {
	function Container({ children }) {
		return (
			<div
				className="flexbox-row"
				style={{ minWidth: "300px", width: "80%" }}
			>
				<label
					style={{ display: "block", width: "fit-content" }}
					htmlFor={fieldName}
				>
					{fieldName}
				</label>
				{Children.map(children, (child, i) =>
					cloneElement(child, {
						key: i,
						id: fieldName,
						style: { display: "block", width: "75%" },
						...formUtil.register(fieldName, formOptions),
						readOnly: readOnly,
					}),
				)}
			</div>
		);
	}
	switch (fieldType) {
		case "select": {
			return (
				<Container>
					<select>
						{fieldOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</Container>
			);
		}
		default: {
			return (
				<Container>
					<input type={fieldType} />
				</Container>
			);
		}
	}
}
