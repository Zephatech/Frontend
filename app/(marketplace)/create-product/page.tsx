'use client'
import {
  ExclamationTriangleIcon,
  PhotoIcon,
  PencilIcon,
} from '@heroicons/react/24/solid'
import { useState, useEffect, Fragment } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { generateDescription } from '@/app/_utils/api/ai'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { ScaleLoader } from 'react-spinners'
import useAuthStore from '@/app/stores/authStore'
import WithAuth from '@/app/components/withAuth'

function CreateProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [toxicModal, setToxicModal] = useState({ state: false, reason: '' })
  const [autoDescriptorQuestionModal, setAutoDescriptorQuestionModal] =
    useState(false)
  const [autoDescriptorModal, setAutoDescriptorModal] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Textbook',
    image: '',
    course: '',
  })
  const { userId } = useAuthStore()

  const { name, description, price, category, image, course } = formData

  const onChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  const mutation = useMutation({
    mutationFn: ({ image }: { image: string }) => generateDescription(image),
    onSuccess: async (data) => {
      setFormData({
        ...formData,
        name: data.result.title,
        description: data.result.description,
      })
      setAutoDescriptorModal(false)
    },
    onError: () => {
      setAutoDescriptorModal(false)
      setToxicModal({ state: true, reason: 'image' })
    },
  })
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const formDataToSend = new FormData()

    if (formData.image) {
      formDataToSend.append('image', formData.image)
    }
    formDataToSend.append('name', formData.name)
    formDataToSend.append('price', formData.price.toString())
    formDataToSend.append('description', formData.description)
    formDataToSend.append('category', formData.category)
    if (formData.category === 'Textbook' && formData.course !== '') {
      formDataToSend.append(
        'options',
        JSON.stringify({ course: formData.course.replace(/\s/g, '') })
      ) // remove all space
    }

    await fetch('http://localhost:3001/products', {
      method: 'POST',
      body: formDataToSend,
      credentials: 'include',
      cache: 'no-cache',
    }).then(async (res) => {
      if (res.status == 200) {
        toast.success('Posted')
        const data = await res.json()
        router.replace(`/products/${data.product.id}`)
        queryClient.invalidateQueries({ queryKey: ['products'] })
      } else {
        return res.json().then((data) => {
          const message = data.message

          setToxicModal({
            state: true,
            reason:
              message === 'Product image contains sensitive content'
                ? 'image'
                : 'text',
          })
        })
      }
    })
  }
  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes

    if (
      file &&
      (file.type === 'image/png' || file.type === 'image/jpeg') &&
      file.size <= maxSize
    ) {
      setPreviewImage(URL.createObjectURL(file))
      setFormData({ ...formData, image: file })
      setAutoDescriptorQuestionModal(true)
    } else {
      toast.warning('File not supported')
      setPreviewImage('')
      setFormData({ ...formData, image: '' })
    }
  }
  if (!userId) {
    return <p>Loading...</p>
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-xl font-semibold text-indigo-600">Create Product</h1>
      <form className="space-y-5">
        <div className="">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            id="name"
            autoComplete="name"
            className="input-field"
            placeholder="e.g. 2023 Spring ECE 105 Textbook"
          />
        </div>
        <div className="">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </label>
          <div className="">
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={onChange}
              rows={3}
              className="input-field"
            />
          </div>
        </div>
        <div className="">
          <label
            htmlFor="photo"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Photo
          </label>
          <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              {previewImage ? (
                <>
                  <div className="mt-6">
                    <img
                      className="mt-6"
                      width="300"
                      src={previewImage}
                      alt="Preview"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        image: '',
                      })
                      setPreviewImage('')
                    }}
                    className="mt-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Reset Image
                  </button>
                </>
              ) : (
                <>
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        name="image"
                        value={image}
                        onChange={handleImageChange}
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPEG up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="">
          <label
            htmlFor="price"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Price
          </label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={onChange}
            id="price"
            className="input-field"
          />
        </div>
        <div className="">
          <label
            htmlFor="category"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Category
          </label>
          <div className="">
            <select
              id="category"
              name="category"
              value={category}
              onChange={onChange}
              className="input-field"
            >
              <option>Textbook</option>
              <option>Living Supply</option>
              <option>School Supply</option>
            </select>
          </div>
        </div>

        {category === 'Textbook' && (
          <div className="">
            <label
              htmlFor="course"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Course
            </label>
            <input
              type="text"
              name="course"
              id="course"
              value={course}
              onChange={onChange}
              className="input-field"
              placeholder="e.g. ECE 105"
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={() => {
              router.push('/')
            }}
            type="button"
            className="text-sm font-semiboltext-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="primary-btn w-fit"
          >
            Post
          </button>
        </div>
      </form>
      <Transition.Root show={toxicModal.state} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            setToxicModal({ ...toxicModal, state: false })
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
                <Dialog.Panel className="border-2 border-red-600 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {toxicModal.reason === 'text' && 'Toxic Text Detected'}
                        {toxicModal.reason === 'image' &&
                          'Toxic Image Detected'}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {toxicModal.reason === 'text' &&
                            `Warning: Detected toxic
                                                    content. Please be mindful
                                                    of your language and ensure
                                                    respectful communication`}
                          {toxicModal.reason === 'image' &&
                            `Warning: Detected toxic
                                                        image. Please be mindful
                                                        of your uploads and ensure
                                                        respectful communication`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setToxicModal({
                          ...toxicModal,
                          state: false,
                        })
                      }}
                    >
                      Acknowledged
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={autoDescriptorQuestionModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            setAutoDescriptorQuestionModal(false)
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
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
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PencilIcon
                        className="h-6 w-6 text-black-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Auto Description Generator
                      </Dialog.Title>
                      <div className="mt-2">
                        Would you like to auto-generate description?
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-x-3">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setAutoDescriptorQuestionModal(false)
                        setAutoDescriptorModal(true)
                        mutation.mutate({
                          image: formData.image,
                        })
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setAutoDescriptorQuestionModal(false)
                      }}
                    >
                      Skip, I will fill the description manually
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={autoDescriptorModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            console.log('here')
            // setAutoDescriptorModal(false)
          }}
        >
          <div className="fixed inset-0 overlay" />
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
                <Dialog.Panel className="border-2 border-black-600 relative transform overflow-hidden rounded-lg bg-white px-10 py-5 text-left shadow-xl transition-all  max-w-lg ">
                  <div className="flex justify-center">
                    <div className="mt-3 text-center ml-4 ">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Description generating in progress
                      </Dialog.Title>
                      <div className="mt-2">Please wait one moment...</div>
                      <ScaleLoader
                        color="#8bf7f2"
                        loading={autoDescriptorModal}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default WithAuth(CreateProduct)
