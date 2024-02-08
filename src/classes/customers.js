export default class Customers {
	constructor(dataset) {
		Object.assign(this, dataset);
		this.plot = null;
	}
	setPlot(startDate, endDate) {
		const results = this;
		const counts = new Map();
		results?.data?.forEach((customer) => {
			const date = new Date(customer.startTime);
			if (date >= new Date(startDate) && date <= new Date(endDate)) {
				const dateStr = date.toDateString();
				const count = counts.get(dateStr);
				if (count) {
					counts.set(dateStr, count + 1);
				} else {
					counts.set(dateStr, 1);
				}
			}
		});
		const countsArr = [];
		counts.forEach((val, key) => {
			countsArr.push({
				date: key,
				count: val,
			});
		});
		this.plot = countsArr;
	}
	getPlot() {
		return this.plot;
	}
}
