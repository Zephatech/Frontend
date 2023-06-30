import { useEffect, useState } from 'react'

export const useAuth = ({ redirect = true }: { redirect: boolean }) => {
    // Function to check user authentication status
    const [isAuth, setIsAuth] = useState(false)
    const [userId, setUserId] = useState<>()
    const checkAuth = async () => {
        const res = await fetch('http://localhost:3001/auth/getCurrentUserId', {
            cache: 'no-cache',
            credentials: 'include',
        }).then((res) => {
            if (res.status == 401) {
                if (redirect) {
                    window.location.href = '/login?unauthenticated'
                }
            } else {
                setIsAuth(true)
                return res.json()
            }
        })
        setUserId(res?.userId)
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return { isAuth, userId }
}
