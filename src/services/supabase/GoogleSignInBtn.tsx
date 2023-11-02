import { Button } from '@/components/ui/button';

type Props = {
  onLogin: (provider: 'google') => () => void;
};

const GoogleSignInBtn = ({ onLogin }: Props) => {
  const handleClick = () => {
    onLogin('google')();
  };

  return (
    <Button
      onClick={handleClick}
      className='w-2/3 mx-auto bg-white rounded-md text-black flex gap-4 py-6 justify-center items-center border hover:bg-secondary hover:dark:text-white transition-all duration-300'>
      <img className='w-6' src='./images/google-logo.png' alt='' />
      <span>Sign In with Google</span>
    </Button>
  );
};

export default GoogleSignInBtn;
