import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AudioPlayer from './components/Layout/AudioPlayer';
import Header from './components/Layout/Header';
import SideBar from './components/Layout/SideBar';
import EmailTemplates from './components/Pages/EmailTemplates';
import FormatFiles from './components/Pages/FormatFiles';
import RecentFiles from './components/Pages/RecentFiles';
import Recipients from './components/Pages/Recipients';
import Settings from './components/Pages/Settings';
import Stats from './components/Pages/Stats';
import UserProfile from './components/Pages/UserProfile';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { checkBaseFolderStatus } from './redux/features/baseFolderStatus-slice';
import { setCurrentView } from './redux/features/navigation-slice';
import { setBaseFolder } from './redux/features/recentFiles-slice';
import { ReduxProvider } from './redux/provider';
import { AppDispatch, RootState } from './redux/store';
import { signOutAuth } from './services/supabase/auth';
import { appConfigStore } from './utils/appConfigStore';

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
  // Redux
  const dispatch: AppDispatch = useDispatch();
  const currentView = useSelector(
    (state: RootState) => state.navigation.currentView
  );

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
    dispatch(checkBaseFolderStatus());
  }, [currentView, dispatch]);

  const components = {
    'Recent Files': <RecentFiles setCurrentView={setCurrentView} />,
    Recipients: <Recipients />,
    'Format Files': <FormatFiles />,
    'Email Templates': <EmailTemplates />,
    'User Profile': <UserProfile />,
    Settings: <Settings />,
    Stats: <Stats />,
  } as const;

  type ViewKey = keyof typeof components;
  const currentViewKey = currentView as ViewKey;

  return (
    <main className='min-h-screen grid grid-cols-[200px_1fr] grid-rows-[auto_1fr_auto]'>
      <div data-tauri-drag-region className='faux-header'></div>
      <>
        <section>
          <SideBar />
        </section>
        <section className='flex flex-col h-full'>
          <Header signOut={signOutAuth} />
          <div className='flex-grow grid overflow-y-auto'>
            {components[currentViewKey]}
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
