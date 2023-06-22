import { getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from './services/firebase';
import { SideBar } from './components/Layout/SideBar';
import { Header } from './components/Layout/Header';
import SignInPage from './components/Layout/SignIn';
import Clients from './components/Layout/Clients';
import EmailTemplates from './components/Layout/EmailTemplates';
import FormatFiles from './components/Layout/FormatFiles';
import RecentFiles from './components/Layout/RecentFiles';
import Settings from './components/Layout/Settings';
import UserProfile from './components/Layout/UserProfile';

function App() {
  const [currentView, setCurrentView] = useState('');

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
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Set the onAuthStateChanged listener
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     console.log('User:', user);
  //     setUser(user);
  //     setLoading(false);
  //   });

  //   // Get the redirect result
  //   getRedirectResult(auth)
  //     .then((result) => {
  //       console.log('getRedirectResult called');
  //       if (result) {
  //         console.log('getRedirectResult result:', result);
  //         const credential = GoogleAuthProvider.credentialFromResult(result);
  //         const token = credential.accessToken;
  //         // The signed-in user info.
  //         const user = result.user;
  //         console.log('User signed in: ', user);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Sign in failed', error);
  //     });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (!user) {
  //   return <SignInPage />;
  // }

  return (
    <main className='min-h-screen grid grid-cols-[200px_1fr]'>
      <SideBar setCurrentView={setCurrentView} />
      <section>
        <Header setCurrentView={setCurrentView} />
        <div className='grid place-items-center text-white'>
          {componentInView}
        </div>
      </section>
    </main>
  );
}

export default App;
