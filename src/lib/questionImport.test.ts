import { describe, it, expect } from "vitest";
import {
  parseQuestionsJSON,
  parseQuestionsCSV,
  QuestionImportError,
} from "./questionImport";

describe("parseQuestionsJSON", () => {
  it("naparsuje pole platných otázek všech tří typů", () => {
    const json = JSON.stringify([
      {
        text: "Hlavní město Francie?",
        type: "quiz",
        options: ["Paříž", "Londýn", "Berlín", "Madrid"],
        correctIndex: 0,
        timeLimit: 20,
        points: 1000,
      },
      {
        text: "Země je placatá",
        type: "true_false",
        options: ["Pravda", "Nepravda"],
        correctIndex: 1,
        timeLimit: 10,
        points: 1000,
      },
      {
        text: "Řeka tekoucí Prahou?",
        type: "type_answer",
        options: ["Vltava"],
        correctIndex: 0,
        timeLimit: 30,
        points: 2000,
      },
    ]);
    const result = parseQuestionsJSON(json);
    expect(result).toHaveLength(3);
    expect(result[0].type).toBe("quiz");
    expect(result[1].correctIndex).toBe(1);
    expect(result[2].options).toEqual(["Vltava"]);
  });

  it("vyhodí chybu když JSON není pole", () => {
    expect(() => parseQuestionsJSON("{}")).toThrow(QuestionImportError);
  });

  it("vyhodí chybu při neznámém typu", () => {
    const json = JSON.stringify([
      {
        text: "?",
        type: "neznamy",
        options: ["a"],
        correctIndex: 0,
        timeLimit: 10,
        points: 1000,
      },
    ]);
    expect(() => parseQuestionsJSON(json)).toThrow(/neznámý typ/);
  });

  it("vyhodí chybu když quiz nemá 4 neprázdné možnosti", () => {
    const json = JSON.stringify([
      {
        text: "?",
        type: "quiz",
        options: ["a", "b", "c", ""],
        correctIndex: 0,
        timeLimit: 10,
        points: 1000,
      },
    ]);
    expect(() => parseQuestionsJSON(json)).toThrow(/4 neprázdné/);
  });

  it("vyhodí chybu když correctIndex je mimo rozsah", () => {
    const json = JSON.stringify([
      {
        text: "?",
        type: "true_false",
        options: ["Ano", "Ne"],
        correctIndex: 5,
        timeLimit: 10,
        points: 1000,
      },
    ]);
    expect(() => parseQuestionsJSON(json)).toThrow(/correctIndex/);
  });
});

describe("parseQuestionsCSV", () => {
  it("naparsuje CSV s čárkou jako oddělovačem", () => {
    const csv = [
      "text,type,option1,option2,option3,option4,correctIndex,timeLimit,points",
      '"Hlavní město Francie?",quiz,Paříž,Londýn,Berlín,Madrid,0,20,1000',
      "Země je placatá,true_false,Pravda,Nepravda,,,1,10,1000",
      "Řeka v Praze?,type_answer,Vltava,,,,0,30,2000",
    ].join("\n");
    const result = parseQuestionsCSV(csv);
    expect(result).toHaveLength(3);
    expect(result[0].options).toEqual(["Paříž", "Londýn", "Berlín", "Madrid"]);
    expect(result[1].options).toEqual(["Pravda", "Nepravda"]);
    expect(result[2].options).toEqual(["Vltava"]);
    expect(result[2].points).toBe(2000);
  });

  it("podporuje středník jako oddělovač (Czech Excel)", () => {
    const csv = [
      "text;type;option1;option2;option3;option4;correctIndex;timeLimit;points",
      "Otázka;quiz;A;B;C;D;2;15;1000",
    ].join("\n");
    const result = parseQuestionsCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].correctIndex).toBe(2);
  });

  it("vyhodí chybu při chybějícím sloupci", () => {
    const csv = "text,type\nfoo,quiz";
    expect(() => parseQuestionsCSV(csv)).toThrow(/postrádá sloupec/);
  });

  it("vyhodí chybu když je jen hlavička", () => {
    const csv =
      "text,type,option1,option2,option3,option4,correctIndex,timeLimit,points";
    expect(() => parseQuestionsCSV(csv)).toThrow(/alespoň jednu/);
  });
});
