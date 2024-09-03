import Table from "react-bootstrap/Table";
import { useContext } from "react";
import { AppContext } from "/src/contexts/AppContext";
export default function TutorHours() {
	const { info } = useContext(AppContext);
	return (
		<div>
			<h1>Tutor Hours</h1>
			<Table>
				<tbody>
					{Object.keys(info)
						.filter((key) => info[key].inactive == false)
						.toSorted()
						.map((key, i, arr) => {
							const hours = Math.max(
								0,
								info[key].schedule
									?.flat()
									.reduce(
										(sum, e) => (e ? sum + 0.25 : sum),
										-0.25,
									) || 0,
							);
							return (
								<tr key={`${key} ${hours} ${info[key.name]}`}>
									<td>{key}</td>
									<td>{info[key].name}</td>
									<td>{hours}</td>
								</tr>
							);
						})}
				</tbody>
			</Table>
		</div>
	);
}
