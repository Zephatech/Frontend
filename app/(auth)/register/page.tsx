'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FieldErrors, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'

import { register as registerFn, useAuth } from '@/app/_utils/api/auth'
import { useMutation } from '@tanstack/react-query'

type FormValues = {
    firstName: string
    lastName: string
    email: string
    password: string
    agreeTOS: boolean
}

export default function Register() {
    const { data, isLoading } = useAuth()
    const userId = data?.userId
    const router = useRouter()
    const mutation = useMutation({
        mutationFn: ({
            firstName,
            lastName,
            email,
            password,
        }: {
            firstName: string
            lastName: string
            email: string
            password: string
        }) => registerFn(firstName, lastName, email, password),
        onSuccess: async (data) => {
            if (data.status == 200) {
                toast.success('Verification code sent, please check your email')
                router.replace('/')
            } else {
                const resData = await data.json()
                toast.warning(resData?.message)
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
            firstName: data.firstName,
            lastName: data.lastName,
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
                    Register your account
                </h1>
                <div className="w-[25rem] mt-7">
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(onSubmit, onError)}
                        noValidate
                    >
                        <div>
                            <input
                                id="firstName"
                                type="text"
                                {...register('firstName', {
                                    required: 'Firstname is required',
                                })}
                                placeholder="First Name"
                                className="input-field"
                            />
                            <p className="text-red-600 text-sm">
                                {errors.firstName?.message}
                            </p>
                        </div>
                        <div>
                            <input
                                id="lastName"
                                type="text"
                                {...register('lastName', {
                                    required: 'Lastname is required',
                                })}
                                placeholder="Last Name"
                                className="input-field"
                            />
                            <p className=" text-red-600 text-sm">
                                {errors.lastName?.message}
                            </p>
                        </div>
                        <div>
                            <input
                                id="email"
                                type="email"
                                {...register('email', {
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@uwaterloo\.ca$/,
                                        message:
                                            'Must be a valid UWaterloo email address',
                                    },
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
                            <Tooltip
                                anchorSelect=".register-password-info"
                                place="top"
                            >
                                Password should be at least 8 characters long
                                and contain at <br />
                                least one uppercase letter, one lowercase
                                letter, one digit, <br />
                                and one special character.
                            </Tooltip>
                            <div>
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password', {
                                        pattern: {
                                            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
                                            message:
                                                'Please choose a stronger password',
                                        },
                                        required: 'Password is required',
                                    })}
                                    placeholder="Password"
                                    className="input-field register-password-info"
                                />
                                <p className="text-red-600 text-sm">
                                    {errors.password?.message}
                                </p>
                            </div>
                        </div>
                        <div className="mt-7 text-gray-400">
                            <p className="text-xs">
                                By signing up, you agree to our{' '}
                                <Link
                                    href="/terms-and-conditions"
                                    className="text-indigo-600 hover:text-indigo-500"
                                >
                                    Terms and Conditions
                                </Link>
                                .
                            </p>
                            <button type="submit" className="mt-3 primary-btn">
                                Sign up
                            </button>
                        </div>
                        <p className="text-center text-xs">
                            Already a member?{' '}
                            <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                <span
                                    className="cursor-pointer"
                                    onClick={() => {
                                        router.replace('/login')
                                    }}
                                >
                                    Log in
                                </span>
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
