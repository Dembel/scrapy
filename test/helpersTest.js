const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const fs = require("fs");
const helpers = require("../src/helpers");

describe("Helpers tests", function () {

  describe("parseUri function tests", function () {

    it("should correctly extract protocol, host, path and port from uri string",
      function () {
        const uri = "http://www.foo.com:40/bar";
        const result = helpers.parseUri(uri);
          
        expect(result.protocol).to.equal("http:");
        expect(result.hostname).to.equal("www.foo.com");
        expect(result.path).to.equal("/bar");
        expect(result.port).to.equal("40");
    });

    it("should correctly extract protocol, host, path and port from uri string",
      function () {
        const uri = "foo.com:40/bar";
        const result = helpers.parseUri(uri);
          
        expect(result.protocol).to.equal("http:");
        expect(result.hostname).to.equal("foo.com");
        expect(result.path).to.equal("/bar");
        expect(result.port).to.equal("40");
    });

    it("should correctly extract protocol, host, path and port from uri string",
      function () {
        const uri = "http://foobar.com/barfoo";
        const result = helpers.parseUri(uri);

        expect(result.protocol).to.equal("http:");
        expect(result.hostname).to.equal("foobar.com");
        expect(result.path).to.equal("/barfoo");
        expect(result.port).to.equal("");
    });

    it("should correctly extract protocol, host, path and port from uri string",
      function () {
        const uri = "https://bar.com";
        const result = helpers.parseUri(uri);

        expect(result.protocol).to.equal("https:");
        expect(result.hostname).to.equal("bar.com");
        expect(result.path).to.equal("/");
        expect(result.port).to.equal("");
    });

    it("should correctly extract protocol, host, path and port from uri string",
      function () {
        const uri = "https://bar.com:443/bar?foo=bar&bar=foo#foobar";
        const result = helpers.parseUri(uri);

        expect(result.protocol).to.equal("https:");
        expect(result.hostname).to.equal("bar.com");
        expect(result.path).to.equal("/bar?foo=bar&bar=foo#foobar");
        expect(result.port).to.equal("443");
    });
    
  });

  describe("log function tests", function () {
  
    beforeEach(function () {
      this.sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      this.sandbox.restore();
    });

    it("should save GET request log into a file", function () {
      const res = { req: { hostname: "foobar.com" } };
      const writeFileStub = this.sandbox.stub(
        fs, 
        "writeFile"
      );

      helpers.log(res);

      sinon.assert.calledOnce(writeFileStub);
      sinon.assert.calledWith(writeFileStub, "src/logs/foobar.com.log");
    });

    it("should save POST request log into a file", function () {
      const res = { req: { hostname: "bar.com" } };
      const writeFileStub = this.sandbox.stub(
        fs, 
        "writeFile"
      );

      helpers.log(res);

      sinon.assert.calledOnce(writeFileStub);
      sinon.assert.calledWith(writeFileStub, "src/logs/bar.com.log");
    });

    it("should save POST request log into a file", function () {
      const res = { req: { hostname: "bar.com" } };
      const writeFileStub = this.sandbox.stub(
        fs, 
        "writeFile"
      );

      helpers.log(res);

      sinon.assert.calledOnce(writeFileStub);
      sinon.assert.calledWith(writeFileStub, "src/logs/bar.com.log");
    });

  });

});
