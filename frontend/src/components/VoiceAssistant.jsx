/**
 * VoiceAssistant.jsx
 *
 * Self-contained voice + typed assistant panel.
 *
 * Features:
 *  - Language selector  : English / हिंदी / मराठी
 *  - Mode selector      : Scheme Discovery / Profile Score / Guidance
 *  - Text input + voice input button
 *  - Real Web Speech API (SpeechRecognition) for STT — degrades gracefully
 *  - Web Speech API (SpeechSynthesis) for TTS of assistant replies
 *  - Profile form (collapsible) for ML feature inputs
 *  - Renders eligible schemes inline
 *  - SHAP top-features bar chart (text-based)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sendChatMessage } from '../services/chatService';

// ── Constants ──────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English',  srLang: 'en-IN' },
  { code: 'hi', label: 'हिंदी',    srLang: 'hi-IN' },
  { code: 'mr', label: 'मराठी',   srLang: 'mr-IN' },
];

const MODES = [
  { code: 'scheme_discovery', label: 'Scheme Discovery',   icon: 'search'      },
  { code: 'profile_score',    label: 'Score Insights',      icon: 'analytics'   },
  { code: 'guidance',         label: 'Help / Guidance',     icon: 'help_outline' },
];

const DEFAULT_PROFILE = {
  upi_transactions_count: '',
  upi_avg_monthly_amount: '',
  location_consistency:   '',
  peer_attestations:      '',
  customer_rating_avg:    '',
  work_duration_months:   '',
  aadhaar_verified:       '',
};

const PROFILE_FIELDS = [
  { key: 'upi_transactions_count', label: 'UPI Transactions',        placeholder: 'e.g. 45',    type: 'number', hint: 'Total UPI transactions made' },
  { key: 'upi_avg_monthly_amount', label: 'Avg Monthly UPI (₹)',      placeholder: 'e.g. 8500',  type: 'number', hint: 'Average UPI amount per month' },
  { key: 'location_consistency',   label: 'Location Consistency',     placeholder: '0.0 – 1.0',  type: 'number', hint: 'How consistent is your work location (0–1)' },
  { key: 'peer_attestations',      label: 'Peer Attestations',        placeholder: 'e.g. 4',     type: 'number', hint: 'Number of peers who vouched for you' },
  { key: 'customer_rating_avg',    label: 'Customer Rating (1–5)',    placeholder: 'e.g. 4.2',   type: 'number', hint: 'Average customer satisfaction rating' },
  { key: 'work_duration_months',   label: 'Work Duration (months)',   placeholder: 'e.g. 18',    type: 'number', hint: 'Months of continuous work' },
  { key: 'aadhaar_verified',       label: 'Aadhaar Verified',         placeholder: '0 or 1',     type: 'number', hint: '1 = verified, 0 = not verified' },
];

const CATEGORY_ICONS = {
  'Micro Loan':      'account_balance',
  'Insurance':       'health_and_safety',
  'Banking':         'savings',
  'Social Security': 'shield',
  'Business Loan':   'business_center',
  'Healthcare':      'local_hospital',
  'Pension':         'elderly',
};

// ── Helpers ────────────────────────────────────────────────────────────────
function isSpeechSupported() {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}

function speak(text, langCode) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = LANGUAGES.find(l => l.code === langCode)?.srLang ?? 'en-IN';
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
}

function profileIsComplete(profile) {
  return PROFILE_FIELDS.every(f => profile[f.key] !== '' && profile[f.key] !== null);
}

function buildUserProfile(profile) {
  const result = {};
  for (const f of PROFILE_FIELDS) {
    result[f.key] = parseFloat(profile[f.key]);
  }
  return result;
}

/**
 * Extract profile field values from a natural-language message.
 *
 * Handles inputs like:
 *   "upi transation - 107, monthly amount - 26169, work duration - 6,
 *    location consistency - 0.69, peer attesations - 5, customer rating - 3.2, adhaar - 0"
 *
 * Returns a partial profile object (only fields that were found).
 */
