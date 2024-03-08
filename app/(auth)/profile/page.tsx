'use client'
import { useState, useEffect, ChangeEvent } from 'react'
<<<<<<< HEAD
import withAuth from '../../components/withAuth'
import useAuthStore from '@/app/stores/authStore'

interface UserProfile {
  firstName?: string
  lastName?: string
  phone?: string
  facebook?: string
  bio?: string
}

function Profile() {
  const [editMode, setEditMode] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    phone: '',
    facebook: '',
    bio: '',
  })
  const { setName } = useAuthStore()
  useEffect(() => {
    // Fetch user profile data based on userId
    const fetchUserProfile = async () => {
      try {
        // Replace the following line with your API call to get user profile data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/profile/getProfile`,
          { credentials: 'include' }
        )
        const data = await response.json()

        setUserProfile({
          firstName: data?.firstName || '',
          lastName: data?.lastName || '',
          phone: data?.phoneNumber || '',
          facebook: data?.facebookProfile || '',
          bio: data?.bio || '',
        })
        setFormData({
          firstName: data?.firstName || '',
          lastName: data?.lastName || '',
          phone: data?.phoneNumber || '',
          facebook: data?.facebookProfile || '',
          bio: data?.bio || '',
        })
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    fetchUserProfile()
  }, [])

  const handleEditClick = () => {
    setEditMode(true)
  }

  const handleCancelClick = () => {
    setEditMode(false)
    setFormData({
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      phone: userProfile?.phone || '',
      facebook: userProfile?.facebook || '',
      bio: userProfile?.bio || '',
    })
  }

  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/profile/updateProfile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include',
        }
      )

      if (response.ok) {
        setUserProfile({
          ...userProfile,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          facebook: formData.facebook,
          bio: formData.bio,
        })
        formData.firstName && setName(formData.firstName)
        setEditMode(false)
      } else {
        console.error('Failed to update user profile')
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <div className="mx-auto max-w-8xl px-6 py-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">My Profile</h1>
        <div className="space-y-4">
          {/* First Name */}
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700">First Name:</label>
            {editMode ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="ml-2 flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="ml-2 text-sm text-gray-600">{userProfile?.firstName}</p>
            )}
          </div>
  
          {/* Last Name */}
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700">Last Name:</label>
            {editMode ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="ml-2 flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="ml-2 text-sm text-gray-600">{userProfile?.lastName}</p>
            )}
          </div>
  
          {/* Phone */}
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700">Phone:</label>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="ml-2 flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <p className="ml-2 text-sm text-gray-600">{userProfile?.phone}</p>
            )}
          </div>
  
          {/* Facebook */}
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700">Facebook:</label>
            {editMode ? (
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="ml-2 flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <a
                href={userProfile?.facebook}
                className="ml-2 text-sm text-indigo-600 hover:text-indigo-500"
              >
                {userProfile?.facebook}
              </a>
            )}
          </div>

          {/* Bio */}
          <div className="flex flex-col mt-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio:</label>
            {editMode ? (
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="form-textarea mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="A short bio..."
              />
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-line">{userProfile?.bio}</p>
            )}
          </div>
  
          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            {editMode ? (
              <>
                <button
                  onClick={handleCancelClick}
                  className="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClick}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
  
=======

import { BACKEND_URL } from '../../constants/backend'

interface UserProfile {
    firstName?: string
    lastName?: string
    phone?: string
    facebook?: string
}

export default function Profile() {
    const [editMode, setEditMode] = useState(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [formData, setFormData] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        phone: '',
        facebook: '',
    })

    useEffect(() => {
        // Fetch user profile data based on userId
        const fetchUserProfile = async () => {
            try {
                // Replace the following line with your API call to get user profile data
                const response = await fetch(
                    `${BACKEND_URL}/profile/getProfile`,
                    { credentials: 'include' }
                )
                const data = await response.json()

                setUserProfile({
                    firstName: data?.firstName || '',
                    lastName: data?.lastName || '',
                    phone: data?.phoneNumber || '',
                    facebook: data?.facebookProfile || '',
                })
                setFormData({
                    firstName: data?.firstName || '',
                    lastName: data?.lastName || '',
                    phone: data?.phoneNumber || '',
                    facebook: data?.facebookProfile || '',
                })
            } catch (error) {
                console.error('Error fetching user profile:', error)
            }
        }

        fetchUserProfile()
    }, [])

    const handleEditClick = () => {
        setEditMode(true)
    }

    const handleCancelClick = () => {
        setEditMode(false)
        setFormData({
            firstName: userProfile?.firstName || '',
            lastName: userProfile?.lastName || '',
            phone: userProfile?.phone || '',
            facebook: userProfile?.facebook || '',
        })
    }

    const handleSaveClick = async () => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/profile/updateProfile`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                }
            )

            if (response.ok) {
                setUserProfile({
                    ...userProfile,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    facebook: formData.facebook,
                })

                setEditMode(false)
            } else {
                console.error('Failed to update user profile')
            }
        } catch (error) {
            console.error('Error updating user profile:', error)
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    return (
        <>
            <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-xl font-semibold text-indigo-600">
                    My Profile
                </h1>
                <div className="mt-6 space-y-4">
                    {/* First Name */}
                    <div className="flex items-center">
                        <p className="text-sm font-medium leading-5 text-gray-900">
                            First Name:
                        </p>
                        {editMode ? (
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="ml-2 px-2 py-1 border rounded"
                            />
                        ) : (
                            <p className="ml-2 text-sm font-medium leading-5 text-gray-900">
                                {userProfile?.firstName}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="flex items-center">
                        <p className="text-sm font-medium leading-5 text-gray-900">
                            Last Name:
                        </p>
                        {editMode ? (
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="ml-2 px-2 py-1 border rounded"
                            />
                        ) : (
                            <p className="ml-2 text-sm font-medium leading-5 text-gray-900">
                                {userProfile?.lastName}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="flex items-center">
                        <p className="text-sm font-medium leading-5 text-gray-900">
                            Phone:
                        </p>
                        {editMode ? (
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="ml-2 px-2 py-1 border rounded"
                            />
                        ) : (
                            <p className="ml-2 text-sm font-medium leading-5 text-gray-900">
                                {userProfile?.phone}
                            </p>
                        )}
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center">
                        <p className="text-sm font-medium leading-5 text-gray-900">
                            Facebook:
                        </p>
                        {editMode ? (
                            <input
                                type="text"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleInputChange}
                                className="ml-2 px-2 py-1 border rounded"
                            />
                        ) : (
                            <a
                                href={userProfile?.facebook}
                                className="ml-2 text-sm font-medium leading-5 text-gray-900"
                            >
                                {userProfile?.facebook}
                            </a>
                        )}
                    </div>

                    {/* Edit and Save buttons */}
                    <div>
                        {editMode ? (
                            <>
                                <div className="mt-4 space-x-2">
                                    <button
                                        onClick={handleSaveClick}
                                        className="mt-3 primary-btn"
                                    >
                                        Save
                                    </button>
                                </div>
                                <div className="mt-4 space-x-2">
                                    <button
                                        onClick={handleCancelClick}
                                        className="mt-3 primary-btn"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="primary-btn mt-4"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
>>>>>>> b004859 (Initialize for deployment)
}

export default withAuth(Profile)
