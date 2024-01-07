const listEntriesOf = function (obj) {
  Object.entries(obj).forEach(([key, values]) => {
    console.log(`%c ${key}`, 'color: red;');
    console.log(`%c ${values}`, 'color: blue;');
  });
}

export default {
    listEntriesOf: listEntriesOf
}