import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from '@heroicons/react/20/solid'
import { classNames } from '../_utils/styles'
const tabs = [
    { name: 'Textbooks', href: '#', current: true },
    { name: 'Living Supply', href: '#', current: false },
    { name: 'School Supply', href: '#', current: false },
]

const products = [
    {
        id: 1,
        name: 'Introduction to Biology',
        href: '#',
        price: '$45',
        description:
            'Comprehensive textbook covering the basics of biology with illustrations and practice questions.',
        options: 'Hardcover',
        imageSrc:
            'data:image/jpeg;base64,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',
        imageAlt: 'Cover of the "Introduction to Biology" textbook',
    },
    {
        id: 2,
        name: 'Graphing Calculator',
        href: '#',
        price: '$120',
        description:
            'Advanced graphing calculator with a high-resolution color display and programmable functions.',
        options: 'Model: TI-84 Plus',
        imageSrc:
            'https://i2.wp.com/passionatepennypincher.com/wp-content/uploads/2022/07/Tx-instruments-scaled.jpg',
        imageAlt: 'Image of a graphing calculator',
    },
    {
        id: 3,
        name: 'Twin XL Bedding Set',
        href: '#',
        price: '$80',
        description:
            'Complete bedding set for a twin XL bed, including sheets, pillowcases, and a comforter.',
        options: 'Color: White',
        imageSrc:
            'https://i.pinimg.com/736x/f4/0b/2c/f40b2c4718143c1513b187160aad8aa2.jpg',
        imageAlt: 'Twin XL bedding set in white',
    },
    {
        id: 4,
        name: 'World History: A Comprehensive Guide',
        href: '#',
        price: '$55',
        description:
            'In-depth textbook exploring world history from ancient civilizations to the present day.',
        options: 'Paperback',
        imageSrc:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe7di2mUf1N9U6QotIJBJGvrnWzg-_1Ro9PA&usqp=CAU',
        imageAlt:
            'Cover of the "World History: A Comprehensive Guide" textbook',
    },
    {
        id: 6,
        name: 'Desk Lamp',
        href: '#',
        price: '$35',
        description:
            'Adjustable LED desk lamp with multiple brightness levels and a USB charging port.',
        options: 'Color: Black',
        imageSrc:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtC9mjD6NvqqdBDLoiL5XtlKxIcz-bBgw4vg&usqp=CAU',
        imageAlt: 'Desk lamp in black color',
    },
    // More products...
]
export default function page() {
    return (
        <>
            <div>
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a tab
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                        id="tabs"
                        name="tabs"
                        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        defaultValue={tabs.find((tab) => tab.current).name}
                    >
                        {tabs.map((tab) => (
                            <option key={tab.name}>{tab.name}</option>
                        ))}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <nav
                        className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
                        aria-label="Tabs"
                    >
                        {tabs.map((tab, tabIdx) => (
                            <a
                                key={tab.name}
                                href={tab.href}
                                className={classNames(
                                    tab.current
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700',
                                    tabIdx === 0 ? 'rounded-l-lg' : '',
                                    tabIdx === tabs.length - 1
                                        ? 'rounded-r-lg'
                                        : '',
                                    'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
                                )}
                                aria-current={tab.current ? 'page' : undefined}
                            >
                                <span>{tab.name}</span>
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        tab.current
                                            ? 'bg-indigo-500'
                                            : 'bg-transparent',
                                        'absolute inset-x-0 bottom-0 h-0.5'
                                    )}
                                />
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
            {/* Product List */}
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Products</h2>

                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                            >
                                <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
                                    <img
                                        src={product.imageSrc}
                                        alt={product.imageAlt}
                                        className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col space-y-2 p-4">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        <a href={product.href}>
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-0"
                                            />
                                            {product.name}
                                        </a>
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {product.description}
                                    </p>
                                    <div className="flex flex-1 flex-col justify-end">
                                        <p className="text-sm italic text-gray-500">
                                            {product.options}
                                        </p>
                                        <p className="text-base font-medium text-gray-900">
                                            {product.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                <div className="-mt-px flex w-0 flex-1">
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        <ArrowLongLeftIcon
                            className="mr-3 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                        Previous
                    </a>
                </div>
                <div className="hidden md:-mt-px md:flex">
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        1
                    </a>
                    {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
                        aria-current="page"
                    >
                        2
                    </a>
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        3
                    </a>
                    <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                        ...
                    </span>
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        8
                    </a>
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        9
                    </a>
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        10
                    </a>
                </div>
                <div className="-mt-px flex w-0 flex-1 justify-end">
                    <a
                        href="#"
                        className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        Next
                        <ArrowLongRightIcon
                            className="ml-3 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </nav>
        </>
    )
}
