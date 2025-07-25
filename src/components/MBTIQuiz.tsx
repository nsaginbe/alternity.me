import { useState, useMemo, useEffect } from 'react';
import questionsDataEn from '../data/mbti_questions_en.json';
import questionsDataRu from '../data/mbti_questions_ru.json';
import questionsDataKz from '../data/mbti_questions_kz.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Briefcase, Heart, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { CelebrityImage } from './CelebrityImage';
import { useTranslation } from 'react-i18next';

interface Answer {
  id: string;
  value: number;
}

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    value: number;
  }[];
}

interface FamousPerson {
  name: string;
  description: string;
}

interface ResultData {
    mbti_type: string;
    type_name: string;  
    core_characteristics: string;
    strengths: string[];
    challenges: string[];
    career_paths: string[];
    famous_people: FamousPerson[];
    summary: string;
    official_link: string;
}

const getQuestionsByLang = (lang: string): Question[] => {
  switch (lang) {
    case 'ru':
      return questionsDataRu;
    case 'kz':
      return questionsDataKz;
    case 'en':
    default:
      return questionsDataEn;
  }
};

const MBTIQuiz = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [questions, setQuestions] = useState<Question[]>(getQuestionsByLang(i18n.language));
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (i18n.language !== lang) {
      setQuestions(getQuestionsByLang(i18n.language));
      setAnswers({});
      setCurrentPage(0);
      setGender(undefined);
      setResult(null);
      setError(null);
      setLang(i18n.language);
    }
  }, [i18n.language, lang]);

  const questionsTextMap = questions.reduce((acc, q) => {
    acc[q.id] = q.text;
    return acc;
  }, {} as Record<string, string>);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const isLastPage = currentPage === totalPages - 1;

  const currentQuestions = useMemo(() => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return questions.slice(start, end);
  }, [currentPage]);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!gender) {
        alert("Please select a gender option.");
        return;
    }
    setLoading(true);
    setError(null);
    const formattedAnswers: Answer[] = Object.entries(answers).map(([id, value]) => ({
      id,
      value,
    }));

    try {
      const apiUrl = import.meta.env.VITE_MBTI_BACK_API_URL;
      const response = await fetch(`${apiUrl}/analyse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            answers: formattedAnswers,
            gender: gender,
            questionsText: questionsTextMap
        }),
      });
      const data = await response.json();
      if(response.ok) {
        setResult(data);
      } else {
        throw new Error(data.error || "An unknown error occurred");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`There was an error processing your results: ${errorMessage}. Please try again later.`);
      console.error('Error submitting quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const allQuestionsOnPageAnswered = useMemo(() => {
    return currentQuestions.every((q) => answers[q.id] !== undefined);
  }, [answers, currentQuestions]);

  const progress = (Object.keys(answers).length / questions.length) * 100;

  const resetQuiz = () => {
    setResult(null);
    setError(null);
    setAnswers({});
    setCurrentPage(0);
    setGender(undefined);
  }

  if (error) {
    return (
        <Card className="w-full max-w-2xl mx-auto text-center p-8">
            <CardHeader>
                <CardTitle className="text-red-500">{t('mbti.analysisFailed')}</CardTitle>
                <CardDescription>{t('mbti.couldNotProcess')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <Button onClick={resetQuiz}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('mbti.tryAgain')}
                </Button>
            </CardContent>
        </Card>
    )
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="mb-6">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-blue-600">{result.mbti_type}</CardTitle>
                <CardDescription className="text-xl">{result.type_name}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-gray-700 dark:text-gray-300">{result.core_characteristics}</p>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><CheckCircle className="mr-2 text-green-500"/> {t('mbti.strengths')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                        {result.strengths.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><XCircle className="mr-2 text-red-500"/> {t('mbti.challenges')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                        {result.challenges.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center"><Briefcase className="mr-2 text-gray-500"/> {t('mbti.careerPaths')}</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-wrap gap-2">
                    {result.career_paths.map((item, i) => (
                        <div key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-sm font-medium">
                            {item}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Famous People Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 text-pink-500" />
              {t('mbti.famousPeople')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-y-3">
              {result.famous_people && result.famous_people.map((person, idx) => (
                <li key={idx} className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-10 h-10 flex-shrink-0 relative">
                    <CelebrityImage
                      name={person.name}
                      similarity={1}
                      index={idx}
                      size={40}
                      className="absolute inset-0 w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="truncate">
                    <span className="block font-semibold text-blue-700 dark:text-blue-300 truncate">
                      {person.name}
                    </span>
                    <span className="block text-gray-700 dark:text-gray-300 truncate">
                      {person.description}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-300">{t('mbti.finalSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">{result.summary}</p>
                <div className="flex justify-between items-center">
                    <Button onClick={() => window.open(result.official_link, '_blank')}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t('mbti.readFullProfile')}
                    </Button>
                     <Button variant="ghost" onClick={resetQuiz}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t('mbti.takeAgain')}
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative">
        {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('mbti.analyzingYourAnswers')}</p>
                <p className="text-gray-600 dark:text-gray-400">{t('mbti.pleaseWait')}</p>
            </div>
        )}
      <Card>
        <CardHeader>
          <CardTitle>{t('mbti.testTitle')}</CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">{t('mbti.answered', {answered: Object.keys(answers).length, total: questions.length})}</p>
        </CardHeader>
        <CardContent>
          {!isLastPage ? currentQuestions.map((question, index) => (
            <div key={question.id} className="mb-8">
              <p className="font-semibold text-lg mb-4">{`${currentPage * questionsPerPage + index + 1}. ${question.text}`}</p>
              <div className="flex justify-between items-center space-x-2">
                <span className="text-sm text-gray-500 text-center">{t('mbti.disagree')}</span>
                <div className="flex justify-center items-center gap-1 sm:gap-2 flex-grow">
                  {question.options.map((option) => {
                    const isSelected = answers[question.id] === option.value;
                    let ringClass = '';
                    if (isSelected) {
                      ringClass = option.value > 0 ? 'ring-green-500' : 'ring-red-500';
                    }
                    if (isSelected && option.value === 0) {
                        ringClass = 'ring-gray-500';
                    }

                    return (
                        <button
                        key={option.value}
                        onClick={() => handleAnswerChange(question.id, option.value)}
                        className={`
                            w-8 h-8 sm:w-10 sm:h-10 
                            rounded-full flex-shrink-0
                            flex items-center justify-center 
                            border-2
                            transition-all duration-200 ease-in-out
                            transform hover:scale-110
                            ${isSelected
                                ? `${option.value > 0 ? 'bg-green-400 border-green-600 text-white' : option.value < 0 ? 'bg-red-400 border-red-600 text-white' : 'bg-gray-400 border-gray-600 text-white'}`
                                : 'bg-white border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                            }
                            ${isSelected ? `ring-2 ${ringClass} ring-offset-2 dark:ring-offset-gray-900` : ''}
                        `}
                        title={option.text}
                        >
                        </button>
                    );
                  })}
                </div>
                <span className="text-sm text-gray-500 text-center">{t('mbti.agree')}</span>
              </div>
            </div>
          )) : (
            <div>
                 {currentQuestions.map((question, index) => (
                    <div key={question.id} className="mb-8">
                    <p className="font-semibold text-lg mb-4">{`${currentPage * questionsPerPage + index + 1}. ${question.text}`}</p>
                    <div className="flex justify-between items-center space-x-2">
                        <span className="text-sm text-gray-500 text-center">{t('mbti.disagree')}</span>
                        <div className="flex justify-center items-center gap-1 sm:gap-2 flex-grow">
                        {question.options.map((option) => {
                            const isSelected = answers[question.id] === option.value;
                            let ringClass = '';
                            if (isSelected) {
                              ringClass = option.value > 0 ? 'ring-green-500' : 'ring-red-500';
                            }
                            if (isSelected && option.value === 0) {
                                ringClass = 'ring-gray-500';
                            }

                            return (
                                <button
                                key={option.value}
                                onClick={() => handleAnswerChange(question.id, option.value)}
                                className={`
                                    w-8 h-8 sm:w-10 sm:h-10 
                                    rounded-full flex-shrink-0
                                    flex items-center justify-center 
                                    border-2
                                    transition-all duration-200 ease-in-out
                                    transform hover:scale-110
                                    ${isSelected
                                        ? `${option.value > 0 ? 'bg-green-400 border-green-600 text-white' : option.value < 0 ? 'bg-red-400 border-red-600 text-white' : 'bg-gray-400 border-gray-600 text-white'}`
                                        : 'bg-white border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                                    }
                                    ${isSelected ? `ring-2 ${ringClass} ring-offset-2 dark:ring-offset-gray-900` : ''}
                                `}
                                title={option.text}
                                >
                                </button>
                            );
                        })}
                        </div>
                        <span className="text-sm text-gray-500 text-center">{t('mbti.agree')}</span>
                    </div>
                    </div>
                ))}
                <div className="mt-8 pt-6 border-t">
                    <h3 className="font-semibold text-lg mb-4">{t('mbti.specifyGender')}</h3>
                    <RadioGroup onValueChange={setGender} value={gender} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">{t('mbti.male')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">{t('mbti.female')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" />
                            <Label htmlFor="prefer_not_to_say">{t('mbti.preferNotToSay')}</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
          )}
          <div className="flex justify-end mt-6">
            {!isLastPage ? (
              <Button onClick={handleNextPage} disabled={!allQuestionsOnPageAnswered}>
                {t('mbti.next')}
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length || !gender || loading}>
                {loading ? t('mbti.analyzing') : t('mbti.finishAndSeeResults')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MBTIQuiz; 