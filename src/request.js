"use strict";
const logger = require("./logger");
const statusCodes = require("./config").statusCodes;
const maxRedirects = require("./config").maxRedirects;
const helpers = require("./helpers");
const cookie = require("./cookie");
const R = require("ramda");
const zlib = require("zlib");

// TODO: Consider promises
const makeRequest = (opts, callback, callCount = 0) => {
  let[options, data] = opts;
  const uri = options.protocol.concat("//",options.hostname, options.path);
  const reqCookie = cookie.getCookie(uri);
  
  options.headers.cookie = cookie.nameVal(reqCookie).join(";");
  
  const req = require(options.protocol.replace(":", "")).request(options, res => {
    let body = [];

    res.on("data", data => {
      body.push(data);
    });

    res.on("end", () => {
      res.body = Buffer.concat(body);
      res.statusCodeMessage = statusCodes[res.statusCode];
      res.req = options;
      res.req.data = data || null;
      handleResponse(res);
    });

    res.on("error", err => {
      logger.info(err);
    });
  });

  if (data) req.write(data);
  req.end();
  req.on("error", err => {
    logger.info(err);
  });

  function handleResponse(res) {
    const decodedResponse = R.merge(
      res, 
      { body: decode(res) }
    );
    
    handleCookies(res);
    switch (res.statusCode) {
    case 302:
      redirectGet(decodedResponse);
      break;
    default:
      callback(null, decodedResponse);
      break;
    }
  }

  function decode(res) {
    switch (res.headers["content-encoding"]) {
    case "gzip":
      return zlib.gunzipSync(res.body);
    case "deflate":
      return zlib.inflateSync(res.body);
    default:
      return res.body.toString();
    }
  }

  function handleCookies(res) {
    const cookies = R.concat(reqCookie, res.headers["set-cookie"] || []);
    const cleanedCookies = cookie.setDomain(res.req.hostname, cookie.parse(cookies));
    const domains = cleanedCookies.map(
      val => val.match(/domain=(.*);|domain=(.*)$/i)[1]
    );

    R.uniq(domains).forEach(val => {
      const filteredCookies = cleanedCookies.filter(
        cval => cval.toLowerCase().includes("domain=" + val + ";"));

      cookie.saveCookie(val, filteredCookies);
    });
  }
  
  function redirectGet(res) {
    const headers = require("./config").defaultHeaders;
    const opts = R.merge(
      helpers.parseUri(res.headers.location), 
      { headers: headers }
    );

    if (callCount + 1 > maxRedirects) {
      callback("Too many consecutive redirects", null);
      return;
    }

    makeRequest([opts, null], callback, callCount + 1);
  }

};

module.exports = makeRequest;
