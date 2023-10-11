const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const times = Array.from(Array(13), (e,i)=> (6 + Math.floor(i/4)) + ":" + (i%4?(i%4)*15:"00") + " PM");
const scheme = {
  name: "",
  time: [],
  day: [],
  subject: "",
  courses: [],
  profilePic: null,
  shcedule: null,
}


const sortByLastName = (arr, levels) => {
  arr.sort((a, b) => {
    levels.forEach(lev => {
      a = a[lev];
      b = b[lev];
    });
    a = a.split(" ")[1];
    b = b.split(" ")[1];
    if (a <= b) {
      return -1;
    } else {
      return 1;
    }
  });
}

export {sortByLastName, days, times};