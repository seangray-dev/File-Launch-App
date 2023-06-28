import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>User not authenticated</p>;
  }

  return (
    <div className='text-darkBlue dark:text-white'>
      <h1 className='font-bold text-2xl text-darkBlue dark:text-white mb-6'>
        Profile
      </h1>
      <div className='flex flex-col gap-2'>
        <img
          className='max-w-[100px] mx-auto'
          src={user.photoURL}
          alt='User Photo'
        />
        <div className='flex justify-between'>
          <p>Name:</p>
          <span>{user.displayName}</span>
        </div>
        <div className='flex justify-between'>
          <p>Email:</p>
          <span>{user.email}</span>
        </div>
        <div className='flex justify-between'>
          <p>Email Verified:</p>
          <span>{user.emailVerified ? 'Yes' : 'No'}</span>
        </div>
        <div className='flex justify-between'>
          <p>Account Created:</p>
          <span>{user.metadata.creationTime}</span>
        </div>
        <div className='flex justify-between'>
          <p>Last Sign-in Time:</p>
          <span>{user.metadata.lastSignInTime}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
