import DropboxSignInBtn from '@/services/supabase/DropboxSignInBtn';
import GoogleSignInBtn from '@/services/supabase/GoogleSignInBtn';
import { invoke, shell } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { useEffect, useState } from 'react';
import callbackTemplate from './callback.template';
import { supabase } from './supabaseClient';

function getLocalHostUrl(port: number) {
  return `http://localhost:${port}`;
}

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [port, setPort] = useState<number | null>(null);

  useEffect(() => {
    console.log('Refresh', port);
    if (port) return;

    const unlisten = listen('oauth://url', (data) => {
      setPort(null);
      if (!data.payload) return;

      const url = new URL(data.payload as string);
      const code = new URLSearchParams(url.search).get('code');

      console.log('here', data.payload, code);
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
          if (error) {
            alert(error.message);
            console.error(error);
            return;
          }
          location.reload();
        });
      }
    });

    let _port: number | null = null;
    invoke('plugin:oauth|start', {
      config: {
        response: callbackTemplate,
      },
    }).then(async (port) => {
      setPort(port as number);
      _port = port as number;
    });

    () => {
      unlisten?.then((u) => u());
      invoke('plugin:oauth|cancel', { port: _port });
    };
  }, [port]);

  const onProviderLogin = (provider: 'google') => async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      options: {
        skipBrowserRedirect: true,
        scopes: provider === 'google' ? 'profile email' : '',
        redirectTo: getLocalHostUrl(port!),
      },
      provider: provider,
    });

    if (data.url) {
      shell.open(data.url);
    } else {
      alert(error?.message);
    }
  };

  return (
    <main className='grid place-items-center h-screen w-full'>
      <div data-tauri-drag-region className='faux-header'></div>
      <div className='flex flex-col gap-10'>
        <img
          className='dark:hidden'
          src={'/images/logo-no-background-light.png'}
          width={500}
        />
        <img
          className='dark:block hidden'
          src={'/images/logo-no-background.png'}
          width={500}
        />
        <div className='flex flex-col gap-4'>
          <GoogleSignInBtn onLogin={onProviderLogin} />
          <DropboxSignInBtn onLogin={onProviderLogin} />
        </div>
      </div>
    </main>
  );
}

export const signOutAuth = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert(error.message);
    console.error(error);
    return;
  }
};
