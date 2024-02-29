import { create } from 'zustand';

interface AuthStore {
    userId: string | null;
    name: string | null;
    isLoading: boolean;
    isError: boolean;
    login: (userId: string, name: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    userId: null,
    name: null,
    isLoading: false,
    isError: false,
  
    login: (userId, name) => {
        console.log('login');
        set(() => ({ userId, name }));
    },
  
    logout: () => {
        set(() => ({
            userId: null,
            name: null,
        }));
    },
}));

export default useAuthStore;
