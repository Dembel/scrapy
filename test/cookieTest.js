"use strict";
const chai = require("chai");
const expect = chai.expect;
const cookie = require("../src/cookie");

describe("Cookie parser tests", function () {

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

    it("should correctly parse Expires and return name-value only",
    function () {
      const date1 = new Date(9999, 12, 12).toUTCString();
      const date2 = new Date(5000, 12, 12).toUTCString();

      const input = [
        "foo=bar; Expires=" + date1,
        "bar=foo; Expires=" + date2,
        "foobar=barf; Expires=" + new Date(1990, 12, 12).toUTCString()
      ];
      const parsed = cookie.parse(input);
      expect(cookie.nameVal(parsed)).to.eql(["foo=bar", "bar=foo"]);
    });

    it("should correctly parse Expires and return name-value only",
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
      const parsed = cookie.parse(input);
      expect(cookie.nameVal(parsed)).to.eql([
        "john=dough",
        "foobarf=foo",
        "foo=barfoo",
        "bar=fobarfoo"
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

    it("should consider path to be \"/\" if there's no Path directive\n\t" +
    "or if it's not valid", function () {
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

});
