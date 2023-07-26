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

export const login = (email: string, password: string) => {
    return fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    }).then((res) => res.json())
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
    }).then((res) => res.json())
}
