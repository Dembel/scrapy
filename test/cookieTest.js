"use strict";
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const fs = require("fs");
const cookie = require("../src/cookie");
const cookieDir = process.env.PWD + "/src/cookies";

describe("Cookie module tests", function () {

  it("should return an empty array", function () {
    /* jshint ignore:start */
    const input = [];

    expect(cookie.parse(input)).to.be.empty;
    /* jshint ignore:end */
  });

  describe("Expires directive tests", function () {

    it("should return an empty array", function () {
      /* jshint ignore:start */
      const input = [
        "foo=bar; expires=" + new Date(1980, 12, 12).toUTCString(),
        "bar=fo; expires=" + new Date(1970, 12, 12).toUTCString() + "; path=/"];

      expect(cookie.parse(input)).to.be.empty;
      /* jshint ignore:end */
    });

    it("should correctly parse Expires", function () {
      const input = ["foo=bar", "bar=foo", "foobar=barf"];

      expect(cookie.parse(input)).to.eql(["foo=bar", "bar=foo", "foobar=barf"]);
    });

    it("should correctly parse Expires",
    function () {
      const date1 = new Date(9999, 12, 12).toUTCString();
      const date2 = new Date(5000, 12, 12).toUTCString();
      const input = [
        "foo=bar; Expires=" + date1,
        "bar=foo; Expires=" + date2,
        "foobar=barf; Expires=" + new Date(1990, 12, 12).toUTCString()
      ];

      expect(cookie.parse(input)).to.eql([
        "foo=bar; Expires=" + date1,
        "bar=foo; Expires=" + date2
      ]);
    });

    it("should correctly parse Expires", function () {
      const date = new Date(5000, 12, 12).toUTCString();
      const input = [
        "foo=bar; Expires=" + new Date().toUTCString() + "; path=/",
        "bar=foo; expires=" + date + "; path=/",
        "foob=bar; Expires=" + new Date(1990, 12, 12).toUTCString() + "; path=/"
      ];

      expect(cookie.parse(input)).to.eql([
        "bar=foo; expires=" + date + "; path=/"
      ]);
    });

    it("should correctly parse Expires", function () {
      const date1 = new Date(9999, 12, 12).toUTCString();
      const date2 = new Date(5000, 12, 12).toUTCString();
      const input = [
        "foo=bar; expires=" + new Date(9999, 12, 12).toUTCString(),
        "bar=foo; Expires=" + new Date(5000, 12, 12).toUTCString(),
        "foobar=barf; Expires=" + new Date(1990, 12, 12).toUTCString(),
        "foo=str; expires=" + date1,
        "bar=foor; Expires=" + date2
      ];

      expect(cookie.parse(input)).to.eql([
        "foo=str; expires=" + date1,
        "bar=foor; Expires=" + date2]);
    });

    it("should correctly parse Expires", function () {
      const date1 = new Date(9999, 12, 12).toUTCString();
      const date2 = new Date(5000, 12, 12).toUTCString();
      const input = [
        "foo=bar; expires=" + new Date(9999, 12, 12).toUTCString(),
        "bar=foo; Expires=" + new Date(5000, 12, 12).toUTCString(),
        "foobar=barf; Expires=" + new Date(1990, 12, 12).toUTCString(),
        "john=dough",
        "foo=str; expires=" + new Date(9999, 12, 12).toUTCString(),
        "bar=foor; Expires=" + new Date(9999, 12, 12).toUTCString(),
        "john=dough; domain=foo.com",
        "foobarf=foo",
        "foo=barfoo; expires=" + date1,
        "bar=gon",
        "bar=fobarfoo; expires=" + date2
      ];

      expect(cookie.parse(input)).to.eql([
        "john=dough; domain=foo.com",
        "foobarf=foo",
        "foo=barfoo; expires=" + date1,
        "bar=fobarfoo; expires=" + date2
      ]);
    });

    it("should correctly parse Expires",
    function () {
      const date1 = new Date(9999, 12, 12).toUTCString();
      const date2 = new Date(5000, 12, 12).toUTCString();
      const input = [
        "foo=bar; Expires=" + date1,
        "bar=foo; Expires=" + date2,
        "foobar=barf; Expires=" + new Date(1990, 12, 12).toUTCString()
      ];

      expect(cookie.parse(input)).to.eql([
        "foo=bar; Expires=" + date1, 
        "bar=foo; Expires=" + date2
      ]);
    });

    it("should correctly parse Expires",
    function () {
      const date1 = new Date(9999, 12, 12).toUTCString();
      const date2 = new Date(5000, 12, 12).toUTCString();
      const input = [
        "foo=bar; expires=" + new Date(9999, 12, 12).toUTCString(),
        "bar=foo; Expires=" + new Date(5000, 12, 12).toUTCString(),
        "foobar=barf; Expires=" + new Date(1990, 12, 12).toUTCString(),
        "john=dough",
        "foo=str; expires=" + new Date(9999, 12, 12).toUTCString(),
        "bar=foor; Expires=" + new Date(9999, 12, 12).toUTCString(),
        "john=dough; domain=foo.com",
        "foobarf=foo",
        "foo=barfoo; expires=" + date1,
        "bar=gon",
        "bar=fobarfoo; expires=" + date2
      ];

      expect(cookie.parse(input)).to.eql([
        "john=dough; domain=foo.com",
        "foobarf=foo",
        "foo=barfoo; expires=" + date1,
        "bar=fobarfoo; expires=" + date2
      ]);
    });
  });

  describe("Domain directive tests", function () {

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foo=barfoo"
      ];

      expect(cookie.selectDomain("foo.com", input)).to.eql([
        "john=dough; domain=foo.com",
        "foo=barfoo"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; Domain=foo.com",
        "foobarf=foo; Domain=bar.ru; path=/"
      ];

      expect(cookie.selectDomain("foo.com", input)).to.eql([
        "john=dough; Domain=foo.com"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; Domain=foo.com; path=/",
        "foobarf=foo; Domain=bar.ru; path=/"
      ];

      expect(cookie.selectDomain("foo.com", input)).to.eql([
        "john=dough; Domain=foo.com; path=/"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foo.com",
        "foobarf=foo; Domain=bar.ru; path=/"
      ];

      expect(cookie.selectDomain("bar.foo.com", input)).to.eql([
        "john=dough; domain=foo.com"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foobar=bar; path=/; domain=foobar.foo.com"
      ];

      expect(cookie.selectDomain("bar.foobar.foo.com", input)).to.eql([
        "john=dough; domain=foo.com",
        "foobar=bar; path=/; domain=foobar.foo.com"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foobar=bar; path=/; domain=foo.com"
      ];

      expect(cookie.selectDomain("foobar.bar.foobar.foo.com", input)).to.eql([
        "john=dough; domain=foo.com",
        "foobar=bar; path=/; domain=foo.com"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foobar=bar; path=/; domain=foo.com",
        "bar=foo; domain=foo.com:coverNull"
      ];

      expect(cookie.selectDomain("bar.foo.barfoo.foobar.bar.foobar.foo.com",
      input)).to.eql([
        "john=dough; domain=foo.com",
        "foobar=bar; path=/; domain=foo.com"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foobar.foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foobar=bar; path=/; domain=foo.com",
        "bar=foo; domain=foo.com:coverNull"
      ];

      expect(cookie.selectDomain("foo.com", input)).to.eql([
        "foobar=bar; path=/; domain=foo.com",
        "bar=foo; domain=foo.com:coverNull"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foobar.foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foobar=bar; path=/; domain=foo.com",
        "bar=foo; domain=www.foobar.foo.com:coverNull"
      ];

      expect(cookie.selectDomain("foobar.foo.com", input)).to.eql([
        "john=dough; domain=foobar.foo.com",
        "foobar=bar; path=/; domain=foo.com"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foobar.foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foobar=bar; path=/; domain=foo.com",
        "bar=foo; domain=foobar.foo.com:coverNull"
      ];

      expect(cookie.selectDomain("foobar.foo.com", input)).to.eql([
        "john=dough; domain=foobar.foo.com",
        "foobar=bar; path=/; domain=foo.com",
        "bar=foo; domain=foobar.foo.com:coverNull"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foobar.foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foobar=bar; path=/; domain=barfoo.com"
      ];

      expect(cookie.selectDomain("foobar.foo.com", input)).to.eql([
        "john=dough; domain=foobar.foo.com"
      ]);
    });

    it("should return cookies with valid Domen", function () {
      const input = [
        "john=dough; domain=foobar.foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foo=barfo; domain=foo.com",
        "foo=barf; domain=foo.bar.foobar.foo.com",
        "foobar=bar; path=/; domain=barfoo.com"
      ];

      expect(cookie.selectDomain("bar.foobar.foo.com", input)).to.eql([
        "john=dough; domain=foobar.foo.com",
        "foo=barfo; domain=foo.com"
      ]);
    });

    it("should return cookies with valid Domen and remove leading dot",
    function () {
      const input = cookie.parse([
        "john=dough; domain=.foobar.foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foobar=bar; path=/; domain=.foo.com",
        "bar=foo; domain=www.foobar.foo.com:coverNull"
      ]);

      expect(cookie.selectDomain("foobar.foo.com", input)).to.eql([
        "john=dough; domain=foobar.foo.com",
        "foobar=bar; path=/; domain=foo.com"
      ]);
    });

    it("should return cookies with valid Domen and remove leading dot",
    function () {
      const input = cookie.parse([
        "john=dough; Domain=.foobar.foo.com",
        "foobarf=foo; Domain=bar.ru; path=/",
        "foobar=bar; path=/; domain=.foo.com",
        "bar=foo; domain=www.foobar.foo.com:coverNull"
      ]);

      expect(cookie.selectDomain("foobar.foo.com", input)).to.eql([
        "john=dough; Domain=foobar.foo.com",
        "foobar=bar; path=/; domain=foo.com"
      ]);
    });

  });

  describe("Path directive tests", function () {

    it("should return cookies with valid Path directive", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=/",
        "foo=barfo",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.selectPath("/", input)).to.eql([
        "foobarf=foo; Domain=bar.ru; path=/",
        "foo=barfo",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ]);
    });

    it("should return cookies with valid Path directive", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=/foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.selectPath("/", input)).to.eql([
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ]);
    });

    it("should return cookies with valid Path directive", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=/foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.selectPath("/foo", input)).to.eql([
        "foobarf=foo; Domain=bar.ru; path=/foo",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ]);
    });

    it("should return cookies with valid Path directive", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=/foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.selectPath("/foo/", input)).to.eql([
        "foobarf=foo; Domain=bar.ru; path=/foo",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ]);
    });

    it("should return cookies with valid Path directive", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=/foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.selectPath("/foo/bar", input)).to.eql([
        "foobarf=foo; Domain=bar.ru; path=/foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ]);
    });

    it("should return cookies with valid Path directive", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=/foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.selectPath("/foo/bar/foobar/foo/bar", input)).to.eql([
        "foobarf=foo; Domain=bar.ru; path=/foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ]);
    });

    it("should return cookies with valid Path directive", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.selectPath("/foo/bar/foobar/", input)).to.eql([
        "foobarf=foo; Domain=bar.ru; path=foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ]);
    });

    it("should consider path to be \"/\" if there's no Path directive" +
    " or if it's not valid", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=foo",
        "foo=barfo; path=/foo/bar",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.selectPath("/", input)).to.eql([
        "foobarf=foo; Domain=bar.ru; path=foo",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ]);
    });

  });

  describe("Secure directive tests", function () {

    it("should filter out cookies w/o Secure directive", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=foo",
        "foo=barfo; path=/foo/bar; Secure",
        "foobar=bar; Secure; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.secure(input)).to.eql([
        "foo=barfo; path=/foo/bar; Secure",
        "foobar=bar; Secure; path=/; domain=barfoo.com"
      ]);
    });

    it("should filter out cookies with Secure directive", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=foo",
        "foo=barfo; path=/foo/bar; Secure",
        "foobar=bar; Secure; path=/; domain=barfoo.com",
        "barr=fobar"
      ];
      expect(cookie.notSecure(input)).to.eql([
        "foobarf=foo; Domain=bar.ru; path=foo",
        "barr=fobar"
      ]);
    });

  });

  describe("nameVal function tests", function () {
  
    it("should parse cookies and return name=value pairs only", function () {
      const input = [
        "foo=bar; expires=" + new Date(9999, 12, 12).toUTCString(),
        "bar=foo; Expires=" + new Date(5000, 12, 12).toUTCString(),
        "foobar=barf; Expires=" + new Date(1990, 12, 12).toUTCString(),
        "foo=str; expires=" + new Date(9999, 12, 12).toUTCString(),
        "bar=foor; Expires=" + new Date(9999, 12, 12).toUTCString(),
        "john=dough; domain=foo.com",
        "foobarf=foo",
        "foo=barfoo; path=/",
        "bar=gon",
        "bar=fobarfoo; domain=foo.bar; path=/; Secure"
      ];
      
      expect(cookie.nameVal(input)).to.eql([
        "foo=bar", "bar=foo", "foobar=barf", "foo=str", "bar=foor", 
        "john=dough", "foobarf=foo", "foo=barfoo", "bar=gon",
        "bar=fobarfoo"
      ]);
    });
  });

  describe("setDomain function tests", function () {
  
    it("should set cookie domain with :coverNull tag" +
    " if there's no cover domain", function () {
      const input = [
        "foobarf=foo; Domain=bar.ru; path=/",
        "foo=barfo",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar"
      ];

      expect(cookie.setDomain("bar.foobar.foo.com", input)).to.eql([
        "foobarf=foo; Domain=bar.ru; path=/",
        "foo=barfo;domain=bar.foobar.foo.com;coverNull",
        "foobar=bar; path=/; domain=barfoo.com",
        "barr=fobar;domain=bar.foobar.foo.com;coverNull"
      ]);
    });
  
  });

  describe("saveCookie function tests", function () {

    beforeEach(function () {
      this.sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      this.sandbox.restore();
    });

    it("should save cookie into a file", function () {
      const writeFileSyncStub = this.sandbox.stub(fs, "writeFileSync");
      const cookieArray = [
        "bar=foo;domain=bar.foo.com",
        "barfoo=foo;domain=bar.foo.com",
      ];

      cookie.saveCookie("bar.foo.com", cookieArray);

      sinon.assert.calledOnce(writeFileSyncStub);
      sinon.assert.calledWith(
        writeFileSyncStub, 
        cookieDir + "/bar.foo.com",
        "bar=foo;domain=bar.foo.com*****barfoo=foo;domain=bar.foo.com"
      );
    });

    it("should not save anything if passed cookieArray is empty", function () {
      const writeFileSyncStub = this.sandbox.stub(fs, "writeFileSync");
      const cookieArray = [];

      cookie.saveCookie("bar.foo.com", cookieArray);

      sinon.assert.notCalled(writeFileSyncStub);
    });

    it("should create coookie directory if it doesn't exist",
    function () {
      const mkdirSyncStub = this.sandbox.stub(fs, "mkdirSync");
      const writeFileSyncStub = this.sandbox.stub(fs, "writeFileSync");
      const existsSyncStub = this.sandbox.stub(fs, "existsSync");
      const cookieArray = ["foo=bar;domain=bar.foo.com"];

      existsSyncStub.withArgs().returns(false);
      
      cookie.saveCookie("bar.foo.com", cookieArray);

      sinon.assert.calledOnce(writeFileSyncStub);
      sinon.assert.calledOnce(mkdirSyncStub);
    });

  });

  describe("clearCookie function tests", function () {

    beforeEach(function () {
      this.sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      this.sandbox.restore();
    });

    it("should remove all cookie files from cookie directory", function () {
      const readdirSyncStub = this.sandbox.stub(fs, "readdirSync");
      const unlinkStub = this.sandbox.stub(fs, "unlink");
      const cookieFiles = ["foo=bar", "bar=foo", "foobar=bar"];

      readdirSyncStub.withArgs(cookieDir).returns(cookieFiles);
      cookie.clearCookie();

      sinon.assert.calledThrice(unlinkStub);
      sinon.assert.callOrder(
        unlinkStub.withArgs(cookieDir + "/foo=bar"),
        unlinkStub.withArgs(cookieDir + "/bar=foo"),
        unlinkStub.withArgs(cookieDir + "/foobar=bar")
      );
    });

    it("should do nothing if cookie dir is empty", function () {
      const readdirSyncStub = this.sandbox.stub(fs, "readdirSync");
      const unlinkStub = this.sandbox.stub(fs, "unlink");

      readdirSyncStub.withArgs(cookieDir).returns([]);
      cookie.clearCookie();

      sinon.assert.notCalled(unlinkStub);
    });

  });

  describe("getCookie function tests", function () {

    beforeEach(function () {
      this.sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      this.sandbox.restore();
    });

    it("should return an empty array if no cookie was found", function () {
      const readdirSyncStub = this.sandbox.stub(fs, "readdirSync");

      readdirSyncStub.withArgs(cookieDir).returns([]);

      const result = cookie.getCookie("http://foo.com/bar");

      sinon.assert.calledOnce(readdirSyncStub);
      expect(result).to.eql([]);
    });

    it("should return an array of cookie when given the req uri", function () {
      const readdirSyncStub = this.sandbox.stub(fs, "readdirSync");
      const readFileSyncStub = this.sandbox.stub(fs, "readFileSync");
      const cookie1 = "foo=bar;domain=foo.com*****" + 
        "bar=foo;domain=foo.com;path=/john*****" +
        "bar=foobar;domain=foo.com;coverNull;path=/bar";
      const cookie2 = "bar=foob;domain=bar.net;coverNull;path=/";

      readdirSyncStub.withArgs(cookieDir).returns(["foo.com", "bar.net"]);
      readFileSyncStub.withArgs(cookieDir + "/foo.com").returns(cookie1);
      readFileSyncStub.withArgs(cookieDir + "/bar.net").returns(cookie2);

      const result = cookie.getCookie("http://foo.com/bar");

      sinon.assert.calledOnce(readFileSyncStub);
      expect(result).to.eql([
        "foo=bar;domain=foo.com",
        "bar=foobar;domain=foo.com;coverNull;path=/bar"
      ]);
    });

    it("should return an array of cookie when given the req uri", function () {
      const readdirSyncStub = this.sandbox.stub(fs, "readdirSync");
      const readFileSyncStub = this.sandbox.stub(fs, "readFileSync");
      const cookie1 = "foo=bar;domain=foo.com*****" + 
        "bar=foo;domain=foo.com;path=/john*****" +
        "bar=foobar;domain=foo.com;coverNull;path=/bar";
      const cookie2 = "bar=barfoo;domain=bar.foo.com;path=/bar*****" +
        "barbar=foofoo;domain=bar.foo.com;coverNull";
      const cookie3 = "bar=foob;domain=bar.net;coverNull;path=/";

      readdirSyncStub.withArgs(cookieDir).returns([
        "bar.foo.com", "foo.com", "bar.net"
      ]);

      readFileSyncStub.withArgs(cookieDir + "/foo.com").returns(cookie1);
      readFileSyncStub.withArgs(cookieDir + "/bar.foo.com").returns(cookie2);
      readFileSyncStub.withArgs(cookieDir + "/bar.net").returns(cookie3);

      const result = cookie.getCookie("http://foo.com/bar");

      sinon.assert.calledTwice(readFileSyncStub);
      expect(result).to.eql([
        "bar=barfoo;domain=bar.foo.com;path=/bar",
        "foo=bar;domain=foo.com",
        "bar=foobar;domain=foo.com;coverNull;path=/bar"
      ]);
    });

    it("should create coookie directory if it doesn't exist",
    function () {
      const mkdirSyncStub = this.sandbox.stub(fs, "mkdirSync");
      const existsSyncStub = this.sandbox.stub(fs, "existsSync");

      existsSyncStub.withArgs().returns(false);
      
      cookie.getCookie("http://bar.foo.com");

      sinon.assert.calledOnce(mkdirSyncStub);
    });

  });

});
