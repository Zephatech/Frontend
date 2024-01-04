'use client'
import { useState, useEffect, ChangeEvent} from 'react'


interface UserProfile {
    firstName?: string;
    lastName?: string;
    phone?: string;
    facebook?: string;
    // Add other fields as needed
}

export default function Profile() {
    const [editMode, setEditMode] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        phone: '',
        facebook: '',
    });

    
    useEffect(() => {
        // Fetch user profile data based on userId
        const fetchUserProfile = async () => {
            try {
                // Replace the following line with your API call to get user profile data
                const response = await fetch(`http://localhost:3001/profile/getUserProfile`, {credentials: 'include'});
                const data = await response.json();

                console.log(data)
                console.log(data?.phoneNumber)
                setUserProfile({
                    firstName: data?.firstName || '',
                    lastName: data?.lastName || '',
                    phone: data?.phoneNumber || '',
                    facebook: data?.facebookProfile || '',
                });
                setFormData({
                    firstName: data?.firstName || '',
                    lastName: data?.lastName || '',
                    phone: data?.phoneNumber || '',
                    facebook: data?.facebookProfile || '',
                });
            } catch (error) {
                console.error('Error fetching user profile:', error)
            }
        }

        fetchUserProfile()
    },[])

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
        });
    }

    const handleSaveClick = async () => {
        try {

            const response = await fetch(`http://localhost:3001/profile/updateProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.ok) {
                setUserProfile({
                    ...userProfile,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    facebook: formData.facebook
                });

                setEditMode(false);
            } else {
                console.error('Failed to update user profile');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

         
    return (
        <>
            <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-xl font-semibold text-indigo-600">My Profile</h1>
                <div className="mt-6">
                <p className="text-sm font-medium leading-5 text-gray-900">
                    First Name: {editMode ? (
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    ) : userProfile?.firstName}
                </p>

                <p className="text-sm font-medium leading-5 text-gray-900">
                    Last Name: {editMode ? (
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    ) : userProfile?.lastName}

                </p>

                <p className="text-sm font-medium leading-5 text-gray-900">
                    Phone: {editMode ? (
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    ) : userProfile?.phone}
                </p>

                <p className="text-sm font-medium leading-5 text-gray-900">
                    Facebook: {editMode ? (
                        <input
                            type="text"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleInputChange}
                        />
                    ) : userProfile?.facebook}
                </p>


                {editMode ? (
                    <div className="mt-4">
                        <button
                            onClick={handleSaveClick}
                            className="primary-btn mr-2"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelClick}
                            className="secondary-btn mr-2"
                        >
                            Cancel
                        </button>
                    </div>
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
        </>
    )
}
