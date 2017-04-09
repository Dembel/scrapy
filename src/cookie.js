/*
 * Cookie parser module
 * Designed by Dmitry Lukashevich a.k.a Dembel
 * ludn2@mail.ru
*/
"use strict";
const fs = require("fs");
const path = require("path");
const R = require("ramda");
/********************* private stuff ********************/
/********************************************************/
// [String] -> [String]
// remove leading dot in Domain attribute value
const dotFree = cookie => cookie.map(val => val.replace("omain=.", "omain="));

// [String] -> [String]
// filter out dublicates
const rmDublicates = cookie => {
  const filtered = cookie.reduceRight((acc, val) => {
    return acc.some(accVal => accVal.indexOf(val.split("=")[0] + "=") === 0) ?
      acc.concat("") : acc.concat(val);
  }, []);

  return cookie.filter(val => filtered.includes(val));
};

// [String] -> [String]
// filter out expired cookie
const rmExpired = cookie => {
  const timestamp = new Date().getTime();

  return cookie.filter(val => {
    const expires = val.match(/expires=.+;|expires=.+$/i);
    return expires ? new Date(expires).getTime() >= timestamp : true;
  });
};
/************************************************************/
/********************* private stuff end ********************/

const nameVal = cookie => cookie.map(val => val.split(";")[0]);
const secure = cookie => cookie.filter(val => val.includes("Secure"));
const notSecure = cookie => cookie.filter(val => !val.includes("Secure"));

// String -> [String] -> [String]
// filter cookie with specific domain
const selectDomain = (origDomain, cookie) => 
  cookie.filter(val => {
    const domainDir = val.match(/domain=.*;|domain=.*$/i);
    const coverDomain = domainDir ?
      domainDir[0].replace(/domain=|;/ig, "") : "";
 
    return val.includes("domain=" + origDomain + ":coverNull") ||
      new RegExp(".*" + coverDomain, "i").test(origDomain);
  });

// String -> [String] -> [String]
// filter cookie with specific path
const selectPath = (path, cookie) => 
  cookie.filter(val => {
    const pathDir = val.match(/path=\/.*;|path=\/.*$/i);
    const cookiePath = pathDir ? 
      pathDir[0].replace(/path=|;|\/$/ig, "") : "/";

    return new RegExp(cookiePath + ".*", "i").test(path);
  });

// String -> [String] -> [String]
// set domain with :coverNull flag for cookies without Domain directive
const setDomain = (origDomain, cookie) =>
  cookie.map(val => !val.toLowerCase().includes("domain=") ?
    val.concat("; domain=", origDomain, ":coverNull") : val);

// String -> [String]
const getCookie = domain => {
  const cookieFile = path.join(__dirname, "cookies", domain);
  
  return fs.existsSync(cookieFile) ?
  fs.readFileSync(cookieFile).toString().split("*****") : [];
};

// String -> [String] -> ()
const saveCookie = (domain, cookie) => {
  const cookieFile = path.join(__dirname, "cookies", domain);

    if (fs.existsSync(path.join(__dirname, "cookies")) && cookie.length) {
    fs.writeFileSync(cookieFile, cookie.join("*****"));
  } else if (cookie.length) {
    fs.mkdirSync(path.join(__dirname, "cookies"));
    fs.writeFileSync(cookieFile, cookie.join("*****"));
  }
};

// clearCookie :: ()
const clearCookie = () => {
  const cookieDir = path.join(__dirname, "cookies");
    
  fs.readdir(cookieDir, (err, files) => {
    files.forEach(val => fs.unlink(path.join(cookieDir, val), () => {}));
  });
};

const parseCookie = R.compose(
  dotFree,
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