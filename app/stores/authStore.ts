import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AuthStore {
  userId: string | null
  name: string | null
  isLoading: boolean
  isValidUser: boolean
  login: (userId: string, name: string) => void
  logout: () => void
  failToLogin: () => void
  setName: (name: string) => void
}

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        userId: null,
        name: null,
        isLoading: true,
        isError: false,
        isValidUser: false,

        login: (userId, name) => {
          set(() => ({
            userId,
            name,
            isLoading: false,
            isValidUser: true,
          }))
        },
        setName: (newName) => {
          set(() => ({
            name: newName,
          }))
        },
        failToLogin: () => {
          set(() => ({
            userId: null,
            name: null,
            isLoading: false,
            isValidUser: false,
          }))
        },

        logout: () => {
          set(() => ({
            userId: null,
            name: null,
          }))
        },
      }),
      { name: 'auth-store' }
    )
  )
)

export default useAuthStore
