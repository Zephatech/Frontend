'use client'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function CreateProduct() {
    const [isLoading, setIsLoading] = useState(true)
    const [previewImage, setPreviewImage] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: null,
    })

    useEffect(() => {
        fetch('http://localhost:3001/auth/getCurrentUserId', {
            cache: 'no-cache',
            credentials: 'include',
        }).then((res) => {
            if (res.status == 401) {
                window.location.href = '/login?unauthenticated'
            } else {
                setIsLoading(false)
            }
        })
    }, [])
    const { name, description, price, category, image } = formData

    const onChange = (e: any) =>
        setFormData({ ...formData, [e.target.name]: e.target.value })

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
        const res = await fetch('http://localhost:3001/products', {
            method: 'POST',
            body: formDataToSend,
            credentials: 'include',
            cache: 'no-cache',
        })
        if (res.status == 200) {
            toast.success('Posted')
        } else {
            toast.warning('Something is wrong')
        }
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
        } else {
            toast.warning('File not supported')
            setPreviewImage(URL.createObjectURL(''))
            setFormData({ ...formData, image: null })
        }
    }
    if (isLoading) {
        return (
            <div role="status">
                <svg
                    aria-hidden="true"
                    className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }
    return (
        <form>
            <div className="space-y-12">
                <div className=" border-gray-900/10">
                    <h1 className="text-lg font-semibold leading-9 text-gray-900">
                        Sell Product
                    </h1>

                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Name
                            </label>
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    id="name"
                                    autoComplete="name"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    placeholder="e.g. 2023 Spring ECE 105 Textbook"
                                />
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={onChange}
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label
                                htmlFor="photo"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Photo
                            </label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    {previewImage ? (
                                        <>
                                            <div className="mt-6">
                                                <img
                                                    className="mt-6"
                                                    src={previewImage}
                                                    alt="Preview"
                                                />
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        image: null,
                                                    })
                                                }
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
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                        type="file"
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="pl-1">
                                                    or drag and drop
                                                </p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">
                                                PNG, JPEG up to 10MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label
                                htmlFor="price"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Price
                            </label>
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                    type="number"
                                    name="price"
                                    value={price}
                                    onChange={onChange}
                                    id="price"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Category
                            </label>
                            <div className="mt-2">
                                <select
                                    id="category"
                                    name="category"
                                    value={category}
                                    onChange={onChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                >
                                    <option>Textbook</option>
                                    <option>Living Supply</option>
                                    <option>School Supply</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Post
                </button>
            </div>
        </form>
    )
}
