import dayjs from "dayjs";

export default class Customers {
	constructor(dataset) {
		Object.assign(this, dataset);
		this.plot = null;
		this.yMax = 0;
	}
	setPlot(startDate, endDate) {
		const results = this;
		const counts = new Map();
		results?.data?.forEach((customer) => {
			const date = dayjs(customer.startTime);
			if (date >= dayjs(startDate) && date <= dayjs(endDate)) {
				const dateStr = date.format("YYYY-MM-DD");
				const count = counts.get(dateStr);
				if (count) {
					counts.set(dateStr, count + 1);
				} else {
					counts.set(dateStr, 1);
				}
			}
		});
		const countsArr = [];
		let currDate = dayjs(startDate);
		let yMax = 0;
		while (currDate <= dayjs(endDate)) {
			const key = currDate.format("YYYY-MM-DD");
			const val = counts.has(key) ? counts.get(key) : 0;
			yMax = Math.max(val, yMax);
			countsArr.push({
				date: key,
				count: val,
			});
			currDate = currDate.add(1, "day");
		}
		this.plot = countsArr;
		this.yMax = yMax;
	}
	getPlot() {
		return this.plot;
	}
}
