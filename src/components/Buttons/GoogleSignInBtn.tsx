import { signInWithRedirect } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const GoogleSignInBtn = () => {
  const signInWithGoogle = () => {
    console.log('Attempting to sign in with Google');
    const provider = new GoogleAuthProvider();

    signInWithRedirect(auth, provider)
      .then((result) => {
        console.log('Sign in successful', result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log('Sign in failed', error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
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
