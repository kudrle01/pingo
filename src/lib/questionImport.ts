import type { Question, QuestionType } from "@/types";

export class QuestionImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuestionImportError";
  }
}

const VALID_TYPES: ReadonlySet<QuestionType> = new Set([
  "quiz",
  "true_false",
  "type_answer",
]);


function normalizeQuestion(raw: unknown, label: string): Question {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new QuestionImportError(`${label}: očekáván objekt`);
  }
  const r = raw as Record<string, unknown>;

  const text = typeof r.text === "string" ? r.text.trim() : "";
  if (!text) throw new QuestionImportError(`${label}: chybí "text"`);

  const type = r.type as QuestionType;
  if (!VALID_TYPES.has(type)) {
    throw new QuestionImportError(
      `${label}: neznámý typ "${String(r.type)}" (povolené: quiz, true_false, type_answer)`,
    );
  }

  const rawOptions = Array.isArray(r.options) ? r.options : null;
  if (!rawOptions) {
    throw new QuestionImportError(`${label}: "options" musí být pole`);
  }
  const options = rawOptions.map((o) => String(o ?? "").trim());

  if (type === "quiz") {
    if (options.length !== 4 || options.some((o) => !o)) {
      throw new QuestionImportError(
        `${label}: typ "quiz" vyžaduje právě 4 neprázdné možnosti`,
      );
    }
  } else if (type === "true_false") {
    if (options.length !== 2) {
      throw new QuestionImportError(
        `${label}: typ "true_false" vyžaduje právě 2 možnosti`,
      );
    }
  } else {
    if (options.length < 1 || !options[0]) {
      throw new QuestionImportError(
        `${label}: typ "type_answer" vyžaduje neprázdnou správnou odpověď v options[0]`,
      );
    }
  }

  const correctIndex = Number(r.correctIndex);
  if (
    !Number.isInteger(correctIndex) ||
    correctIndex < 0 ||
    correctIndex >= options.length
  ) {
    throw new QuestionImportError(
      `${label}: "correctIndex" musí být celé číslo 0..${options.length - 1}`,
    );
  }

  const timeLimit = Number(r.timeLimit);
  if (!Number.isFinite(timeLimit) || timeLimit <= 0) {
    throw new QuestionImportError(`${label}: "timeLimit" musí být kladné číslo`);
  }

  const points = Number(r.points);
  if (!Number.isFinite(points) || points <= 0) {
    throw new QuestionImportError(`${label}: "points" musí být kladné číslo`);
  }

  return { text, type, options, correctIndex, timeLimit, points };
}

export function parseQuestionsJSON(source: string): Question[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (e) {
    throw new QuestionImportError(
      `Soubor není validní JSON: ${(e as Error).message}`,
    );
  }
  if (!Array.isArray(parsed)) {
    throw new QuestionImportError("JSON musí obsahovat pole otázek");
  }
  return parsed.map((item, i) => normalizeQuestion(item, `Otázka ${i + 1}`));
}


function parseCsvLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delim) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}


export function parseQuestionsCSV(source: string): Question[] {
  const lines = source
    .split(/\r?\n/)
    .map((l) => l)
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    throw new QuestionImportError("CSV musí mít hlavičku a alespoň jednu otázku");
  }

  const headerLine = lines[0];
  const delim = headerLine.includes(";") ? ";" : ",";
  const header = parseCsvLine(headerLine, delim).map((h) => h.toLowerCase());

  const idx = (name: string) => header.indexOf(name);
  const required = [
    "text",
    "type",
    "option1",
    "option2",
    "option3",
    "option4",
    "correctindex",
    "timelimit",
    "points",
  ];
  for (const r of required) {
    if (idx(r) === -1) {
      throw new QuestionImportError(
        `CSV hlavička postrádá sloupec "${r}". Požadované: ${required.join(", ")}`,
      );
    }
  }

  return lines.slice(1).map((line, i) => {
    const cells = parseCsvLine(line, delim);
    const get = (name: string) => cells[idx(name)] ?? "";
    const optionsRaw = [
      get("option1"),
      get("option2"),
      get("option3"),
      get("option4"),
    ];
    const type = get("type") as QuestionType;

    let options: string[];
    if (type === "quiz") {
      options = optionsRaw;
    } else if (type === "true_false") {
      options = optionsRaw.slice(0, 2);
    } else {
      options = [optionsRaw[0] ?? ""];
    }

    const raw = {
      text: get("text"),
      type,
      options,
      correctIndex: Number(get("correctindex")),
      timeLimit: Number(get("timelimit")),
      points: Number(get("points")),
    };
    return normalizeQuestion(raw, `Řádek ${i + 2}`);
  });
}

export async function parseQuestionsFile(file: File): Promise<Question[]> {
  const name = file.name.toLowerCase();
  const text = await file.text();
  if (name.endsWith(".json")) return parseQuestionsJSON(text);
  if (name.endsWith(".csv")) return parseQuestionsCSV(text);
  throw new QuestionImportError(
    `Nepodporovaný formát "${file.name}" – povoleny .json a .csv`,
  );
}
