import { useState, useCallback } from 'react';
import type { Question, UserAnswers, ExamResult, QuestionScore, StudentInfo, ExamYearKey, SemesterKey, QuestionsData } from './types';
import { WelcomePage } from './components/WelcomePage';
import { InstructionsPage } from './components/InstructionsPage';
import { ExamPage } from './components/ExamPage';
import { ResultPage } from './components/ResultPage';
import questionsData from './data/questions.json';

/* ==============================
   APPLICATION PRINCIPALE QCM
   QCM Électricité - Licence 1
   Université Joseph KI-ZERBO (UJKZ)
   MPCI Promotion 2025 - Ouagadougou
   Créé par Hadara IDANI (PIRATK)
   ============================== */

type ExamState = 'welcome' | 'instructions' | 'exam' | 'result';

/* ==============================
   ZONE À MODIFIER : BONNES RÉPONSES
   Les corrections sont définies dans le fichier JSON
   questions.json > semesters > [S1/S2] > exams > [année] > questions > bonnes_réponses
   
   Pour chaque question, vous pouvez spécifier une ou plusieurs
   bonnes réponses sous forme de tableau :
   
   "bonnes_réponses": ["A"]        // Une seule bonne réponse
   "bonnes_réponses": ["A", "B"]   // Deux bonnes réponses
   "bonnes_réponses": ["A", "B", "C", "D"]  // Toutes correctes
   
   La correction utilise la formule :
   Score = (CB / B) - (CM / M)
   CB = Bonnes réponses cochées
   B  = Nombre total de bonnes réponses
   CM = Mauvaises réponses cochées
   M  = Nombre total de mauvaises réponses
   ============================== */

