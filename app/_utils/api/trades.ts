import { attachStatus } from '.'
import { Product } from './products'

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
export const getTrades = async () => {
    const res = await fetch('http://localhost:3001/trade/getAllTrades', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    return attachStatus(res)
}

export type Trade = {
    id: number
    product: Product
    buyer: {
        id: number
    }
    seller: {
        id: number
    }
}
export type AllTrades = {
    buy: Trade[]
    sell: Trade[]
}
