import { login } from '../../services/auth';

const GoogleSignInBtn = () => {
  const handleClick = () => {
    login().catch((error) => {
      console.error('Login failed:', error);
    });
  };

  return (
    <button
      onClick={handleClick}
      className='w-2/3 mx-auto bg-white rounded-md text-deepBlue font-bold flex gap-4 py-3 justify-center items-center border border-deepBlue hover:border-gray hover:text-gray transition-all duration-300'>
      <img className='w-6' src='./images/google-logo.png' alt='' />
      <span>Sign In with Google</span>
    </button>
  );
};

export default GoogleSignInBtn;
