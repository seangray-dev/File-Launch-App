import { auth } from '../../services/firebase';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

const GoogleSignInBtn = () => {
  const signInWithGoogle = () => {
    console.log('Attempting to sign in with Google');
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <button
      className='w-2/3 mx-auto bg-white rounded-full text-deepBlue font-bold flex gap-4 py-3 justify-center items-center border border-white hover:bg-transparent hover:text-white transition-all duration-300'
      onClick={signInWithGoogle}>
      <img className='w-6' src='./images/google-logo.png' alt='' />
      <span>Sign In with Google</span>
    </button>
  );
};

export default GoogleSignInBtn;
