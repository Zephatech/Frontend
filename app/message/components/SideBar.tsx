import React, { useEffect, useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import useConversation from '../../stores/convnStore';
import { toast } from 'react-toastify';

// interfaces
interface Conversation {
	id: number;	// Assuming this is the ID of the conversation
	userId: number; 
	firstName: string;
	lastName: string;	
}

interface ConversationProps {
    conversation: Conversation
    lastIdx: boolean;
}

// hooks
const useGetConversations = () => {
    const [loading, setLoading] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>([])

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true)
            try {
                const data = await fetch('http://localhost:3001/conversation', {
                    credentials: 'include',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((res) => res.json())

                if (!Array.isArray(data)) {
                    throw new Error(data.message)
                }

                setConversations(data) // Explicitly specify the type as any[]
            } catch (error: any) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        getConversations()
    }, [])

    return { loading, conversations }
}

// components
const Conversation = ({ conversation, lastIdx }: ConversationProps) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const isSelected = selectedConversation?.id === conversation.id;

    return (
        <>
            <div
                className={`flex gap-2 items-center hover:bg-gray-200 rounded p-2 py-1 cursor-pointer ${isSelected ? "bg-gray-200" : ""}`}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className='avatar w-10 h-10 rounded-ful'>
                    <UserCircleIcon className='h-10 w-10' />
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between'>
                        <p>{conversation.firstName + " " + conversation.lastName}</p>
                    </div>
                </div>
            </div>

            {!lastIdx && <div className='divider my-0 py-0 h-1' />}
        </>
    );
};

// main component
const SideBar = () => {
    const { loading, conversations } = useGetConversations();
    return (
        <div className='border-r border-bg-gray-300 p-4 flex flex-col flex-grow '>
            <div className='py-2 flex flex-col overflow-auto'>
                {conversations.map((conversation, idx) => {
                    return (
                        <Conversation
                            key={conversation.id}
                            conversation={conversation}
                            lastIdx={idx === conversations.length - 1}
                        />
                    )
                })}
                {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
            </div>
        </div>
    );
};

export default SideBar;