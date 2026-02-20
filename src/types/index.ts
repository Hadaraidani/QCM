/* ==============================
   TYPES POUR LE QCM ÉLECTRICITÉ
   Licence 1 - Université
   ============================== */

// Information de l'étudiant
export interface StudentInfo {
  nom: string;
  prenom: string;
}

// Structure d'une question
export interface Question {
  id: number;
  theme: string;
  question: string;
  réponses: string[];
  bonnes_réponses: string[];
  image?: string; // Chemin vers une image optionnelle (ex: "/images/schema.png")
}

// Structure d'un examen par année
export interface ExamYear {
  title: string;
  date: string;
  questions: Question[];
}

// Structure des examens par année
export interface ExamsByYear {
  "2024"?: ExamYear;
  "2025"?: ExamYear;
  "2026"?: ExamYear;
  [key: string]: ExamYear | undefined;
}

// Structure d'un semestre
export interface Semester {
  name: string;
  description: string;
  subjects: string[];
  exams: ExamsByYear;
}

// Structure des semestres
export interface Semesters {
  S1: Semester;
  S2: Semester;
  [key: string]: Semester;
}

// Informations de l'université
export interface University {
  name: string;
  faculty: string;
  location: string;
}

// Configuration globale
export interface Config {
  title: string;
  description: string;
  timerMinutes: number;
  university: string;
  department: string;
  location?: string;
}

// Informations du créateur
export interface Creator {
  nom: string;
  prenom: string;
  pseudo: string;
  whatsapp: string[];
  facebook: {
    name: string;
    url: string;
  };
}

// Structure complète des données JSON
export interface QuestionsData {
  config: Config;
  creator: Creator;
  semesters: Semesters;
}

// Réponses de l'utilisateur
export interface UserAnswers {
  [questionId: number]: string[];
}

// Score par question
export interface QuestionScore {
  questionId: number;
  score: number;
  maxScore: number;
  userAnswers: string[];
  correctAnswers: string[];
  isCorrect: boolean;
}

// Résultat de l'examen
export interface ExamResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  questionScores: QuestionScore[];
}

// Années d'examen disponibles
export type ExamYearKey = "2024" | "2025" | "2026";

// Semestres disponibles
export type SemesterKey = "S1" | "S2";
