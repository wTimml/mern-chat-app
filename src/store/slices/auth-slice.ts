import type { UserData } from '../../types/userData';


export interface AuthSlice {
  userInfo: UserData | undefined;
  setUserInfo: (userInfo: UserData | undefined) => void;
}

export const createAuthSlice = (set: any, get: any, api: any): AuthSlice => ({
  userInfo: undefined,
  setUserInfo: (userInfo: UserData | undefined) => set({ userInfo }),
});