import { useEffect, useState } from 'react';
import { login, logout } from './services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ThemeProvider from './context/ThemeProvider';
import SideBar from './components/Layout/SideBar';
import Header from './components/Layout/Header';
import SignInPage from './components/Layout/SignIn';
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  let componentInView;
  switch (currentView) {
    case 'RecentFiles':
      componentInView = <RecentFiles />;
      break;
    case 'Clients':
      componentInView = <Clients />;
      break;
    case 'FormatFiles':
      componentInView = <FormatFiles />;
      break;
    case 'EmailTemplates':
      componentInView = <EmailTemplates />;
      break;
    case 'UserProfile':
      componentInView = <UserProfile />;
      break;
    case 'Settings':
      componentInView = <Settings />;
      break;
  }

  if (!user) {
    return <SignInPage login={login} />;
  }

  return (
    <main className='min-h-screen grid grid-cols-[200px_1fr]'>
      <>
        <SideBar setCurrentView={setCurrentView} />
        <section>
          <Header logout={logout} setCurrentView={setCurrentView} />
          <div className='grid text-darkBlue pt-4 px-4'>{componentInView}</div>
        </section>
      </>
    </main>
  );
}

export default App;
