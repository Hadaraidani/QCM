import type { Question, UserAnswers, ExamResult, QuestionScore, StudentInfo, Creator } from '../types';
import { QuestionCard } from './QuestionCard';
import { AnswerSheet } from './AnswerSheet';
import { Footer } from './Footer';

/* ==============================
   COMPOSANT PAGE DE RÉSULTATS
   Affiche les résultats avec le pourcentage de réussite
   ============================== */

interface ResultPageProps {
  questions: Question[];
  userAnswers: UserAnswers;
  result: ExamResult;
  studentInfo: StudentInfo;
  examYear: string;
  semester: string;
  semesterName: string;
  examDate: string;
  creator: Creator;
  onRestart: () => void;
}

export function ResultPage({
  questions,
  userAnswers,
  result,
  studentInfo,
  examYear,
  semester,
  semesterName,
  examDate,
  creator,
  onRestart,
}: ResultPageProps) {
  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 50) return 'text-yellow-500';
    if (percentage >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (percentage: number): string => {
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-blue-500 to-indigo-600';
    if (percentage >= 50) return 'from-yellow-500 to-amber-600';
    if (percentage >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-700';
  };

  const getScoreEmoji = (percentage: number): string => {
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👏';
    if (percentage >= 50) return '👍';
    if (percentage >= 40) return '📚';
    return '💪';
  };

  const getGradeMessage = (percentage: number): string => {
    if (percentage >= 80) return 'Excellent travail !';
    if (percentage >= 60) return 'Très bien !';
    if (percentage >= 50) return 'Bien, continuez !';
    if (percentage >= 40) return 'Peut mieux faire';
    return 'Travail supplémentaire nécessaire';
  };

  const getMention = (percentage: number): string => {
    if (percentage >= 80) return 'Très Bien';
    if (percentage >= 70) return 'Bien';
    if (percentage >= 60) return 'Assez Bien';
    if (percentage >= 50) return 'Passable';
    return 'Insuffisant';
  };

  // Stats par thème
  const themeStats: { [theme: string]: { correct: number; total: number } } = {};
  questions.forEach((q, idx) => {
    if (!themeStats[q.theme]) {
      themeStats[q.theme] = { correct: 0, total: 0 };
    }
    themeStats[q.theme].total++;
    if (result.questionScores[idx]?.score === result.questionScores[idx]?.maxScore) {
      themeStats[q.theme].correct++;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Carte de résultat principal */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* En-tête avec gradient */}
          <div className={`bg-gradient-to-r ${getScoreBgColor(result.percentage)} p-6 text-white md:p-8`}>
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              {/* Info étudiant */}
              <div className="text-center md:text-left">
                <div className="text-4xl">{getScoreEmoji(result.percentage)}</div>
                <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                  {studentInfo.prenom} {studentInfo.nom}
                </h1>
                <p className="mt-1 text-white/80">
                  {semester} - {semesterName} • Session {examYear} • {examDate}
                </p>
              </div>

              {/* Score principal */}
              <div className="text-center">
                <div className="rounded-2xl bg-white/20 px-8 py-4 backdrop-blur-sm">
                  <div className="text-5xl font-bold md:text-6xl">
                    {result.totalScore.toFixed(2)}
                  </div>
                  <div className="text-lg opacity-90">/ {result.maxScore}</div>
                </div>
              </div>

              {/* Pourcentage */}
              <div className="text-center">
                <div className="text-6xl font-bold md:text-7xl">
                  {result.percentage.toFixed(1)}%
                </div>
                <div className="mt-1 rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
                  {getMention(result.percentage)}
                </div>
              </div>
            </div>
          </div>

          {/* Message et statistiques */}
          <div className="p-6 md:p-8">
            <p className="mb-6 text-center text-lg text-gray-600">
              {getGradeMessage(result.percentage)}
            </p>

            {/* Statistiques générales */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {result.questionScores.filter((q) => q.score === q.maxScore).length}
                </div>
                <div className="text-sm text-green-600">Parfaites</div>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.questionScores.filter((q) => q.score > 0 && q.score < q.maxScore).length}
                </div>
                <div className="text-sm text-blue-600">Partielles</div>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {result.questionScores.filter((q) => q.score === 0 && q.userAnswers.length > 0).length}
                </div>
                <div className="text-sm text-red-600">Incorrectes</div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {result.questionScores.filter((q) => q.userAnswers.length === 0).length}
                </div>
                <div className="text-sm text-gray-600">Non répondues</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques par thème */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Performance par thème
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(themeStats).map(([theme, stats]) => {
              const percent = (stats.correct / stats.total) * 100;
              return (
                <div key={theme} className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{theme}</span>
                    <span className={`text-sm font-bold ${getScoreColor(percent)}`}>
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getScoreBgColor(percent)}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {stats.correct} / {stats.total} questions parfaites
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Détail des scores par question */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Détail des scores
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="p-3 text-left font-semibold">Q</th>
                  <th className="p-3 text-left font-semibold">Thème</th>
                  <th className="p-3 text-center font-semibold">Vos réponses</th>
                  <th className="p-3 text-center font-semibold">Correctes</th>
                  <th className="p-3 text-center font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {result.questionScores.map((qs: QuestionScore, idx: number) => {
                  const question = questions[idx];
                  return (
                    <tr key={qs.questionId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-600">{question.theme}</td>
                      <td className="p-3 text-center">
                        {qs.userAnswers.length > 0 ? (
                          <div className="flex justify-center gap-1">
                            {qs.userAnswers.map((a) => (
                              <span
                                key={a}
                                className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                                  qs.correctAnswers.includes(a)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                }`}
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1">
                          {qs.correctAnswers.map((a) => (
                            <span
                              key={a}
                              className="inline-flex h-6 w-6 items-center justify-center rounded bg-green-100 text-xs font-bold text-green-700"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex min-w-16 justify-center rounded-full px-3 py-1 text-xs font-bold ${
                            qs.score === qs.maxScore
                              ? 'bg-green-100 text-green-700'
                              : qs.score > 0
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {qs.score.toFixed(2)}/{qs.maxScore.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Correction détaillée */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Questions avec correction */}
          <div className="flex-1">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Correction détaillée
            </h2>
            {questions.map((question, idx) => (
              <QuestionCard
                key={question.id}
                question={question}
                questionIndex={idx}
                showCorrection={true}
                selectedAnswers={userAnswers[question.id] || []}
              />
            ))}
          </div>

          {/* Feuille de réponses corrigée */}
          <div className="w-full lg:w-96">
            <div className="sticky top-4">
              <h2 className="mb-4 text-xl font-bold text-gray-800">Récapitulatif</h2>
              <AnswerSheet
                questions={questions}
                userAnswers={userAnswers}
                onAnswerToggle={() => {}}
                disabled={true}
                showCorrection={true}
              />

              {/* Bouton recommencer */}
              <button
                onClick={onRestart}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
              >
                🔄 Nouvel examen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer avec informations du créateur */}
      <Footer creator={creator} showFull={true} />
    </div>
  );
}
