'use client'
import { useRouter } from 'next/navigation'
import { FieldErrors, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { login, useAuth } from '@/app/_utils/auth'
import { useMutation } from '@tanstack/react-query'

type FormValues = {
    firstName: string
    lastName: string
    email: string
    password: string
    agreeTOS: boolean
}

export default function Login() {
    const router = useRouter()
    const { data, isLoading } = useAuth()
    const userId = data?.userId
    const mutation = useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string
            password: string
        }) => login(email, password),
        onSuccess: (data) => {
            console.log(data)
            if (data.success) {
                toast.success('Logged in')
                router.replace(`/`)
            } else {
                toast.warning(data?.message)
            }
        },
        onError: () => {
            toast.warning('Something is wrong')
        },
    })
    const form = useForm<FormValues>()
    const { register, handleSubmit, formState } = form
    const { errors } = formState

    const onSubmit = (data: FormValues) => {
        mutation.mutate({
            email: data.email,
            password: data.password,
        })
    }

    const onError = (errors: FieldErrors<FormValues>) => {
        console.log('Form Errors', errors)
    }

    if (userId || isLoading) {
        if (userId) {
            toast.info('Already logged in, redirected to homepage')
            router.replace('/')
        }
        return null
    }

    return (
        <>
            <div className="flex flex-col items-center mt-20">
                <h1 className="text-xl text-indigo-600 font-semibold text-center">
                    Log in to your account
                </h1>
                <div className="w-[25rem] mt-7">
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(onSubmit, onError)}
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
                                    href="#"
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
    )
}
