import React, { useState } from 'react';
import { StarRating } from '../../components/feedback/StarRating';
import {
  Star,
  CheckCircle2,
  Globe,
  Sparkles,
  Send,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  User,
  Wrench,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface FeedbackFormProps {
  workOrderId?: string;
  technicianName?: string;
  customerName?: string;
  onSubmitSuccess?: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  workOrderId = 'WO-9045',
  technicianName = 'Rahim Ahmed',
  customerName = 'Grameenphone Ltd',
  onSubmitSuccess,
}) => {
  const [lang, setLang] = useState<'en' | 'bn'>('bn');

  // Form State
  const [overallRating, setOverallRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [professionalismRating, setProfessionalismRating] = useState(5);
  const [workQualityRating, setWorkQualityRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [npsScore, setNpsScore] = useState(10);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onSubmitSuccess) onSubmitSuccess();
  };

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto my-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {lang === 'bn' ? 'ধন্যবাদ! আপনার ফিডব্যাক জমা হয়েছে' : 'Thank You! Feedback Submitted'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'bn'
              ? 'আপনার মতামত আমাদের সেবার মান বৃদ্ধিতে সহায়তা করবে।'
              : 'Your valuable feedback helps FieldOps Pro maintain top quality standards.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1 font-mono">
          <div>Work Order: #{workOrderId}</div>
          <div>Technician: {technicianName}</div>
          <div className="font-extrabold text-amber-600">⭐ {overallRating}.0 / 5.0 Rating Recorded</div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsSubmitted(false)}
          className="font-bold"
        >
          {lang === 'bn' ? 'নতুন প্রতিক্রিয়া জমা দিন' : 'Submit Another Review'}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-8 space-y-6 animate-fadeIn font-sans">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-amber-500 font-black text-xl">FieldOps</span>
            <span className="text-white font-black text-xl">PRO</span>
          </div>

          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'English' : 'বাংলা (Bangla)'}
          </button>
        </div>

        <div>
          <h1 className="text-lg font-extrabold text-white">
            {lang === 'bn' ? '🌟 কাস্টমার সার্ভিস ফিডব্যাক ফর্ম' : '🌟 Service Quality Feedback Form'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'bn'
              ? 'অনুগ্রহ করে আমাদের ফিল্ড সার্ভিসের মান মূল্যায়ন করুন'
              : 'Please evaluate the quality of our field service completion'}
          </p>
        </div>

        {/* Job Context Banner */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex justify-between items-center text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Client / কাজের বিবরণ</span>
            <span className="font-bold text-white">{customerName}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Technician</span>
            <span className="font-bold text-amber-400">{technicianName}</span>
          </div>
        </div>
      </div>

      {/* Main Feedback Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        {/* Overall Rating */}
        <div className="space-y-2 text-center p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
          <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-100">
            {lang === 'bn' ? 'সামগ্রিক সেবার মান (Overall Rating)' : 'Overall Service Rating'}
          </label>
          <div className="flex justify-center py-1">
            <StarRating
              value={overallRating}
              onChange={setOverallRating}
              size="lg"
              showLabel
              lang={lang}
            />
          </div>
        </div>

        {/* Aspect Ratings Breakdown */}
        <div className="space-y-4 pt-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
            {lang === 'bn' ? 'নির্দিষ্ট ক্যাটাগরি মূল্যায়ন' : 'Specific Aspect Ratings'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                {lang === 'bn' ? 'সময়ানুবর্তিতা (Punctuality)' : 'Punctuality & Arrival'}
              </label>
              <StarRating value={punctualityRating} onChange={setPunctualityRating} size="sm" />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                {lang === 'bn' ? 'পেশাদারিত্ব (Professionalism)' : 'Professionalism'}
              </label>
              <StarRating value={professionalismRating} onChange={setProfessionalismRating} size="sm" />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                {lang === 'bn' ? 'কাজের গুণমান (Work Quality)' : 'Work Quality & Testing'}
              </label>
              <StarRating value={workQualityRating} onChange={setWorkQualityRating} size="sm" />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                {lang === 'bn' ? 'যোগাযোগ (Communication)' : 'Communication'}
              </label>
              <StarRating value={communicationRating} onChange={setCommunicationRating} size="sm" />
            </div>
          </div>
        </div>

        {/* Recommendation & NPS */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            {lang === 'bn'
              ? 'আপনি কি অন্য কাউকে ফিল্ডঅপস প্রো সুপারিশ করবেন? (Would Recommend)'
              : 'Would you recommend FieldOps Pro to a colleague or partner?'}
          </label>
          <div className="flex gap-2">
            {[
              { val: 'yes', labelEn: 'Yes (হ্যাঁ)', bg: 'bg-emerald-500 text-white' },
              { val: 'maybe', labelEn: 'Maybe (হতেও পারে)', bg: 'bg-amber-500 text-slate-950' },
              { val: 'no', labelEn: 'No (না)', bg: 'bg-red-500 text-white' },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => setWouldRecommend(item.val as any)}
                className={`flex-1 p-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                  wouldRecommend === item.val
                    ? `${item.bg} border-transparent shadow-md`
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                {item.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Comment Textarea */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            {lang === 'bn'
              ? 'আপনার মূল্যবান মন্তব্য বা পরামর্শ (ঐচ্ছিক)'
              : 'Your Comment or Suggestions (Optional)'}
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              lang === 'bn'
                ? 'এখানে আপনার মতামত লিখুন...'
                : 'Share details about technician behavior or service quality...'
            }
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 text-sm rounded-2xl shadow-lg"
        >
          <Send className="w-4 h-4 mr-2" />
          {lang === 'bn' ? 'ফিডব্যাক জমা দিন' : 'Submit Feedback'}
        </Button>
      </form>
    </div>
  );
};
