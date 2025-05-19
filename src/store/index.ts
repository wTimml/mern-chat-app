import { create } from 'zustand';
import { createAuthSlice } from './slices/auth-slice.ts';
import type { AuthSlice } from './slices/auth-slice.ts';

type AppStore = AuthSlice

export const useAppStore = create<AppStore>()((...a) => ({
    ...createAuthSlice(...a),
}));