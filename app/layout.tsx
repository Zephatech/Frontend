import '@/app/_utils/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-tooltip/dist/react-tooltip.css'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import QueryProvider from './_utils/QueryProvider'
import MainLayout from './components/MainLayout'

export const metadata = {
  title: 'UW Trade',
}

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full vsc-initialized">
        <QueryProvider>
          {modal}
          <MainLayout>{children}</MainLayout>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  )
}
