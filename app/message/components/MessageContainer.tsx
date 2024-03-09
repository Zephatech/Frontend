import React, { useEffect, useRef, useState } from 'react'
import useAuthStore from '../../stores/authStore'
import useConversation from '../../stores/convnStore'
import { toast } from 'react-toastify'

// Helper function
function _padZero(number: number) {
  return number.toString().padStart(2, '0')
}
export function _extractTime(dateString: string | number | Date) {
  const date = new Date(dateString)
  const hours = _padZero(date.getHours())
  const minutes = _padZero(date.getMinutes())
  return `${hours}:${minutes}`
}

// hooks
const useGetMessages = () => {
  const [loading, setLoading] = useState(false)
  const { messages, setMessages, selectedConversation } = useConversation()

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true)
      try {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/message/${selectedConversation?.id}`,
          {
            credentials: 'include',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        ).then((res) => res.json())

        setMessages(data)
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (selectedConversation?.id) {
      getMessages()
    }
  }, [selectedConversation?.id, setMessages])

  return { messages, loading }
}

const useSendMessage = () => {
  const [loading, setLoading] = useState(false)
  const { setMessages, selectedConversation } = useConversation()

  const sendMessage = async (message: string) => {
    if (!selectedConversation) {
      toast.error('Please select a conversation to send a message')
      return
    }

    console.log(selectedConversation)
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/message/send/${selectedConversation.userId}`,
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

      setMessages(data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, sendMessage }
}

// components
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

const Messages = () => {
  let { messages, loading } = useGetMessages()
  const lastMessageRef = useRef<HTMLDivElement>(null)

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
          <div key={message.id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  )
}

const Message = ({ message }: { message: any }) => {
  const { userId } = useAuthStore()
  const fromMe = message.sender.id === userId
  const formattedTime = _extractTime(message.timestamp)
  const chatClassName = fromMe ? 'chat-end' : 'chat-start'
  const bubbleBgColor = fromMe ? 'bg-blue-500' : ''

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full"></div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>
        {message.content}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  )
}

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const { loading, sendMessage } = useSendMessage()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
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
          className="border text-sm rounded-lg block w-full p-2.5  bg-gray-200 text-black"
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

// main component
const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation()

  return (
    <div className="flex flex-col flex-grow" style={{ flexGrow: 3 }}>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="px-4 py-2 mb-2 shadow-md p-6 border-b-1 border-gray-200">
            <span>
              To: {selectedConversation.firstName}{' '}
              {selectedConversation.lastName}
            </span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  )
}

export default MessageContainer
