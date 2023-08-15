'use client'
import Link from 'next/link'
import { useEffect, useState, Fragment } from 'react'
import { toast } from 'react-toastify'
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTrades, Trade } from '@/app/_utils/api/trades'
import { useAuth } from '../_utils/api/auth'
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter()
    const [allTrades, setAllTrades] = useState<Trade[][]>()
    const queryClient = useQueryClient()
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['trades'],
        queryFn: getTrades,
    })
    const {
        data: authData,
        isLoading: authIsLoading,
        isFetching: authIsFetching,
    } = useAuth()
    const userId = authData?.userId

    useEffect(() => {
        if (!authIsLoading && !authIsFetching && !userId) {
            router.replace('/login?unauthenticated')
        }
        if (!isLoading) {
            setAllTrades([data.buy ?? [], data.sell ?? []])
        }
    }, [isLoading, authIsLoading, isFetching])

    if (isLoading || authIsLoading || !userId) {
        return <h1>Loading...</h1>
    }
    if (!allTrades && !isFetching) {
        return <h1>No Products yet</h1>
    }
    if (allTrades) {
        console.log(allTrades)
        return (
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full">
                                <thead className="bg-white">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                        >
                                            Product
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Trader
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Price
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                                        >
                                            <span className="sr-only">
                                                Edit
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {allTrades.map(
                                        (allTrade, idx) =>
                                            allTrade.length !== 0 && (
                                                <Fragment key={idx}>
                                                    <tr className="border-t border-gray-200">
                                                        <th
                                                            colSpan={5}
                                                            scope="colgroup"
                                                            className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                        >
                                                            {idx === 0
                                                                ? 'Buy'
                                                                : 'Sell'}
                                                        </th>
                                                    </tr>
                                                    {allTrade.map((trade) => (
                                                        <tr
                                                            key={
                                                                trade.product.id
                                                            }
                                                        >
                                                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                                                <div className="flex items-center">
                                                                    <img
                                                                        className="h-11 w-11 rounded-full"
                                                                        src={`/images/${trade.product.image}`}
                                                                        alt=""
                                                                    />
                                                                    <div className="ml-4">
                                                                        <div className="font-medium text-gray-900">
                                                                            <Link
                                                                                href={`/products/${trade.product.id}`}
                                                                                className="text-blue-700 underline"
                                                                            >
                                                                                {
                                                                                    trade
                                                                                        .product
                                                                                        .name
                                                                                }
                                                                            </Link>
                                                                        </div>
                                                                        <div className="text-gray-400">
                                                                            {
                                                                                trade
                                                                                    .product
                                                                                    .category
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                    Active
                                                                </span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                                <div className="text-gray-900">
                                                                    User{' '}
                                                                    {idx === 0
                                                                        ? trade
                                                                              .seller
                                                                              .id
                                                                        : trade
                                                                              .buyer
                                                                              .id}
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                                <div className="text-gray-900">
                                                                    $
                                                                    {
                                                                        trade
                                                                            .product
                                                                            .price
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="flex px-3 py-8 align-center justify-center h-full w-full">
                                                                <ArchiveBoxXMarkIcon className="h-6 w-6 text-red-800 hover:text-red-600 cursor-pointer" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </Fragment>
                                            )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            // <div className="px-4 sm:px-6 lg:px-8 ">
            //     <div className="flow-root">
            //         <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            //             <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            //                 <table className="min-w-full divide-y divide-gray-300">
            //                     <thead>
            //                         <tr>
            //                             <th
            //                                 scope="col"
            //                                 className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            //                             >
            //                                 Product
            //                             </th>
            //                             <th
            //                                 scope="col"
            //                                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            //                             >
            //                                 Status
            //                             </th>
            //                             <th
            //                                 scope="col"
            //                                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            //                             >
            //                                 Type
            //                             </th>
            //                             <th
            //                                 scope="col"
            //                                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            //                             >
            //                                 Type
            //                             </th>
            //                             <th
            //                                 scope="col"
            //                                 className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            //                             >
            //                                 Type
            //                             </th>
            //                         </tr>
            //                     </thead>
            //                     <tbody className="divide-y divide-gray-200 bg-white">
            //
            //                     </tbody>
            //                 </table>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        )
    }
}
