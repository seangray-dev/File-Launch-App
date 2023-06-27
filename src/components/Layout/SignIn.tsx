import GoogleSignInBtn from '../Buttons/GoogleSignInBtn';
import DropboxSignInBtn from '../Buttons/DropboxSignInBtn';

const SignInPage = () => {
  return (
    <main className='grid place-items-center h-screen w-full'>
      <div className='flex flex-col gap-10'>
        <img src={'/images/logo-no-background-light.png'} width={500} />
        <img
          className='hidden'
          src={'/images/logo-no-background.png'}
          width={500}
        />
        <div className='flex flex-col gap-4'>
          <GoogleSignInBtn />
          <DropboxSignInBtn />
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
