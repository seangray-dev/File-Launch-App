import { useEffect, useState } from 'react';
import { auth } from './services/firebase';
import { SideBar } from './components/SideBar';
import { Header } from './components/Header';
import SignInPage from './components/SignIn';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('auth.currentUser', auth.currentUser); // Log the current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('User:', user);
      setUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <SignInPage />;
  }

  return (
    <main className='min-h-screen grid grid-cols-[200px_1fr]'>
      <SideBar />
      <section>
        <Header />
      </section>
    </main>
  );
}

export default App;
