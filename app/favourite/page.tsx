import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
const getFavouriteData = async () => {
    const res = await fetch('http://localhost:3001/auth/getCurrentUserId', {
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            Cookie: cookies()
                .getAll()
                .map(({ name, value }) => `${name}=${value}`)
                .join('; '),
        },
    }).then((res) => {
        if (res.status == 401) {
            redirect('/login?unauthenticated')
        }
        return res.json()
    })
    return res.message
}

export default async function Page() {
    const data = await getFavouriteData()
    return <div>Favourite: {data}</div>
}
