'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { requestResetPassword } from '@/app/_utils/api/auth'
import { useMutation } from '@tanstack/react-query'

type FormValues = {
  email: string
}
export default function ForgotPassword() {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: ({ email }: { email: string }) => requestResetPassword(email),
    onSuccess: () => {
      toast.success(
        'If the email exists in our system, you will receive a password reset email'
      )
      router.replace('/login')
    },
    onError: () => {
      toast.error(
        'Failed to send password reset email, please try again or contact support'
      )
    },
  })
  const form = useForm<FormValues>()
  const { register, handleSubmit, formState } = form
  const { errors } = formState

  const onSubmit = (data: FormValues) => {
    mutation.mutate({ email: data.email })
  }

  return (
    <>
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-xl text-indigo-600 font-semibold text-center">
          Forgot Password
        </h1>
        <div className="w-[25rem] mt-7">
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <input
                id="email"
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@uwaterloo\.ca$/,
                    message: 'Must be a valid UWaterloo email address',
                  },
                  required: 'Email is required',
                })}
                placeholder="Email Address"
                className="input-field"
              />
              <p className=" text-red-600 text-sm">{errors.email?.message}</p>
            </div>
            <div className="mt-3">
              <button type="submit" className="primary-btn">
                Send Reset Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
