import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CompassPage from './pages/CompassPage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AddInterestModal from './components/interests/AddInterestModal';

import './App.css'
function AppContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Navbar */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Main Content Router View */}
      <main className="flex-1 pb-12">
        <Routes>
          <Route path="/" element={<CompassPage onOpenAddModal={() => setIsAddModalOpen(true)} />} />
          <Route path="/dashboard" element={<DashboardPage onOpenAddModal={() => setIsAddModalOpen(true)} />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Add Interest Modal with React Hook Form */}
      <AddInterestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
