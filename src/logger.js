"use strict";

const winston = require("winston");

winston.configure({
  transports: [
    new (winston.transports.File)({
      filename: "scrappy_debug.log",
      json: true,
      maxsize: 5000000,
      maxfiles: 5,
      zippedArchive: true
    }),
    new (winston.transports.Console)({
      level: "debug",
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = winston;
