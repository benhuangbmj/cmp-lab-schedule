import bcrypt from 'bcryptjs';

const saltRounds = 10;
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const times = Array.from(Array(13), (e, i) => (6 + Math.floor(i / 4)) + ":" + (i % 4 ? (i % 4) * 15 : "00") + " PM");
const schema = {
  password: null,
  name: null,
  time: [],
  day: [],
  subject: null,
  courses: [],
  profilePic: {
    url: null,
    id: null,
    transform: null,
  },
  schedule: null,
  override: {},
  links: {
    linkedin: null,
    twitter: null,
    github: null,
    instagram: null,
    youtube: null,
    facebook: null,
  },
  lastUpdate: null,
  lastLogin: null,
  roles: {
    developer: false,
    admin: false,
  }
};

let blankForm = Object.assign({}, schema, { username: null });
blankForm = Object.assign(blankForm, schema.links);
blankForm.profilePic = null;
delete blankForm.links;

const courseOptions = ['MATH102', 'MATH107', 'MATH108', 'MATH111', 'MATH112', 'MATH180', 'MATH198', 'MATH211', 'MATH261', 'MATH270', 'MATH308', 'STAT269', 'STAT281', 'STAT291', 'STAT292', 'PHYS201', 'PHYS202', 'PHYS211', 'PHYS212', 'MATH105', 'CIS284'];

courseOptions.sort();

