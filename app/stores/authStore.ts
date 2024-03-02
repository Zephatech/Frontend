import { create } from 'zustand';

interface AuthStore {
    userId: string | null;
    name: string | null;
    isLoading: boolean;
    isValidUser: boolean;
    login: (userId: string, name: string) => void;
    logout: () => void;
    failToLogin: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    userId: null,
    name: null,
    isLoading: true,
    isError: false,
    isValidUser: false,
  
    login: (userId, name) => {
        set(() => ({ userId, name, isLoading: false, isValidUser: true }));
    },

    failToLogin: () => {
        set(() => ({ userId: null, name: null, isLoading: false, isValidUser: false}));
    },
  
    logout: () => {
        set(() => ({
            userId: null,
            name: null,
        }));
    },
}));

export default useAuthStore;
