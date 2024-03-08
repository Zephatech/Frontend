// MyListings.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
<<<<<<< HEAD
import { useQuery } from '@tanstack/react-query'
import useAuthStore from '@/app/stores/authStore'
import WithAuth from '@/app/components/withAuth'
import { deleteProduct } from '@/app/_utils/api/products'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid'

const getMyListings = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/products/myListings`,
    {
      credentials: 'include',
    }
  )
  const data = await response.json()
  return data
}

type Listing = {
  id: number
  name: string
  category: string
  image: string
}

const MyListings = () => {
  const router = useRouter()
  const [sellListings, setSellListings] = useState<Listing[]>([])
  const { isValidUser } = useAuthStore()
  const {
    data: sellListingsData,
    isLoading,
    error,
  } = useQuery(['sellListings'], () => (isValidUser ? getMyListings() : null))

  const handleDelete = async (id: number) => {
    const response = await deleteProduct(id)
    console.log(response)
    if (response.success) {
      setSellListings((prevListings) =>
        prevListings.filter((listing) => listing.id !== id)
      )
      toast.success('Listing deleted successfully')
    } else {
      toast.error('Error deleting listing')
    }
  }

  useEffect(() => {
    if (!isLoading && Array.isArray(sellListingsData)) {
      setSellListings(sellListingsData)
    }
  }, [isLoading])

  if (isLoading) {
    return <div>Loading...</div>
  } else if (error) {
    return <div>Error loading listings</div>
  } else {
    return (
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-3">
                    Product Image
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="relative py-3 px-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {sellListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-100">
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm sm:pl-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={
                          listing.image === ''
                            ? 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg'
                            : `/images/${listing.image}`
                        }
                        alt=""
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                      <div className="font-medium text-indigo-600 underline hover:text-indigo-800">
                        <Link href={`/products/${listing.id}`}>
                          {listing.name}
                        </Link>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                      {listing.category}
                    </td>
                    <td className="flex justify-end items-center space-x-2 px-3 py-3">
                      <button
                        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        onClick={() =>
                          router.push(`/update-product?id=${listing.id}`)
                        }
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => handleDelete(listing.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default WithAuth(MyListings)
=======
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/app/_utils/api/auth'
import { useRouter } from 'next/navigation'

import { BACKEND_URL } from '../../constants/backend'

const getMyListings = async () => {
    const response = await fetch(`${BACKEND_URL}/products/myListings`, {
        credentials: 'include',
    })
    const data = await response.json()
    return data
}

type Listing = {
    id: number
    name: string
    category: string
    image: string
}

const MyListings = () => {
    const [sellListings, setSellListings] = useState<Listing[]>([])
    const {
        data: sellListingsData,
        isLoading,
        error,
    } = useQuery(['sellListings'], () => getMyListings())
    const { data, isLoading: authLoading, isFetching: authFetching } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Check if the user is not authenticated, redirect to the login page
        console.log(
            authLoading,
            authFetching,
            !data?.userId,
            isLoading,
            sellListingsData
        )
        if (!data?.userId) {
            router.replace('/login?unauthenticated')
        } else if (!isLoading) {
            console.log(sellListingsData)
            setSellListings(sellListingsData)
        }
    }, [authLoading, authFetching, data, isLoading, router, sellListingsData])

    useEffect(() => {
        // You can perform additional actions here if needed
    }, [sellListings])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error loading listings</div>
    }

    const handleDelete = (listingId: number) => {
        // Implement your delete logic here
        console.log(`Deleting listing with ID: ${listingId}`)
    }

    return (
        <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full">
                        <thead className="bg-white">
                            <tr>
                                <th className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                    Image
                                </th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                                    Title
                                </th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                                    Category
                                </th>
                                <th className="relative py-2 px-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellListings.map((listing) => (
                                <tr
                                    key={listing.id}
                                    className="border-t border-gray-200"
                                >
                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm sm:pl-0">
                                        <Image
                                            className="h-11 w-11 rounded-full"
                                            src={
                                                listing.image === ''
                                                    ? 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg'
                                                    : `/images/${listing.image}`
                                            }
                                            alt=""
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">
                                        <div className="font-medium text-blue-700 underline">
                                            <Link
                                                href={`/products/${listing.id}`}
                                            >
                                                {listing.name}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">
                                        {listing.category}
                                    </td>
                                    <td className="flex flex-col px-3 py-2 align-center justify-center h-full w-full">
                                        {/* You can replace the buttons below with your actual actions */}
                                        <button
                                            className="px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                                            onClick={() =>
                                                handleDelete(listing.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                        <Link
                                            href={`/update-product?id=${listing.id}`}
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default MyListings
>>>>>>> b004859 (Initialize for deployment)
