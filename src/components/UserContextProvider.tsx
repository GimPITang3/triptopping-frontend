import { UserContext } from '@/contexts';
import { User } from '@/types';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

const UserContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    console.log(rawUser);
    if(rawUser == "undefined")
    {
      const user = undefined;
    }
    else
    {
      const user = rawUser ? (JSON.parse(rawUser) as User) : undefined;
    }

    user && setUser(user);

    const accessToken = localStorage.getItem('accessToken');
    setAccessToken(accessToken || undefined);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [user, accessToken]);

  const contextValue = { user, setUser, accessToken, setAccessToken };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
