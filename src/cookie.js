"use strict";
const fs = require("fs");
const path = require("path");
const R = require("ramda");
const url = require("url");
const cookieDir = path.join(__dirname, "cookies");

const rmLeadingDot = cookie => cookie.map(val => val.replace("omain=.", "omain="));

const rmDublicates = cookie => {
  const filtered = cookie.reduceRight((acc, val) => {
    return acc.some(accVal => accVal.indexOf(val.split("=")[0] + "=") === 0) ?
      acc.concat("") : acc.concat(val);
  }, []);

  return cookie.filter(val => filtered.includes(val));
};

const rmExpired = cookie => {
  const timestamp = new Date().getTime();

  return cookie.filter(val => {
    const expires = val.match(/expires=.+;|expires=.+$/i);
    return expires ? new Date(expires).getTime() >= timestamp : true;
  });
};

const nameVal = cookie => cookie.map(val => val.split(";")[0]);
const secure = cookie => cookie.filter(val => val.includes("Secure"));
const notSecure = cookie => cookie.filter(val => !val.includes("Secure"));

const selectDomain = (origDomain, cookie) => 
  cookie.filter(val => {
    const domainDir = val.match(/domain=.*?;|domain=.*$/i);
    const coverDomain = domainDir ?
      domainDir[0].replace(/domain=|;/ig, "") : "";
 
    return val.includes("domain=" + origDomain + ":coverNull") ||
      new RegExp(".*" + coverDomain, "i").test(origDomain);
});

const selectPath = (path, cookie) => 
  cookie.filter(val => {
    const pathDir = val.match(/path=\/.*?;|path=\/.*$/i);
    const cookiePath = pathDir ? 
      pathDir[0].replace(/path=|;|$/ig, "") : "/";

    return new RegExp(cookiePath + ".*", "i").test(path);
});

// set domain with ;coverNull flag for cookies without Domain directive
const setDomain = (origDomain, cookie) =>
  cookie.map(val => !val.toLowerCase().includes("domain=") ?
    val.concat(";domain=", origDomain, ";coverNull") : val);

const getCookie = uri => {
  const uriStr = url.parse(uri);
  const domain = uriStr.hostname;
  const uriPath = uriStr.path;
  const cookieFiles = readAllCookie().filter(
    val => new RegExp("(.+\.)*" + domain + "$").test(val)
  );

  return selectPath(uriPath, R.flatten(cookieFiles.map(val => val === domain ? 
    fs.readFileSync(path.join(cookieDir, val)).toString().split("*****") :
    fs.readFileSync(path.join(cookieDir, val)).toString().split("*****").
      filter(val => !val.includes("coverNull")))));
};

function readAllCookie () {
  prepareFolder(cookieDir);

  return fs.readdirSync(cookieDir);
}

const saveCookie = (domain, cookie) => {
  const cookieFileName = path.join(__dirname, "cookies", domain);
  
  prepareFolder(cookieDir);

  if (cookie.length) {
    fs.writeFileSync(cookieFileName, cookie.join("*****"));
  }
};

const clearCookie = () => {
  prepareFolder(cookieDir);
  const files = fs.readdirSync(cookieDir);
    
  files.forEach(val => fs.unlink(path.join(cookieDir, val), () => {}));
};

function prepareFolder(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

const parseCookie = R.compose(
  rmLeadingDot,
  rmExpired,
  rmDublicates
);

module.exports = {
  parse: parseCookie,
  nameVal: nameVal,
  selectDomain: R.curry(selectDomain),
  selectPath: R.curry(selectPath),
  secure: secure,
  notSecure: notSecure,
  setDomain: R.curry(setDomain),
  getCookie: getCookie,
  saveCookie: R.curry(saveCookie),
  clearCookie: clearCookie
};
