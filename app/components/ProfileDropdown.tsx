'use client'
import Link from 'next/link'
import { Fragment } from 'react'

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useQueryClient } from '@tanstack/react-query'

import { logout as logoutBackend} from '../_utils/api/auth'
import { classNames } from '../_utils/styles/styles'
import  useAuthStore  from '../stores/authStore'

const ProfileDropdown = () => {
    const { userId, name, isLoading, isValidUser, logout } = useAuthStore();
    const queryClient = useQueryClient()

    const hanldeLogout = async () => {
        logout();
        await logoutBackend();
        queryClient.invalidateQueries({ queryKey: ['auth'] });
    }

    if (isLoading){
        return null
    } else if (!isValidUser || !userId){
        return <AuthLinks />
    } else {
        return (
            <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <span className="flex items-center">
                        <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">{name}</span>
                        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Menu.Button>
    
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item key="Your Profile">
                            {({ active }) => (
                                <a href="/profile" className={classNames(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}>Your Profile</a>
                            )}
                        </Menu.Item>
                        <Menu.Item key="Log out">
                            {({ active }) => (
                                <a href="/" className={classNames(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')} onClick={hanldeLogout}>Log out</a>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        )
    }
}

const AuthLinks = () => (
    <p className="text-sm">
        <Link href="/register" className="text-indigo-600 hover:text-indigo-400">Register</Link> or{' '}
        <Link href="/login" className="text-indigo-600 hover:text-indigo-400">Log in</Link>
    </p>
)

export default ProfileDropdown