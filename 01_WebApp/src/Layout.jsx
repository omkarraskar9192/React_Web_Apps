import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import JoinClubModal from './components/Modals/JoinClubModal';

export default function Layout() {
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]') || document.getElementById('theme-color-meta');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      document.body.style.backgroundColor = '#030712';
      document.body.style.color = '#f8fafc';
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#030712');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0f172a';
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
    }
  }, [isDarkMode]);

  const getThemeClass = () => {
    if (isDarkMode) {
      return 'dark-theme bg-[#030712] text-slate-100';
    } else {
      return 'light-theme bg-white text-slate-900';
    }
  };

  return (
    <div className={`theme-container flex-1 w-full min-h-screen min-h-[100dvh] flex flex-col transition-colors duration-500 ${getThemeClass()}`}>
      <Header />
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <JoinClubModal />
    </div>
  );
}