const icons = {
  linkedin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABEVJREFUaEPtmm1oFEcYx/+zuV4Oc0k0ueQkttaoiS8VW2qIb00rQoPG02Jb+kHUitLQfmihGCFW8TypJiToh1oo0kYoFK1IW7B3p7aJmNQqVSPGEiQvh0qhuUt6xl6aM7nc7ZRZOU32Zjd64O5Gbj7uPrPz/+3zzDPP7CyBvDnP5IDGtgF0HUBmA9QOQkiCnRYXKKUACYCgC4SewhAaUOvoHz30WGF7vB8AtA4Ek7XQl8QY/QCpgqviaLzvIwCnpw7AjiQeqkeXWrjW7GQDPwBwuisBckQPJcmPSbYxTxBUu6fAjG4QkpP8w3Tp2Q+kzSbY49kBAhY+iq1wyiRYTAK6goOIilQXtdxBKakicHpaAJTxDN6cZcPh1S9hji1Duh0MR7CvuRtf/HHbKBDNBE53L0Dy5IpWzMjFr5tLYRISM+hnTR2o+c2nPwSFn4VQDASCXM2VyuUoKcjmihyKiph2sAl374/oC0EhshBKCOrMdBNCO8tVxa09dhXuzl59AaQ0ygHItphwr1od4K3jrTjVETAmAFPV9lEZFtozuQIjMREvHDqH3sGIcQFWF+XBvaEEAqcM2t/Sjd3nOnUX/2Al5oRQXNnb86bicMV8FGRapEvhkRhqL/iwv8UHkdVZBmiqAExfmkDwsj1LWsjaAiEMRmIGkP1IwrgAhlLLEfPsAuRnmLGy0MZ1QHvfAP4MDCTcY6t3XoaZ2+dke8/D67ZJZmxcWICKonzMtVkRFUUpozXdCoLZXfeHHtvxih5YWZiLpvcXcx+klIXOb1mCN2YkFrVsvgsur1S7f7q0EM4VRchKNymK9Hb14ZPT7fDdDY8LohmA5fMz+P7dV7B+3tRxRTEDVjiuO96Ki3+N2UEm9NUMwNPVC0dx/mOJjxvdH4lh8TcXueEat9EE4IlUy4xvBAaw6MgFxX2I4QEYzzsnruHHm37ue9AcYDgq4nR3H3oGhrEg34rXpudgvI82rGhkxSOvaQpwqz+MVd9dQWdw8KGWshdz8MN7ryqmX2b4TziCvLpGfQHYJqj069+5E7J8lg1nN5WqTpXsml8QGo7qk4XYqF9evoOPve2KIq9WLscihR0g62Svb+SW75qF0LKGS7ikktO/cizAhyXTFQFtdY3S2iBvmgFYD5xVrWTry+eiatlMYwLESwm1IE8ByN/O0yjmUh7QaxKn5gAAXdNoygMpD8jyX7J74qeTRhU+r0+IdUD6vL7X4weFfUIuZIT2sAOOZhC8PiEBRHKeYK+7CpTUywGs5jQU51q5Ydvz35C0JZS34twMsMMRXmv9+1/VDcvzWRbYremKNm3+EG9jv53A+dNk0Od8E/eYlTE7vVsB2qD6iox2k9It2Of4dvSvBjUAqo2mk6+HHoDLsYvdG3uGyjxBxXrjhhMJgorb2ZuPgyUeAku/HghbQehaUMzR/XcbAX7EhA4I9GcgchSu9fdGe+V/YcXHotUlU+oAAAAASUVORK5CYII=',
  twitter: 'data:image/png;base64,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',
  facebook: 'data:image/png;base64,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',
  instagram: 'data:image/png;base64,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',
  youtube: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABQpJREFUaEPVmn1oVnUUxz83nTqdayPL3kas/VEtZCkGzhRkf5gUONHYNAoRNfB9OUjTptNA22ITX9ikhdOluAjSCWP4Rw1GaOQsUiqJmlK2GjRruRebm098vfe269pz72+tZ+0eeNh9nn3Pued77+/lnPM7FlEkAmOAR4GHgYeAB4D7gfuAe4GJzmcccDdwl8dUHJDg+X4LaPN87wGuO9//AH7zfH73XDcDPwHfWNA+kKuW98cIPAa8DDwLZAByZCRIL3AJ+BCotOCy69TfBCLwNvAqMGokeOzjQxew3oJ3hblNIALPAbUj3HGve38C6RY0uQQ+AF4IEQG5+pYFr7sErgHJISOgiZ1uRexV5seQOe+MfJJFYA5QH0ICcjlTBF4EjoWUQK4IrAf2hpRAngi8AbwZUgIFIlAEvBZSAsUiUAasMiYwejRMngxjx9oqyZ7VNzERRjkbeUICxMVBVxfcuGFju7uho8O+7umB60441NkJLS0QiRi74QDLReA94KVATTlWWAhr10JSUiB80ICrV2HbNqisHIzqURE4CWQHalVUwIoVgbAhA9atgwMHTM3UiMBHQJavxrRpcP68qdGh4TSsUlKgzRt9RzX5sQicBWb43rWgAHbuHJpjg9HOzoZTp0w0PhOBL4CnfNFlZbDKcJ739vZNZBMXBsLoXgcPmmh/KQJfA0/4og8fhqVLTQzaT662FkpKQCvRv5GNG2HPHhPNSyLQBKT6oqurITfXxCDU1MCCBZCaCocOwRyFWoOUrVth1y4TpcsioJzzQV+0nJo/38RgHwGhLQtWroTSUpgwwUxfKM237dtN8M0i8Ctwjy/69GmYO9fE4J0EXI20NNAwnDXLzEZxMWzaZIJtFQFth/6DtaEBZs82MTgwAWlqB8/Phx07+nbxaBb37YMNG0zu1y4C3YHVhzNnIDPTxGB0AtJW+FFVBTk5/rbKy2H1apP73RSBm3o+vuj6evPJ6E7i/ganTIEjR2Dq1GDHtAJpJQqWHhHoBOJ9sXV1MG9esDkh+hNwh44m5hjVygxk927YssUASIcIqCrmH52dOGEvjSbiJZCebj/16dNNNPswCho1V4Llmgi0OOXC6PDjx2Hx4mBz7htYuBAUlBUVBU/Ygaxu3mzrBsvPIvADkOKL1Ya0bFmwOSEaG+24f+ZMM/xAqLw82GuU5V4Rge+ANN+77d9v5wHDJcuX27t4sHwrAl+pTOeLXbNmMDF68G2DEHp7ZxUkB8pFs2h00iRoaoKJqqjHWC5csJfaW6rIB0qjCHwCPBMIXbQINJmV58ZKWlshKwtEwkwaRKAOMFvkMzJAw0nL4zidaygIcZJ3XcfH9/2uXXf8eDtxVwIvUUKvCS7xJvvt7XDunB1CN+tMw1hqReB9IGBvNzY43MBqEagAhiFbjwm3d0SgBDAKPGLiwtCMlohAIWCUPQztXjHRLhQBPX29hTBKvgioKqfqXBhliQioqKXiVhhlhgg8AlwJofc6O04SAR30tYbwkK/RgqfdU8oq54Q+TC8i34JSl8CT2CXGGAY6/+mz+QV43II2b6vB84CCcDVzjGRRz0SOBRflZP9mD9WHXnGGk5o97vj//8hKE/ZT7P6IY5ZdSbktUR2M2O01qlq7LTdK/JUQiKT+qsUm0WkOUWjqrWzonEn/c0W9Dap+SOSMWmwkOlNSe43OndTEod9VaBNW10p3vwc+t0DdBP+QvwBzdlbD+/wzSwAAAABJRU5ErkJggg==',
  github: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABPNJREFUaEPVmleoHVUUhr/Yomjs5cEK9tg1GhQsqKgPYgmIJVZUsGN/UGIXhMSGiqCiicSOHRJRkmBIhKgJJmKLYkOF2HtvfLDnsh3OObPmzMyDCw73cma1f88ua/37jOJ/LqNazn85YI3M5wrAGOBP4Ifs+9+Bn9qIXQfApsDuwM7AZumzHrAWsCaw4pAJ/Qh8kz6fAB8B7wGvAIuqgFYBMMGzgKOBbYdMsInZb8BzwFTgaeCfsrNBAC4Ark5ToEkSbdm+CpwEvJk77AXA7+4FTm4rcot+vgcOA14sfPYCcDlwXYtB23b1JbAb8LGOywA2AZYCo9uO2rK/h4FjewG4DTin5WBduPs7bSpL8zewPPAZsH4XETvweSVwTQ5gT+ClDgJ15fJlYHwO4Hzg5q6ideDX03z1HMA04MQOAnXpclwOYC6wdzDaB8CtwHbAEYAndhN5A3gW+Ba4oYajo3IA1iBuoxGZAlySFF38xwHXAxuXjE3IOsc6yZpp1dJzB00/zudC3gK2iSQBXJwD+LXG/n848EwpyCrAKcB3wMJ0nrjd5aLOjsCuacezvinL3cBpQQCTCwCOjFVhVPYFHL0uZLIjG3R8TwFgQ8BSNirO+16jF7UfpHcXcHrQ0eMFgC2Ad4NGqlkrTaqhX0fVHmCXoMGMAoCLxsUTESvC8cDbEeUhdJz/roOIvFAA2AFYErEALgJuCuoOqzYL2D9gPKcA4Cvz1VWJfe0GwC9Vig2fH5w6sSo38woA9rr5XtzP8CngyCqvLTxfCfi6x7lRdr2gALAXMD8Q2C3u0oBeGyqRA21hAWCfvE0bEN0e+ao2sgv4kJUYV6G3pC6A24FzA8HbUPkQkMoZJIvrTqFHgGPayC7gw8qgXDuVzRYVAPYAFgScvg9sHtBrqiIH9R/6pI/DkUVsly/vEpGtU6EW0R1Wx1rIDaNK5hdvwApxcZV2em4fYPfWlVh6e6hGSuq5BYCxgE1FRP5ItUpUP+Iz17kQuDFoNHvYYk5Sya3XJqhN8ZB8FJDVjsjMAoDdkidfHVmWttTH6hj10bXRuSL1AdHkdTW9AOBfu/x+xnZfVoiO+nmlzu219Oz5RItH8TjX3f3s7uRhh+mrb8lbSke0H6n1M3AC8ERqB2eXLjKKpL9IOmcMQLFOakdtK1eOou2jNykH4KJ0MfcTuflTgfuAQ1MSZW5VHSvbqh3tskQCNMyfM/ME5gD7VXj0TWyZGnKnkn2BrEQhbn87BbLyhkdqpqlMyAHcCQx69UWwOzICWDATABehPfVM4NNAVsa1p2jKgo/NAZwNWKxVidc+EmBWi03E9bJuAwfSQGNyANsDrwcdSlZZlcrT/xW0Kat5UeGCHlbcSA7IAfi/JWyUnTOwO5dF4OdpNG1Lrw1m9BWwdlC3l5qM3pTyLiLn3qRhuT9dxEXy8uD0AB1GPLMc6GVlAM7JdxqMzPR0XkSSagJgpLEqAzDw8YAj2etZVWIPJPsqPZ+7jrwgryv2JLaa2vdN0vklze1PB+rIg8DEoIHMdf6zhIiZa/SgnEUcNMqHpDuArSKek85DiWqPmNQBIMvt2/Xy3cU/IlXTxOJOItcrzQO90qnIbOT6M4BAGr7Kn+vxScDbo55UZhWAPA+nk7WS54Vk8EZpDjsNnMt+LPa8KI/IPGC1dCvj2yg+/tBDotkt2cNuoPwLkL/iSas27EIAAAAASUVORK5CYII=',
}

