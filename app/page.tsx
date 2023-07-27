'use client'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUserId } from './_utils/auth'

export default function Page() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['auth'],
        queryFn: getCurrentUserId,
    })

    const userId = data?.userId
    if (isLoading) {
        return <h1>Loading...</h1>
    }
    if (userId) {
        return <h1> Logged In as user {userId}</h1>
    }
    return <h1>Not logged in</h1>
}
