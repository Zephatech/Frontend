import { attachStatus } from '.'

export const getProducts = async (query: String | null) => {
    if(query === null)  {
        const res = await fetch(`http://localhost:3001/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return attachStatus(res)
    } else {
        const res = await fetch(`http://localhost:3001/products?q=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return attachStatus(res)
    }
    
}

export const deleteProduct = async (id: number) => {
    const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    return attachStatus(res)
}

export type Product = {
    id: number
    ownerId: number
    name: string
    price: number
    description: string
    category: string
    image: string
    locked: boolean
}
