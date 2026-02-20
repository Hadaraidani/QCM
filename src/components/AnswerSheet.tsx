import type { Question, UserAnswers } from '../types';
import { useTheme } from '../context/ThemeContext';

/* ==============================
   COMPOSANT FEUILLE DE RÉPONSES
   C'est ICI que l'étudiant répond aux questions
   Cases carrées A, B, C, D
   ============================== */

interface AnswerSheetProps {
  questions: Question[];
  userAnswers: UserAnswers;
  onAnswerToggle: (questionId: number, answer: string) => void;
  disabled?: boolean;
  showCorrection?: boolean;
}

export function AnswerSheet({
  questions,
  userAnswers,
  onAnswerToggle,
  disabled = false,
  showCorrection = false,
}: AnswerSheetProps) {
  const { theme } = useTheme();
  const options = ['A', 'B', 'C', 'D'];

  const isSelected = (questionId: number, option: string): boolean => {
    return userAnswers[questionId]?.includes(option) || false;
  };

  const isCorrectAnswer = (question: Question, option: string): boolean => {
    return question.bonnes_réponses.includes(option);
  };

  const getOptionStyle = (question: Question, option: string): string => {
    const selected = isSelected(question.id, option);
    const correct = isCorrectAnswer(question, option);

    if (showCorrection) {
      if (correct && selected) {
        return 'bg-green-500 text-white border-green-600 shadow-green-200';
      }
      if (correct && !selected) {
        return 'bg-green-100 text-green-700 border-green-400 ring-2 ring-green-400';
      }
      if (!correct && selected) {
        return 'bg-red-500 text-white border-red-600 shadow-red-200';
      }
      return `${theme.colors.bgTertiary} ${theme.colors.textMuted} ${theme.colors.border}`;
    }

    if (selected) {
      return 'bg-gray-900 text-white border-gray-900 shadow-lg';
    }
    return `${theme.colors.card} ${theme.colors.text} ${theme.colors.border} hover:border-indigo-500 hover:bg-indigo-500/20`;
  };

  // Grouper les questions par thème pour un meilleur affichage
  const getThemeIcon = (themeType: string): string => {
    switch (themeType) {
      case 'Électrostatique':
        return '⚡';
      case 'Champ Magnétique':
        return '🧲';
      case 'Courant Continu':
        return '🔋';
      case 'Régime Sinusoïdal':
        return '〰️';
      default:
        return '📝';
    }
  };

  return (
    <div className={`rounded-xl ${theme.colors.card} p-3 md:p-4 ${theme.colors.shadow} ${theme.colors.border} border`}>
      {/* Instructions rapides */}
      {!showCorrection && !disabled && (
        <div className={`mb-3 flex items-center gap-2 rounded-lg bg-amber-500/20 border border-amber-500/30 p-2 text-xs text-amber-400`}>
          <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Case <strong>noire</strong> = sélectionnée</span>
        </div>
      )}

      {/* Légende en mode correction */}
      {showCorrection && (
        <div className={`mb-3 flex flex-wrap gap-2 rounded-lg ${theme.colors.bgTertiary} p-2 text-xs`}>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-green-500"></span>
            <span className={theme.colors.textSecondary}>Correct coché</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded border-2 border-green-400 bg-green-100"></span>
            <span className={theme.colors.textSecondary}>Correct non coché</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-red-500"></span>
            <span className={theme.colors.textSecondary}>Incorrect coché</span>
          </div>
        </div>
      )}

      {/* Grille de réponses */}
      <div className="space-y-1.5">
        {questions.map((question, idx) => (
          <div
            key={question.id}
            className={`flex items-center gap-1.5 md:gap-2 rounded-lg ${theme.colors.bgTertiary} p-1.5 md:p-2 transition-all ${theme.colors.border} border`}
          >
            {/* Numéro de question avec icône thème */}
            <div className="flex items-center gap-1">
              <span className="text-xs md:text-sm">{getThemeIcon(question.theme)}</span>
              <span className={`flex h-6 w-6 md:h-7 md:w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r ${theme.colors.gradient} text-xs font-bold text-white`}>
                {idx + 1}
              </span>
            </div>

            {/* Cases de réponse */}
            <div className="flex flex-1 justify-center gap-1 md:gap-1.5">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => !disabled && onAnswerToggle(question.id, option)}
                  disabled={disabled}
                  className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg border-2 text-xs md:text-sm font-bold transition-all duration-200 ${getOptionStyle(question, option)} ${
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'
                  }`}
                  title={`Question ${idx + 1} - Option ${option}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Indicateur de réponse donnée */}
            {!showCorrection && (
              <div className="w-5 flex-shrink-0 text-center">
                {userAnswers[question.id]?.length > 0 ? (
                  <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className={theme.colors.textMuted}>○</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Résumé */}
      {!showCorrection && (
        <div className={`mt-3 rounded-lg ${theme.colors.accentLight} p-2 text-center`}>
          <span className={`text-xs md:text-sm font-medium ${theme.colors.accentText}`}>
            {Object.values(userAnswers).filter((a) => a.length > 0).length} / {questions.length} répondues
          </span>
        </div>
      )}
    </div>
  );
}
