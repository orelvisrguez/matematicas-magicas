
import { WorldId, Question, QuestionType, Difficulty } from '../types';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to adjust range based on streak
const getAdaptiveRange = (min: number, max: number, streak: number): [number, number] => {
  if (streak > 2) {
    // Push towards upper half for challenge
    const mid = Math.floor((min + max) / 2);
    return [mid, max];
  }
  return [min, max];
};

export const generateQuestionForWorld = (
  worldId: WorldId, 
  difficulty: Difficulty, 
  streak: number, 
  isBoss: boolean = false
): Question => {
  const id = `q-${Date.now()}-${Math.random()}`;

  switch (worldId) {
    case WorldId.NUMBERS:
      return generateNumberQuestion(id, difficulty, streak, isBoss);
    case WorldId.ADD_SUB:
      return generateAddSubQuestion(id, difficulty, streak, isBoss);
    case WorldId.MULT:
      return generateMultQuestion(id, difficulty, streak, isBoss);
    case WorldId.DIV:
      return generateDivQuestion(id, difficulty, streak, isBoss);
    case WorldId.GEO:
      return generateGeoQuestion(id, difficulty, streak, isBoss);
    case WorldId.TIME:
      return generateTimeQuestion(id, difficulty, streak, isBoss);
    case WorldId.CHALLENGE:
      return generateAddSubQuestion(id, 'hard', streak, true); // Always hard for challenge world default
    default:
      return generateNumberQuestion(id, 'normal', 0, false);
  }
};

const generateNumberQuestion = (id: string, difficulty: Difficulty, streak: number, isBoss: boolean): Question => {
  // Boss: Always Sequence with harder step
  if (isBoss) {
    const start = randomInt(50, 150);
    const step = randomInt(10, 25);
    return {
      id,
      type: QuestionType.MULTIPLE_CHOICE,
      text: `¡Desafío del Guardián! ¿Qué número sigue? ${start}, ${start + step}, ${start + step * 2}, ...`,
      correctAnswer: (start + step * 3).toString(),
      options: [
        (start + step * 3).toString(),
        (start + step * 3 + step).toString(),
        (start + step * 3 - 5).toString(),
        (start + step * 3 + 10).toString()
      ].sort(() => Math.random() - 0.5)
    };
  }

  // Difficulty Config
  let min = 1, max = 20;
  if (difficulty === 'normal') { min = 10; max = 100; }
  if (difficulty === 'hard') { min = 100; max = 1000; }
  
  // Apply Streak
  [min, max] = getAdaptiveRange(min, max, streak);

  const type = Math.random();
  
  // Easy: Mostly counting or simple comparison
  if (difficulty === 'easy') {
    if (type < 0.5) {
       // Simple Compare
       const a = randomInt(min, max);
       const b = randomInt(min, max);
       if(a===b) return generateNumberQuestion(id, difficulty, streak, isBoss);
       return {
         id,
         type: QuestionType.MULTIPLE_CHOICE,
         text: `¿Cuál es mayor? ${a} o ${b}`,
         correctAnswer: a > b ? a.toString() : b.toString(),
         options: [a.toString(), b.toString()]
       };
    } else {
       // Count sequence simple
       const start = randomInt(1, 10);
       return {
         id,
         type: QuestionType.MULTIPLE_CHOICE,
         text: `¿Qué viene después de ${start}, ${start+1}, ${start+2}?`,
         correctAnswer: (start+3).toString(),
         options: [(start+3).toString(), (start+4).toString(), (start+2).toString()].sort(() => Math.random() - 0.5)
       };
    }
  }

  // Normal/Hard Logic
  if (type < 0.33) {
    // Even/Odd
    const num = randomInt(min, max);
    const isEven = num % 2 === 0;
    return {
      id,
      type: QuestionType.MULTIPLE_CHOICE,
      text: `¿El número ${num} es Par o Impar?`,
      correctAnswer: isEven ? "Par" : "Impar",
      options: ["Par", "Impar"]
    };
  } else if (type < 0.66) {
    // Comparison
    const a = randomInt(min, max);
    const b = randomInt(min, max);
    if (a === b) return generateNumberQuestion(id, difficulty, streak, isBoss);
    const isGreater = a > b;
    return {
      id,
      type: QuestionType.MULTIPLE_CHOICE,
      text: `¿Qué símbolo va aquí? ${a} ___ ${b}`,
      correctAnswer: isGreater ? ">" : "<",
      options: [">", "<", "="]
    };
  } else {
    // Sequence
    const start = randomInt(min, max - 20);
    const step = difficulty === 'hard' ? randomInt(5, 15) : randomInt(2, 5);
    return {
      id,
      type: QuestionType.MULTIPLE_CHOICE,
      text: `¿Qué número sigue? ${start}, ${start + step}, ${start + step * 2}, ...`,
      correctAnswer: (start + step * 3).toString(),
      options: [
        (start + step * 3).toString(),
        (start + step * 3 + 1).toString(),
        (start + step * 3 - 2).toString(),
        (start + step * 4).toString()
      ].sort(() => Math.random() - 0.5)
    };
  }
};

