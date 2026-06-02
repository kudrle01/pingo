import { describe, expect, it } from "vitest";
import { calculateScore } from "./scoring";

describe("calculateScore", () => {
  it("vrátí 0 při špatné odpovědi", () => {
    const score = calculateScore(false, 20, 5000, 1000, 0);
    expect(score).toBe(0);
  });

  it("vrátí plné body při okamžité správné odpovědi (ms ≈ 0)", () => {
    const score = calculateScore(true, 20, 0, 1000, 0);
    expect(score).toBe(1000);
  });

  it("správně snižuje body podle uplynulého času", () => {
    const score = calculateScore(true, 20, 10000, 1000, 0);
    expect(score).toBe(750);
  });

  it("přidává streak bonus (50 bodů za každý streak)", () => {
    const score = calculateScore(true, 20, 0, 1000, 3);
    expect(score).toBe(1150);
  });

  it("omezuje streak bonus na max 300 bodů", () => {
    const score = calculateScore(true, 20, 0, 1000, 10);
    expect(score).toBe(1300);
  });

  it("funguje s 2000 basePoints (těžká otázka)", () => {
    const score = calculateScore(true, 30, 0, 2000, 0);
    expect(score).toBe(2000);
  });
});
