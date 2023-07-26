import './_utils/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import QueryProvider from './_utils/QueryProvider'
import MainLayout from './components/MainLayout'

export const metadata = {
    title: 'UW Trade',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="h-full bg-white">
            <body>
                <QueryProvider>
                    <MainLayout>{children}</MainLayout>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryProvider>
            </body>
        </html>
    )
}
