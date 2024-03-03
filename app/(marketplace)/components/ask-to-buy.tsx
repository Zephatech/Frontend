'use client'
import { useAuth } from '@/app/_utils/api/auth'
import { createTrade } from '@/app/_utils/api/trades'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function AskToBuy({
  ownerId,
  productId,
}: {
  ownerId: number
  productId: number
}) {
  const { data, isLoading, isFetching } = useAuth()
  const userId = data?.userId
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: ({ productId }: { productId: number }) =>
      createTrade(productId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Trade request created, waiting for seller to confirm')
        router.push('/')
      } else {
        toast.warning(data?.message)
      }
    },
    onError: () => {
      toast.warning('Something is wrong')
    },
  })

  if (isLoading || isFetching) {
    return <p>Loading...</p>
  }

  if (!userId || userId == ownerId) {
    return null
  }
  return (
    <>
      <div className="mt-10">
        <button
          type="button"
          onClick={() => mutation.mutate({ productId })}
          className="flex w-full items-center justify-center primary-btn"
        >
          Ask to Buy
        </button>
      </div>
    </>
  )
}
