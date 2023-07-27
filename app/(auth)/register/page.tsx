'use client'
import Link from 'next/link'
// import { DevTool } from '@hookform/devtools'
import { FieldErrors, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Tooltip } from 'react-tooltip'

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { register as registerFn } from '@/app/_utils/auth'

import { classNames } from '@/app/_utils/styles/styles'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

type FormValues = {
    firstName: string
    lastName: string
    email: string
    password: string
    agreeTOS: boolean
}

export default function Register() {
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
            console.log(data)
            if (data.status == 200) {
                const email = getValues('email')
                toast.success('Verification Email Sent')
                router.replace(`/verify-email?email=${email}`)
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
    const { register, handleSubmit, formState, getValues } = form
    const { errors, isDirty, isValid } = formState

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
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center  lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className="mt-10 text-center font-bold text-5xl text-indigo-600">
                        UWTrade
                    </h1>
                    <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Register your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit, onError)}
                        noValidate
                    >
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                First Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="firstName"
                                    type="text"
                                    {...register('firstName', {
                                        required: 'Firstname is required',
                                    })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <p className="text-red-600 text-sm">
                                    {errors.firstName?.message}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Last Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="lastName"
                                    type="text"
                                    {...register('lastName', {
                                        required: 'Lastname is required',
                                    })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <p className="text-red-600 text-sm">
                                    {errors.lastName?.message}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                UWaterloo Email address
                            </label>
                            <div className="mt-2">
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <p className="text-red-600 text-sm">
                                    {errors.email?.message}
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-1 items-center">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Password
                                </label>
                                <InformationCircleIcon className="register-password-info h-5 w-5 text-gray-400" />
                                <Tooltip
                                    anchorSelect=".register-password-info"
                                    place="bottom"
                                >
                                    Password should be at least 8 characters
                                    long and contain at <br />
                                    least one uppercase letter, one lowercase
                                    letter, one digit, <br />
                                    and one special character.
                                </Tooltip>
                            </div>
                            <div className="mt-2">
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <p className="text-red-600 text-sm">
                                    {errors.password?.message}
                                </p>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="bg-indigo-600 focus-visible:outline-indigo-600 hover:bg-indigo-500 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                Sign up
                            </button>
                            <p className="text-sm mt-2 text-gray-400">
                                By signing up, you agree to our{' '}
                                <Link
                                    href="/terms"
                                    className="text-indigo-600 hover:text-indigo-500"
                                >
                                    Terms and Conditions
                                </Link>
                                .
                            </p>
                        </div>
                    </form>
                    {/* <DevTool control={control} /> */}
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already a member?{' '}
                        <Link
                            href="/login"
                            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
