import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AudioPlayer from './components/Layout/AudioPlayer';
import Header from './components/Layout/Header';
import SideBar from './components/Layout/SideBar';
import NoBaseFolderAlert from './components/NoBaseFolderAlert';
import EmailTemplates from './components/Pages/EmailTemplates';
import FormatFiles from './components/Pages/FormatFiles';
import RecentFiles from './components/Pages/RecentFiles';
import Recipients from './components/Pages/Recipients';
import Settings from './components/Pages/Settings';
import Stats from './components/Pages/Stats';
import UserProfile from './components/Pages/UserProfile';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { setBaseFolder } from './redux/features/recentFiles-slice';
import { ReduxProvider } from './redux/provider';
import { logout } from './services/auth';
import { appConfigStore } from './utils/appConfigStore';
import { checkBaseFolderExistence } from './utils/baseFolderCheck';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ReduxProvider>
          <WrappedApp />
        </ReduxProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function WrappedApp() {
  const dispatch = useDispatch();

  const [currentView, setCurrentView] = useState(() => {
    const savedStartupView = window.localStorage.getItem('startupView');
    return savedStartupView ? savedStartupView : 'Recent Files';
  });

  const [isDialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    const loadInitialBaseFolder = async () => {
      const result = await appConfigStore.get('baseFolder');
      if (typeof result === 'string') {
        dispatch(setBaseFolder(result));
      }
    };

    loadInitialBaseFolder();
  }, [dispatch]);

  useEffect(() => {
    const perfromCheck = async () => {
      const status = await checkBaseFolderExistence();
      if (status === 'does not exist') {
        setDialogVisible(true);
      }
    };

    perfromCheck();
  }, [currentView]);

  let componentInView;
  switch (currentView) {
    case 'Recent Files':
      componentInView = <RecentFiles setCurrentView={setCurrentView} />;
      break;
    case 'Recipients':
      componentInView = <Recipients />;
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
    case 'Stats':
      componentInView = <Stats />;
      break;
  }

  return (
    <main className='min-h-screen grid grid-cols-[200px_1fr] grid-rows-[auto_1fr_auto]'>
      <div data-tauri-drag-region className='faux-header'></div>

      <>
        <section>
          <SideBar setCurrentView={setCurrentView} />
        </section>
        <section className='flex flex-col h-full'>
          <Header logout={logout} setCurrentView={setCurrentView} />
          <div className='flex-grow grid overflow-y-auto'>
            {isDialogVisible ? (
              <NoBaseFolderAlert
                isOpen={isDialogVisible}
                onClose={() => setDialogVisible(false)}
              />
            ) : (
              <>{componentInView}</>
            )}
          </div>
          <div className='bottom-0 sticky z-50'>
            <AudioPlayer />
          </div>
        </section>
      </>
    </main>
  );
}

export default App;
