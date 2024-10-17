import { ReactNode, useState } from 'react';
import UserContext from '../contexts/user';
import UserModel from '../model';

function UserProvider(props: {children: ReactNode}) {

  const [ state, setState ] = useState<UserModel | null>(null);

  return (
    <UserContext.Provider value={{user: state, setUser: setState}}>
      { props.children }
    </UserContext.Provider>
  );
}

export default UserProvider;
