import { createContext } from "react";

export const UserContext = createContext({user:null, isAdmin:null, userAvatar:null, isLoading:false})