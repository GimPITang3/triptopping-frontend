import { UserContext } from '@/contexts';
import { User } from '@/types';
import { FC, PropsWithChildren, useState } from 'react';

const UserContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>({
    userId: '',
    nickname: '',
  });
  const contextValue = { user, setUser };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