function parseProfileFromMessage(text) {
  const parsed = {};

  // Each entry: field key → keywords to match (case-insensitive substrings).
  // List longer/more-specific keywords first so they win over shorter ones.
  const FIELD_KEYWORDS = [
    {
      key: 'upi_transactions_count',
      keywords: ['upi transact', 'upi transation', 'upi txn', 'upi trans'],
    },
    {
      key: 'upi_avg_monthly_amount',
      keywords: ['monthly amount', 'avg monthly', 'monthly upi', 'monthly'],
    },
    {
      key: 'location_consistency',
      keywords: ['location consistency', 'location consist', 'location'],
    },
    {
      key: 'peer_attestations',
      keywords: ['peer attestat', 'peer attesta', 'peer attest', 'attestat', 'peer'],
    },
    {
      key: 'customer_rating_avg',
      keywords: ['customer rating', 'customer rate', 'cust rating', 'rating'],
    },
    {
      key: 'work_duration_months',
      keywords: ['work duration', 'work dur', 'duration'],
    },
    {
      key: 'aadhaar_verified',
      keywords: ['aadhaar status', 'aadhar status', 'adhaar status', 'adhar status',
                 'aadhaar', 'aadhar', 'adhaar', 'adhar'],
    },
  ];

  // Split on commas or newlines to get individual key–value segments
  const segments = text.split(/[,\n]+/);

  for (const segment of segments) {
    const lower = segment.toLowerCase();

    for (const { key, keywords } of FIELD_KEYWORDS) {
      if (parsed[key] !== undefined) continue;  // already extracted

      const matched = keywords.some(kw => lower.includes(kw));
      if (!matched) continue;

      // Extract the last number (including decimals) from the segment.
      // "work duration - 6" → ["6"]   "location consistency - 0.69" → ["0.69"]
      const numbers = segment.match(/\d+(?:\.\d+)?/g);
      if (numbers && numbers.length > 0) {
        parsed[key] = numbers[numbers.length - 1];
      }
      break;  // stop checking keywords for this field once matched
    }
  }

  return parsed;  // may be partial
}

/**
 * Merge message-parsed values onto the existing form profile state.
 * Parsed values take precedence over empty form fields; existing non-empty
 * form values are kept as-is so the user's manual edits are never wiped.
 */
