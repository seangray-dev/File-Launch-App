import { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';

export default function Startup() {
  const startupViews = [
    'Recent Files',
    'Clients',
    'Format Files',
    'Email Templates',
    'User Profile',
    'Settings',
  ];

  const [startupView, setStartupView] = useState(() => {
    const savedStartupView = window.localStorage.getItem('startupView');
    return savedStartupView
      ? savedStartupView.replace(/_/g, ' ')
      : startupViews[0];
  });

  useEffect(() => {
    window.localStorage.setItem('startupView', startupView.replace(/ /g, ''));
  }, [startupView]);

  return (
    <section>
      <p className='mb-2 text-darkBlue dark:text-white'>Startup Settings:</p>
      <div className='flex items-center justify-between'>
        <p className='text-gray'>Set the default view on application launch</p>
        <div className='w-48'>
          <Listbox value={startupView} onChange={setStartupView}>
            <div className='relative'>
              <Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left bg-transparent dark:text-white border border-gray rounded-md focus:outline-none sm:text-sm'>
                <span className='block truncate'>{startupView}</span>
              </Listbox.Button>
              <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-sm bg-transparent border dark:text-white border-gray rounded-md max-h-60 focus:outline-none'>
                {startupViews.map((view, idx) => (
                  <Listbox.Option key={idx} value={view}>
                    {({ selected, active }) => (
                      <div
                        className={`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                          selected ? 'bg-cyan text-darkBlue' : 'text-gray'
                        } ${active ? 'bg-gray text-white' : ''}`}>
                        {view}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>
    </section>
  );
}
