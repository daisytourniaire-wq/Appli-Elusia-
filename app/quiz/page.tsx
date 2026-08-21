"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { AxisBar } from "@/components/AxisBar";
import { CONCERN_OPTIONS, LIFESTYLE_QUESTIONS } from "@/lib/quiz/questions";
import { AXIS_META, CONCERN_META } from "@/lib/quiz/content";
import type { AxisScore, ConcernKey } from "@/lib/quiz/types";

type Phase = "intro" | "concern" | "lifestyle" | "lead" | "result";

interface ApiResult {
  profileTitle: string;
  priorities: string[];
  axisScores: AxisScore[];
}

const SESSION_KEY = "elusia_session_id";
const STARTED_KEY = "elusia_quiz_started";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getUtm() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    content: params.get("utm_content") ?? undefined,
    term: params.get("utm_term") ?? undefined,
  };
}

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [lifestyleIndex, setLifestyleIndex] = useState(0);
  const [concern, setConcern] = useState<ConcernKey | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const startedRef = useRef(false);

  const totalSteps = 1 + LIFESTYLE_QUESTIONS.length + 1; // concern + lifestyle + lead
  const currentStep = useMemo(() => {
    if (phase === "concern") return 1;
    if (phase === "lifestyle") return 1 + lifestyleIndex + 1;
    if (phase === "lead" || phase === "result") return totalSteps;
    return 0;
  }, [phase, lifestyleIndex, totalSteps]);

  function startQuiz() {
    if (!startedRef.current && typeof window !== "undefined") {
      startedRef.current = true;
      const sessionId = getSessionId();
      if (!window.sessionStorage.getItem(STARTED_KEY)) {
        window.sessionStorage.setItem(STARTED_KEY, "1");
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, utm: getUtm() }),
        }).catch(() => {});
      }
    }
    setPhase("concern");
  }

  function selectConcern(key: ConcernKey) {
    setConcern(key);
    setLifestyleIndex(0);
    setPhase("lifestyle");
  }

  function answerLifestyle(value: number) {
    const question = LIFESTYLE_QUESTIONS[lifestyleIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (lifestyleIndex + 1 < LIFESTYLE_QUESTIONS.length) {
      setLifestyleIndex((i) => i + 1);
    } else {
      setPhase("lead");
    }
  }

  function goBack() {
    if (phase === "lifestyle") {
      if (lifestyleIndex === 0) {
        setPhase("concern");
      } else {
        setLifestyleIndex((i) => i - 1);
      }
    } else if (phase === "lead") {
      setPhase("lifestyle");
      setLifestyleIndex(LIFESTYLE_QUESTIONS.length - 1);
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!concern) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          concern,
          answers,
          consent,
          sessionId: getSessionId(),
          utm: getUtm(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Une erreur est survenue.");
      }
      setResult(data);
      setPhase("result");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-elusia-bg px-6 py-14">
      <div className="mx-auto max-w-xl">
        {phase !== "intro" && phase !== "result" && (
          <ProgressBar step={currentStep} total={totalSteps} />
        )}

        {phase === "intro" && <IntroStep onStart={startQuiz} />}

        {phase === "concern" && (
          <ConcernStep selected={concern} onSelect={selectConcern} />
        )}

        {phase === "lifestyle" && (
          <LifestyleStep
            index={lifestyleIndex}
            selectedValue={answers[LIFESTYLE_QUESTIONS[lifestyleIndex].id]}
            onAnswer={answerLifestyle}
            onBack={goBack}
          />
        )}

        {phase === "lead" && (
          <LeadStep
            firstName={firstName}
            email={email}
            consent={consent}
            submitting={submitting}
            error={submitError}
            onFirstNameChange={setFirstName}
            onEmailChange={setEmail}
            onConsentChange={setConsent}
            onSubmit={submitLead}
            onBack={goBack}
          />
        )}

        {phase === "result" && result && concern && (
          <ResultStep concern={concern} result={result} firstName={firstName} />
        )}
      </div>
    </main>
  );
}

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center">
      <h1 className="font-serif text-3xl italic text-elusia-ink">
        Ton diagnostic Élusia
      </h1>
      <p className="mx-auto mt-4 max-w-md text-elusia-muted">
        10 questions sur ta peau, ton alimentation et ton mode de vie. À la
        fin, tu reçois ton profil personnalisé et tes 3 priorités.
      </p>
      <button onClick={onStart} className="btn-primary mt-8">
        Démarrer le quiz
      </button>
      <p className="mt-8">
        <Link href="/" className="text-xs text-elusia-muted underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}

