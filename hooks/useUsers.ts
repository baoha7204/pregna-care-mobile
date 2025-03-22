import { useContext } from 'react';
import { UsersContext } from '@/contexts/users.context';

const useUsers = () => {
  const value = useContext(UsersContext);
  if (!value) {
    throw new Error('useUsers must be wrapped in a <UsersProvider />');
  }

  return value;
};

export default useUsers;
