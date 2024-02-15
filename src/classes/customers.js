import dayjs from "dayjs";

import { subjects } from "/src/utils";

const regexSubject = /^[a-z]+/i;

export default class Customers {
  constructor(dataset) {
    this.dataset = Array.from(dataset);
    this.plot = null;
    this.yMax = 0;
    this.total = 0;
    this.rating = calcRating();
    this.distinct = 0;
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
    const countsByDay = new Map(
      Array.from(Array(4), (e, i) => [getDayStr(i + 1), getSubjectSchema()]),
    );
    const dataInScope = [];
    this.total = 0;
    this.dataset.forEach((customer) => {
      const date = dayjs(customer.start_time);
      if (date >= dayjs(startDate) && date <= dayjs(endDate)) {
        dataInScope.push(customer);
        this.total++;
        let subject = subjects[customer.courses.match(regexSubject)];
        if (!subject) subject = "other";
        const dateStr = date.format("YYYY-MM-DD");
        const dayStr = date.format("dddd");
        calcSubject(counts, dateStr, subject);
        calcSubject(countsByDay, dayStr, subject);
      }
      function calcDistinct(dataset) {
        const distinct = new Set();
        dataset.forEach((e) => {
          distinct.add(e.email);
        });
        return distinct.size;
      }
      this.distinct = calcDistinct(dataInScope);
    });
    const countsArr = [];
    let currDate = dayjs(startDate);
    let yMax = 0;
    while (currDate <= dayjs(endDate)) {
      const key = currDate.format("YYYY-MM-DD");
      const count = counts.has(key) ? counts.get(key) : {};
      yMax = count.val ? Math.max(count.val, yMax) : yMax;
      countsArr.push(
        Object.assign(
          {
            date: key,
          },
          count,
        ),
      );
      currDate = currDate.add(1, "day");
    }
    const countsByDayArr = Array.from(countsByDay.entries(), (e) =>
      Object.assign({ day: e[0] }, e[1]),
    );
    countsByDayArr.sort((a, b) => getDayNum(a.day) - getDayNum(b.day));
    this.plot = {
      counts: countsArr,
      countsByDay: countsByDayArr,
    };
    this.yMax = yMax;
  }
  getPlot() {
    return this.plot;
  }
  getTotal() {
    return this.total;
  }
}

function calcSubject(counts, dateStr, subject) {
  const count = counts.get(dateStr);
  if (count) {
    count[subject]++;
    count.val++;
    counts.set(dateStr, count);
  } else {
    const newCount = {
      val: 1,
      physics: 0,
      math: 0,
      CIS: 0,
      statistics: 0,
      other: 0,
    };
    newCount[subject]++;
    counts.set(dateStr, newCount);
  }
}

function getDayNum(day) {
  switch (day) {
    case "Monday":
      return 1;
      break;
    case "Tuesday":
      return 2;
      break;
    case "Wednesday":
      return 3;
      break;
    case "Thursday":
      return 4;
      break;
    case "Friday":
      return 5;
      break;
  }
}

function getDayStr(num) {
  switch (num) {
    case 0:
      return "Sunday";
      break;
    case 1:
      return "Monday";
      break;
    case 2:
      return "Tuesday";
      break;
    case 3:
      return "Wednesday";
      break;
    case 4:
      return "Thursday";
      break;
    case 5:
      return "Friday";
      break;
    case 6:
      return "Saturday";
  }
}

function getSubjectSchema() {
  return {
    val: 0,
    physics: 0,
    math: 0,
    CIS: 0,
    statistics: 0,
    other: 0,
  };
}
