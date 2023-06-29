import './_utils/styles/globals.css'
import MainLayout from './_components/main-layout'
import 'react-toastify/dist/ReactToastify.css'

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
                <MainLayout>{children}</MainLayout>
            </body>
        </html>
    )
}
