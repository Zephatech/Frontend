'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Product, deleteProduct, getProducts } from '../_utils/api/products'
import { useAuth } from '../_utils/api/auth'

export default function Page() {
    const [products, setProducts] = useState<Product[]>()
    const queryClient = useQueryClient()
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })
    const { data: authData, isLoading: authIsLoading } = useAuth()
    const userId = authData?.userId
    const mutation = useMutation({
        mutationFn: ({ id }: { id: number }) => deleteProduct(id),
        onSuccess: (data) => {
            if (data.success) {
                toast.success('Product Deleted')
                queryClient.invalidateQueries({ queryKey: ['products'] })
            } else {
                toast.warning(data?.message)
            }
        },
        onError: () => {
            toast.warning('Something is wrong')
        },
    })

    useEffect(() => {
        if (!isLoading) {
            setProducts(data)
        }
    }, [isLoading, isFetching])

    if (isLoading || authIsLoading) {
        return <h1>Loading...</h1>
    }
    if (!products && !isFetching) {
        return <h1>No Products yet</h1>
    }
    if (products) {
        return (
            <>
                {/* Product List */}
                <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-3 lg:gap-x-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group relative flex flex-col rounded-lg border border-gray-200 bg-white"
                            >
                                <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
                                    <Link href={`/products/${product.id}`}>
                                        <img
                                            src={
                                                product.image === ''
                                                    ? 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg'
                                                    : `/images/${product.image}`
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                                        />
                                    </Link>
                                </div>
                                <div className="flex flex-1 flex-col space-y-2 p-4">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        <span aria-hidden="true" />
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {product.description}
                                    </p>
                                    <div className="flex flex-1 flex-row items-center justify-between ">
                                        <p className="text-base font-medium text-gray-900">
                                            {product.price}
                                        </p>
                                        {userId == product.ownerId && (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        mutation.mutate({
                                                            id: product.id,
                                                        })
                                                    }
                                                    className="bg-transparent mr-2 hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-2 border border-red-500 hover:border-transparent rounded"
                                                >
                                                    remove
                                                </button>
                                                <Link
                                                    href={`/update-product?id=${product.id}`}
                                                >
                                                    <button className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-1 px-2 border border-gray-500 hover:border-transparent rounded">
                                                        modify
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }
}
