'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form' // Import the useForm hook from 'react-hook-form' // @ts-ignore
import { toast } from 'react-toastify'
import useAuthStore from '../../stores/authStore'
import { login as SendLogin } from '@/app/_utils/api/auth'

type FormValues = {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const [finishedLogin, setFinishedLogin] = useState(false)
  const { isLoading, isValidUser, login, failToLogin } = useAuthStore()

<<<<<<< HEAD
  // prompt user to login if not authenticated
  const searchParams = useSearchParams()
  useEffect(() => {
    if (isValidUser) {
      toast.info('Already logged in, redirected to homepage')
      router.replace('/')
    } else if (searchParams.has('unauthenticated')) {
      toast.error('You are not logged in yet') // Display the toast message
    }
  }, [])
=======
    const searchParams = useSearchParams()
    useEffect(() => {
        if (searchParams.has('unauthenticated')) {
            toast.error('You are not logged in yet') // Display the toast message
        }
    }, [searchParams])
>>>>>>> b004859 (Initialize for deployment)

  const mutation = useMutation({
    mutationFn: ({ email, password }: FormValues) => SendLogin(email, password),
    onSuccess: (data: any) => {
      if (data.success) {
        setFinishedLogin(true)
        login(data.userId, data.name)
        router.replace(`/`)
        toast.success('Logged in')
      } else {
        failToLogin()
        toast.warning(data?.message)
      }
    },
    onError: () => {
      toast.warning('Something is wrong')
    },
  })

  const { register, handleSubmit, formState } = useForm<FormValues>()
  const { errors } = formState

  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      email: data.email,
      password: data.password,
    })
  }

  if (finishedLogin || isLoading) {
    return null
  } else {
    return (
<<<<<<< HEAD
      <LoginForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        router={router}
      />
=======
        <>
            <div className="flex flex-col items-center mt-20">
                <h1 className="text-xl text-indigo-600 font-semibold text-center">
                    Log in to your account
                </h1>
                <div className="w-[25rem] mt-7">
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(onSubmit, () => {})}
                        noValidate
                    >
                        <div>
                            <input
                                id="email"
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                })}
                                placeholder="UWaterloo Email Address"
                                className="input-field"
                            />
                            <p className=" text-red-600 text-sm">
                                {errors.email?.message}
                            </p>
                        </div>
                        <div>
                            <input
                                id="password"
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                })}
                                placeholder="Password"
                                className="input-field"
                            />
                            <p className="text-red-600 text-sm">
                                {errors.password?.message}
                            </p>
                        </div>
                        <div className="!mt-3">
                            <div className="text-sm">
                                <a
                                    href="/forgot-password"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <button type="submit" className="mt-3 primary-btn">
                                Log in
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-400">
                            Not yet a member?{' '}
                            <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                <span
                                    className="cursor-pointer"
                                    onClick={() => {
                                        router.replace('/register')
                                    }}
                                >
                                    Sign up
                                </span>
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </>
>>>>>>> b004859 (Initialize for deployment)
    )
  }
}

function LoginForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  router,
}: {
  register: any
  handleSubmit: any
  onSubmit: any
  errors: any
  router: any
}): JSX.Element {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-xl text-indigo-600 font-semibold text-center">
        Log in to your account
      </h1>
      <div className="w-[25rem] mt-7">
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit, () => {})}
          noValidate
        >
          <div>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
              })}
              placeholder="UWaterloo Email Address"
              className="input-field"
            />
            <p className=" text-red-600 text-sm">{errors.email?.message}</p>
          </div>
          <div>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
              })}
              placeholder="Password"
              className="input-field"
            />
            <p className="text-red-600 text-sm">{errors.password?.message}</p>
          </div>
          <div className="!mt-3">
            <div className="text-sm">
              <a
                href="/forgot-password"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
            <button type="submit" className="mt-3 primary-btn">
              Log in
            </button>
          </div>
          <p className="text-center text-xs text-gray-400">
            Not yet a member?{' '}
            <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              <span
                className="cursor-pointer"
                onClick={() => {
                  router.replace('/register')
                }}
              >
                Sign up
              </span>
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}
