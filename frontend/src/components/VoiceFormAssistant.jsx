/**
 * VoiceFormAssistant.jsx
 * ──────────────────────
 * A controlled-form voice + text assistant that:
 *  • Asks one question at a time in the selected language
 *  • Accepts voice (Web Speech API) or typed input
 *  • AUTO-DETECTS language from user input and switches UI + voice
 *  • Validates every answer via the backend before accepting
 *  • Directly fills the parent form (via setFormData / setField props)
 *  • Highlights the currently active form field
 *  • Reads assistant messages aloud (SpeechSynthesis)
 *  • Gracefully degrades when Speech APIs are unavailable
 *
 * Props:
 *   mode          "registration" | "login"
 *   formData      object — the parent's form state
 *   setFormData   (updater) — sets individual fields on the parent form
 *   activeField   string  — the field currently being filled (read by parent to apply highlight CSS)
 *   onFieldChange (fieldName: string) => void — called when assistant advances to next field
 *   onComplete    () => void — called when all voice fields are done
 *   onDismiss     () => void — called when user closes the assistant
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

const API_URL = 'http://localhost:8000/api';

// ── Constants ──────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'EN',    full: 'English', srLang: 'en-IN' },
  { code: 'hi', label: 'HI',   full: 'हिंदी',   srLang: 'hi-IN' },
  { code: 'mr', label: 'MR',   full: 'मराठी',   srLang: 'mr-IN' },
];

// Field order (password is always manual — excluded from voice flow)
const REG_FIELDS  = ['name', 'email', 'phone', 'aadhaarMasked', 'state', 'district', 'workType'];
const LOGIN_FIELDS = ['email'];

// Questions per field per language
const QUESTIONS = {
  en: {
    name:          'What is your full name?',
    email:         'What is your email address?',
    phone:         'What is your 10-digit mobile number?',
    aadhaarMasked: 'Please tell me your 12-digit Aadhaar number.',
    state:         'Which Indian state do you live in?',
    district:      'What is your district name?',
    workType:      'What type of work do you do? (vendor, driver, construction worker, delivery, or other)',
  },
  hi: {
    name:          'आपका पूरा नाम क्या है?',
    email:         'आपका ईमेल पता क्या है?',
    phone:         'आपका 10 अंकों का मोबाइल नंबर क्या है?',
    aadhaarMasked: 'कृपया अपना 12 अंकों का आधार नंबर बताएं।',
    state:         'आप भारत के किस राज्य में रहते हैं?',
    district:      'आपका जिला कौन सा है?',
    workType:      'आप क्या काम करते हैं? (विक्रेता, ड्राइवर, निर्माण मजदूर, डिलीवरी, या अन्य)',
  },
  mr: {
    name:          'तुमचे पूर्ण नाव काय आहे?',
    email:         'तुमचा ईमेल पत्ता काय आहे?',
    phone:         'तुमचा 10 अंकी मोबाइल नंबर काय आहे?',
    aadhaarMasked: 'कृपया तुमचा 12 अंकी आधार नंबर सांगा.',
    state:         'तुम्ही भारतातील कोणत्या राज्यात राहता?',
    district:      'तुमचा जिल्हा कोणता आहे?',
    workType:      'तुम्ही कोणते काम करता? (विक्रेता, चालक, बांधकाम कामगार, डिलीव्हरी, किंवा इतर)',
  },
};

// Greetings / onboarding
const GREETINGS = {
  registration: {
    en: "Hi! I'll help you register step by step. Let's start.",
    hi: 'नमस्ते! मैं आपको चरण-दर-चरण पंजीकरण में मदद करूंगा।',
    mr: 'नमस्कार! मी तुम्हाला टप्प्याटप्प्याने नोंदणी करण्यात मदत करेन.',
  },
  login: {
    en: "Welcome back! Please tell me your email address.",
    hi: 'स्वागत है! कृपया अपना ईमेल पता बताएं।',
    mr: 'स्वागत आहे! कृपया तुमचा ईमेल पत्ता सांगा.',
  },
};

// Password prompt (always manual)
const PWD_PROMPT = {
  en: "All done! For security, please type your password in the form below. Voice is disabled for passwords.",
  hi: 'बढ़िया! सुरक्षा के लिए कृपया नीचे फ़ॉर्म में पासवर्ड टाइप करें।',
  mr: 'छान! सुरक्षिततेसाठी कृपया खाली फॉर्ममध्ये पासवर्ड टाइप करा.',
};

// Field labels for progress display
const FIELD_LABELS = {
  en: { name: 'Full Name', email: 'Email', phone: 'Phone', aadhaarMasked: 'Aadhaar', state: 'State', district: 'District', workType: 'Work Type' },
  hi: { name: 'पूरा नाम', email: 'ईमेल', phone: 'फ़ोन', aadhaarMasked: 'आधार', state: 'राज्य', district: 'जिला', workType: 'काम' },
  mr: { name: 'पूर्ण नाव', email: 'ईमेल', phone: 'फोन', aadhaarMasked: 'आधार', state: 'राज्य', district: 'जिल्हा', workType: 'काम' },
};

// ── Language detection ─────────────────────────────────────────────────────
// Character-range based; no external API needed.
function detectLanguage(text) {
  if (!text || text.trim().length < 2) return null;   // not enough signal

  const devanagari = (text.match(/[\u0900-\u097F]/g) || []).length;
  const latin      = (text.match(/[a-zA-Z]/g)        || []).length;
  const total      = text.replace(/\s/g, '').length;

  if (total === 0) return null;

  // If >30% of chars are Devanagari → Hindi or Marathi
  if (devanagari / total > 0.3) {
    // Marathi-specific common words / endings
    const marathiPattern = /आहे|आहेत|आणि|करा|सांगा|नाव|माझे|माझा|तुमचे|तुमचा|नाही|जिल्हा|राज्य/;
    return marathiPattern.test(text) ? 'mr' : 'hi';
  }

  // If >70% Latin → English
  if (latin / total > 0.7) return 'en';

  return null;  // low confidence → keep current
}

// ── Web Speech API helpers ─────────────────────────────────────────────────
function speechSupported() {
  return typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

function speak(text, langCode, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utter  = new SpeechSynthesisUtterance(text);
  utter.lang   = LANGUAGES.find(l => l.code === langCode)?.srLang ?? 'en-IN';
  utter.rate   = 0.92;
  utter.pitch  = 1.0;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

// ── API call ───────────────────────────────────────────────────────────────
async function validateStep(mode, field, input, language) {
  const endpoint = mode === 'registration' ? 'register-step' : 'login-step';
  const res = await fetch(`${API_URL}/voice/${endpoint}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ field, input, language, mode }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Validation failed');
  }
  return res.json();
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function VoiceFormAssistant({
  mode = 'registration',
  formData,
  setFormData,
  onFieldChange,
  onComplete,
  onDismiss,
}) {
  const FIELD_ORDER = mode === 'registration' ? REG_FIELDS : LOGIN_FIELDS;

  const [lang, setLang]               = useState('en');
  const [fieldIdx, setFieldIdx]       = useState(0);
  const [transcript, setTranscript]   = useState('');
  const [inputText, setInputText]     = useState('');
  const [listening, setListening]     = useState(false);
  const [processing, setProcessing]   = useState(false);
  const [assistantMsg, setAssistantMsg] = useState('');
  const [msgType, setMsgType]         = useState('info');   // 'info' | 'success' | 'error'
  const [done, setDone]               = useState(false);
  const [filledFields, setFilledFields] = useState([]);

  const recognitionRef = useRef(null);
  const inputRef       = useRef(null);
  const hasMounted     = useRef(false);

  const currentField = FIELD_ORDER[fieldIdx] ?? null;

  // ── Greeting on mount ────────────────────────────────────────────
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    const greeting = GREETINGS[mode]?.[lang] ?? GREETINGS[mode]?.en ?? '';
    const firstQ   = currentField ? (QUESTIONS[lang]?.[currentField] ?? '') : '';
    const full     = greeting + (firstQ ? ' ' + firstQ : '');

    setAssistantMsg(full);
    setMsgType('info');
    speak(full, lang);
    if (onFieldChange && currentField) onFieldChange(currentField);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Ask question when field advances ────────────────────────────
  const askQuestion = useCallback((fieldName, language, prefix = '') => {
    const q = QUESTIONS[language]?.[fieldName] ?? QUESTIONS['en']?.[fieldName] ?? '';
    const msg = prefix ? prefix + ' ' + q : q;
    setAssistantMsg(msg);
    setMsgType('info');
    speak(msg, language);
    setTranscript('');
    setInputText('');
    if (onFieldChange) onFieldChange(fieldName);
    inputRef.current?.focus();
  }, [onFieldChange]);

  // ── Language switch ──────────────────────────────────────────────
  const switchLang = useCallback((newLang, silent = false) => {
    setLang(newLang);
    if (!silent && currentField) {
      askQuestion(currentField, newLang);
    }
  }, [currentField, askQuestion]);

  // ── Speech recognition ────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!speechSupported()) return;
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang            = LANGUAGES.find(l => l.code === lang)?.srLang ?? 'en-IN';
    rec.continuous      = false;
    rec.interimResults  = true;
    rec.maxAlternatives = 1;

    rec.onstart  = () => setListening(true);
    rec.onend    = () => { setListening(false); };
    rec.onerror  = () => setListening(false);

    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(text);
      setInputText(text);

      // Auto-detect language from spoken text
      const detected = detectLanguage(text);
      if (detected && detected !== lang) {
        setLang(detected);
      }
    };

    recognitionRef.current = rec;
    rec.start();
  }, [lang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  // ── Submit / validate ────────────────────────────────────────────
  const handleSubmit = useCallback(async (textOverride) => {
    const raw = (textOverride ?? inputText).trim();
    if (!raw || !currentField || processing) return;

    // Auto-detect language from typed/spoken text
    const detected = detectLanguage(raw);
    const effectiveLang = detected ?? lang;
    if (detected && detected !== lang) setLang(detected);

    setProcessing(true);
    setTranscript('');

    try {
      const result = await validateStep(mode, currentField, raw, effectiveLang);

      if (result.valid) {
        // Fill the form field with normalized value
        setFormData(prev => ({ ...prev, [currentField]: result.normalizedValue }));
        setFilledFields(prev => [...new Set([...prev, currentField])]);
        setMsgType('success');

        const nextField = result.nextField;

        if (!nextField) {
          // All voice fields done
          const doneMsg = result.message || PWD_PROMPT[effectiveLang] || PWD_PROMPT['en'];
          setAssistantMsg(doneMsg);
          setMsgType('success');
          setDone(true);
          speak(doneMsg, effectiveLang, () => { if (onComplete) onComplete(); });
        } else {
          // Advance to next field
          const okMsg = result.message;
          setAssistantMsg(okMsg);
          speak(okMsg, effectiveLang, () => {
            const nextIdx = FIELD_ORDER.indexOf(nextField);
            setFieldIdx(nextIdx);
            askQuestion(nextField, effectiveLang);
          });
        }

        setInputText('');
      } else {
        // Invalid — stay on same field
        const errMsg = result.message;
        setAssistantMsg(errMsg);
        setMsgType('error');
        speak(errMsg, effectiveLang);
        setInputText('');
        inputRef.current?.focus();
      }
    } catch (err) {
      const errMsg = `Connection error: ${err.message}`;
      setAssistantMsg(errMsg);
      setMsgType('error');
    } finally {
      setProcessing(false);
    }
  }, [inputText, currentField, processing, lang, mode, setFormData, FIELD_ORDER, askQuestion, onComplete]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ── After listening ends, auto-submit if transcript exists ───────
  useEffect(() => {
    if (!listening && transcript) {
      handleSubmit(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  // ── Progress ──────────────────────────────────────────────────────
  const totalFields   = FIELD_ORDER.length;
  const filledCount   = filledFields.filter(f => FIELD_ORDER.includes(f)).length;
  const progressPct   = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0;

  // ── Message colours ───────────────────────────────────────────────
  const msgColour = {
    info:    'text-indigo-200',
    success: 'text-emerald-300',
    error:   'text-rose-300',
  }[msgType];

  const msgBg = {
    info:    'bg-white/5',
    success: 'bg-emerald-950/40 border-emerald-800/30',
    error:   'bg-rose-950/40 border-rose-800/30',
  }[msgType];

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-gradient-to-br from-indigo-950 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-secondary-fixed text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            assistant
          </span>
          <span className="font-headline font-bold text-white text-base leading-none">
            Voice Assistant
          </span>
          <span className="text-[10px] text-indigo-300/60 uppercase tracking-widest ml-1">
            {mode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="flex gap-1 bg-white/5 rounded-full p-1">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => switchLang(l.code)}
                title={l.full}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === l.code
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-indigo-300/70 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-full flex items-center justify-center text-indigo-300/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      {mode === 'registration' && (
        <div className="px-6 pt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] uppercase tracking-widest text-indigo-300/60 font-bold">
              {filledCount} / {totalFields} fields
            </span>
            <span className="text-[10px] text-indigo-300/60">{progressPct}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary-fixed to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Field pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {FIELD_ORDER.map(f => {
              const isFilled  = filledFields.includes(f);
              const isCurrent = f === currentField && !done;
              const labels    = FIELD_LABELS[lang] ?? FIELD_LABELS['en'];
              return (
                <span
                  key={f}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all ${
                    isFilled
                      ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/40'
                      : isCurrent
                        ? 'bg-secondary-container text-on-secondary-container animate-pulse'
                        : 'bg-white/5 text-indigo-400/60 border border-white/5'
                  }`}
                >
                  {isFilled && '✓ '}{labels[f] ?? f}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Assistant message ── */}
      <div className={`mx-6 mt-5 p-4 rounded-xl border ${msgBg} flex items-start gap-3`}>
        <span
          className={`material-symbols-outlined text-xl shrink-0 mt-0.5 ${
            msgType === 'error' ? 'text-rose-400' : msgType === 'success' ? 'text-emerald-400' : 'text-secondary-fixed'
          }`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {msgType === 'error' ? 'error' : msgType === 'success' ? 'check_circle' : 'assistant'}
        </span>
        <p className={`text-sm leading-relaxed font-medium ${msgColour}`}>{assistantMsg}</p>
      </div>

      {/* ── Transcript live display ── */}
      {listening && (
        <div className="mx-6 mt-3 px-4 py-2.5 bg-rose-950/30 border border-rose-800/30 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0" />
          <p className="text-sm text-rose-200 italic">
            {transcript || (lang === 'hi' ? 'सुन रहा है...' : lang === 'mr' ? 'ऐकत आहे...' : 'Listening...')}
          </p>
        </div>
      )}

      {/* ── Input row ── */}
      {!done && (
        <div className="flex items-center gap-3 px-6 py-5">
          {/* Mic button */}
          <button
            type="button"
            disabled={processing || !speechSupported()}
            onClick={listening ? stopListening : startListening}
            title={
              !speechSupported()
                ? 'Voice not supported in this browser'
                : listening ? 'Stop' : 'Speak'
            }
            className={`relative shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              listening
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110'
                : !speechSupported()
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-indigo-700 text-white hover:bg-indigo-600 active:scale-95 shadow-md'
            }`}
          >
            {listening && <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-40" />}
            <span
              className="material-symbols-outlined text-[22px] relative"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {listening ? 'mic_off' : 'mic'}
            </span>
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type={currentField === 'phone' || currentField === 'aadhaarMasked' ? 'tel' : 'text'}
            value={inputText}
            onChange={e => {
              setInputText(e.target.value);
              // Detect language from typed text (only after a few chars)
              if (e.target.value.length > 3) {
                const d = detectLanguage(e.target.value);
                if (d && d !== lang) setLang(d);
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={processing}
            placeholder={
              lang === 'hi' ? 'यहाँ टाइप करें या माइक दबाएं…' :
              lang === 'mr' ? 'इथे टाइप करा किंवा मायक दाबा…' :
                              'Type here or press the mic…'
            }
            className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder:text-indigo-300/40 text-sm focus:outline-none focus:border-secondary-fixed/60 focus:bg-white/15 transition-all"
          />

          {/* Submit */}
          <button
            type="button"
            disabled={!inputText.trim() || processing}
            onClick={() => handleSubmit()}
            className="shrink-0 w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
          >
            {processing
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <span className="material-symbols-outlined text-[22px]">send</span>
            }
          </button>
        </div>
      )}

      {/* ── Done state ── */}
      {done && (
        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center gap-3 p-4 bg-emerald-900/30 border border-emerald-700/30 rounded-xl">
            <span className="material-symbols-outlined text-emerald-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              task_alt
            </span>
            <div>
              <p className="font-bold text-emerald-300 text-sm">
                {lang === 'hi' ? 'आवाज़ इनपुट पूर्ण!' : lang === 'mr' ? 'व्हॉइस इनपुट पूर्ण!' : 'Voice input complete!'}
              </p>
              <p className="text-xs text-indigo-300/60 mt-0.5">
                {lang === 'hi' ? 'नीचे पासवर्ड टाइप करें और जारी रखें।' :
                 lang === 'mr' ? 'खाली पासवर्ड टाइप करा आणि पुढे जा.' :
                                 'Type your password below and continue.'}
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="mt-3 w-full py-3 bg-white/5 hover:bg-white/10 text-indigo-300 rounded-xl text-sm font-bold transition-all"
          >
            {lang === 'hi' ? 'फॉर्म पर वापस जाएं' : lang === 'mr' ? 'फॉर्मवर परत जा' : 'Back to form'}
          </button>
        </div>
      )}

      {/* ── Tip ── */}
      {!done && (
        <p className="text-center text-[10px] text-indigo-400/40 pb-4">
          {lang === 'hi'
            ? 'भाषा स्वतः पहचानी जाएगी • पासवर्ड हमेशा मैन्युअल है'
            : lang === 'mr'
              ? 'भाषा स्वयं ओळखली जाईल • पासवर्ड नेहमी मॅन्युअल आहे'
              : 'Language auto-detected • Password is always entered manually'}
        </p>
      )}
    </div>
  );
}
