require('dotenv').config();
const fs=require('fs');
const {exec} = require("node:child_process");

let myFile = fs.readFileSync('.env.local', {encoding: 'utf8'});

const regexp = /(?<=VITE_API_BASE_URL=)[\w\W]+(?=\n)/
const original = myFile.match(regexp)[0];
myFile = myFile.replace(regexp, process.env.API_PRODUCTION);

try {
  fs.writeFileSync('.env.local', myFile);
} catch(err) {
  console.log(err)
}
exec("npm run build", (err, output) => {
  console.log(output);
  myFile = myFile.replace(regexp, original);
  fs.writeFileSync('.env.local', myFile);
  exec("bash transfer.sh", (err, output) => {
    err && console.log(err);
  });
});
