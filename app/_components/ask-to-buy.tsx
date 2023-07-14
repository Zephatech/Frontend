'use client'
import { useGlobalContext } from '@/app/_utils/contexts/global-context'

export default function AskToBuy() {
    const { user } = useGlobalContext()
    console.log(user)
    return (
        <>
            {user && (
                <div className="mt-10">
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                        Ask to Buy
                    </button>
                </div>
            )}
        </>
    )
}
