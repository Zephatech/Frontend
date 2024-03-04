import { create } from 'zustand'

interface Conversation {
	id: number;	// Assuming this is the ID of the conversation
	userId: number; 
	firstName: string;
	lastName: string;	
}

interface ConversationState {
    selectedConversation: Conversation | null;
    setSelectedConversation: (selectedConversation: Conversation) => void;
    messages: any[]; // Define proper type for messages
    setMessages: (messages: any[]) => void; // Define proper type for setMessages
}

const useConversation = create<ConversationState>((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation: Conversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
}));

export default useConversation;
