import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import AuthProvider from './context/AuthContext';
import { logout } from './services/auth';
import SideBar from './components/Layout/SideBar';
import Header from './components/Layout/Header';
import Clients from './components/Layout/Clients';
import EmailTemplates from './components/Layout/EmailTemplates';
import FormatFiles from './components/Layout/FormatFiles';
import RecentFiles from './components/Layout/RecentFiles';
import Settings from './components/Layout/Settings';
import UserProfile from './components/Layout/UserProfile';

function App() {
  const [currentView, setCurrentView] = useState(() => {
    const savedStartupView = window.localStorage.getItem('startupView');
    return savedStartupView ? savedStartupView : 'default-view';
  });

  let componentInView;
  switch (currentView) {
    case 'Recent Files':
      componentInView = <RecentFiles />;
      break;
    case 'Clients':
      componentInView = <Clients />;
      break;
    case 'Format Files':
      componentInView = <FormatFiles />;
      break;
    case 'Email Templates':
      componentInView = <EmailTemplates />;
      break;
    case 'User Profile':
      componentInView = <UserProfile />;
      break;
    case 'Settings':
      componentInView = <Settings />;
      break;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <main className='min-h-screen grid grid-cols-[200px_1fr]'>
          <>
            <SideBar setCurrentView={setCurrentView} />
            <section>
              <Header logout={logout} setCurrentView={setCurrentView} />
              <div className='grid text-darkBlue pt-4 px-10'>
                {componentInView}
              </div>
            </section>
          </>
        </main>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
