import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch, useStore } from 'react-redux'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import BottomNavBar from './components/BottomNavBar'
import AuthModal from './components/AuthModal'
import TodayPage from './pages/TodayPage'
import CalendarPage from './pages/CalendarPage'
import AssistantPage from './pages/AssistantPage'
import ProfilePage from './pages/ProfilePage'
import {
  setHabitsFromDB,
  setHistoryFromDB,
  checkDateRollover,
  calculateOverallStreak,
  getTodayKey,
} from './store/habitsSlice'
import { setStreakCount, setUserFromDB } from './store/userSlice'
import { setDbStatus, setAuthModalOpen } from './store/uiSlice'
import { checkServerHealth, fetchHabitsAPI, fetchHistoryAPI, getMeAPI } from './services/api'
import { initSyncEngine } from './services/syncEngine'

export default function App() {
  const dispatch = useDispatch()
  const store = useStore()
  const isDark = useSelector((state) => state.ui.isDark)
  const mobileNavOpen = useSelector((state) => state.ui.mobileNavOpen)
  const authModalOpen = useSelector((state) => state.ui.authModalOpen)
  const habits = useSelector((state) => state.habits.habits)
  const history = useSelector((state) => state.habits.history)
  const user = useSelector((state) => state.user)

  // Initialize theme class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Initialize Offline-First Sync Engine (auto flushes queue when internet connects)
  useEffect(() => {
    const cleanup = initSyncEngine(() => store.getState())
    return cleanup
  }, [store])

  // Date rollover listener & broken streak recalculation
  useEffect(() => {
    // Check immediately
    dispatch(checkDateRollover())

    // Check whenever tab becomes visible or gains focus
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        dispatch(checkDateRollover())
      }
    }
    const handleFocus = () => {
      dispatch(checkDateRollover())
    }

    // Interval to check at midnight even if left open
    const interval = setInterval(() => {
      dispatch(checkDateRollover())
    }, 60000)

    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [dispatch])

  // Continually sync overall user streak with real history
  useEffect(() => {
    const todayKey = getTodayKey()
    const activeStreak = calculateOverallStreak(history, habits, todayKey)
    dispatch(setStreakCount(activeStreak))
  }, [history, habits, dispatch])

  // Sync with MongoDB backend & verify user profile if available
  useEffect(() => {
    const syncDatabase = async () => {
      const health = await checkServerHealth()
      if (health.online && health.mongo) {
        dispatch(setDbStatus('connected'))

        // Only sync cloud database if user is logged into their account
        if (user.token) {
          const profile = await getMeAPI()
          if (profile && profile.user) {
            dispatch(setUserFromDB(profile.user))
          }

          const dbHabits = await fetchHabitsAPI()
          if (dbHabits && dbHabits.length > 0) {
            dispatch(setHabitsFromDB(dbHabits))
          }
          const dbHistory = await fetchHistoryAPI()
          if (dbHistory && dbHistory.length > 0) {
            const historyMap = {}
            dbHistory.forEach((h) => {
              historyMap[h.date] = h
            })
            dispatch(setHistoryFromDB(historyMap))
          }
        }
      } else {
        dispatch(setDbStatus('local'))
      }
    }
    syncDatabase()
  }, [dispatch, user.token])

  return (
    <div className="flex flex-1 min-h-screen bg-[#f0f8fb] dark:bg-[#050e14] text-[#0a2330] dark:text-[#dcf2f9] transition-colors duration-300">
      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        isOpen={mobileNavOpen}
        onClose={() => dispatch({ type: 'ui/setMobileNavOpen', payload: false })}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar />

        {/* Page Routing */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6 md:py-8 overflow-y-auto pb-24 md:pb-12">
          <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<TodayPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </main>

        {/* Bottom Nav Bar on Mobile */}
        <BottomNavBar className="md:hidden" />
      </div>

      {/* Cloud Authentication & Backup Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => dispatch(setAuthModalOpen(false))}
      />
    </div>
  )
}