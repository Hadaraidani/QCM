import type { Question } from '../types';
import MathText from './MathText';
import { useTheme } from '../context/ThemeContext';

/* ==============================
   COMPOSANT QUESTION CARD
   Affiche une question avec ses options (lecture seule)
   Les réponses se font sur la feuille de réponses
   Support LaTeX pour les formules mathématiques
   ============================== */

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  showCorrection?: boolean;
  selectedAnswers?: string[];
}

export function QuestionCard({
  question,
  questionIndex,
  showCorrection = false,
  selectedAnswers = [],
}: QuestionCardProps) {
  const { theme } = useTheme();

  // Extraire la lettre de la réponse (ex: "A. Bleu" -> "A")
  const extractLetter = (answer: string): string => {
    return answer.charAt(0);
  };

  const isCorrectAnswer = (answer: string): boolean => {
    const letter = extractLetter(answer);
    return question.bonnes_réponses.includes(letter);
  };

  const isSelected = (answer: string): boolean => {
    const letter = extractLetter(answer);
    return selectedAnswers.includes(letter);
  };

  const getAnswerStyle = (answer: string): string => {
    if (!showCorrection) {
      return `${theme.colors.bgTertiary} ${theme.colors.text} ${theme.colors.border}`;
    }

    const selected = isSelected(answer);
    const correct = isCorrectAnswer(answer);

    if (correct && selected) {
      return 'bg-green-500 text-white border-green-600';
    }
    if (correct && !selected) {
      return 'bg-green-100 text-green-800 border-green-400 ring-2 ring-green-400';
    }
    if (!correct && selected) {
      return 'bg-red-500 text-white border-red-600';
    }
    return `${theme.colors.bgTertiary} ${theme.colors.textMuted} ${theme.colors.border}`;
  };

  // Couleur du thème
  const getThemeColor = (themeType: string): string => {
    switch (themeType) {
      case 'Électrostatique':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Champ Magnétique':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'Courant Continu':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'Régime Sinusoïdal':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <div className={`mb-3 md:mb-4 rounded-xl ${theme.colors.border} border ${theme.colors.card} p-3 md:p-4 ${theme.colors.shadow} transition-all hover:shadow-md`}>
      {/* En-tête avec numéro et thème */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-gradient-to-r ${theme.colors.gradient} text-xs md:text-sm font-bold text-white`}>
          {questionIndex + 1}
        </span>
        <span className={`rounded-full px-2 md:px-3 py-1 text-xs font-medium ${getThemeColor(question.theme)}`}>
          {question.theme}
        </span>
      </div>

      {/* Question avec support LaTeX */}
      <h3 className={`mb-4 text-sm md:text-base font-medium leading-relaxed ${theme.colors.text}`}>
        <MathText text={question.question} />
      </h3>

      {/* Image associée à la question (si elle existe) */}
      {question.image && (
        <div className="mb-4 flex justify-center">
          <div className={`relative overflow-hidden rounded-lg border-2 ${theme.colors.border} ${theme.colors.bgTertiary} p-2`}>
            <img
              src={question.image}
              alt={`Schéma pour la question ${questionIndex + 1}`}
              className="max-w-full h-auto max-h-64 md:max-h-80 object-contain rounded"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'flex items-center justify-center p-4 text-sm text-red-400';
                  errorDiv.innerHTML = `
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Image non disponible
                  `;
                  parent.appendChild(errorDiv);
                }
              }}
            />
            <div className={`absolute top-1 right-1 px-2 py-0.5 rounded text-xs font-medium ${theme.colors.accentLight} ${theme.colors.accentText}`}>
              📷 Figure
            </div>
          </div>
        </div>
      )}

      {/* Options de réponse (lecture seule ou correction) */}
      <div className="grid gap-2 md:grid-cols-2">
        {question.réponses.map((answer, idx) => {
          const answerLetter = extractLetter(answer);
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 md:gap-3 rounded-lg border-2 px-2 md:px-3 py-2 text-xs md:text-sm transition-all ${getAnswerStyle(answer)}`}
            >
              <span
                className={`flex h-5 w-5 md:h-6 md:w-6 flex-shrink-0 items-center justify-center rounded text-xs font-bold ${
                  showCorrection
                    ? isCorrectAnswer(answer)
                      ? isSelected(answer)
                        ? 'bg-white/30 text-white'
                        : 'bg-green-600 text-white'
                      : isSelected(answer)
                        ? 'bg-white/30 text-white'
                        : `${theme.colors.bgSecondary} ${theme.colors.textMuted}`
                    : `${theme.colors.accentLight} ${theme.colors.accentText}`
                }`}
              >
                {answerLetter}
              </span>
              <span className="flex-1"><MathText text={answer.substring(3)} /></span>
              {showCorrection && isCorrectAnswer(answer) && (
                <svg className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {showCorrection && !isCorrectAnswer(answer) && isSelected(answer) && (
                <svg className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Affichage des bonnes réponses en mode correction */}
      {showCorrection && (
        <div className="mt-3 rounded-lg bg-blue-500/20 border border-blue-500/30 p-3 text-sm">
          <span className="font-semibold text-blue-400">Réponse(s) correcte(s) : </span>
          <span className="text-blue-300">{question.bonnes_réponses.join(', ')}</span>
        </div>
      )}
    </div>
  );
}
