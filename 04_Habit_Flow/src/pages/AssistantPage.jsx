import { useVoiceAssistant } from '../hooks/useVoiceAssistant'
import { Card } from '@heroui/react'
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Command,
  CheckCircle2,
  PlusCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react'

export default function AssistantPage() {
  const {
    supported,
    isListening,
    isSpeaking,
    voiceTranscript,
    lastVoiceResponse,
    startListening,
    stopListening,
    speak,
    processCommand,
  } = useVoiceAssistant()

  const quickCommands = [
    { label: 'Add habit Drink Herbal Tea', icon: '🍵', cmd: 'Add habit Drink Herbal Tea' },
    { label: 'Complete Morning Sun', icon: '☀️', cmd: 'Complete Morning sun' },
    { label: 'What are my habits today?', icon: '📋', cmd: 'What are my habits today?' },
    { label: 'Check off Deep Reading', icon: '📖', cmd: 'Complete Deep reading' },
    { label: 'Add habit 10 min Yoga', icon: '🧘', cmd: 'Add habit 10 min Yoga' },
  ]

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in">
      {/* Header */}
      <header className="space-y-1.5 pt-1">
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#0284c7] dark:text-[#38bdf8]">
          <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>AI Voice Assistant</span>
        </div>
        <div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Speak to Flow
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Hands-free habit tracking. Speak commands to add habits, check off tasks, and hear your daily progress.
          </p>
        </div>
      </header>

      {/* Voice Assistant Studio Card */}
      <Card className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#071924] border border-cyan-100 dark:border-cyan-900/40 shadow-md text-center flex flex-col items-center justify-center">
        {/* Background glow when listening */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            isListening
              ? 'opacity-100 bg-radial from-[#00e5ff]/20 to-transparent'
              : isSpeaking
              ? 'opacity-100 bg-radial from-[#e89048]/15 to-transparent'
              : 'opacity-0'
          }`}
        />

        {/* Big Interactive Microphone Button */}
        <div className="relative mb-6">
          {/* Animated ring when active */}
          {isListening && (
            <div className="absolute -inset-4 rounded-full bg-[#00e5ff]/25 animate-ping" />
          )}

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 ${
              isListening
                ? 'bg-gradient-to-tr from-red-500 to-rose-600 shadow-red-500/30'
                : isSpeaking
                ? 'bg-gradient-to-tr from-[#e89048] to-[#f5b35c] shadow-[#e89048]/30'
                : 'bg-gradient-to-tr from-[#0284c7] via-[#06b6d4] to-[#00e5ff] shadow-[#00e5ff]/30 hover:shadow-[#00e5ff]/50'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="w-10 h-10 animate-bounce" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>

        {/* Status indicator */}
        <div className="space-y-1 mb-5">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {isListening
              ? '🎙️ Listening to you... (Speak now)'
              : isSpeaking
              ? '🔊 HabitFlow Assistant is speaking...'
              : 'Tap microphone and say a command'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {!supported
              ? '⚠️ Web Speech API not detected in this browser. Tap quick actions below!'
              : 'Supported: Add habit, Complete habit, What are my habits, Delete habit'}
          </p>
        </div>

        {/* Sound wave bars when listening or speaking */}
        {(isListening || isSpeaking) && (
          <div className="flex items-center gap-1.5 h-8 my-2">
            {[0.2, 0.4, 0.7, 1, 0.6, 0.3, 0.8, 0.5, 0.2].map((delay, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-[#0284c7] to-[#00e5ff] voice-wave-bar"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        )}

        {/* Live Transcript and Assistant Reply Display */}
        <div className="w-full max-w-lg space-y-3 pt-4 border-t border-cyan-100 dark:border-cyan-900/30">
          {/* User speech */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#051119] p-3.5 border border-cyan-100/80 dark:border-cyan-900/40 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-400 block mb-1">
              You Said
            </span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic">
              {voiceTranscript ? `"${voiceTranscript}"` : 'No voice command spoken yet'}
            </p>
          </div>

          {/* Assistant speech output */}
          {lastVoiceResponse && (
            <div className="rounded-2xl bg-cyan-50/80 dark:bg-[#082836] p-3.5 border border-cyan-200 dark:border-cyan-800/60 text-left flex items-start justify-between gap-3 animate-fade-in">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700 dark:text-[#00e5ff] block mb-1">
                  Assistant Response
                </span>
                <p className="text-sm font-semibold text-cyan-950 dark:text-cyan-100">
                  {lastVoiceResponse}
                </p>
              </div>
              <button
                type="button"
                onClick={() => speak(lastVoiceResponse)}
                className="p-1.5 rounded-xl bg-white dark:bg-[#0c4a6e] text-cyan-600 dark:text-[#00e5ff] hover:scale-105 shadow-2xs"
                title="Replay audio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Test Voice Commands (Tap to execute) */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Command className="w-4 h-4 text-cyan-600 dark:text-[#00e5ff]" />
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Quick Voice Simulations (Tap to run)
          </h3>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {quickCommands.map((item) => (
            <button
              type="button"
              key={item.cmd}
              onClick={() => processCommand(item.cmd)}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#071924] border border-cyan-100 dark:border-cyan-900/40 hover:border-cyan-400 dark:hover:border-[#00e5ff] text-left transition-all hover:scale-102 shadow-2xs group"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-[#00e5ff] transition-colors">
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Say: "{item.cmd}"
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Assistant Recipe Guide */}
      <Card className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#071924] border border-cyan-100 dark:border-cyan-900/40 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-500 dark:text-[#00e5ff]" />
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Supported Voice Commands
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#051119] border border-cyan-100/70 dark:border-cyan-900/40 space-y-1">
            <span className="font-bold text-cyan-700 dark:text-[#00e5ff] flex items-center gap-1">
              <PlusCircle className="w-3.5 h-3.5" /> Add Habits
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              "Add habit Drink 2 liters of water" or "Create habit 30 min Walk"
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#051119] border border-cyan-100/70 dark:border-cyan-900/40 space-y-1">
            <span className="font-bold text-cyan-700 dark:text-[#00e5ff] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete Habits
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              "Complete Morning sun" or "Check off Workout" or "Done with Meditation"
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#051119] border border-cyan-100/70 dark:border-cyan-900/40 space-y-1">
            <span className="font-bold text-cyan-700 dark:text-[#00e5ff] flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" /> Progress Check
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              "What are my habits today?" or "List my habits" (assistant speaks aloud)
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
