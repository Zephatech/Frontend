'use client'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { create } from 'zustand'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../_utils/api/auth'
import { useRouter } from 'next/navigation'

export default function MessagePage() {
  const router = useRouter()
  const {
    data: authData,
    isLoading: authIsLoading,
    isFetching: authIsFetching,
  } = useAuth()
  const userId = authData?.userId
  useEffect(() => {
    console.log(authIsLoading, authIsFetching, userId)
    if (!authIsLoading && !userId) {
      router.replace('/login?unauthenticated')
    }
  }, [authIsLoading])

  return (
    <>
      <div className="flex h-full overflow-hidden bg-gray-50 rounded-lg">
        <Sidebar />
        <MessageContainer />
      </div>
    </>
  )
}

const Sidebar = () => {
  const { loading, conversations } = useGetConversations()

  console.log(conversations)

  return (
    <div className="border-r border-bg-gray-300 p-4 flex flex-col flex-grow ">
      <div className="py-2 flex flex-col overflow-auto">
        {conversations.map((conversation, idx) => {
          console.log(conversation)
          return (
            <Conversation
              key={conversation.id}
              conversation={conversation}
              lastIdx={idx === conversations.length - 1}
            />
          )
        })}
        {loading ? (
          <span className="loading loading-spinner mx-auto"></span>
        ) : null}
      </div>
    </div>
  )
}

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation()
  const isSelected = selectedConversation?._id === conversation._id

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-gray-200 rounded p-2 py-1 cursor-pointer ${
          isSelected ? 'bg-gray-200' : ''
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="avatar w-10 h-10 rounded-ful">
          <UserCircleIcon className="h-10 w-10" />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p>
              {conversation.users[0].firstName +
                ' ' +
                conversation.users[0].lastName}
            </p>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  )
}

const useGetConversations = () => {
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState([])

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

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}))

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation()

  useEffect(() => {
    // cleanup function (unmounts)
    return () => setSelectedConversation(null)
  }, [setSelectedConversation])

  return (
    <div className="flex flex-col flex-grow" style={{ flexGrow: 3 }}>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="px-4 py-2 mb-2 shadow-md p-6 border-b-1 border-gray-200">
            <span className="label-text">To:</span>{' '}
            <span className="text-gray-900">
              {selectedConversation.fullName}
            </span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  )
}

const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl font-semibold flex flex-col items-center gap-2">
        <p>Welcome</p>
        <p>Select a chat to start messaging</p>
        {/* <TiMessages className='text-3xl md:text-6xl text-center' /> */}
      </div>
    </div>
  )
}

const useSendMessage = () => {
  const [loading, setLoading] = useState(false)
  const { messages, setMessages, selectedConversation } = useConversation()

  const sendMessage = async (message) => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3001/message/send/${selectedConversation.id}`,
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

      setMessages([...messages, data])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading }
}

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const { loading, sendMessage } = useSendMessage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message) return
    await sendMessage(message)
    setMessage('')
  }

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5  bg-gray-200 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {loading ? <div className="loading loading-spinner"></div> : 'Send'}
        </button>
      </div>
    </form>
  )
}

const useGetMessages = () => {
  const [loading, setLoading] = useState(false)
  const { messages, setMessages, selectedConversation } = useConversation()

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true)
      try {
        const data = await fetch(
          `http://localhost:3001/message/${selectedConversation?.id}`,
          {
            credentials: 'include',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        ).then((res) => res.json())

        console.log(data)
        const transformedData = data.map((message) => {
          return {
            _id: message.id,
            message: message.content,
            senderId: message.sender.id,
            createdAt: message.timestamp,
          }
        })

        console.log(transformedData)

        setMessages(transformedData)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (selectedConversation?.id) getMessages()
  }, [selectedConversation?.id, setMessages])

  return { messages, loading }
}

const Messages = () => {
  let { messages, loading } = useGetMessages()
  const lastMessageRef = useRef()

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [messages])

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  )
}

export function extractTime(dateString) {
  const date = new Date(dateString)
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  return `${hours}:${minutes}`
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
  return number.toString().padStart(2, '0')
}

const Message = ({ message }) => {
  // const { authUser } = useAuthContext();
  const authUser = { _id: 2 }
  const { selectedConversation } = useConversation()
  const fromMe = message.senderId === authUser._id
  const formattedTime = extractTime(message.createdAt)
  const chatClassName = fromMe ? 'chat-end' : 'chat-start'
  const bubbleBgColor = fromMe ? 'bg-blue-500' : ''

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full"></div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  )
}

const MessageSkeleton = () => {
  return (
    <>
      <div className="flex gap-3 items-center">
        <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-1">
          <div className="skeleton h-4 w-40"></div>
          <div className="skeleton h-4 w-40"></div>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-end">
        <div className="flex flex-col gap-1">
          <div className="skeleton h-4 w-40"></div>
        </div>
        <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
      </div>
    </>
  )
}
