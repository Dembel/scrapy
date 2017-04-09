"use strict";
const url = require("url");
const logger = require("./logger");
const statusCodes = require("./config").statusCodes;
const maxRedirects = require("./config").maxRedirects;
const helpers = require("./helpers");
const cookie = require("./cookie");
const R = require("ramda");
const zlib = require("zlib");

// TODO: Consider promises
const makeRequest = (opts, callback, callCount = 0) => {
  const[options, data] = opts;

  if (callCount > maxRedirects) {
    callback("Too many consecutive redirects", null);
    return;
  }
  
  const handleCookies = res => {
    const uri = url.parse(res.headers.location);
    const cookies = R.concat(
      cookie.getCookie(res.req.hostname) || [],
      res.headers["set-cookie"]          || []
    );
    const validate = R.compose(
      cookie.selectPath(uri.path),
      cookie.selectDomain(uri.hostname),
      cookie.setDomain(res.req.hostname),
      cookie.parse
    );
    const validCookies = validate(cookies);

    cookie.saveCookie(res.req.hostname, validCookies);
    return cookie.nameVal(validCookies).join(";");
  };

  const redirectGet = res => {
    const opts = R.merge(
      helpers.parseUri(res.headers.location), 
      { cookie: handleCookies(res) }
    );

    makeRequest([opts, null], callback, callCount + 1);
  };

  const decode = res => {
    switch (res.headers["content-encoding"]) {
    case "gzip":
      return zlib.gunzipSync(res.body);
    case "deflate":
      return zlib.inflateSync(res.body);
    default:
      return res.body.toString();
    }
  };

  const handleResponse = res => {
    const decodedResponse = R.merge(
      res, 
      { body: decode(res) }
    );

    switch (res.statusCode) {
    case 302:
      redirectGet(decodedResponse);
      break;
    default:
      cookie.clearCookie();
      callback(null, decodedResponse);
      break;
    }
  };

  const req = require(options.protocol).request(options, res => {
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
};

module.exports = makeRequest;
