import { useState } from 'react';
import { Creator, StudentInfo, ExamYearKey, SemesterKey, Semesters } from '../types';
import { Footer } from './Footer';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';

interface WelcomePageProps {
  title: string;
  description: string;
  university: string;
  department: string;
  location?: string;
  timerMinutes: number;
  semesters: Semesters;
  availableSemesters: SemesterKey[];
  creator: Creator;
  onStart: (info: StudentInfo, semester: SemesterKey, year: ExamYearKey) => void;
}

export function WelcomePage({
  title,
  description,
  university,
  department,
  location,
  timerMinutes,
  semesters,
  availableSemesters,
  creator,
  onStart,
}: WelcomePageProps) {
  const { theme } = useTheme();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<SemesterKey>(availableSemesters[0]);
  const [selectedYear, setSelectedYear] = useState<ExamYearKey>('2024');
  const [error, setError] = useState('');

  // Années disponibles pour le semestre sélectionné
  const currentSemester = semesters[selectedSemester];
  const availableYears: ExamYearKey[] = currentSemester ? Object.keys(currentSemester.exams) as ExamYearKey[] : [];
  const currentExam = currentSemester?.exams[selectedYear];
  const questionCount = currentExam?.questions?.length || 0;

  // Mettre à jour l'année quand le semestre change
  const handleSemesterChange = (semester: SemesterKey) => {
    setSelectedSemester(semester);
    const semesterData = semesters[semester];
    if (semesterData) {
      const years = Object.keys(semesterData.exams) as ExamYearKey[];
      if (years.length > 0 && !years.includes(selectedYear)) {
        setSelectedYear(years[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim()) {
      setError('Veuillez remplir votre nom et prénom');
      return;
    }
    onStart({ nom: nom.trim(), prenom: prenom.trim() }, selectedSemester, selectedYear);
  };

  // Convertir les minutes en heures/minutes
  const hours = Math.floor(timerMinutes / 60);
  const minutes = timerMinutes % 60;
  const durationText = hours > 0 
    ? `${hours} heure${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min` : ''}`
    : `${minutes} minutes`;

  return (
    <div className={`min-h-screen ${theme.colors.bg} bg-gradient-to-br ${theme.colors.gradientBg}`}>
      {/* Header avec sélecteur de thème */}
      <div className={`${theme.colors.header} sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className={`font-bold ${theme.colors.text}`}>QCM Électricité</span>
          </div>
          <ThemeSelector />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête université */}
        <div className={`text-center mb-8 ${theme.colors.card} rounded-2xl p-6 ${theme.colors.shadow} ${theme.colors.border} border`}>
          <div className="text-5xl mb-4">🎓</div>
          <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-2`}>
            {university}
          </h1>
          <p className={`text-lg ${theme.colors.accentText} font-semibold`}>
            {department}
          </p>
          {location && (
            <p className={`${theme.colors.textSecondary} mt-1`}>
              📍 {location}
            </p>
          )}
        </div>

        {/* Titre du QCM */}
        <div className="text-center mb-8">
          <div className={`inline-block bg-gradient-to-r ${theme.colors.gradient} text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg`}>
            ⚡ {title}
          </div>
          <p className={`mt-3 ${theme.colors.textSecondary}`}>{description}</p>
        </div>

        {/* Formulaire d'inscription */}
        <div className={`${theme.colors.card} rounded-2xl p-6 md:p-8 ${theme.colors.shadow} ${theme.colors.border} border mb-8`}>
          <h2 className={`text-xl font-bold ${theme.colors.text} mb-6 flex items-center gap-2`}>
            <span className="text-2xl">📝</span>
            Identification de l'étudiant
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold ${theme.colors.textSecondary} mb-2`}>
                  Prénom *
                </label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Entrez votre prénom"
                  className={`w-full px-4 py-3 rounded-xl ${theme.colors.input} border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${theme.colors.textSecondary} mb-2`}>
                  Nom *
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Entrez votre nom"
                  className={`w-full px-4 py-3 rounded-xl ${theme.colors.input} border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                />
              </div>
            </div>

            {/* Sélection du semestre */}
            <div>
              <label className={`block text-sm font-semibold ${theme.colors.textSecondary} mb-2`}>
                📚 Semestre *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableSemesters.map((semester) => {
                  const semesterData = semesters[semester];
                  return (
                    <button
                      key={semester}
                      type="button"
                      onClick={() => handleSemesterChange(semester)}
                      className={`py-4 px-4 rounded-xl font-bold transition-all duration-200 border-2 ${
                        selectedSemester === semester
                          ? `bg-gradient-to-r ${theme.colors.gradient} text-white border-transparent shadow-lg scale-105`
                          : `${theme.colors.bgSecondary} ${theme.colors.text} ${theme.colors.border} ${theme.colors.cardHover}`
                      }`}
                    >
                      <div className="text-lg mb-1">{semester}</div>
                      <div className={`text-xs ${selectedSemester === semester ? 'text-white/80' : theme.colors.textSecondary}`}>
                        {semesterData?.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matières du semestre sélectionné */}
            {currentSemester && (
              <div className={`${theme.colors.bgTertiary} rounded-xl p-4`}>
                <p className={`text-sm font-semibold ${theme.colors.text} mb-2`}>
                  📖 Thèmes du {currentSemester.name} :
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentSemester.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${theme.colors.bgSecondary} ${theme.colors.text} border ${theme.colors.border}`}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sélection de l'année */}
            <div>
              <label className={`block text-sm font-semibold ${theme.colors.textSecondary} mb-2`}>
                📅 Session d'examen *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className={`py-3 px-4 rounded-xl font-bold text-lg transition-all duration-200 border-2 ${
                      selectedYear === year
                        ? `bg-gradient-to-r ${theme.colors.gradient} text-white border-transparent shadow-lg scale-105`
                        : `${theme.colors.bgSecondary} ${theme.colors.text} ${theme.colors.border} ${theme.colors.cardHover}`
                    }`}
                  >
                    📅 {year}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-4 bg-gradient-to-r ${theme.colors.gradient} text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2`}
            >
              <span>🚀</span>
              Commencer l'examen
            </button>
          </form>
        </div>

        {/* Informations sur l'examen */}
        <div className={`${theme.colors.card} rounded-2xl p-6 ${theme.colors.shadow} ${theme.colors.border} border mb-8`}>
          <h3 className={`text-lg font-bold ${theme.colors.text} mb-4 flex items-center gap-2`}>
            <span>📋</span>
            Informations sur l'épreuve
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-3 ${theme.colors.bgTertiary} rounded-xl`}>
              <span className="text-2xl">⏱️</span>
              <div>
                <p className={`font-semibold ${theme.colors.text}`}>Durée</p>
                <p className={`text-sm ${theme.colors.textSecondary}`}>{durationText}</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 ${theme.colors.bgTertiary} rounded-xl`}>
              <span className="text-2xl">❓</span>
              <div>
                <p className={`font-semibold ${theme.colors.text}`}>Questions</p>
                <p className={`text-sm ${theme.colors.textSecondary}`}>{questionCount} questions QCM</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 ${theme.colors.bgTertiary} rounded-xl`}>
              <span className="text-2xl">📊</span>
              <div>
                <p className={`font-semibold ${theme.colors.text}`}>Notation</p>
                <p className={`text-sm ${theme.colors.textSecondary}`}>Sur 20 points</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 ${theme.colors.bgTertiary} rounded-xl`}>
              <span className="text-2xl">📚</span>
              <div>
                <p className={`font-semibold ${theme.colors.text}`}>Semestre</p>
                <p className={`text-sm ${theme.colors.textSecondary}`}>{selectedSemester} - {currentSemester?.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formule de notation */}
        <div className={`${theme.colors.card} rounded-2xl p-6 ${theme.colors.shadow} ${theme.colors.border} border mb-8`}>
          <h3 className={`text-lg font-bold ${theme.colors.text} mb-4 flex items-center gap-2`}>
            <span>⚖️</span>
            Système de notation
          </h3>
          
          <div className={`${theme.colors.bgTertiary} rounded-xl p-4 text-center mb-4`}>
            <p className={`font-mono text-lg ${theme.colors.text}`}>
              Score = (CB / B) - (CM / M)
            </p>
          </div>
          
          <div className={`text-sm ${theme.colors.textSecondary} space-y-1`}>
            <p>• <strong>CB</strong> = Bonnes réponses cochées</p>
            <p>• <strong>B</strong> = Nombre total de bonnes réponses</p>
            <p>• <strong>CM</strong> = Mauvaises réponses cochées</p>
            <p>• <strong>M</strong> = Nombre total de mauvaises réponses</p>
            <p className="text-red-400 mt-2">⚠️ Les mauvaises réponses entraînent des pénalités !</p>
          </div>
        </div>

        {/* Footer avec infos créateur */}
        <Footer creator={creator} showFull={true} />
      </div>
    </div>
  );
}
