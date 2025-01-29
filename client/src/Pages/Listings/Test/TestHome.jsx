import React, { useState } from 'react'
import UserList from './UserList'
import ChatWindow from './ChatWindow'

const staticUsers = [
  { id: '1', name: 'Alice Johnson', avatar: '/placeholder.svg?height=40&width=40&text=AJ', lastMessage: 'Hey, how are you?', unread: 2 },
  { id: '2', name: 'Bob Smith', avatar: '/placeholder.svg?height=40&width=40&text=BS', lastMessage: 'Can we reschedule?', unread: 0 },
  { id: '3', name: 'Carol Williams', avatar: '/placeholder.svg?height=40&width=40&text=CW', lastMessage: 'The place was great!', unread: 1 },
  { id: '4', name: 'David Brown', avatar: '/placeholder.svg?height=40&width=40&text=DB', lastMessage: 'Thanks for the quick response', unread: 0 },
]

const staticMessages = [
  { id: '1', senderId: '1', text: 'Hey, how are you?', timestamp: '2023-06-20T10:30:00Z' },
  { id: '2', senderId: "currentUser', text: 'I'm doing well, thanks! How about you?', timestamp: '2023-06-20T10:32:00Z" },
  { id: '3', senderId: '1', text: 'Great! I wanted to ask about the apartment.', timestamp: '2023-06-20T10:33:00Z' },
  { id: '4', senderId: 'currentUser', text: 'Sure, what would you like to know?', timestamp: '2023-06-20T10:35:00Z' },
]

export default function ChatContainer() {
  const [users, setUsers] = useState(staticUsers)
  const [selectedUser, setSelectedUser] = useState(users[0])
  const [messages, setMessages] = useState(staticMessages)

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    // In a real app, you'd fetch messages for the selected user here
  }

  const handleSendMessage = (message) => {
    const newMessage = {
      id: String(messages.length + 1),
      senderId: 'currentUser',
      text: message,
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, newMessage])

    // Update last message in user list
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? { ...user, lastMessage: message } : user
    )
    setUsers(updatedUsers)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <UserList users={users} selectedUser={selectedUser} onSelectUser={handleUserSelect} />
      <ChatWindow user={selectedUser} messages={messages} onSendMessage={handleSendMessage} />
    </div>
  )
}