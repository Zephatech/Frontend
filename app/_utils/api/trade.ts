import { attachStatus } from '.'

export const createTrade = async (productId: number) => {
    console.log('HERE with', productId)
    const res = await fetch('http://localhost:3001/trade', {
        method: 'POST',
        body: JSON.stringify({ productId }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    return attachStatus(res)
}
