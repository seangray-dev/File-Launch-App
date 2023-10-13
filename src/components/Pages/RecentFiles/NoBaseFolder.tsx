const NoBaseFolder = () => {
	return (
		<div className='flex flex-col justify-center items-center h-32 text-red-500'>
			<p>Please set a base folder to proceed.</p>
			<p>
				Go to Settings {'>'} Base Folder {'>'} Change Folder
			</p>
		</div>
	);
};

export default NoBaseFolder;
