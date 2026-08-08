import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanText,
  isStrongPassword,
  isValidEmail,
  normalizeEmail,
  parseNonNegativeInteger,
  parseNonNegativeNumber,
  parsePositiveInteger,
} from "../Utils/validation.js";

test("normalizes and validates email addresses", () => {
  assert.equal(normalizeEmail("  User@Example.COM "), "user@example.com");
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail("../profile.jpg"), false);
});

test("enforces password length", () => {
  assert.equal(isStrongPassword("short"), false);
  assert.equal(isStrongPassword("long-enough"), true);
  assert.equal(isStrongPassword("x".repeat(129)), false);
});

test("parses bounded positive integers", () => {
  assert.equal(parsePositiveInteger("3", { max: 5 }), 3);
  assert.equal(parsePositiveInteger(0), null);
  assert.equal(parsePositiveInteger(1.5), null);
  assert.equal(parsePositiveInteger(6, { max: 5 }), null);
});

test("parses non-negative finite numbers", () => {
  assert.equal(parseNonNegativeNumber("99.50"), 99.5);
  assert.equal(parseNonNegativeNumber(-1), null);
  assert.equal(parseNonNegativeNumber("not-a-number"), null);
});

test("parses non-negative integers", () => {
  assert.equal(parseNonNegativeInteger("0"), 0);
  assert.equal(parseNonNegativeInteger("5"), 5);
  assert.equal(parseNonNegativeInteger(1.5), null);
});

test("trims and bounds text", () => {
  assert.equal(cleanText("  hello  ", 20), "hello");
  assert.equal(cleanText("abcdef", 3), "abc");
  assert.equal(cleanText(null, 3), "");
});
