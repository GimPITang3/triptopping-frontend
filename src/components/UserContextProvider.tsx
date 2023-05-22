import { UserContext } from '@/contexts';
import { User } from '@/types';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

const UserContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>({
    userId: '',
    nickname: '',
    email: '',
    introduce: '',
  });

  useEffect(() => {
    const rawUser =
      typeof localStorage !== 'undefined' && localStorage.getItem('user');
    const user = rawUser && JSON.parse(rawUser);

    user && setUser(user);
  }, []);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const contextValue = { user, setUser };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