const makeLogo = (canvas, setLogo) => {
  const words = ['faith', 'life', 'possibilities', 'world'];
  const colors = ['bluegreen', 'orangeyellow', 'purpleblue', 'redorange'];
  const word = words[Math.floor(Math.random() * words.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const cvs = canvas.current;
  const ctx = cvs.getContext('2d');
  const img = new Image();
  img.src = `/src/img/see your ${word} anew-${color}word.jpg`;
  img.onload = () => {
    ctx.drawImage(img, 37, 168, 429, 167, 0, 0, 429, 167);
    const logo = cvs.toDataURL();
    setLogo(logo);
  };
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
export const generateVerificationCode = (digits=4) => {
  const codeArr = Array(digits).fill();
  codeArr.forEach((e, i) => {
    codeArr[i] = Math.floor(Math.random() * 10);
  });
  const code = codeArr.join('');
  const output = {
    code: code,
    generatedTime: Date.now()
  };
  return output;
}
export { sortByLastName, days, times, schema, courseOptions, icons, makeLogo, blankForm, };

export const apiBaseUrl = 'https://3d64b95a-1830-4deb-a296-7328fbea73f2-00-2nqzg05jzqy5l.picard.replit.dev';

export const fieldOptions = {
  roles: Object.keys(schema.roles),
  courses: courseOptions,
  links: Object.keys(schema.links),
}

export const sortCriterionHelper = (c, d, sign) => {
  if (c < d) return sign*-1;
  if (c > d) return sign*1;
  return 0;
}

export const signHelper = (key, sortHelper, descending, setDescending) => {
  const sign = descending === key? -1 : 1;  
  sortHelper(sign);
  if (sign == -1) setDescending();
  else setDescending(key);
}

export const toSortedHelper = (arr, ref, sign, keyGenerator, setSorted = null) => {
  const output = arr.toSorted((a,b) => {      
      const [c, d] = [ref[keyGenerator(a)], ref[keyGenerator(b)]];
      return sortCriterionHelper(c,d, sign);
    })
  if (setSorted) setSorted(output);
  else return output;
}

export const sortGenerator = (arr, ref, keyGenerator, descending, setDescending, setSorted) => {
  const output = (key) => {
    const myToSorted = (sign) => toSortedHelper(arr, ref, sign, keyGenerator, setSorted);
    signHelper(key, myToSorted, descending, setDescending);
  }
  return output;
}

export const encrypt = (text) => bcrypt.hashSync(text, saltRounds);

const arrToObj = ['roles'];

const processPassword = (data, key) => {
  if(data[key] === '') {
    delete data[key];
  } else {
    data[key] = utils.encrypt(data[key]);
  }
}

const processArrToObj = (data, key) => {
  if (Array.isArray(data[key])) {
    data[key] = (Object.fromEntries(data[key].map((val) => [val, true])));          
  } else {
    data[key] = {};
  }
}

const prepareData = (usernames, data) => {
  usernames.forEach((user) => {
    arrToObj.forEach((field) => {
      const key = `${user} ${field}`;
      processArrToObj(data, key);
    })
    const key = `${user} password`;
    processPassword(data, key);
    delete data[`${user} username`];
  })
}

const convertData = (usernames, data) => {
  const output = {};
  usernames.forEach((user) => {
    output[user] = {};
  })
  Object.keys(data).forEach((key) => {
    const [user, field] = key.split(' ');
    output[user][field] = data[key];
  })
  return output;
}

export const getReadyForUpdate = (usernames, data) => {
  prepareData(usernames, data);
  return convertData(usernames, data);
}

export default {
  apiBaseUrl: apiBaseUrl,
  generateVerificationCode: generateVerificationCode,
  fieldOptions: fieldOptions,
  sortCriterionHelper: sortCriterionHelper,
  signHelper: signHelper,
  toSortedHelper: toSortedHelper,
  sortGenerator: sortGenerator,
  encrypt: encrypt,
  getReadyForUpdate: getReadyForUpdate,
}