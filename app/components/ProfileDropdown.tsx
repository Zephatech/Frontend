'use client'
import Link from 'next/link'
import { Fragment } from 'react'

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUserId, logout } from '../_utils/auth'
import { classNames } from '../_utils/styles/styles'

const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
]

export default function ProfileDropdown() {
    const queryClient = useQueryClient()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['auth'],
        queryFn: getCurrentUserId,
    })

    const userId = data?.userId
    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['auth'] })
            console.log('hi')
        },
    })
    // const { userId, isLoading } = useGetCurrentUserId()
    // const { trigger } = useLogout()
    return (
        <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                {userId ? (
                    <>
                        <img
                            className="h-8 w-8 rounded-full bg-gray-50"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                        />
                        <span className="hidden lg:flex lg:items-center">
                            <span
                                className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                                aria-hidden="true"
                            >
                                Tom Cook
                            </span>
                            <ChevronDownIcon
                                className="ml-2 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className=" rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Log In
                    </Link>
                )}
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item key="Your Profile">
                        {({ active }) => (
                            <a
                                href="#"
                                className={classNames(
                                    active ? 'bg-gray-50' : '',
                                    'block px-3 py-1 text-sm leading-6 text-gray-900'
                                )}
                            >
                                Your Profile
                            </a>
                        )}
                    </Menu.Item>
                    <Menu.Item key="Log out">
                        {({ active }) => (
                            <a
                                href="#"
                                className={classNames(
                                    active ? 'bg-gray-50' : '',
                                    'block px-3 py-1 text-sm leading-6 text-gray-900'
                                )}
                                onClick={() => mutation.mutate()}
                            >
                                Log out
                            </a>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
