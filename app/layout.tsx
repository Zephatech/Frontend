import './_utils/styles/globals.css'
import MainLayout from './_components/main-layout'
import 'react-toastify/dist/ReactToastify.css'
import { GlobalContextProvider } from './_utils/contexts/globalContext'

export const metadata = {
    title: 'UW Trade',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="h-full bg-white">
            <body>
                <GlobalContextProvider>
                    <MainLayout>{children}</MainLayout>
                </GlobalContextProvider>
            </body>
        </html>
    )
}
