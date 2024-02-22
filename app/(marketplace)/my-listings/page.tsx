// MyListings.tsx
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/_utils/api/auth';
import { useRouter } from 'next/navigation';

const getMyListings = async () => {
  const response = await fetch(`http://localhost:3001/products/myListings`, { credentials: 'include' });
  const data = await response.json();
  return data;
};

type Listing = {
  id: number;
  name: string;
  category: string;
  image: string;
};

const MyListings = () => {
  const [sellListings, setSellListings] = useState<Listing[]>([]); 
  const { data: sellListingsData, isLoading, error } = useQuery(['sellListings'], () => getMyListings());
  const { data, isLoading: authLoading, isFetching: authFetching } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if the user is not authenticated, redirect to the login page
    console.log(authLoading, authFetching, !data?.userId, isLoading, sellListingsData)
    if (!data?.userId) {
      router.replace('/login?unauthenticated');
    } else if (!isLoading){
      console.log(sellListingsData)
      setSellListings(sellListingsData);
    }
  }, [authLoading, authFetching, data, isLoading]);

  useEffect(() => {
    // You can perform additional actions here if needed
  }, [sellListings]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading listings</div>;
  }

  const handleDelete = (listingId: number) => {
    // Implement your delete logic here
    console.log(`Deleting listing with ID: ${listingId}`);
  };

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full">
            <thead className="bg-white">
              <tr>
                <th className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Image</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="relative py-2 px-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sellListings.map((listing) => (
                <tr key={listing.id} className="border-t border-gray-200">
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm sm:pl-0">
                    <img
                      className="h-11 w-11 rounded-full"
                      src={listing.image === '' ? 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg' : `/images/${listing.image}`}
                      alt=""
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">
                    <div className="font-medium text-blue-700 underline">
                      <Link href={`/products/${listing.id}`}>{listing.name}</Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">{listing.category}</td>
                  <td className="flex flex-col px-3 py-2 align-center justify-center h-full w-full">
                    {/* You can replace the buttons below with your actual actions */}
                    <button className="px-2 py-1 bg-blue-500 text-white rounded-md mr-2" onClick={() => handleDelete(listing.id)}>
                      Delete
                    </button>
                    <Link href={`/update-product?id=${listing.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyListings;