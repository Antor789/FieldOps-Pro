import React, { useState } from 'react';
import { CustomSurvey, SurveyQuestion } from '../../types/feedback';
import { INITIAL_CUSTOM_SURVEYS } from '../../data/mockFeedbackData';
import { Sparkles, Plus, Trash2, Globe, CheckCircle2, FileText, Layers, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SurveyBuilder: React.FC = () => {
  const [surveys, setSurveys] = useState<CustomSurvey[]>(INITIAL_CUSTOM_SURVEYS);
  const [selectedSurvey, setSelectedSurvey] = useState<CustomSurvey>(INITIAL_CUSTOM_SURVEYS[0]);

  const [titleEn, setTitleEn] = useState(selectedSurvey.titleEn);
  const [titleBn, setTitleBn] = useState(selectedSurvey.titleBn);
  const [questions, setQuestions] = useState<SurveyQuestion[]>(selectedSurvey.questions);

  const handleAddQuestion = () => {
    const newQ: SurveyQuestion = {
      id: `q-${Date.now()}`,
      type: 'rating',
      questionEn: 'How satisfied were you with this aspect?',
      questionBn: 'আপনি এই বিষয়ে কতটা সন্তুষ্ট?',
      required: true,
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSaveSurvey = () => {
    const updated: CustomSurvey = {
      ...selectedSurvey,
      titleEn,
      titleBn,
      questions,
    };

    setSurveys((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    alert('Survey template saved successfully!');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-sans">
      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-white">Custom Survey & Questionnaire Builder</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build bilingual (English + বাংলা) CSAT & NPS survey templates with auto-dispatch triggers
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleSaveSurvey}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
        >
          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Save Survey Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Template Selector */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 px-1">
            Saved Survey Templates ({surveys.length})
          </h3>

          <div className="space-y-3">
            {surveys.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedSurvey(s);
                  setTitleEn(s.titleEn);
                  setTitleBn(s.titleBn);
                  setQuestions(s.questions);
                }}
                className={`p-4 rounded-3xl border transition cursor-pointer space-y-2 ${
                  s.id === selectedSurvey.id
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{s.titleEn}</div>
                  <span className="text-[9px] uppercase font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    {s.surveyType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.descriptionEn}</p>
                <div className="text-[10px] font-mono text-slate-400 pt-1">
                  {s.questions.length} Questions • {s.responseCount} Responses
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bilingual Question Editor (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-amber-500" />
            Bilingual Template Editor ({selectedSurvey.titleEn})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Survey Title (English)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Survey Title (বাংলা)
              </label>
              <input
                type="text"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                Questions ({questions.length})
              </h4>
              <Button size="xs" variant="outline" onClick={handleAddQuestion} className="font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Question
              </Button>
            </div>

            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400">
                    Question #{idx + 1} ({q.type.toUpperCase()})
                  </span>
                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Question (English)</label>
                    <input
                      type="text"
                      value={q.questionEn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions((prev) =>
                          prev.map((item) => (item.id === q.id ? { ...item, questionEn: val } : item))
                        );
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Question (বাংলা)</label>
                    <input
                      type="text"
                      value={q.questionBn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions((prev) =>
                          prev.map((item) => (item.id === q.id ? { ...item, questionBn: val } : item))
                        );
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
