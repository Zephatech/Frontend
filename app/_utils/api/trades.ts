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
    confirmed: boolean
    canceledAt: string
    endedAt: string
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

export const getStatus = (trade: Trade) => {
    if (!trade.confirmed) {
        return 'requested'
    }
    if (trade.canceledAt != null) {
        return 'cancelled'
    }
    if (trade.endedAt != null) {
        return 'fulfilled'
    }
    return 'confirmed'
}

export const cancelTrade = async (tradeId: number) => {
    const res = await fetch(`http://localhost:3001/trade/${tradeId}/cancel`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    return attachStatus(res)
}

export const endTrade = async (tradeId: number) => {
    const res = await fetch(`http://localhost:3001/trade/${tradeId}/end`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    return attachStatus(res)
}

export const confirmTrade = async (tradeId: number) => {
    const res = await fetch(`http://localhost:3001/trade/${tradeId}/confirm`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    return attachStatus(res)
}

export const getStatusTextClasses = (trade: Trade) => {
    const status = getStatus(trade)
    if (status === 'requested') {
        return 'bg-blue-50 text-blue-700 ring-blue-600/20'
    }
    if (status === 'cancelled') {
        return 'bg-gray-50 text-gray-700 ring-gray-600/20 opacity-50'
    }
    if (status === 'fulfilled') {
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
    }
    return 'bg-green-50 text-green-700 ring-green-600/20'
}