const generateAddSubQuestion = (id: string, difficulty: Difficulty, streak: number, isBoss: boolean): Question => {
  const isAdd = Math.random() > 0.5;
  let min = 1, max = 10;
  
  if (difficulty === 'easy') { min = 1; max = 9; } // Single digit
  else if (difficulty === 'normal') { min = 10; max = 50; } // Double digit
  else { min = 50; max = 500; } // Triple digit

  // Adaptive
  [min, max] = getAdaptiveRange(min, max, streak);
  
  const a = randomInt(min, max);
  const b = randomInt(min, max);

  const titlePrefix = difficulty === 'hard' ? "¡Magia Avanzada! " : "";
  const questionType = (difficulty === 'easy' || difficulty === 'normal') ? QuestionType.MULTIPLE_CHOICE : QuestionType.INPUT;

  // Hard mode: sometimes missing operand "5 + ? = 12"
  const missingOperand = difficulty === 'hard' && Math.random() > 0.6;

  if (isAdd) {
    const ans = a + b;
    if (missingOperand) {
      return {
        id,
        type: QuestionType.INPUT,
        text: `${titlePrefix}${a} + ? = ${ans}`,
        correctAnswer: b.toString()
      };
    }
    
    const q: Question = {
      id,
      type: questionType,
      text: `${titlePrefix}¿Quanto es ${a} + ${b}?`,
      correctAnswer: ans.toString()
    };
    if (questionType === QuestionType.MULTIPLE_CHOICE) {
       q.options = [ans.toString(), (ans+1).toString(), (ans-1).toString(), (ans+2).toString()].sort(()=>Math.random()-0.5);
    }
    return q;
  } else {
    // Resta
    const large = Math.max(a, b);
    const small = Math.min(a, b);
    const ans = large - small;
    
    if (missingOperand) {
       return {
        id,
        type: QuestionType.INPUT,
        text: `${titlePrefix}${large} - ? = ${ans}`,
        correctAnswer: small.toString()
      };
    }

    const q: Question = {
      id,
      type: questionType,
      text: `${titlePrefix}¿Cuánto es ${large} - ${small}?`,
      correctAnswer: ans.toString()
    };
    if (questionType === QuestionType.MULTIPLE_CHOICE) {
       q.options = [ans.toString(), (ans+1).toString(), (ans-1).toString(), (ans+2).toString()].sort(()=>Math.random()-0.5);
    }
    return q;
  }
};

const generateMultQuestion = (id: string, difficulty: Difficulty, streak: number, isBoss: boolean): Question => {
  let tableMin = 1, tableMax = 5;
  if (difficulty === 'normal') { tableMin = 2; tableMax = 9; }
  if (difficulty === 'hard') { tableMin = 6; tableMax = 12; }

  // Adaptive
  [tableMin, tableMax] = getAdaptiveRange(tableMin, tableMax, streak);

  const a = randomInt(tableMin, tableMax);
  const b = randomInt(1, 10); // Standard multiply by 1-10
  const ans = a * b;
  
  const text = isBoss 
    ? `¡La Araña te reta! ¿Cuánto es ${a} x ${b}?` 
    : `¿Cuánto es ${a} x ${b}?`;

  const questionType = difficulty === 'easy' ? QuestionType.MULTIPLE_CHOICE : QuestionType.INPUT; // Normal/Hard use input for mult to practice tables

  const q: Question = {
    id,
    type: questionType,
    text: text,
    correctAnswer: ans.toString(),
  };

  if (questionType === QuestionType.MULTIPLE_CHOICE) {
    q.options = [
      ans.toString(),
      (ans + a).toString(),
      (ans - 1).toString(),
      (ans + randomInt(2, 5)).toString()
    ].sort(() => Math.random() - 0.5);
  }
  return q;
};

