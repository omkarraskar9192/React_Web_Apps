import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createHabit, toggleHabit, deleteHabit } from '../store/habitsSlice'
import {
  setListening,
  setSpeaking,
  setVoiceTranscript,
  setLastVoiceResponse,
} from '../store/uiSlice'

export function useVoiceAssistant() {
  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits.habits)
  const isListening = useSelector((state) => state.ui.isListening)
  const isSpeaking = useSelector((state) => state.ui.isSpeaking)
  const voiceTranscript = useSelector((state) => state.ui.voiceTranscript)
  const lastVoiceResponse = useSelector((state) => state.ui.lastVoiceResponse)

  const [supported] = useState(
    () => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  )
  const recognitionRef = useRef(null)

  // Speak helper
  const speak = useCallback(
    (text) => {
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel() // Stop any previous speech

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.05

      // Pick clean voice if available
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find((v) => v.lang.startsWith('en') && v.name.includes('Natural')) || voices[0]
      if (preferredVoice) utterance.voice = preferredVoice

      dispatch(setSpeaking(true))
      dispatch(setLastVoiceResponse(text))

      utterance.onend = () => {
        dispatch(setSpeaking(false))
      }
      utterance.onerror = () => {
        dispatch(setSpeaking(false))
      }

      window.speechSynthesis.speak(utterance)
    },
    [dispatch]
  )

  // Command parser
  const processCommand = useCallback(
    (rawTranscript) => {
      const text = rawTranscript.trim().toLowerCase()

      // 1. "Add habit [name]" or "Create habit [name]"
      if (text.startsWith('add habit') || text.startsWith('create habit') || text.startsWith('new habit')) {
        const habitName = rawTranscript
          .replace(/^(add habit|create habit|new habit)\s*/i, '')
          .replace(/[.!?,]+$/g, '')
          .trim()

        if (habitName.length > 0) {
          dispatch(
            createHabit({
              name: habitName.charAt(0).toUpperCase() + habitName.slice(1),
              detail: 'Added via Voice Assistant',
              color: 'mint',
              category: 'wellness',
            })
          )
          speak(`I have added "${habitName}" to your daily habits!`)
          return
        }
      }

      // 2. "Complete [name]" or "Check off [name]" or "Done with [name]" or "Finish [name]"
      if (
        text.startsWith('complete') ||
        text.startsWith('check off') ||
        text.startsWith('check') ||
        text.startsWith('done with') ||
        text.startsWith('finish') ||
        text.startsWith('mark')
      ) {
        const query = text
          .replace(/^(complete|check off|check|done with|finish|mark as done|mark)\s*/i, '')
          .replace(/(as done|done)$/i, '')
          .replace(/[.!?,]+$/g, '')
          .trim()

        const target = habits.find((h) => h.name.toLowerCase().includes(query))
        if (target) {
          if (!target.done) {
            dispatch(toggleHabit(target.id))
            speak(`Awesome job! I marked "${target.name}" as completed!`)
          } else {
            speak(`"${target.name}" is already marked completed for today!`)
          }
          return
        } else {
          speak(`I couldn't find a habit matching "${query}". Could you try saying the full name?`)
          return
        }
      }

      // 3. "Delete habit [name]" or "Remove habit [name]"
      if (text.startsWith('delete habit') || text.startsWith('remove habit') || text.startsWith('delete')) {
        const query = text
          .replace(/^(delete habit|remove habit|delete|remove)\s*/i, '')
          .replace(/[.!?,]+$/g, '')
          .trim()

        const target = habits.find((h) => h.name.toLowerCase().includes(query))
        if (target) {
          dispatch(deleteHabit(target.id))
          speak(`I've deleted the habit "${target.name}".`)
          return
        }
      }

      // 4. "What are my habits?" or "List my habits" or "Status"
      if (
        text.includes('what are my habits') ||
        text.includes('list habits') ||
        text.includes('my habits') ||
        text.includes('how am i doing') ||
        text.includes('status')
      ) {
        const completed = habits.filter((h) => h.done)
        const pending = habits.filter((h) => !h.done)

        if (habits.length === 0) {
          speak('You have no habits scheduled yet. Say "Add habit" to create your first one!')
          return
        }

        if (pending.length === 0) {
          speak(`You are completely finished for today! All ${completed.length} habits are checked off!`)
          return
        }

        const pendingNames = pending.map((h) => h.name).join(', ')
        speak(
          `You have completed ${completed.length} of ${habits.length} habits. Still pending: ${pendingNames}.`
        )
        return
      }

      // 5. Help command
      if (text.includes('help') || text.includes('what can you do')) {
        speak('You can say: Add habit drink water, Complete morning sun, What are my habits, or Delete habit.')
        return
      }

      // Unrecognized
      speak(`I heard: "${rawTranscript}". You can say "Add habit [name]" or "Complete [name]".`)
    },
    [habits, dispatch, speak]
  )

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        dispatch(setListening(true))
      }

      recognition.onresult = (event) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        dispatch(setVoiceTranscript(transcript))

        if (event.results[current].isFinal) {
          processCommand(transcript)
        }
      }

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error)
        dispatch(setListening(false))
      }

      recognition.onend = () => {
        dispatch(setListening(false))
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // ignore
        }
      }
    }
  }, [dispatch, processCommand])

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        dispatch(setVoiceTranscript('Listening...'))
        recognitionRef.current.start()
      } catch (err) {
        console.warn('Recognition already started or error:', err)
      }
    }
  }, [dispatch])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // ignore
      }
    }
  }, [])

  return {
    supported,
    isListening,
    isSpeaking,
    voiceTranscript,
    lastVoiceResponse,
    startListening,
    stopListening,
    speak,
    processCommand,
  }
}
