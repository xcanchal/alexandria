import { expect } from "chai";

export default function validateDate(date: Date) {
  expect(date.getFullYear()).eq(new Date().getFullYear());
  expect(date.getMonth()).eq(new Date().getMonth());
  expect(date.getDate()).eq(new Date().getDate());
}
