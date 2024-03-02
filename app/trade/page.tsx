'use client'
import { Dialog, Transition } from '@headlessui/react'

import Link from 'next/link'
import { useEffect, useState, Fragment } from 'react'
import { toast } from 'react-toastify'
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
import { classNames } from '../_utils/styles/styles'
import TradeTimeLine from './components/TradeTimeline'
import WithAuth from '@/app/components/withAuth'

function Page() {
    const [allTrades, setAllTrades] = useState<Trade[][]>()
    const [confirmActionModel, setConfirmActionModel] = useState({
        state: false,
        title: '',
        description: '',
        dispatch: () => {},
    })
    const [timelineModal, setTimelineModal] = useState<{
        state: boolean
        trade: Trade | null
    }>({
        state: false,
        trade: null,
    })
    const queryClient = useQueryClient()
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['trades'],
        queryFn: getTrades,
    })

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
        mutationFn: ({ trade, sell }: { trade: Trade; sell: Trade[] }) =>
            confirmTrade(trade, sell),
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
        sell,
    }: {
        trade: Trade
        isSeller: boolean
        sell: Trade[]
    }) => {
        const status = getStatus(trade)
        if (status === 'fulfilled') {
            return null
        }
        return (
            <>
                <span
                    onClick={() => {
                        setConfirmActionModel({
                            state: true,
                            title: 'Cancellation',
                            description:
                                'Are you sure you want to cancel the trade? ' +
                                (status === 'confirmed'
                                    ? 'Cancelling a confirmed trade will lower your rating!'
                                    : ''),
                            dispatch: () => {
                                cancelTradeMutation.mutate({
                                    tradeId: trade.id,
                                })
                            },
                        })
                    }}
                    className="text-xs font-medium text-red-800 hover:text-red-600 cursor-pointer"
                >
                    Cancel
                </span>
                {status === 'requested' && isSeller && (
                    <span
                        onClick={() => {
                            setConfirmActionModel({
                                state: true,
                                title: 'Confirmation',
                                description:
                                    'Confirming the trade will remove the listing from the marketplace, unless canceled later. Note that canceling a confirmed trade will lower your rating. Are you sure you want to proceed?',
                                dispatch: () => {
                                    confirmTradeMutation.mutate({
                                        trade,
                                        sell,
                                    })
                                },
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
                            setConfirmActionModel({
                                state: true,
                                title: 'Fulfillment',
                                description:
                                    'Are you sure you want to mark this trade as fulfilled? Please proceed only when you have received the item.',
                                dispatch: () => {
                                    endTradeMutation.mutate({
                                        tradeId: trade.id,
                                    })
                                },
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

    if (isLoading) {
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
                                                        <tr key={trade.id}>
                                                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                                                <div className="flex items-center">
                                                                    <img
                                                                        className="h-11 w-11 rounded-full"
                                                                        src={
                                                                            trade
                                                                                .product
                                                                                .image ===
                                                                            ''
                                                                                ? 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg'
                                                                                : `/images/${trade.product.image}`
                                                                        }
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
                                                                    onClick={() => {
                                                                        setTimelineModal(
                                                                            {
                                                                                state: true,
                                                                                trade,
                                                                            }
                                                                        )
                                                                    }}
                                                                    className={classNames(
                                                                        'cursor-pointer inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset',
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
                                                                    {idx === 0
                                                                        ? trade
                                                                              .seller
                                                                              .firstName
                                                                        : trade
                                                                              .buyer
                                                                              .firstName}
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
                                                                    sell={
                                                                        allTrades[1]
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
                <Transition.Root show={confirmActionModel.state} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={() => {
                            setConfirmActionModel({
                                state: false,
                                title: '',
                                description: '',
                                dispatch: () => {},
                            })
                        }}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-100"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 overlay" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="border-2 border-black-600 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div className="sm:flex ">
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-base font-semibold leading-6 text-gray-900"
                                                >
                                                    {confirmActionModel.title}
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-500">
                                                        {
                                                            confirmActionModel.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-x-2">
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:mt-0 sm:w-auto"
                                                onClick={() => {
                                                    setConfirmActionModel({
                                                        state: false,
                                                        title: '',
                                                        description: '',
                                                        dispatch: () => {},
                                                    })
                                                }}
                                            >
                                                No
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() => {
                                                    confirmActionModel.dispatch()
                                                    setConfirmActionModel({
                                                        state: false,
                                                        title: '',
                                                        description: '',
                                                        dispatch: () => {},
                                                    })
                                                }}
                                            >
                                                Yes
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={timelineModal.state} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={() => {
                            setTimelineModal({ ...timelineModal, state: false })
                        }}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-100"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 overlay" />
                        </Transition.Child>
                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="border-2 border-black-600 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <TradeTimeLine
                                            trade={timelineModal.trade!!}
                                        />
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </div>
        )
    }
}

export default WithAuth(Page)