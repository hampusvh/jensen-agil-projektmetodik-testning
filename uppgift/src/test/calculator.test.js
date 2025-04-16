import { beforeEach, test, expect } from "vitest";
import { createCalculator } from "../lib/calculator.js";

let calculator;

beforeEach(() => {
  calculator = createCalculator();
});

test("adderar två tal", () => {
  expect(calculator.add(2, 2)).toBe(4);
});

test("subtraherar två tal", () => {
  expect(calculator.subtract(3, 2)).toBe(1);
});

test("multiplicerar två tal", () => {
  expect(calculator.multiply(3, 2)).toBe(6);
});

test("dividerar två tal", () => {
  expect(calculator.divide(6, 2)).toBe(3);
});
