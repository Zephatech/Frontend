'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import OtpInput from 'react-otp-input'
import { toast } from 'react-toastify'

import { verifyEmail } from '@/app/_utils/api/auth'
import { classNames } from '@/app/_utils/styles/styles'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function App() {
    const router = useRouter()
    const [otp, setOtp] = useState('')

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: ({
            email,
            verificationcode,
        }: {
            email: string
            verificationcode: string
        }) => verifyEmail(email, verificationcode),
        onSuccess: async (data) => {
            if (data.success) {
                toast.success('Verified and logged In')
                router.replace('/')
                queryClient.invalidateQueries({ queryKey: ['auth'] })
            } else {
                toast.warning(data?.message)
            }
        },
        onError: () => {
            toast.warning('Something is wrong')
        },
    })

    const searchParams = useSearchParams()
    if (!searchParams.has('email')) {
        router.replace('/')
        return null
    }
    return (
        <>
            <div className="flex flex-col items-center mt-20 ">
                <h2 className="text-center text-base tracking-tight text-black">
                    Please enter the verification code for <br />
                    <span className="font-bold">
                        {searchParams.get('email')}
                    </span>
                </h2>
                <div className="mt-10">
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        shouldAutoFocus={true}
                        inputStyle="p-0 !w-14 !h-14 mr-2 text-3xl"
                        renderInput={(props) => {
                            const { inputMode, ...otherProps } = props
                            return <input inputMode="text" {...otherProps} />
                        }}
                    />
                    <button
                        disabled={otp.length != 6}
                        onClick={() =>
                            mutation.mutate({
                                email: searchParams.get('email') || '',
                                verificationcode: otp,
                            })
                        }
                        className={classNames(
                            otp.length != 6
                                ? 'bg-gray-300 focus:outline-none cursor-auto'
                                : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                            'mx-auto mt-10 px-20 py-3 flex justify-center rounded-md   text-sm leading-6 text-white shadow-sm '
                        )}
                    >
                        Verify
                    </button>
                </div>
            </div>
        </>
    )
}
