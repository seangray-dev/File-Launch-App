import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  console.log(user);

  if (!user) {
    return <p>User not authenticated</p>;
  }

  function formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  return (
    <div className='text-darkBlue dark:text-white p-4'>
      <h1 className='font-bold text-2xl text-darkBlue dark:text-white mb-6'>
        Profile
      </h1>
      <div className='flex flex-col gap-2'>
        <Avatar className='mx-auto'>
          <AvatarImage src={user.user_metadata.avatar_url} />
          <AvatarFallback>FL</AvatarFallback>
        </Avatar>
        <div className='flex justify-between'>
          <p>Name:</p>
          <span>{user.user_metadata.full_name}</span>
        </div>
        <div className='flex justify-between'>
          <p>Email:</p>
          <span>{user.email}</span>
        </div>
        <div className='flex justify-between'>
          <p>Email Verified:</p>
          <span>{user.user_metadata.email_verified ? 'Yes' : 'No'}</span>
        </div>
        <div className='flex justify-between'>
          <p>Account Created:</p>
          <span>{formatDate(user.created_at)}</span>
        </div>
        <div className='flex justify-between'>
          <p>Last Sign-in Time:</p>
          <span>{formatDate(user.last_sign_in_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
