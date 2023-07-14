'use client'
import { CheckIcon } from '@heroicons/react/20/solid'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useGlobalContext } from '@/app/_utils/contexts/global-context'
import { useEffect, useState } from 'react'

export default function Page({ params }: { params: { id: number } }) {
    const [product, setProduct] = useState()
    const [productLoading, setProductLoading] = useState(true)
    useEffect(() => {
        const getProduct = async (id: Number) => {
            const res = await fetch(`http://localhost:3001/products/${id}`, {
                cache: 'no-cache',
            }).then((res) => {
                return res.json()
            })
            return res
        }
        getProduct(params.id).then((res) => {
            setProduct(res)
            setProductLoading(false)
        })
    }, [])
    const { user, loading } = useGlobalContext()
    console.log(user)
    if (loading || productLoading) {
        return <></>
    }
   
    )
}
