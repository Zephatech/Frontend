'use client'
import { useState, useEffect, Fragment } from 'react'
import { Product } from '@/app/_utils/api/products'
import { CheckIcon } from '@heroicons/react/20/solid'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { TextField } from '@mui/material'
import useAuthStore from '@/app/stores/authStore'
import AskToBuy from '../../components/ask-to-buy'

// compoents
function ContactInfoCard({
  isOpen,
  setIsOpen,
  profile,
}: {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  profile: any
}) {
  return (
    <Transition.Root as={Fragment} show={isOpen}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          setIsOpen(false)
        }}
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

function SendMessageCard({
  isOpen,
  setIsOpen,
  ownerId,
}: {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  ownerId: number | undefined
}) {
  const [message, setMessage] = useState(
    'Hello, I am interested in your product. Is it still avaiable?'
  )
  const sendMessage = async () => {
    try {
      if (ownerId == undefined) throw new Error('Owner Id is null')

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/message/send/${ownerId}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        }
      )
      const data = await res.json()
      if (data.error) throw new Error(data.error)
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
        onClose={() => {
          setIsOpen(false)
        }}
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
                  label="Message"
                  multiline
                  rows={4}
                  defaultValue="Hello, I am interested in your product. Is it still available?"
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

export default function Page({ params }: { params: { id: number } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [sellerProfile, setSellerProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [contactCardIsOpen, setContactCardIsOpen] = useState(false)
  const [messageCardIsOpen, setMessageCardIsOpen] = useState(false)
  const { isValidUser } = useAuthStore()

  useEffect(() => {
    const getProductData = async (id: number) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/products/${id}`,
          {
            cache: 'no-cache',
          }
        )
        const data = await res.json()
        setProduct(data)

        if (isValidUser && data.ownerId != null) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/profile/getOtherUserProfile/${data.ownerId}`,
            {
              cache: 'no-cache',
              credentials: 'include',
            }
          )
          const profileData = await res.json()
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
    return <div className="text-center py-10">Loading...</div>
  }

  const similarItems = [product, product, product] // @TODO: get similar items from backend (Hubert)
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
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Image container moved to the left side */}
          <div className="lg:col-start-1 lg:self-center">
            <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-200">
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

          {/* Product details and form on the right */}
          <div className="flex flex-col justify-center lg:col-start-2 lg:pl-8">
            <div className="font-medium text-gray-500 hover:text-gray-900">
              {product?.category}
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product?.name}
              </h1>
            </div>
            <div className="mt-4">
              <p className="text-lg text-gray-900 sm:text-xl">
                ${product?.price}
              </p>
            </div>
            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{product?.description}</p>
            </div>
            <div className="mt-6 flex items-center">
              <CheckIcon
                className="h-5 w-5 flex-shrink-0 text-green-500"
                aria-hidden="true"
              />
              <p className="ml-2 text-sm text-gray-500">Good Seller Rating</p>
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

            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              {/* Conditional rendering based on isValidUser */}
              {isValidUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setContactCardIsOpen(true)
                  }}
                  className="w-full items-center justify-center px-6 py-3 border border-transparent text-lg leading-6 font-medium rounded-md text-blue-700 bg-blue-200 hover:text-blue-800 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
                >
                  Check Contact Info
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.replace('/login')}
                  className="w-full items-center justify-center px-6 py-3 bg-gray-600 text-white text-lg leading-6 font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition ease-in-out duration-150"
                >
                  Login to send message to seller or get contact info
                </button>
              )}

              {/* Always visible button */}
              <button
                type="button"
                onClick={() => setMessageCardIsOpen(true)}
                className="w-full items-center justify-center px-6 py-3 bg-blue-600 text-white text-lg leading-6 font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
              >
                Send message to seller
              </button>

              {/* Additional elements like AskToBuy */}
              <AskToBuy ownerId={product?.ownerId} productId={product?.id} />
              <div className="mt-6 text-center">
                <a href="#" className="group inline-flex text-base font-medium">
                  <ShieldCheckIcon
                    className="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-gray-500 hover:text-gray-700">
                    Student to Student Guarantee
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4">
            {/* Similar Items Section */}
            <div className="my-8">
              <h2 className="text-2xl font-bold">
                Similar items inspired by your views
              </h2>
              <div className="flex overflow-x-auto py-4 -mx-4">
                <div className="flex-none min-w-full px-4">
                  <div className="flex space-x-6">
                    {similarItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex-none w-1/2 md:w-1/4 lg:w-1/5"
                      >
                        <img
                          src={
                            product?.image === ''
                              ? 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg'
                              : `/images/${product?.image}`
                          }
                          alt={item?.name || 'No image'}
                          className="w-full h-auto object-cover rounded-lg"
                        />
                        <h3 className="mt-2 text-lg font-medium">
                          {item?.name || 'Product Name'}
                        </h3>
                        <p className="text-lg font-semibold">
                          ${item?.price || '100'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style global jsx>{`
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
        }
        .overflow-x-auto::-webkit-scrollbar {
          display: none; /* for macOS */
        }
        .overflow-x-auto {
          scrollbar-width: none; /* for Firefox */
          ms-overflow-style: none; /* for Internet Explorer and Edge */
        }
      `}</style>
    </>
  )
}
