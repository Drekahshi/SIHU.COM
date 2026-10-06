"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ScanSearch, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, Loader2, ShieldCheck, ThumbsUp, ThumbsDown, MapPin, User } from 'lucide-react';
import { VerifyTask } from '../../../constants/verifyData';

interface AnnotationToolProps {
  task: VerifyTask | null;
  onComplete: (task: VerifyTask, aiScore: number) => void;
}

type Step = 'check' | 'ai' | 'submit';
type Answer = 'yes' | 'no' | null;

/** The questions a verifier answers about each photo. */
const QUESTIONS = [
  { id: 'visible', text: 'Can you clearly see the activity in the photo?' },
  { id: 'place', text: 'Does the place match the task (forest, lake, clinic...)?' },
  { id: 'real', text: 'Does the photo look real and recent, not copied?' },
] as const;

const STEPS: { id: Step; label: string }[] = [
  { id: 'check', label: 'Check the photo' },
  { id: 'ai', label: 'AI check' },
  { id: 'submit', label: 'Submit' },
];

export default function AnnotationTool({ task, onComplete }: AnnotationToolProps) {
  const [step, setStep] = useState<Step>('check');
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [aiScore, setAiScore] = useState(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Start fresh for each task.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep('check'); setAnswers({}); setAiScore(0); setNote(''); setIsSubmitting(false);
  }, [task]);

  if (!task) {
    return (
      <div className="h-full min-h-[420px] bg-white border border-slate-200/80 rounded-3xl flex flex-col items-center justify-center p-10 text-center">
        <span className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center"><Eye size={28} /></span>
        <h2 className="font-heading text-[20px] font-bold text-slate-900 mt-5">Pick a task to begin</h2>
        <p className="text-[14.5px] text-slate-500 mt-2 max-w-xs leading-relaxed">Choose a field photo on the left. You will check it, run the AI check and earn credits.</p>
      </div>
    );
  }

  const answered = QUESTIONS.every((q) => answers[q.id]);
  const noCount = QUESTIONS.filter((q) => answers[q.id] === 'no').length;
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const runAi = () => {
    setStep('ai');
    setAiScore(0);
    setTimeout(() => {
      // Demo score: high when the photo passed your checks, lower for each "no".
      const base = Math.floor(Math.random() * 14) + 84;
      setAiScore(Math.max(35, base - noCount * 22));
    }, 2200);
  };

  const submit = () => {
    setIsSubmitting(true);
    setTimeout(() => onComplete(task, aiScore), 1200);
  };

  const good = aiScore >= 80;

  return (
    <div className="h-full bg-white border border-slate-200/80 rounded-3xl flex flex-col overflow-hidden">
      {/* Task header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-500">{task.id} · {task.categoryName}</p>
            <h2 className="font-heading text-[19px] font-bold text-slate-900 leading-snug">{task.label}</h2>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-slate-500 mt-1">
              <span className="flex items-center gap-1"><User size={13} /> {task.contributor}</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> {task.lat}, {task.lng}</span>
            </p>
          </div>
          <span className="shrink-0 text-right">
            <span className="block text-[15px] font-bold text-emerald-700">+{task.reward}</span>
            <span className="block text-[11.5px] text-slate-500">credits</span>
          </span>
        </div>
        {/* Steps */}
        <ol className="flex items-center gap-2 mt-4" aria-label="Steps">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2 flex-1 min-w-0">
              <span className={`w-6 h-6 shrink-0 rounded-full text-[12px] font-bold flex items-center justify-center ${i < stepIndex ? 'bg-emerald-500 text-white' : i === stepIndex ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {i < stepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </span>
              <span className={`text-[12.5px] font-semibold truncate ${i === stepIndex ? 'text-slate-900' : 'text-slate-500'}`}>{s.label}</span>
              {i < STEPS.length - 1 && <span className="hidden sm:block flex-1 h-px bg-slate-200" />}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex-1 p-5 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 'check' && (
            <motion.div key="check" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                <Image src={task.img} alt={task.label} fill sizes="(max-width: 1024px) 100vw, 480px" className="object-cover" />
              </div>
              <div className="mt-5 space-y-3">
                {QUESTIONS.map((q) => (
                  <div key={q.id} className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200">
                    <p className="text-[14.5px] text-slate-800 leading-snug">{q.text}</p>
                    <div className="flex gap-1.5 shrink-0">
                      {(['yes', 'no'] as const).map((a) => {
                        const on = answers[q.id] === a;
                        return (
                          <button key={a} onClick={() => setAnswers({ ...answers, [q.id]: a })} aria-pressed={on}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold border transition-colors ${
                              on ? (a === 'yes' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-rose-600 border-rose-600 text-white')
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                            }`}>
                            {a === 'yes' ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />} {a === 'yes' ? 'Yes' : 'No'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={runAi} disabled={!answered}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-slate-900 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-500 text-white text-[15px] font-semibold transition-colors">
                <ScanSearch size={18} /> {answered ? 'Run the AI check' : 'Answer the 3 questions first'}
              </button>
            </motion.div>
          )}

          {step === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center text-center py-6">
              {aiScore === 0 ? (
                <>
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                    <Image src={task.img} alt="" fill sizes="480px" className="object-cover opacity-60" />
                    <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }} className="absolute left-0 right-0 h-[3px] bg-sky-500 shadow-[0_0_16px_rgba(14,165,233,0.9)]" />
                  </div>
                  <p className="flex items-center gap-2 mt-6 text-[15px] font-semibold text-slate-800"><Loader2 size={18} className="animate-spin text-sky-600" /> Checking the photo...</p>
                  <p className="text-[13px] text-slate-500 mt-1">Comparing it with the task and nearby reports.</p>
                </>
              ) : (
                <>
                  <div className="relative w-36 h-36">
                    <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <motion.circle cx="50" cy="50" r="44" fill="none" stroke={good ? '#059669' : '#d97706'} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray="276.5" initial={{ strokeDashoffset: 276.5 }} animate={{ strokeDashoffset: 276.5 - (276.5 * aiScore) / 100 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                    </svg>
                    <span className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-heading text-[34px] font-bold text-slate-900">{aiScore}%</span>
                      <span className="text-[11.5px] text-slate-500">confidence</span>
                    </span>
                  </div>
                  <p className={`flex items-center gap-2 mt-5 text-[17px] font-bold ${good ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {good ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />} {good ? 'Looks good' : 'Needs a second look'}
                  </p>
                  <p className="text-[14.5px] text-slate-600 mt-2 max-w-sm leading-relaxed">
                    {good ? 'The photo matches the task. You can submit your check.' : 'Something does not match. Your check will also go to a SIHU editor.'}
                  </p>
                  <p className="text-[12px] text-slate-400 mt-2">AI check is a demo while SIHU-Vision is in testing.</p>
                  <div className="flex flex-col sm:flex-row gap-2 w-full mt-6">
                    <button onClick={() => setStep('check')} className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full border border-slate-300 text-slate-700 text-[14.5px] font-semibold hover:border-slate-900"><ArrowLeft size={16} /> Look again</button>
                    <button onClick={() => setStep('submit')} className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-slate-900 hover:bg-sky-600 text-white text-[14.5px] font-semibold">Continue <ArrowRight size={16} /></button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 'submit' && (
            <motion.div key="submit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-[12px] text-slate-500">Your checks</p>
                  <p className="text-[15px] font-bold text-slate-900 mt-0.5">{QUESTIONS.length - noCount} of {QUESTIONS.length} passed</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-[12px] text-slate-500">AI confidence</p>
                  <p className={`text-[15px] font-bold mt-0.5 ${good ? 'text-emerald-700' : 'text-amber-700'}`}>{aiScore}%</p>
                </div>
              </div>
              <div className="mt-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-end justify-between">
                <div>
                  <p className="text-[12.5px] font-semibold text-emerald-800">You will earn</p>
                  <p className="font-heading text-[32px] font-bold text-emerald-700 leading-none mt-1">{task.reward} <span className="text-[15px] font-sans">credits</span></p>
                </div>
                <p className="text-[15px] font-bold text-emerald-700">+{task.xp} XP</p>
              </div>
              <label className="block mt-5">
                <span className="block text-[14px] font-semibold text-slate-700 mb-2">Note for the editors (optional)</span>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-[14.5px] leading-relaxed focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15 resize-y"
                  placeholder="What did you notice? For example: trees are young but healthy." />
              </label>
              <div className="flex flex-col sm:flex-row gap-2 mt-5">
                <button onClick={() => setStep('ai')} disabled={isSubmitting} className="sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-slate-300 text-slate-700 text-[14.5px] font-semibold hover:border-slate-900"><ArrowLeft size={16} /> Back</button>
                <button onClick={submit} disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white text-[15px] font-semibold transition-colors">
                  {isSubmitting ? <><Loader2 size={17} className="animate-spin" /> Submitting...</> : <><ShieldCheck size={17} /> Submit my check</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
