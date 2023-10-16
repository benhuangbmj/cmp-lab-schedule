const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const times = Array.from(Array(13), (e, i) => (6 + Math.floor(i / 4)) + ":" + (i % 4 ? (i % 4) * 15 : "00") + " PM");
const scheme = {
  name: "",
  time: [],
  day: [],
  subject: "",
  courses: [],
  profilePic: null,
  shcedule: null,
  override: {}
}
const courseOptions = ['MATH102', 'MATH107', 'MATH108', 'MATH111', 'MATH112', 'MATH180', 'MATH198', 'MATH211', 'MATH261', 'MATH270', 'MATH308', 'STAT269', 'STAT281', 'STAT291', 'STAT292', 'PHYS201', 'PHYS202', 'PHYS211', 'PHYS212'];

courseOptions.sort();


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

export { sortByLastName, days, times, scheme, courseOptions };