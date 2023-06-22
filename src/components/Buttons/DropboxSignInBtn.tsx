const DropboxSignInBtn = () => {
  return (
    <button
      className='w-2/3 mx-auto bg-white rounded-full text-deepBlue font-bold flex gap-4 py-3 justify-center items-center border border-white hover:bg-transparent hover:text-white transition-all duration-300'
      onClick={() => {}}>
      <img src='./images/dropbox-logo.png' alt='' />
      <span>Sign In with Dropbox</span>
    </button>
  );
};

export default DropboxSignInBtn;
