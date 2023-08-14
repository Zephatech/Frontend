'use client'
import Link from 'next/link'

import {
    ChartPieIcon,
    Cog6ToothIcon,
    FolderIcon,
    HomeIcon,
    CurrencyDollarIcon,
    InformationCircleIcon,
    PlusIcon,
} from '@heroicons/react/24/outline'
import { classNames } from '../_utils/styles/styles'

const navigation = [
    { name: 'Marketplace', href: '#', icon: HomeIcon, current: false },
    // { name: 'Chat', href: '#', icon: UsersIcon, current: false },
    // { name: 'Favourite', href: '/favourite', icon: FolderIcon, current: false },
    {
        name: 'Sell',
        href: '/create-product',
        icon: CurrencyDollarIcon,
        current: false,
    },
]

export default function SideBar({
    isStatic = false,
    closeSideBar,
}: {
    isStatic?: boolean
    closeSideBar?: () => void
}) {
    return (
        <div
            className={classNames(
                isStatic ? 'border-r border-gray-200' : '',
                'flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4'
            )}
        >
            <div className="flex mt-4 items-center">
                <Link href="/" onClick={closeSideBar}>
                    <span className="ml-2 font-bold text-2xl text-gray-800">
                        UWTrade
                    </span>
                </Link>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={closeSideBar}
                                        className={classNames(
                                            item.current
                                                ? 'bg-gray-50 text-indigo-600'
                                                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                        )}
                                    >
                                        <item.icon
                                            className={classNames(
                                                item.current
                                                    ? 'text-indigo-600'
                                                    : 'text-gray-400 group-hover:text-indigo-600',
                                                'h-6 w-6 shrink-0'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li className="mt-auto">
                        <a
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        >
                            <InformationCircleIcon
                                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                aria-hidden="true"
                            />
                            About Us
                        </a>
                        <a
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        >
                            <Cog6ToothIcon
                                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                aria-hidden="true"
                            />
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
