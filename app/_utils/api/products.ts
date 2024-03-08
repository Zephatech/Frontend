import { attachStatus } from '.'

import { BACKEND_URL } from '../../constants/backend'

export const getProducts = async (query: String | null) => {
<<<<<<< HEAD
  if (query === null) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/products`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return attachStatus(res)
  } else {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/products?q=${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return attachStatus(res)
  }
}

export const deleteProduct = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/products/${id}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  )
  return attachStatus(res)
}

export type Product = {
  options: null | { course: string }
  id: number
  ownerId: number
  name: string
  price: number
  description: string
  category: string
  image: string
  locked: boolean
=======
    if (query === null) {
        const res = await fetch(`${BACKEND_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return attachStatus(res)
    } else {
        const res = await fetch(`${BACKEND_URL}/products?q=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return attachStatus(res)
    }
}

export const deleteProduct = async (id: number) => {
    const res = await fetch(`${BACKEND_URL}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    return attachStatus(res)
}

export type Product = {
    options: null | { course: string }
    id: number
    ownerId: number
    name: string
    price: number
    description: string
    category: string
    image: string
    locked: boolean
>>>>>>> b004859 (Initialize for deployment)
}
