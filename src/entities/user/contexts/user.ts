import { createContext } from "react";
import UserModel from "../model";

interface IUserContextProps {
  user: UserModel | null;
  setUser: React.Dispatch<UserModel | null>
}

const UserContext = createContext({} as IUserContextProps);

export default UserContext;
