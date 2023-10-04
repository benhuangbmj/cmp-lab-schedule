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

export {sortByLastName};