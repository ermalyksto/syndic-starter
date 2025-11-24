import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '@/types';

// export type UserRole = 'syndic' | 'co-owner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionId: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  sessionId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionId = null;
    },
  },
});

export const { setUser, setSessionId, logout } = authSlice.actions;
export default authSlice.reducer;