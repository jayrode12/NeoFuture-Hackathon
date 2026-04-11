import React, { useState, useEffect } from 'react';

export default function VoiceAssist({ onComplete, context = "login" }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const defaultText = context === "login" 
    ? "State your phone number to sign in..." 
    : "Tell us about your work, location, and name to register...";
    
  const simulatedSpeech = context === "login"
    ? "My phone number is 9988776655. Log me in."
    : "I am a construction worker in Bangalore looking for registration...";

  const handleMicClick = () => {
    if (isListening) return;
    setIsListening(true);
    setTranscript('');
    
    // Simulate speech-to-text
    let i = 0;
    const interval = setInterval(() => {
      setTranscript(prev => prev + simulatedSpeech[i]);
      i++;
      if (i >= simulatedSpeech.length) {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-12">
      <div className="max-w-2xl w-full text-center mb-12">
        <h2 className="font-headline font-bold text-3xl md:text-4xl leading-tight tracking-tight text-on-surface mb-4">
          Speak to fill your details
        </h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          {defaultText}
        </p>
      </div>

      <div className="relative group mb-12">
        {isListening && (
          <>
            <div className="absolute inset-0 bg-secondary-container/20 rounded-full animate-[pulse-ring_2s_cubic-bezier(0.455,0.03,0.515,0.955)_infinite] scale-150"></div>
            <div className="absolute inset-0 bg-secondary-container/10 rounded-full animate-[pulse-ring_2s_cubic-bezier(0.455,0.03,0.515,0.955)_infinite] scale-125 [animation-delay:0.5s]"></div>
          </>
        )}
        <button 
          onClick={handleMicClick}
          className="relative z-10 w-32 h-32 bg-secondary-container text-on-secondary-container rounded-full shadow-[0_20px_40px_-15px_rgba(253,192,2,0.3)] flex items-center justify-center transition-all active:scale-95 hover:scale-105"
        >
          <span className="material-symbols-outlined text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>mic</span>
        </button>
      </div>

      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-outline-variant/10 min-h-[140px]">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-3 w-3 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isListening ? 'bg-error opacity-75' : 'bg-outline opacity-0'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isListening ? 'bg-error' : 'bg-outline'}`}></span>
          </span>
          <span className="font-label text-sm uppercase tracking-widest font-semibold text-on-surface-variant">Live Transcription</span>
        </div>
        <div>
          <p className="text-xl font-medium text-on-surface leading-relaxed">
            {transcript || <span className="opacity-40 italic">Waiting for voice...</span>}
          </p>
          {isListening && transcript.length < simulatedSpeech.length && (
            <span className="inline-block w-1 h-6 bg-indigo-600 animate-pulse ml-1 align-middle"></span>
          )}
        </div>
      </div>

      {(transcript.length === simulatedSpeech.length && isListening) && (
        <div className="mt-12 w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={onComplete}
            className="group flex items-center gap-4 bg-primary-container text-on-primary px-8 py-4 rounded-full text-lg font-bold shadow-[0_10px_20px_rgba(1,7,102,0.2)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_30px_rgba(1,7,102,0.3)] active:scale-95"
          >
            <span>Auto-fill Form</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
