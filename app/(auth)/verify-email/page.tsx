'use client'
import React, { useState } from 'react'
import OtpInput from 'react-otp-input'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyEmail } from '@/app/_utils/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { classNames } from '@/app/_utils/styles/styles'

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
    return (
        <>
            <div className="flex flex-1 flex-col justify-center px-6 py-12 ">
                <div className="sm:mx-auto">
                    <h2 className=" text-center text-lg leading-9 tracking-tight text-gray-500">
                        Code has sent to <br />
                        <span className="font-bold">
                            {searchParams.get('email')}
                        </span>
                    </h2>
                    <div className="p-10">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            shouldAutoFocus={true}
                            containerStyle="h-50 bg-red justify-center"
                            inputStyle="p-0 !w-14 !h-14 mr-2 text-3xl"
                            renderInput={(props) => {
                                const { inputMode, ...otherProps } = props
                                return (
                                    <input inputMode="text" {...otherProps} />
                                )
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
            </div>
        </>
    )
}
