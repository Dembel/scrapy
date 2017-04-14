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
  if (!fs.existsSync(cookieDir)) { 
    fs.mkdirSync(cookieDir);
  }

  return fs.readdirSync(cookieDir);
}

const saveCookie = (domain, cookie) => {
  const cookieFile = path.join(__dirname, "cookies", domain);

    if (fs.existsSync(path.join(__dirname, "cookies")) && cookie.length) {
    fs.writeFileSync(cookieFile, cookie.join("*****"));
  } else if (cookie.length) {
    fs.mkdirSync(path.join(__dirname, "cookies"));
    fs.writeFileSync(cookieFile, cookie.join("*****"));
  }
};

const clearCookie = () => {
  if (!fs.existsSync(cookieDir)) {
    fs.mkdirSync(cookieDir);
  }

  fs.readdir(cookieDir, (err, files) => {
    files.forEach(val => fs.unlink(path.join(cookieDir, val), () => {}));
  });
};

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
