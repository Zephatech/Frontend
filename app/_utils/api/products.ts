import { attachStatus } from '.'

import { BACKEND_URL } from '../../constants/backend'

export const getProducts = async (query: String | null) => {
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
}
