import type { Question, UserAnswers, StudentInfo } from '../types';
import { Timer } from './Timer';
import { QuestionCard } from './QuestionCard';
import { AnswerSheet } from './AnswerSheet';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';

/* ==============================
   PAGE D'EXAMEN
   Affiche les questions et la feuille de réponses
   ============================== */

interface ExamPageProps {
  questions: Question[];
  userAnswers: UserAnswers;
  onAnswerToggle: (questionId: number, answer: string) => void;
  onSubmit: () => void;
  onTimeUp: () => void;
  timerMinutes: number;
  title: string;
  examYear: string;
  semester: string;
  semesterName: string;
  examDate: string;
  studentInfo: StudentInfo;
}

export function ExamPage({
  questions,
  userAnswers,
  onAnswerToggle,
  onSubmit,
  onTimeUp,
  timerMinutes,
  title,
  examYear,
  semester,
  semesterName,
  examDate,
  studentInfo,
}: ExamPageProps) {
  const { theme } = useTheme();

  // Compter les questions répondues
  const answeredCount = Object.keys(userAnswers).filter(
    (key) => userAnswers[parseInt(key)]?.length > 0
  ).length;

  return (
    <div className={`fixed inset-0 flex flex-col ${theme.colors.bg}`}>
      {/* Header fixe */}
      <header className={`flex-shrink-0 ${theme.colors.header} z-40`}>
        <div className="mx-auto max-w-full px-2 md:px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Titre et info étudiant */}
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <div className={`flex items-center gap-2 rounded-lg ${theme.colors.bgSecondary} ${theme.colors.border} border px-2 md:px-3 py-1`}>
                <span className="text-lg">⚡</span>
                <span className={`font-bold ${theme.colors.text} text-sm md:text-base hidden sm:inline`}>{title}</span>
              </div>
              <div className={`flex items-center gap-2 rounded-lg bg-gradient-to-r ${theme.colors.gradient} px-2 md:px-3 py-1 text-white`}>
                <span className="text-sm">👤</span>
                <span className="font-semibold text-sm truncate max-w-[100px] md:max-w-none">
                  {studentInfo.prenom} {studentInfo.nom}
                </span>
              </div>
              <div className={`flex items-center gap-1 rounded-lg ${theme.colors.bgSecondary} ${theme.colors.border} border px-2 py-1`}>
                <span className="text-sm">📚</span>
                <span className={`${theme.colors.text} text-sm font-medium`}>{semester}</span>
              </div>
              <div className={`hidden sm:flex items-center gap-1 rounded-lg ${theme.colors.bgSecondary} ${theme.colors.border} border px-2 py-1`}>
                <span className="text-sm">📅</span>
                <span className={`${theme.colors.text} text-sm font-medium`}>{examYear}</span>
              </div>
            </div>

            {/* Timer et actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className={`hidden md:flex items-center gap-2 ${theme.colors.textSecondary} text-sm`}>
                <span>📝</span>
                <span>{answeredCount}/{questions.length} répondues</span>
              </div>
              
              <Timer 
                initialMinutes={timerMinutes} 
                onTimeUp={onTimeUp} 
              />
              
              <ThemeSelector />
              
              <button
                onClick={onSubmit}
                className={`rounded-lg bg-gradient-to-r ${theme.colors.gradient} px-3 md:px-4 py-2 font-bold text-white transition-all hover:opacity-90 hover:shadow-lg text-sm md:text-base`}
              >
                <span className="hidden md:inline">Terminer</span>
                <span className="md:hidden">✓</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Section des questions (gauche) */}
        <div className={`flex-1 flex flex-col overflow-hidden ${theme.colors.border} border-r-2 min-h-0`}>
          <div className={`flex-shrink-0 ${theme.colors.bgSecondary} px-3 py-2 ${theme.colors.border} border-b`}>
            <h2 className={`font-bold ${theme.colors.text} flex items-center gap-2 text-sm md:text-base`}>
              <span>📝</span>
              <span>Feuille de Questions</span>
              <span className={`text-xs ${theme.colors.textMuted}`}>({semesterName} - {examDate})</span>
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 md:p-4 min-h-0">
            <div className="space-y-3 md:space-y-4 pb-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  questionIndex={index}
                  showCorrection={false}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Section feuille de réponses (droite) */}
        <div className={`w-[45%] md:w-[40%] lg:w-[35%] flex flex-col overflow-hidden min-h-0 ${theme.colors.bgSecondary}`}>
          <div className={`flex-shrink-0 ${theme.colors.bgTertiary} px-3 py-2 ${theme.colors.border} border-b`}>
            <h2 className={`font-bold ${theme.colors.text} flex items-center gap-2 text-sm md:text-base`}>
              <span>✏️</span>
              <span>Feuille de Réponses</span>
            </h2>
            <p className={`text-xs ${theme.colors.textMuted} mt-1`}>
              Cliquez sur les cases pour répondre
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 md:p-3 min-h-0">
            <AnswerSheet
              questions={questions}
              userAnswers={userAnswers}
              onAnswerToggle={onAnswerToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
