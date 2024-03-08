'use client'
import { useState, useEffect, Fragment } from 'react'
import { Product } from '@/app/_utils/api/products'
import { CheckIcon } from '@heroicons/react/20/solid'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
<<<<<<< HEAD
import { useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { TextField } from '@mui/material'
import useAuthStore from '@/app/stores/authStore'
=======
import Image from 'next/image'

>>>>>>> b004859 (Initialize for deployment)
import AskToBuy from '../../components/ask-to-buy'
import { BACKEND_URL } from '../../../constants/backend'

<<<<<<< HEAD
// compoents
function ContactInfoCard({ isOpen, setIsOpen, profile }: { isOpen: boolean, setIsOpen: (value: boolean) => void, profile: any }) {
  return (
    <Transition.Root as={Fragment} show={isOpen}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => { setIsOpen(false) }}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 overlay" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="border-2 border-black-600 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div> Contact Info:</div>
                <div> Name: {profile?.firstName}</div>
                <div> Email: {profile?.email}</div>
                <div> Phone: {profile?.phoneNumber}</div>
                <div> Facebook: {profile?.Facebook} </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

function SendMessageCard({ isOpen, setIsOpen, ownerId }: { isOpen: boolean, setIsOpen: (value: boolean) => void, ownerId: number | undefined }) {
  const [message, setMessage] = useState('Hello, I am interested in your product. Is it still avaiable?')
  const sendMessage = async () => {
    try {
      if (ownerId == undefined) throw new Error('Owner Id is null')
=======
const getProductData = async (id: number) => {
    let res = await fetch(`${BACKEND_URL}/products/${id}`, {
        cache: 'no-cache',
    })
    res = await res.json()
    return res
}

export default async function Page({ params }: { params: { id: number } }) {
    const product = (await getProductData(params.id)) as unknown as Product
    const showCourseLink = product.options !== null && product.options?.course
>>>>>>> b004859 (Initialize for deployment)

      const res = await fetch(`http://localhost:3001/message/send/${ownerId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

    } catch (error) {
      // toast.error(error.message);
    } finally {
      // toast.success('Message sent')
      setIsOpen(false)
    }
  }
  return (
    <Transition.Root as={Fragment} show={isOpen}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => { setIsOpen(false) }}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 overlay" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="border-2 border-black-600 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <TextField
                  id="outlined-multiline-static"
                  label="Multiline"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="flex w-full items-center justify-center primary-btn"
                >
                  Send
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

<<<<<<< HEAD
export default function Page({ params }: { params: { id: number } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [sellerProfile, setSellerProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [contactCardIsOpen, setContactCardIsOpen] = useState(false)
  const [messageCardIsOpen, setMessageCardIsOpen] = useState(false)
  const { isValidUser } = useAuthStore();
=======
                            <div className="mt-6 flex items-center">
                                <CheckIcon
                                    className="h-5 w-5 flex-shrink-0 text-green-500"
                                    aria-hidden="true"
                                />
                                <p className="ml-2 text-sm text-gray-500">
                                    Good Seller Rating
                                </p>
                            </div>

                            {showCourseLink && (
                                <div className="mt-6 flex items-center">
                                    <a
                                        href={`https://uwflow.com/course/${showCourseLink}`}
                                        className="text-sm text-blue-500 hover:text-blue-700"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Related courses on UWFlow
                                    </a>
                                </div>
                            )}
                        </section>
                    </div>
                    <div className="mt-10 md:col-start-2 md:row-span-2 md:mt-0 md:self-center">
                        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
                            <Image
                                src={
                                    product.image === ''
                                        ? 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg'
                                        : `/images/${product.image}`
                                }
                                alt={product.name}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>
                    {/* Product form */}
                    <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
                        <section aria-labelledby="options-heading">
                            <h2 id="options-heading" className="sr-only">
                                Product options
                            </h2>
>>>>>>> b004859 (Initialize for deployment)

  useEffect(() => {
    const getProductData = async (id: number) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PREFIX}/products/${id}`, {
          cache: 'no-cache',
        })
        const data = await res.json()
        setProduct(data)

        if (isValidUser && data.ownerId != null) {
          const res = await fetch(`http://localhost:3001/profile/getOtherUserProfile/${data.ownerId}`, {
            cache: 'no-cache',
            credentials: 'include'
          })
          const profileData = await res.json();
          setSellerProfile(profileData)
        }
      } catch (error) {
        console.error('Error fetching product data:', error)
      } finally {
        setLoading(false)
      }
    }

    getProductData(params.id)
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  const showCourseLink = product?.options !== null && product?.options?.course

  return (
    <>
      <ContactInfoCard
        isOpen={contactCardIsOpen}
        setIsOpen={setContactCardIsOpen}
        profile={sellerProfile}
      />
      <SendMessageCard
        isOpen={messageCardIsOpen}
        setIsOpen={setMessageCardIsOpen}
        ownerId={product?.ownerId}
      />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product details */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="font-medium text-gray-500 hover:text-gray-900">
              {product?.category}
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product?.name}
              </h1>
            </div>

            <section
              aria-labelledby="information-heading"
              className="mt-4"
            >
              <h2 id="information-heading" className="sr-only">
                Product information
              </h2>

              <div className="flex items-center">
                <p className="text-lg text-gray-900 sm:text-xl">
                  ${product?.price}
                </p>
              </div>
              <div className="mt-4 space-y-6">
                <p className="text-base text-gray-500">
                  {product?.description}
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <CheckIcon
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                  aria-hidden="true"
                />
                <p className="ml-2 text-sm text-gray-500">
                  Good Seller Rating
                </p>
              </div>

              {showCourseLink && (
                <div className="mt-6 flex items-center">
                  <a
                    href={`https://uwflow.com/course/${showCourseLink}`}
                    className="text-sm text-blue-500 hover:text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Related courses on UWFlow
                  </a>
                </div>
              )}
            </section>
          </div>
          <div className="mt-10 md:col-start-2 md:row-span-2 md:mt-0 md:self-center">
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
              <img
                src={
                  product?.image === ''
                    ? 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg'
                    : `/images/${product?.image}`
                }
                alt={product?.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          {/* Product form */}
          <div className="mt-1 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <section aria-labelledby="options-heading">
              <form>
                {isValidUser ? (
                  <button
                    type="button"
                    onClick={() => { setContactCardIsOpen(true) }}
                    className="flex w-full items-center justify-center primary-btn"
                  >
                    Check Contact Info
                  </button>)
                  : (
                    <button
                      type="button"
                      onClick={() => { router.replace('/login') }}
                      className="flex w-full items-center justify-center primary-btn"
                    >
                      Login to send message to seller or get contact info
                    </button>
                  )
                }

                <button
                  type="button"
                  onClick={() => { setMessageCardIsOpen(true) }}
                  className="flex w-full items-center justify-center primary-btn"
                >
                  Send message to seller
                </button>
                <AskToBuy
                  ownerId={product?.ownerId}
                  productId={product?.id}
                />
                <div className="mt-6 text-center">
                  <a
                    href="#"
                    className="group inline-flex text-base font-medium"
                  >
                    <ShieldCheckIcon
                      className="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="text-gray-500 hover:text-gray-700">
                      Student to Student Guarantee
                    </span>
                  </a>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}