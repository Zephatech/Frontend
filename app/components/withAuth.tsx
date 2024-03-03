import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useAuthStore from '../stores/authStore'

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper = (props: P) => {
    const router = useRouter()
    const { isLoading, isValidUser } = useAuthStore()
    useEffect(() => {
      if (!isLoading && !isValidUser) {
        router.replace('/login?unauthenticated')
      }
    }, [isLoading])

    if (isLoading) {
      return null
    }
    return <WrappedComponent {...props} />
  }

  return Wrapper
}

export default withAuth
