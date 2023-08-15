'use client'
import Link from 'next/link'
import { useEffect, useState, Fragment } from 'react'
import { toast } from 'react-toastify'
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    getStatus,
    getStatusTextClasses,
    getTrades,
    Trade,
    cancelTrade,
    confirmTrade,
    endTrade,
} from '@/app/_utils/api/trades'
import { useAuth } from '../_utils/api/auth'
import { useRouter } from 'next/navigation'
import { classNames } from '../_utils/styles/styles'

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

    const cancelTradeMutation = useMutation({
        mutationFn: ({ tradeId }: { tradeId: number }) => cancelTrade(tradeId),
        onSuccess: async (data) => {
            if (data.success) {
                toast.success('Trade cancelled')
                queryClient.invalidateQueries({ queryKey: ['trades'] })
            } else {
                toast.warning(data?.message)
            }
        },
        onError: () => {
            toast.warning('Something is wrong')
        },
    })

    const confirmTradeMutation = useMutation({
        mutationFn: ({ tradeId }: { tradeId: number }) => confirmTrade(tradeId),
        onSuccess: async (data) => {
            if (data.success) {
                toast.success('Trade confirmed')
                queryClient.invalidateQueries({ queryKey: ['trades'] })
            } else {
                toast.warning(data?.message)
            }
        },
        onError: () => {
            toast.warning('Something is wrong')
        },
    })

    const endTradeMutation = useMutation({
        mutationFn: ({ tradeId }: { tradeId: number }) => endTrade(tradeId),
        onSuccess: async (data) => {
            if (data.success) {
                toast.success('Trade fulfilled')
                queryClient.invalidateQueries({ queryKey: ['trades'] })
            } else {
                toast.warning(data?.message)
            }
        },
        onError: () => {
            toast.warning('Something is wrong')
        },
    })

    const ActionButtons = ({
        trade,
        isSeller,
    }: {
        trade: Trade
        isSeller: boolean
    }) => {
        const status = getStatus(trade)
        if (status === 'fulfilled') {
            return null
        }
        return (
            <>
                <span
                    onClick={() => {
                        cancelTradeMutation.mutate({
                            tradeId: trade.id,
                        })
                    }}
                    className="text-xs font-medium text-red-800 hover:text-red-600 cursor-pointer"
                >
                    Cancel
                </span>
                {status === 'requested' && isSeller && (
                    <span
                        onClick={() => {
                            confirmTradeMutation.mutate({
                                tradeId: trade.id,
                            })
                        }}
                        className="text-xs font-medium text-blue-800 hover:text-blue-600 cursor-pointer"
                    >
                        Confirm
                    </span>
                )}
                {status === 'confirmed' && !isSeller && (
                    <span
                        onClick={() => {
                            endTradeMutation.mutate({
                                tradeId: trade.id,
                            })
                        }}
                        className="text-xs font-medium text-blue-800 hover:text-blue-600 cursor-pointer"
                    >
                        Fulfill
                    </span>
                )}
            </>
        )
    }

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
                <div className="flow-root">
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
                                                                <span
                                                                    className={classNames(
                                                                        'inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset',
                                                                        getStatusTextClasses(
                                                                            trade
                                                                        )
                                                                    )}
                                                                >
                                                                    {getStatus(
                                                                        trade
                                                                    )}
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
                                                            <td className="flex flex-col px-3 py-8 align-center justify-center h-full w-full">
                                                                <ActionButtons
                                                                    trade={
                                                                        trade
                                                                    }
                                                                    isSeller={
                                                                        idx ===
                                                                        1
                                                                    }
                                                                />
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
        )
    }
}
