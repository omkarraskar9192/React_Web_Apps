import { Routes, Route, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Search from './pages/Search'
import Recommend from './pages/Recommend'
import Profile from './pages/Profile'
import Admin from './pages/Admin/Admin'
import AdminLogin from './pages/Admin/AdminLogin'
import { selectIsAuthenticated } from './store/slices/authSlice'
import { Lock } from 'lucide-react'

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/colleges"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cutoffs"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black text-slate-900">404</h1>
                <p className="mt-2 text-sm text-slate-500">Page not found</p>
                <a
                  href="/"
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Return Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; 2026 CollegeFinder &bull; Cutoffs & Counseling Assistant</span>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Secure Student Platform</span>
            <span>&bull;</span>
            <NavLink
              to={isAuthenticated ? '/admin' : '/admin/login'}
              className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>{isAuthenticated ? 'Admin Panel' : 'Staff / Admin Portal'}</span>
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App