function ConcernStep({
  selected,
  onSelect,
}: {
  selected: ConcernKey | null;
  onSelect: (key: ConcernKey) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-elusia-ink">
        Quelle est ta principale préoccupation peau en ce moment ?
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {CONCERN_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onSelect(opt.key)}
            className={`option-card ${
              selected === opt.key ? "option-card-selected" : ""
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function LifestyleStep({
  index,
  selectedValue,
  onAnswer,
  onBack,
}: {
  index: number;
  selectedValue: number | undefined;
  onAnswer: (value: number) => void;
  onBack: () => void;
}) {
  const question = LIFESTYLE_QUESTIONS[index];
  return (
    <div>
      <h2 className="font-serif text-2xl text-elusia-ink">
        {question.question}
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onAnswer(opt.value)}
            className={`option-card ${
              selectedValue === opt.value ? "option-card-selected" : ""
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={onBack}
        className="mt-6 text-xs text-elusia-muted underline"
      >
        Retour
      </button>
    </div>
  );
}

function LeadStep({
  firstName,
  email,
  consent,
  submitting,
  error,
  onFirstNameChange,
  onEmailChange,
  onConsentChange,
  onSubmit,
  onBack,
}: {
  firstName: string;
  email: string;
  consent: boolean;
  submitting: boolean;
  error: string | null;
  onFirstNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onConsentChange: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-elusia-ink">
        Dernière étape : où envoyer ton profil ?
      </h2>
      <p className="mt-2 text-sm text-elusia-muted">
        Ton profil personnalisé et tes 3 priorités s&apos;affichent juste après.
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-elusia-muted">
            Prénom
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="w-full rounded-xl border border-elusia-line bg-white px-4 py-3 text-sm outline-none focus:border-elusia-clay"
            placeholder="Ton prénom"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-elusia-muted">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full rounded-xl border border-elusia-line bg-white px-4 py-3 text-sm outline-none focus:border-elusia-clay"
            placeholder="ton@email.com"
          />
        </div>
        <label className="flex items-start gap-2.5 text-xs text-elusia-muted">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-elusia-line"
          />
          <span>
            J&apos;accepte de recevoir mon profil Élusia ainsi que des contenus et
            offres adaptés à ma préoccupation par email. Désinscription
            possible à tout moment.
          </span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? "Calcul de ton profil…" : "Découvrir mon profil"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-elusia-muted underline"
        >
          Retour
        </button>
      </form>
    </div>
  );
}

function ResultStep({
  concern,
  result,
  firstName,
}: {
  concern: ConcernKey;
  result: ApiResult;
  firstName: string;
}) {
  const priorityAxes = result.priorities
    .map((axis) => result.axisScores.find((s) => s.axis === axis))
    .filter((s): s is AxisScore => Boolean(s));

  return (
    <div>
      <p className="text-center text-xs uppercase tracking-[0.2em] text-elusia-clay">
        Ton profil Élusia
      </p>
      <h1 className="mt-2 text-center font-serif text-3xl italic text-elusia-ink">
        {result.profileTitle}
        {firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-elusia-muted">
        {CONCERN_META[concern].description}
      </p>

      <div className="card mt-8">
        <h2 className="font-serif text-lg text-elusia-ink">
          Tes 3 axes prioritaires
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          {priorityAxes.map((s) => (
            <AxisBar
              key={s.axis}
              label={AXIS_META[s.axis].label}
              percent={s.percent}
              highlighted
            />
          ))}
        </div>
      </div>

      <div className="card mt-5">
        <h2 className="font-serif text-lg text-elusia-ink">
          Tes 3 premières actions concrètes
        </h2>
        <ul className="mt-4 flex flex-col gap-4">
          {priorityAxes.map((s, i) => (
            <li key={s.axis} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-elusia-clay/10 text-xs font-medium text-elusia-clay">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-elusia-ink">
                {AXIS_META[s.axis].action}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-elusia-muted">
        Ce profil ne constitue pas un diagnostic médical. Tu recevras par
        email des contenus et conseils adaptés à ta préoccupation principale.
      </p>

      <div className="mt-8 text-center">
        <Link href="/" className="btn-secondary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
