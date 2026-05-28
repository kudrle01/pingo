import type { Question, QuestionType } from "@/types";










export function emptyQuestionForType(type: QuestionType): Question {
  switch (type) {
    case "quiz":
      return {
        text: "",
        type: "quiz",
        options: ["", "", "", ""],
        correctIndex: 0,
        timeLimit: 20,
        points: 1000,
      };
    case "true_false":
      return {
        text: "",
        type: "true_false",
        options: ["Pravda", "Nepravda"],
        correctIndex: 0,
        timeLimit: 20,
        points: 1000,
      };
    case "type_answer":
      return {
        text: "",
        type: "type_answer",
        options: [""],
        correctIndex: 0,
        timeLimit: 20,
        points: 1000,
      };
  }
}





export function migrateQuestionType(q: Question, newType: QuestionType): Question {
  if (q.type === newType) return q;
  const base = emptyQuestionForType(newType);
  return {
    ...base,
    text: q.text,
    timeLimit: q.timeLimit,
    points: q.points,
  };
}




export function isTextAnswerCorrect(expected: string, actual: string): boolean {
  return expected.trim().toLowerCase() === actual.trim().toLowerCase();
}
