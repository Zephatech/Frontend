import { useQuery } from '@tanstack/react-query'

export const getCurrentUserId = () => {
    return fetch('http://localhost:3001/auth/getCurrentUserId', {
        credentials: 'include',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())
}

export const logout = () => {
    return fetch('http://localhost:3001/auth/logout', {
        credentials: 'include',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())
}

export const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const data = await res.json()
    if (res.status == 200) {
        data.success = true
    } else {
        data.success = false
    }
    return data
}

export const verifyEmail = async (email: string, verificationCode: string) => {
    const res = await fetch('http://localhost:3001/auth/verifyEmail', {
        method: 'POST',
        body: JSON.stringify({ email, verificationCode }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    const data = await res.json()
    if (res.ok) {
        data.success = true
    } else {
        data.success = false
    }
    return data
}

export const register = (
    firstName: string,
    lastName: string,
    email: string,
    password: string
) => {
    return fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
}

export const useAuth = () => {
    return useQuery({
        queryKey: ['auth'],
        queryFn: getCurrentUserId,
    })
}