export function App() {
  // États de l'application
  const [examState, setExamState] = useState<ExamState>('welcome');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ nom: '', prenom: '' });
  const [selectedSemester, setSelectedSemester] = useState<SemesterKey>('S1');
  const [selectedYear, setSelectedYear] = useState<ExamYearKey>('2024');

  // Charger les données depuis le JSON
  const data = questionsData as QuestionsData;
  const config = data.config;
  const creator = data.creator;
  
  // Semestres disponibles
  const availableSemesters: SemesterKey[] = Object.keys(data.semesters) as SemesterKey[];
  
  // Semestre actuel et ses examens
  const currentSemester = data.semesters[selectedSemester];
  const availableYears: ExamYearKey[] = currentSemester ? Object.keys(currentSemester.exams) as ExamYearKey[] : [];
  
  // Questions de l'année sélectionnée dans le semestre sélectionné
  const currentExam = currentSemester?.exams[selectedYear];
  const questions: Question[] = currentExam?.questions || [];

  /* ==============================
     FONCTION DE CORRECTION
     Calcule le score selon la formule :
     Score = (CB / B) - (CM / M)
     ============================== */
  const calculateScore = useCallback((): ExamResult => {
    const questionScores: QuestionScore[] = [];
    let totalScore = 0;
    const maxScore = 20; // Score maximum sur 20

    questions.forEach((question) => {
      const correctAnswers = question.bonnes_réponses;
      const userSelectedAnswers = userAnswers[question.id] || [];
      
      // Nombre total de bonnes réponses (B)
      const totalCorrect = correctAnswers.length;
      
      // Nombre total de mauvaises réponses possibles (M)
      const totalOptions = question.réponses.length;
      const totalWrong = totalOptions - totalCorrect;

      // Bonnes réponses cochées (CB)
      const correctChecked = userSelectedAnswers.filter((answer) =>
        correctAnswers.includes(answer)
      ).length;

      // Mauvaises réponses cochées (CM)
      const wrongChecked = userSelectedAnswers.filter(
        (answer) => !correctAnswers.includes(answer)
      ).length;

      // Calcul du score : (CB / B) - (CM / M)
      let questionScore = 0;
      if (totalCorrect > 0) {
        questionScore = correctChecked / totalCorrect;
      }
      if (totalWrong > 0) {
        questionScore -= wrongChecked / totalWrong;
      }

      // Score minimum = 0 (pas de score négatif par question)
      questionScore = Math.max(0, questionScore);

      // Score normalisé sur la base du score total
      const normalizedScore = questionScore * (maxScore / questions.length);

      questionScores.push({
        questionId: question.id,
        score: normalizedScore,
        maxScore: maxScore / questions.length,
        userAnswers: userSelectedAnswers,
        correctAnswers: correctAnswers,
        isCorrect: questionScore === 1,
      });

      totalScore += normalizedScore;
    });

    return {
      totalScore,
      maxScore,
      percentage: (totalScore / maxScore) * 100,
      questionScores,
    };
  }, [questions, userAnswers]);

  /* ==============================
     GESTION DES RÉPONSES
     Toggle une réponse pour une question
     ============================== */
  const handleAnswerToggle = useCallback(
    (questionId: number, answer: string) => {
      setUserAnswers((prev) => {
        const currentAnswers = prev[questionId] || [];
        const answerIndex = currentAnswers.indexOf(answer);

        if (answerIndex === -1) {
          // Ajouter la réponse
          return {
            ...prev,
            [questionId]: [...currentAnswers, answer],
          };
        } else {
          // Retirer la réponse
          return {
            ...prev,
            [questionId]: currentAnswers.filter((a) => a !== answer),
          };
        }
      });
    },
    []
  );

  /* ==============================
     GESTION DES ÉVÉNEMENTS
     ============================== */
  const handleStartExam = useCallback((info: StudentInfo, semester: SemesterKey, year: ExamYearKey) => {
    setStudentInfo(info);
    setSelectedSemester(semester);
    setSelectedYear(year);
    setUserAnswers({});
    setExamResult(null);
    setExamState('instructions'); // Afficher d'abord les consignes
  }, []);

  const handleAcceptInstructions = useCallback(() => {
    setExamState('exam'); // Commencer l'examen après acceptation des consignes
  }, []);

  const handleCancelInstructions = useCallback(() => {
    setExamState('welcome'); // Retour à la page d'accueil
  }, []);

  const handleSubmitExam = useCallback(() => {
    const result = calculateScore();
    setExamResult(result);
    setExamState('result');
  }, [calculateScore]);

  const handleTimeUp = useCallback(() => {
    const result = calculateScore();
    setExamResult(result);
    setExamState('result');
  }, [calculateScore]);

  const handleRestart = useCallback(() => {
    setUserAnswers({});
    setExamResult(null);
    setStudentInfo({ nom: '', prenom: '' });
    setExamState('welcome');
  }, []);

  /* ==============================
     RENDU CONDITIONNEL
     ============================== */
  return (
    <>
      {examState === 'welcome' && (
        <WelcomePage
          title={config.title}
          description={config.description}
          university={config.university}
          department={config.department}
          location={config.location}
          timerMinutes={config.timerMinutes}
          semesters={data.semesters}
          availableSemesters={availableSemesters}
          creator={creator}
          onStart={handleStartExam}
        />
      )}

      {examState === 'instructions' && (
        <InstructionsPage
          studentInfo={studentInfo}
          examYear={selectedYear}
          semester={selectedSemester}
          semesterName={currentSemester?.name || ''}
          timerMinutes={config.timerMinutes}
          questionCount={questions.length}
          onAccept={handleAcceptInstructions}
          onCancel={handleCancelInstructions}
        />
      )}

      {examState === 'exam' && (
        <ExamPage
          questions={questions}
          userAnswers={userAnswers}
          onAnswerToggle={handleAnswerToggle}
          onSubmit={handleSubmitExam}
          onTimeUp={handleTimeUp}
          timerMinutes={config.timerMinutes}
          title={config.title}
          examYear={selectedYear}
          semester={selectedSemester}
          semesterName={currentSemester?.name || ''}
          examDate={currentExam?.date || ''}
          studentInfo={studentInfo}
        />
      )}

      {examState === 'result' && examResult && (
        <ResultPage
          questions={questions}
          userAnswers={userAnswers}
          result={examResult}
          studentInfo={studentInfo}
          examYear={selectedYear}
          semester={selectedSemester}
          semesterName={currentSemester?.name || ''}
          examDate={currentExam?.date || ''}
          creator={creator}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}
