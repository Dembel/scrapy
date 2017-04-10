"use strict";

const url = require("url");

// log request and response into a file
const log = res => {
  const fs = require("fs");
  const statusCodes = require("./config").statusCodes;
  const protocol = res.req.protocol === "http" ? "HTTP/1.1" : "HTTPS";
  const reqHeaders = JSON.stringify(res.req.headers, null, 2);
  const resHeaders = JSON.stringify(res.headers, null, 2);
  const path = res.req.path || "/";
  const reqData = res.req.data ?
    "Request data:\n" + JSON.stringify(res.req.data, null, 2) + "\n\n" :
      "";

  const logData = new Date().toUTCString().concat(
    "\n", res.req.method, " ", path, " ", protocol, "\n", "Status code: ",
    res.statusCode, " ", statusCodes[res.statusCode], "\n\n",
    "Request headers:\n", reqHeaders, "\n\n", reqData,
    "Response headers:\n", resHeaders, "\n\n", res.body, "\n\n",
    "============================================================", "\n\n"
  );
  
  if (!fs.existsSync("src/logs")) { 
    fs.mkdirSync("src/logs");
  }

  fs.writeFile(
    "src/logs/" + res.req.hostname + ".log", 
    logData, 
    {flag: "a"}, () => {}
  );
};

const parseUri = uri => {
  const parsedUri = url.parse(uri);

  return {
    protocol: parsedUri.protocol, 
    hostname: parsedUri.hostname, 
    path: parsedUri.hash ? parsedUri.path + parsedUri.hash : parsedUri.path,
    port: parsedUri.port || ""
  };
};

module.exports = {
  log: log,
  parseUri: parseUri
};
