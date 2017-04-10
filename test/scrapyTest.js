"use strict";
const nock = require("nock");
const chai = require("chai");
const expect = chai.expect;
const scrapy = require("../src/scrapy");

describe("Scrapy tests", function () {

  afterEach(function () {
    nock.cleanAll();
  });  

  describe("GET method tests" , function () {

    it("should correctly send http request and get response back",
    function (done) {
      nock("http://gettest.com").get("/").reply(200, {
        foo: 200,
        bar: "foobar"
      });

      scrapy.get("http://gettest.com", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foo", "bar");
        done();
      });
    });

    it("should correctly send http request and get response back",
    function (done) {
      nock("http://gettest.com").get("/").reply(200, {
        foo: 200,
        bar: "foobar"
      });

      scrapy.get("http://gettest.com", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foo", "bar");
        done();
      });
    });

    it("should correctly send https request and get response back",
    function (done) {
      nock("https://gettest.com").get("/").reply(200, {
        foobar: 200,
        https: "https"
      });

      scrapy.get("https://gettest.com", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foobar", "https");
        done();
      });
    });

    it("should correctly send https request and get response back",
    function (done) {
      nock("https://gettest.com").get("/foobar/bar").reply(200, {
        foob: 200,
        https: "https"
      });

      scrapy.get("https://gettest.com/foobar/bar", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foob", "https");
        done();
      });
    });

    it("should correctly send request with query string and " +
    "get response back", function (done) {
      nock("https://gettest.com").get("/foo?name=John&surname=Dough").
      reply(200, {
        foob: 200,
        https: "https"
      });

      scrapy.get("https://gettest.com/foo?name=John&surname=Dough",
      (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foob", "https");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should correctly send request with query string and " +
    "get response back", function (done) {
      nock("https://gettest.com").get("/?name=John&surname=Dough").
      reply(200, {
        foob: 200,
        https: "https"
      });

      scrapy.get("https://gettest.com/?name=John&surname=Dough", 
      (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foob", "https");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should correctly send request with hash and get response back", 
    function (done) {
      nock("https://gettest.com").get("/foo#start").
      reply(200, {
        foo: 2004,
        http: "http"
      });

      scrapy.get("https://gettest.com/foo#start", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foo", "http");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should correctly send request with hash and get response back", 
    function (done) {
      nock("https://gettest.com").get("/#start").
      reply(200, {
        foo: 2004,
        http: "http"
      });

      scrapy.get("https://gettest.com/#start", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foo", "http");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should correctly send request and have statusCodeMessage prop\n\t" +
    "with correct message in res object", function (done) {
      nock("https://gettest.com").get("/foobar/bar").reply(200, {
        foob: 200,
        https: "https"
      });

      scrapy.get("https://gettest.com/foobar/bar", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foob", "https");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should correctly send request and have statusCodeMessage prop\n\t" +
    "with correct message in res object", function (done) {
      nock("https://gettest.com").get("/foobar/bar").reply(404);

      scrapy.get("https://gettest.com/foobar/bar", (err, res) => {
        expect(res.statusCode).to.equal(404);
        /* jshint ignore:start */
        expect(res.body).to.be.empty;
        /* jshint ignore:end */
        expect(res.statusCodeMessage).to.equal("Not Found");
        done();
      });
    });

    it("should correctly send request on non-standart port\n\t" +
    "and get response back", function (done) {
      nock("https://gettest.com:8080").get("/#start").
      reply(200, {
        foo: 2004,
        http: "http"
      });

      scrapy.get("https://gettest.com:8080/#start", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foo", "http");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    xit("should throw Unsoported protocol, expected http: or https:", 
    function () {
      const fn = () => scrapy.get("htps://gettest.com:8080/#start", () => {});
      const err = "Unsoported protocol, expected http: or https:";
      expect(fn).to.throw(Error, err);
    });

  });

  describe("POST method tests" , function () {

    it("should correctly send post request and get response back",
    function (done) {
      const postData = { name: "John", surname: "Dough" };

      nock("http://posttest.com").post("/", postData).reply(403);

      scrapy.post("http://posttest.com", postData, (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(403);
        expect(res.statusCodeMessage).to.equal("Forbidden");
        /* jshint ignore: start */
        expect(res.body).to.be.empty;
        /* jshint ignore: end */
        done();
      });
    });

    it("should correctly send post request and get response back",
    function (done) {
      const postData = { name: "John", surname: "Dough" };

      nock("http://posttest.com").post("/foobar", postData).reply(200, "Hello");

      scrapy.post("http://posttest.com/foobar", postData, (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("Hello");
        done();
      });
    });

    it("should correctly send post request with query string and\n\t" +
    "get response back", function (done) {
      const postData = { name: "Johny", surname: "Doughy" };
      nock("https://posttest.com").
      post("/foo?name=John&surname=Dough", postData).reply(200, {
        fb: 200,
        hps: "https"
      });

      scrapy.post("https://posttest.com/foo?name=John&surname=Dough", 
      postData, (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("fb", "hps");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should correctly send post request with query string and\n\t" +
    "get response back", function (done) {
      const postData = { name: "Johny", surname: "Doughy" };
      nock("https://posttest.com").post("/?name=John&surname=Dough", postData).
      reply(200, {
        b: 200,
        h: "https"
      });

      scrapy.post("https://posttest.com/?name=John&surname=Dough", 
      postData, (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("b", "h");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should correctly send post request with hash and get response back", 
    function (done) {
      const postData = { name: "Johny", surname: "Doughy" };
      nock("https://posttest.com").post("/foo#start", postData).
      reply(200, {
        foo: 2004,
        http: "http"
      });

      scrapy.post("https://posttest.com/foo#start", postData, (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foo", "http");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should correctly send post request with hash and get response back", 
    function (done) {
      const postData = { name: "Johny", surname: "Doughy" };
      nock("https://posttest.com").post("/#start", postData).
      reply(200, {
        oo: 2004,
        ttp: "http"
      });

      scrapy.post("https://posttest.com/#start", postData, (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("oo", "ttp");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should correctly send post request on non-standart port\n\t" +
    "and get response back", function (done) {
      nock("https://posttest.com:8080").post("/#start", {}).
      reply(200, {
        foo: 2004,
        http: "http"
      });

      scrapy.post("https://posttest.com:8080/#start", {}, (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(JSON.parse(res.body)).to.have.all.keys("foo", "http");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    xit("should throw Unsoported protocol, expected http: or https:", 
    function () {
      const fn = () => scrapy.post("htps://posttest.com", {}, () => {});
      const err = "Unsoported protocol, expected http: or https:";
      expect(fn).to.throw(Error, err);
    });

  });

  describe("Redirect tests" , function () {

    it("should successfully redirect on 302 status code", function (done) {
      nock("https://gettest.com").get("/").reply(302, "", {
        location: "http://redirectedget.com"
      });
      nock("http://redirectedget.com").get("/").reply(200, "Redirect");

      scrapy.get("https://gettest.com", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("Redirect");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should successfully redirect on 302 status code", function (done) {
      nock("https://posttest.com").post("/", {}).reply(302, "", {
        location: "http://redirectedget.com"
      });
      nock("http://redirectedget.com").get("/").reply(200, "Redirect");

      scrapy.post("https://posttest.com", {}, (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("Redirect");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should successfully redirect on 302 status code", function (done) {
      nock("https://gettest.com").get("/").times(9).reply(302, "", {
        location: "https://gettest.com"
      });
      nock("https://gettest.com").get("/").reply(302, "", {
        location: "http://redirectedget.com"
      });
      nock("http://redirectedget.com").get("/").reply(200, "Redirect");

      scrapy.get("https://gettest.com", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("Redirect");
        expect(res.statusCodeMessage).to.equal("OK");
        done();
      });
    });

    it("should return error if the number of consecutive redirects\n\t" +
    "is greater than 10", function (done) {
      nock("https://gettest.com").get("/").times(11).reply(302, "", {
        location: "https://gettest.com"
      });

      scrapy.get("https://gettest.com", err => {
        expect(err).to.equal("Too many consecutive redirects");
        done();
      });
    });

  });

  describe("Set-Cookie header tests" , function () {
  
    it("should correctly send request and set cookie passed from server", 
    function (done) {
      const cookie = [
        "foobar=bar; Expires=Fri, 29 Dec 9999 09:11:31 GMT",
        "bar=foobar; path=/",
        "barfoo=foo"
      ];

      nock("https://gettest.com").get("/").reply(302, "", {
        "set-cookie": cookie,
        "location": "https://gettest.com/redirected"

      });
      nock("https://gettest.com").get("/redirected").reply(200, "Redirect");

      scrapy.get("https://gettest.com", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("Redirect");
        expect(res.statusCodeMessage).to.equal("OK");
        expect(res.req.cookie).to.equal("foobar=bar;bar=foobar;barfoo=foo");
        done();
      });
    });

    it("should correctly send request and set cookie passed from server", 
    function (done) {
      const cookie = [
        "foobar=bar; Expires=Fri, 29 Dec 9999 09:11:31 GMT",
        "bar=foobar; path=/",
        "barfoo=foo"
      ];

      nock("https://gettest.com").get("/").reply(302, "", {
        "set-cookie": cookie,
        "location": "https://gettestred.com"

      });
      nock("https://gettestred.com").get("/").reply(200, "Redirect");

      scrapy.get("https://gettest.com", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("Redirect");
        expect(res.statusCodeMessage).to.equal("OK");
        expect(res.req.cookie).to.equal("");
        done();
      });
    });

    it("should correctly send request and set cookie passed from server", 
    function (done) {
      const cookie = [
        "foobar=bar; Expires=Fri, 29 Dec 9999 09:11:31 GMT",
        "bar=foobar; path=/redirected",
        "barfoo=foo"
      ];

      nock("https://gettestred.com").get("/").reply(302, "", {
        "set-cookie": cookie,
        "location": "https://gettestred.com"

      });
      nock("https://gettestred.com").get("/").reply(200, "Redirect");

      scrapy.get("https://gettestred.com", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("Redirect");
        expect(res.statusCodeMessage).to.equal("OK");
        expect(res.req.cookie).to.equal("foobar=bar;barfoo=foo");
        done();
      });
    });

    it("should correctly send request and set cookie passed from server", 
    function (done) {
      const cookie = [
        "foobar=bar;Domain=gettest.com;Expires=Fri, 29 Dec 9999 09:11:31 GMT",
        "bar=foobar;Domain=gettest.com;path=/",
        "barfoo=foo"
      ];

      nock("https://gettest.com").get("/").reply(302, "", {
        "set-cookie": cookie,
        "location": "https://gettest.com/redone"

      });
      nock("https://gettest.com").get("/redone").reply(302, "", {
        "set-cookie": ["foobar=bar; Expires=Fri, 29 Dec 1970 09:11:31 GMT"],
        "location": "https://gettest.com/red2"

      });
      nock("https://gettest.com").get("/red2").reply(200, "Red");

      scrapy.get("https://gettest.com", (err, res) => {
        /* jshint ignore:start */
        expect(err).to.not.exist;
        /* jshint ignore:end */
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal("Red");
        expect(res.statusCodeMessage).to.equal("OK");
        expect(res.req.cookie).to.equal("bar=foobar;barfoo=foo");
        done();
      });
    });

  });

});
