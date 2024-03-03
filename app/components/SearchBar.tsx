'use client'
import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchOnLink = useSearchParams().get('search')

  const [searchKey, setSearchKey] = useState('')

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    router.replace(`/?search=${searchKey}`)
  }

  const handleChange = (event: { target: { value: any } }) => {
    setSearchKey(event.target.value)
  }

  useEffect(() => {
    if (searchOnLink === null) {
      setSearchKey('')
    } else {
      setSearchKey(searchOnLink)
    }
  }, [searchOnLink, pathname]) // Trigger when router path changes

  return (
    <form className="relative flex flex-1" onSubmit={handleSubmit}>
      <label htmlFor="search-field" className="sr-only">
        {' '}
        Search{' '}
      </label>
      <MagnifyingGlassIcon
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
        aria-hidden="true"
      />
      <input
        id="search-field"
        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
        placeholder="Search..."
        type="search"
        name="search"
        value={searchKey}
        onChange={handleChange}
      />
    </form>
  )
}
