import dayjs from "dayjs";

export default class Customers {
  constructor(dataset) {
    this.dataset = Array.from(dataset);
    this.plot = null;
    this.yMax = 0;
    this.total = 0;
    this.rating = calcRating();
    this.distinct = calcDistinct();
    function calcDistinct() {
      const distinct = new Set();
      dataset.forEach((e) => {
        distinct.add(e.email);
      });
      return distinct.size;
    }
    function calcRating() {
      let score = 0;
      let count = 0;
      for (let i = 0; i < dataset.length; i++) {
        if (dataset[i].rating != "") {
          score += Number(dataset[i].rating);
          count++;
        }
      }
      return (score / count).toFixed(2);
    }
  }
  setPlot(startDate, endDate) {
    const counts = new Map();
    this.total = 0;
    this.dataset.forEach((customer) => {
      const date = dayjs(customer.start_time);
      if (date >= dayjs(startDate) && date <= dayjs(endDate)) {
        this.total++;
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
  getTotal() {
    return this.total;
  }
}
