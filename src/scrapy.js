"use strict";
const querystring = require("querystring");
const makeRequest = require("./request");
const helpers = require("./helpers");
const R = require("ramda");

const request = (opts, callback) => {
  const [options, data] = opts;
  const headers = R.merge(require("./config").defaultHeaders, options.headers);
  const reqOpts = R.merge(options, { headers: headers });

  makeRequest([reqOpts, data], (err, res) => callback(err, res));
};

// ==================== request methods ====================
const get = (uriStr, callback) => {
  const opts = helpers.parseUri(uriStr);

  request([opts, null], (err, res) => callback(err, res));
};

const post = (uriStr, data, callback) => {
  const reqData = querystring.stringify(data);
  const specificOptions = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "contet-length": reqData.length
    }
  };
  const opts = R.merge(helpers.parseUri(uriStr), specificOptions);

  request([opts, reqData], (err, res) => callback(err, res));
};

module.exports = {
  get: get,
  post: post
};
