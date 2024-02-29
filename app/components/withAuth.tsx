import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useAuthStore from '../stores/authStore'

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const router = useRouter()
    const { isValidUser } = useAuthStore()

    useEffect(() => {
      if (!isValidUser) {
        router.replace('/login?unauthenticated')
      }
    }, [isValidUser, router])
    
    return <WrappedComponent {...props} />
  }

  return Wrapper
}

export default withAuth
