import { create } from 'zustand';
import { createAuthSlice } from './slices/auth-slice.ts';
import type { AuthSlice } from './slices/auth-slice.ts';
import { createChatSlice, type ChatSlice } from './slices/chat-slice.ts';

type AppStore = AuthSlice & ChatSlice

export const useAppStore = create<AppStore>()((set, get) => ({
    ...createAuthSlice(set),
    ...createChatSlice(set, get)
}));