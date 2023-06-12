import './globals.css'
import MainLayout from './_components/main-layout'

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
            <body className="h-full ">
                <MainLayout>{children}</MainLayout>
            </body>
        </html>
    )
}
