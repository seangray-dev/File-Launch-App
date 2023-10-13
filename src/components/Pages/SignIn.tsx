import DropboxSignInBtn from '../Buttons/DropboxSignInBtn';
import GoogleSignInBtn from '../Buttons/GoogleSignInBtn';

const SignInPage = () => {
	return (
		<main className='grid place-items-center h-screen w-full'>
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
					<GoogleSignInBtn />
					<DropboxSignInBtn />
				</div>
			</div>
		</main>
	);
};

export default SignInPage;
