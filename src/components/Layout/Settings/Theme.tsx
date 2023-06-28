import { RadioGroup } from '@headlessui/react';
import { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const Theme = () => {
  const { theme, handleThemeChange } = useContext(ThemeContext);
  const themes = ['light', 'dark', 'system'];

  return (
    <section className='flex items-center justify-between'>
      <div className='text-darkBlue dark:text-white'>
        <p>Theme:</p>
      </div>
      <div className='flex items-center gap-4'>
        <RadioGroup value={theme} onChange={handleThemeChange}>
          <RadioGroup.Label className='sr-only'>Theme</RadioGroup.Label>
          <div className='flex items-center gap-4'>
            {themes.map((themeOption) => (
              <RadioGroup.Option key={themeOption} value={themeOption}>
                {({ active, checked }) => (
                  <label
                    className={`cursor-pointer select-none relative py-2 hover:text-darkBlue dark:hover:text-white transition-all duration-300 ${
                      checked ? 'text-cyan' : 'text-gray'
                    } `}>
                    <input
                      type='radio'
                      name='theme'
                      className='hidden'
                      checked={checked}
                      onChange={() => handleThemeChange(themeOption)}
                    />
                    <span>
                      {themeOption.charAt(0).toUpperCase() +
                        themeOption.slice(1)}
                    </span>
                  </label>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </section>
  );
};

export default Theme;
