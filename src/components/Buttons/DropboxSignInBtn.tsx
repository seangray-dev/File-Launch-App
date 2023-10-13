import { Button } from '@/components/ui/button';

const DropboxSignInBtn = () => {
	return (
		<Button
			className='w-2/3 mx-auto bg-white rounded-md text-black flex gap-4 py-6 justify-center items-center border hover:bg-secondary hover:dark:text-white transition-all duration-300'
			onClick={() => {}}>
			<img src='./images/dropbox-logo.png' alt='' />
			<span>Sign In with Dropbox</span>
		</Button>
	);
};

export default DropboxSignInBtn;
