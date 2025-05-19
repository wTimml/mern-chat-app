
interface UserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
  profileSetup?: boolean;
  // Add other user properties
}

export interface AuthSlice {
  userInfo: UserInfo | undefined;
  setUserInfo: (userInfo: UserInfo | undefined) => void;
}

export const createAuthSlice = (set: any, get: any, api: any): AuthSlice => ({
  userInfo: undefined,
  setUserInfo: (userInfo: UserInfo | undefined) => set({ userInfo }),
});