const generateDivQuestion = (id: string, difficulty: Difficulty, streak: number, isBoss: boolean): Question => {
  let divisorMin = 2, divisorMax = 5;
  if (difficulty === 'normal') { divisorMin = 2; divisorMax = 9; }
  if (difficulty === 'hard') { divisorMin = 6; divisorMax = 12; }
  
  // Adaptive
  [divisorMin, divisorMax] = getAdaptiveRange(divisorMin, divisorMax, streak);

  const b = randomInt(divisorMin, divisorMax); // Divisor
  const ans = randomInt(2, 10); // Quotient
  const a = b * ans; // Dividend
  
  const text = isBoss
    ? `¡El Pirata duda! Si tienes ${a} monedas y ${b} cofres, ¿cuántas van en cada uno?`
    : `Reparte ${a} gemas entre ${b} cofres. ¿Cuántas tocan en cada cofre? (${a} ÷ ${b})`;

  const questionType = difficulty === 'easy' ? QuestionType.MULTIPLE_CHOICE : QuestionType.INPUT;

  const q: Question = {
    id,
    type: questionType,
    text,
    correctAnswer: ans.toString()
  };

  if (questionType === QuestionType.MULTIPLE_CHOICE) {
    q.options = [ans.toString(), (ans+1).toString(), (ans-1).toString(), (ans+2).toString()].sort(()=>Math.random()-0.5);
  }
  return q;
};

const generateGeoQuestion = (id: string, difficulty: Difficulty, streak: number, isBoss: boolean): Question => {
  // Hard mode: Sides count question
  if (difficulty === 'hard' || isBoss) {
    const type = Math.random() > 0.5 ? 'sides' : 'corners';
    return {
      id,
      type: QuestionType.MULTIPLE_CHOICE,
      text: "¡Pregunta del Arquitecto! ¿Cuántos lados tiene un Cuadrado?",
      correctAnswer: "4",
      options: ["3", "4", "5", "6"],
      shapeData: { type: 'square' } 
    };
  }

  const shapes = ['square', 'circle', 'triangle', 'rectangle'];
  const shape = shapes[randomInt(0, 3)];
  
  const shapeNames: Record<string, string> = {
    square: "Cuadrado",
    circle: "Círculo",
    triangle: "Triángulo",
    rectangle: "Rectángulo"
  };

  return {
    id,
    type: QuestionType.MULTIPLE_CHOICE,
    text: "¿Cómo se llama esta figura?",
    correctAnswer: shapeNames[shape],
    shapeData: { type: shape as any },
    options: ["Cuadrado", "Círculo", "Triángulo", "Rectángulo"]
  };
};

const generateTimeQuestion = (id: string, difficulty: Difficulty, streak: number, isBoss: boolean): Question => {
  const hour = randomInt(1, 12);
  let minutes = [0, 30]; // Easy: O'clock and Half past
  
  if (difficulty === 'normal') minutes = [0, 15, 30, 45];
  if (difficulty === 'hard' || isBoss) minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  
  // Adaptive: if high streak on hard, ensure non-standard minutes
  if (difficulty === 'hard' && streak > 2) {
    minutes = minutes.filter(m => m % 15 !== 0); // Remove 0, 15, 30, 45 to force 5, 10, 20 etc.
    if (minutes.length === 0) minutes = [10, 20, 40, 50];
  }

  const minute = minutes[randomInt(0, minutes.length - 1)];
  const minStr = minute === 0 ? "00" : minute < 10 ? `0${minute}` : minute.toString();
  
  return {
    id,
    type: QuestionType.MULTIPLE_CHOICE,
    text: isBoss ? "¡El tiempo vuela! ¿Qué hora exacta es?" : "¿Qué hora marca el reloj?",
    correctAnswer: `${hour}:${minStr}`,
    shapeData: { type: 'clock', value: { hour, minute } },
    options: [
      `${hour}:${minStr}`,
      `${hour === 12 ? 1 : hour + 1}:${minStr}`,
      `${hour}:${minute === 30 ? "00" : (minute + 15) % 60 < 10 ? `0${(minute+15)%60}` : (minute+15)%60}`,
      `${hour - 1 === 0 ? 12 : hour - 1}:${minStr}`
    ].sort(() => Math.random() - 0.5)
  };
};