function mergeProfile(formProfile, parsedProfile) {
  const merged = { ...formProfile };
  for (const [key, val] of Object.entries(parsedProfile)) {
    if (val !== undefined && val !== null && val !== '') {
      merged[key] = val;
    }
  }
  return merged;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function SchemeCard({ scheme }) {
  const icon = CATEGORY_ICONS[scheme.category] || 'sell';
  return (
    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 hover:border-indigo-200 transition-colors">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-indigo-700 mt-0.5 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-headline font-bold text-sm text-on-surface leading-snug">{scheme.name}</h4>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
              Min: {scheme.minScore}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">{scheme.category} · {scheme.provider}</p>
          <p className="font-bold text-sm text-indigo-900 mt-2">{scheme.amount}</p>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{scheme.match_reason}</p>
          <a
            href={scheme.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline mt-2"
          >
            Apply <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function ShapBar({ feature, impact, direction }) {
  const pct = Math.min(Math.abs(impact) * 50, 100);
  const colour = direction === 'positive' ? 'bg-emerald-500' : 'bg-rose-400';
  const labels = {
    upi_transactions_count: 'UPI Transactions',
    upi_avg_monthly_amount: 'Monthly Amount',
    location_consistency:   'Location Stability',
    peer_attestations:      'Peer Attestations',
    customer_rating_avg:    'Customer Rating',
    work_duration_months:   'Work Duration',
    aadhaar_verified:       'Aadhaar',
    txn_per_month:          'Txn/Month',
    amount_per_txn:         'Amount/Txn',
    trust_signal:           'Trust Signal',
    stability_score:        'Stability Score',
  };
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-on-surface-variant w-32 shrink-0 truncate">{labels[feature] ?? feature}</span>
      <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colour} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold w-12 text-right ${direction === 'positive' ? 'text-emerald-600' : 'text-rose-500'}`}>
        {direction === 'positive' ? '+' : ''}{impact.toFixed(2)}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function VoiceAssistant({ initialScheme }) {
  const [lang, setLang]               = useState('en');
  const [mode, setMode]               = useState('scheme_discovery');
  const [input, setInput]             = useState('');
  const [listening, setListening]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile]         = useState(DEFAULT_PROFILE);
  const [messages, setMessages]       = useState([]);
  const [lastResponse, setLastResponse] = useState(null);

  const recognitionRef = useRef(null);
  const messagesEndRef  = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // If a scheme was passed in (from SchemeDetails context) pre-fill a guidance hint
  useEffect(() => {
    if (initialScheme && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        text: `Ask me about "${initialScheme.name}" (min score: ${initialScheme.minScore}), ` +
              `how to improve your score, or discover other schemes you qualify for. ` +
              `You can also type your profile values directly in the chat (e.g. "upi transactions 107, monthly amount 26169, ...") ` +
              `and I'll extract them automatically.`,
      }]);
    }
  }, [initialScheme]);

  // Auto-expand the profile form when switching to a prediction mode
  useEffect(() => {
    if (mode === 'scheme_discovery' || mode === 'profile_score') {
      if (!profileIsComplete(profile)) setShowProfile(true);
    }
  }, [mode]);

  // ── Speech Recognition ───────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!isSpeechSupported()) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang       = LANGUAGES.find(l => l.code === lang)?.srLang ?? 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart  = () => setListening(true);
    recognition.onend    = () => setListening(false);
    recognition.onerror  = () => setListening(false);

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let resolvedProfile = profile;

      // If this is a prediction mode, try to parse profile values from the
      // message text first (user may have typed them inline instead of using
      // the form). Parsed values are merged on top of any existing form values.
      if (mode === 'scheme_discovery' || mode === 'profile_score') {
        const parsedFromMsg = parseProfileFromMessage(text);
        const parsedCount   = Object.keys(parsedFromMsg).length;

        if (parsedCount > 0) {
          const merged = mergeProfile(profile, parsedFromMsg);
          resolvedProfile = merged;
          // Reflect extracted values back into the form so the user can see them
          setProfile(merged);
          // Auto-expand the profile panel so they can confirm / correct
          if (parsedCount < PROFILE_FIELDS.length) setShowProfile(true);
        }
      }

      const user_profile =
        (mode === 'scheme_discovery' || mode === 'profile_score') && profileIsComplete(resolvedProfile)
          ? buildUserProfile(resolvedProfile)
          : null;

      const response = await sendChatMessage({ message: text, mode, language: lang, user_profile });
      setLastResponse(response);

      // If profile was still incomplete after parsing, show the form to prompt
      if (!user_profile && mode !== 'guidance') setShowProfile(true);

      const assistantMessage = { role: 'assistant', text: response.assistant_reply };
      setMessages(prev => [...prev, assistantMessage]);

      speak(response.assistant_reply, lang);
    } catch (err) {
      const errMsg = `Error: ${err.message}`;
      setMessages(prev => [...prev, { role: 'assistant', text: errMsg, isError: true }]);
    } finally {
      setLoading(false);
    }
  }, [input, mode, lang, profile]);

  // Submit on Enter (not Shift+Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ── Profile field change ──────────────────────────────────────────
  const handleProfileChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const profileComplete = profileIsComplete(profile);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <section className="bg-surface-container-lowest rounded-2xl shadow-[0_40px_60px_-20px_rgba(26,28,28,0.08)] overflow-hidden border border-outline-variant/10">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 px-8 py-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary-fixed text-3xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            assistant
          </span>
          <div>
            <h3 className="font-headline font-bold text-white text-lg leading-none">IWTS Assistant</h3>
            <p className="text-indigo-300/70 text-xs mt-0.5">Voice · Text · Multilingual</p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex gap-1.5">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                lang === l.code
                  ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                  : 'text-indigo-300/70 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mode selector ── */}
      <div className="flex border-b border-outline-variant/20 bg-surface-container-low overflow-x-auto">
        {MODES.map(m => (
          <button
            key={m.code}
            onClick={() => setMode(m.code)}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
              mode === m.code
                ? 'border-indigo-700 text-indigo-700 bg-white/60'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Profile form (collapsible) ── */}
      {(mode === 'scheme_discovery' || mode === 'profile_score') && (
        <div className="border-b border-outline-variant/20">
          <button
            onClick={() => setShowProfile(v => !v)}
            className="w-full flex items-center justify-between px-8 py-4 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
              Worker Profile
              {profileComplete
                ? <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Complete</span>
                : <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Required for prediction</span>
              }
            </span>
            <span className="material-symbols-outlined text-[18px] transition-transform" style={{ transform: showProfile ? 'rotate(180deg)' : 'none' }}>
              expand_more
            </span>
          </button>

          {showProfile && (
            <div className="px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PROFILE_FIELDS.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    step="any"
                    value={profile[f.key]}
                    onChange={e => handleProfileChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    title={f.hint}
                    className="w-full px-3 py-2 bg-surface-container rounded-lg border border-outline-variant/30 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-colors"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Chat history ── */}
      <div className="h-80 overflow-y-auto px-8 py-6 space-y-4 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant/50 gap-3">
            <span className="material-symbols-outlined text-4xl">chat_bubble_outline</span>
            <p className="text-sm">
              {mode === 'scheme_discovery' && 'Fill in your profile above and ask what schemes you qualify for.'}
              {mode === 'profile_score'    && 'Fill in your profile above and ask about your trust score.'}
              {mode === 'guidance'         && 'Ask anything about schemes, eligibility, or how the platform works.'}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <span className="material-symbols-outlined text-indigo-500 text-xl mr-2 mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                assistant
              </span>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-700 text-white rounded-tr-sm'
                  : msg.isError
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 rounded-tl-sm'
                    : 'bg-surface-container text-on-surface rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <span className="material-symbols-outlined text-indigo-500 text-xl mr-2 mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              assistant
            </span>
            <div className="bg-surface-container rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 150, 300].map(delay => (
                <span
                  key={delay}
                  className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 px-8 py-5 border-t border-outline-variant/20 bg-surface-container-low">
        {/* Voice button */}
        <button
          type="button"
          onClick={listening ? stopListening : startListening}
          disabled={!isSpeechSupported() || loading}
          title={isSpeechSupported() ? (listening ? 'Stop listening' : 'Speak') : 'Voice not supported in this browser'}
          className={`relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm ${
            listening
              ? 'bg-rose-500 text-white shadow-rose-300 shadow-md scale-110'
              : isSpeechSupported()
                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:scale-95'
                : 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed'
          }`}
        >
          {listening && (
            <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-50" />
          )}
          <span className="material-symbols-outlined text-[22px] relative" style={{ fontVariationSettings: "'FILL' 1" }}>
            {listening ? 'mic_off' : 'mic'}
          </span>
        </button>

        {/* Text input */}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === 'guidance'
              ? 'Ask about schemes, eligibility, how scores work…'
              : profileIsComplete(profile)
                ? 'Profile ready — ask what schemes you qualify for…'
                : 'Type values (e.g. "upi transactions 107, monthly amount 26169, work duration 6…") or fill the form above'
          }
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-full bg-surface-container border border-outline-variant/30 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-colors"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="shrink-0 w-11 h-11 rounded-full bg-indigo-700 text-white flex items-center justify-center hover:bg-indigo-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <span className="material-symbols-outlined text-[22px]">send</span>
        </button>
      </form>

      {/* ── Results panel ── */}
      {lastResponse && (
        <div className="border-t border-outline-variant/20 px-8 py-7 space-y-8 bg-surface">

          {/* Score badge */}
          {lastResponse.iwts_score !== null && lastResponse.iwts_score !== undefined && (
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-800 text-white shadow-lg">
                <span className="text-3xl font-extrabold text-secondary-fixed leading-none">{lastResponse.iwts_score}</span>
                <span className="text-[10px] uppercase tracking-widest text-indigo-300/70 mt-1">IWTS</span>
              </div>
              <div>
                <p className="font-headline font-bold text-xl text-on-surface">Trust Score</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  {lastResponse.eligible_schemes.length > 0
                    ? `Qualifies for ${lastResponse.eligible_schemes.length} scheme(s)`
                    : 'No schemes matched yet — improve your score'}
                </p>
                {/* Score bar */}
                <div className="w-48 h-2 bg-surface-container-low rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-1000"
                    style={{ width: `${lastResponse.iwts_score}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SHAP explanation */}
          {lastResponse.explanation?.top_features?.length > 0 && (
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-indigo-600">psychology</span>
                Score Breakdown (SHAP)
              </h4>
              <div className="space-y-2.5">
                {lastResponse.explanation.top_features.map((f, i) => (
                  <ShapBar key={i} feature={f.feature} impact={f.impact} direction={f.direction} />
                ))}
              </div>
            </div>
          )}

          {/* Eligible schemes */}
          {lastResponse.eligible_schemes?.length > 0 && (
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-indigo-600">verified</span>
                Eligible Schemes ({lastResponse.eligible_schemes.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lastResponse.eligible_schemes.map(s => (
                  <SchemeCard key={s.schemeId} scheme={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
