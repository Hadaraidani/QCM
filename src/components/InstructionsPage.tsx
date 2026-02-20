import { useState, useEffect } from 'react';
import type { StudentInfo } from '../types';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';

/* ==============================
   PAGE DE CONSIGNES ET SANCTIONS
   Affichée avant le début de l'examen
   ============================== */

interface InstructionsPageProps {
  studentInfo: StudentInfo;
  examYear: string;
  semester: string;
  semesterName: string;
  timerMinutes: number;
  questionCount: number;
  onAccept: () => void;
  onCancel: () => void;
}

export function InstructionsPage({
  studentInfo,
  examYear,
  semester,
  semesterName,
  timerMinutes,
  questionCount,
  onAccept,
  onCancel,
}: InstructionsPageProps) {
  const { theme } = useTheme();
  const [hasRead, setHasRead] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Compte à rebours avant de pouvoir accepter
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const hours = Math.floor(timerMinutes / 60);
  const minutes = timerMinutes % 60;
  const timeDisplay = hours > 0 
    ? `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}` 
    : `${minutes} minutes`;

  return (
    <div className={`min-h-screen ${theme.colors.bg} bg-gradient-to-br ${theme.colors.gradientBg}`}>
      {/* Header avec sélecteur de thème */}
      <div className={`${theme.colors.header} sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <span className={`font-bold ${theme.colors.text}`}>Consignes d'examen</span>
          </div>
          <ThemeSelector />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 shadow-lg`}>
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold ${theme.colors.text} md:text-4xl`}>
            ⚠️ CONSIGNES D'EXAMEN
          </h1>
          <p className={`mt-2 text-lg ${theme.colors.textSecondary}`}>
            Lisez attentivement avant de commencer
          </p>
        </div>

        {/* Carte étudiant */}
        <div className={`mb-6 rounded-2xl bg-gradient-to-r ${theme.colors.gradient} p-4 text-white shadow-lg`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-white/80">Candidat(e)</p>
                <p className="text-xl font-bold">{studentInfo.prenom} {studentInfo.nom}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">{semester} - {semesterName}</p>
              <p className="text-xl font-bold">Session {examYear}</p>
            </div>
          </div>
        </div>

        {/* Consignes principales */}
        <div className={`mb-6 rounded-2xl ${theme.colors.card} p-6 ${theme.colors.shadow} ${theme.colors.border} border`}>
          <h2 className={`mb-4 flex items-center gap-2 text-xl font-bold ${theme.colors.text}`}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.colors.accentLight} ${theme.colors.accentText}`}>
              📋
            </span>
            Règles de l'examen
          </h2>
          
          <div className="space-y-4">
            <div className={`flex gap-3 rounded-xl ${theme.colors.bgTertiary} p-4 ${theme.colors.border} border`}>
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">1</span>
              <div>
                <p className={`font-semibold ${theme.colors.text}`}>Durée de l'épreuve</p>
                <p className={theme.colors.textSecondary}>L'examen dure <strong>{timeDisplay}</strong>. Le chronomètre démarre dès que vous cliquez sur "Commencer".</p>
              </div>
            </div>

            <div className={`flex gap-3 rounded-xl ${theme.colors.bgTertiary} p-4 ${theme.colors.border} border`}>
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">2</span>
              <div>
                <p className={`font-semibold ${theme.colors.text}`}>Nombre de questions</p>
                <p className={theme.colors.textSecondary}>L'épreuve comporte <strong>{questionCount} questions</strong> à choix multiples (QCM).</p>
              </div>
            </div>

            <div className={`flex gap-3 rounded-xl ${theme.colors.bgTertiary} p-4 ${theme.colors.border} border`}>
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">3</span>
              <div>
                <p className={`font-semibold ${theme.colors.text}`}>Comment répondre</p>
                <p className={theme.colors.textSecondary}>Vous devez répondre <strong>UNIQUEMENT</strong> sur la <strong>feuille de réponses</strong> située à droite. Il n'est pas possible de répondre directement sur la feuille de questions.</p>
              </div>
            </div>

            <div className={`flex gap-3 rounded-xl ${theme.colors.bgTertiary} p-4 ${theme.colors.border} border`}>
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">4</span>
              <div>
                <p className={`font-semibold ${theme.colors.text}`}>Réponses multiples</p>
                <p className={theme.colors.textSecondary}>Certaines questions peuvent avoir <strong>plusieurs bonnes réponses</strong>. Cochez toutes les réponses que vous estimez correctes.</p>
              </div>
            </div>

            <div className={`flex gap-3 rounded-xl ${theme.colors.bgTertiary} p-4 ${theme.colors.border} border`}>
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-sm font-bold text-white">5</span>
              <div>
                <p className={`font-semibold ${theme.colors.text}`}>Modification des réponses</p>
                <p className={theme.colors.textSecondary}>Vous pouvez <strong>modifier vos réponses</strong> à tout moment en cliquant à nouveau sur une case pour la désélectionner.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barème et sanctions */}
        <div className={`mb-6 rounded-2xl ${theme.colors.card} p-6 ${theme.colors.shadow} border-2 border-red-500/50`}>
          <h2 className={`mb-4 flex items-center gap-2 text-xl font-bold text-red-500`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
              ⚖️
            </span>
            Barème et Pénalités
          </h2>

          <div className="space-y-4">
            {/* Formule */}
            <div className={`rounded-xl ${theme.colors.bgTertiary} p-4 ${theme.colors.border} border`}>
              <p className={`mb-2 font-semibold ${theme.colors.text}`}>📐 Formule de notation :</p>
              <div className={`rounded-lg ${theme.colors.bgSecondary} p-3 text-center`}>
                <code className={`text-lg font-bold ${theme.colors.accentText}`}>
                  Score = (CB / B) - (CM / M)
                </code>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-green-500/20 p-2 text-center">
                  <span className="font-bold text-green-500">CB</span>
                  <span className={theme.colors.textSecondary}> = Bonnes réponses cochées</span>
                </div>
                <div className="rounded-lg bg-blue-500/20 p-2 text-center">
                  <span className="font-bold text-blue-500">B</span>
                  <span className={theme.colors.textSecondary}> = Total bonnes réponses</span>
                </div>
                <div className="rounded-lg bg-red-500/20 p-2 text-center">
                  <span className="font-bold text-red-500">CM</span>
                  <span className={theme.colors.textSecondary}> = Mauvaises cochées</span>
                </div>
                <div className="rounded-lg bg-orange-500/20 p-2 text-center">
                  <span className="font-bold text-orange-500">M</span>
                  <span className={theme.colors.textSecondary}> = Total mauvaises réponses</span>
                </div>
              </div>
            </div>

            {/* Pénalités */}
            <div className="rounded-xl bg-red-500/20 p-4 border border-red-500/50">
              <p className="mb-3 font-bold text-red-500">🚨 ATTENTION - PÉNALITÉS :</p>
              <ul className={`space-y-2 ${theme.colors.textSecondary}`}>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-red-500">❌</span>
                  <span><strong className="text-red-400">Mauvaise réponse cochée</strong> = Points retirés selon la formule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-red-500">❌</span>
                  <span><strong className="text-red-400">Score négatif par question</strong> = Automatiquement ramené à 0</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-orange-500">⚠️</span>
                  <span><strong className="text-orange-400">Ne pas deviner au hasard</strong> si vous ne connaissez pas la réponse</span>
                </li>
              </ul>
            </div>

            {/* Conseils */}
            <div className="rounded-xl bg-green-500/20 p-4 border border-green-500/50">
              <p className="mb-3 font-bold text-green-500">💡 CONSEILS :</p>
              <ul className={`space-y-2 ${theme.colors.textSecondary}`}>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">✅</span>
                  <span>Si vous êtes sûr(e) de votre réponse, cochez-la</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">✅</span>
                  <span>Si vous hésitez, mieux vaut ne pas répondre que de deviner</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">✅</span>
                  <span>Gérez bien votre temps : {timeDisplay} pour {questionCount} questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fin du temps */}
        <div className={`mb-6 rounded-2xl bg-yellow-500/20 p-4 ${theme.colors.shadow} border border-yellow-500/50`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏰</span>
            <div>
              <p className="font-bold text-yellow-500">Quand le temps est écoulé :</p>
              <p className={theme.colors.textSecondary}>L'examen sera automatiquement terminé et vos réponses seront soumises. Vous ne pourrez plus modifier vos réponses.</p>
            </div>
          </div>
        </div>

        {/* Checkbox acceptation */}
        <div className={`mb-6 rounded-2xl ${theme.colors.card} p-4 ${theme.colors.shadow} ${theme.colors.border} border`}>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={hasRead}
              onChange={(e) => setHasRead(e.target.checked)}
              className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className={theme.colors.text}>
              J'ai lu et compris toutes les consignes et sanctions. Je m'engage à respecter les règles de l'examen.
            </span>
          </label>
        </div>

        {/* Boutons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={onCancel}
            className={`rounded-xl border-2 ${theme.colors.border} ${theme.colors.card} px-8 py-4 font-semibold ${theme.colors.text} transition-all ${theme.colors.cardHover}`}
          >
            ← Retour
          </button>
          
          <button
            onClick={onAccept}
            disabled={!hasRead || countdown > 0}
            className={`rounded-xl px-8 py-4 font-bold text-white shadow-lg transition-all ${
              hasRead && countdown === 0
                ? `bg-gradient-to-r ${theme.colors.gradient} hover:opacity-90 hover:shadow-xl transform hover:scale-105`
                : 'cursor-not-allowed bg-gray-400'
            }`}
          >
            {countdown > 0 ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Patientez ({countdown}s)
              </span>
            ) : !hasRead ? (
              'Veuillez accepter les consignes'
            ) : (
              <span className="flex items-center gap-2">
                🚀 COMMENCER L'EXAMEN
              </span>
            )}
          </button>
        </div>

        {/* Message d'encouragement */}
        <div className="mt-8 text-center">
          <p className={`text-lg font-medium ${theme.colors.textSecondary}`}>
            🍀 Bonne chance, <span className={theme.colors.accentText}>{studentInfo.prenom}</span> !
          </p>
        </div>
      </div>
    </div>
  );
}
