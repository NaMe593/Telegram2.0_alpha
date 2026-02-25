import { useState } from 'react'
import './App.css'
import Menu from './Components/messageMenu'
import Box from './Components/box'

function App() {
  const [chats, setChats] = useState([
    { id: 1, name: 'John Doe', message: 'How are you?', numbers: 5, src: 'Resources/images/back.png' },
    { id: 2, name: 'Jo Doe', message: 'Howe you?', numbers: 100, src: 'Resources/images/back.png' }
  ])
  
  const [selectedChatId, setSelectedChatId] = useState(1)
  
  // Сообщения по чатам
  const [chatMessages, setChatMessages] = useState({
    1: [
      { id: 1, from: 'friend', name: 'John', text: 'Hello!', time: '13:55', avatar_id: 1 },
      { id: 2, from: 'me', text: 'Hi there!', time: '13:56' }
    ],
    2: [
      { id: 1, from: 'friend', name: 'Jo', text: 'Hey mate!', time: '14:00', avatar_id: 1 },
      { id: 2, from: 'me', text: 'Hello!', time: '14:01' },
      { id: 3, from: 'friend', name: 'Jo', text: 'How are you doing?', time: '14:02', avatar_id: 1 }
    ]
  })
  
  const currentMessages = chatMessages[selectedChatId] || []
  
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const [selectedMessage, setSelectedMessage] = useState(null)

  // Функция для отображения меню при клике на сообщение
  function handleMessageClick(e, messageId) {
    if (e.button === 0) {
      e.stopPropagation();
      
      const menuWidth = 250;
      const menuHeight = 220;
      
      let x = e.clientX;
      let y = e.clientY;
      
      // Проверяем, выходит ли меню за правую границу
      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
      }
      
      // Проверяем, выходит ли меню за нижнюю границу
      if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 10;
      }
      
      // Убедиться, что позиция не отрицательна
      x = Math.max(10, x);
      y = Math.max(10, y);
      
      setMenuPos({ x, y })
      setSelectedMessage(messageId)
      setMenuVisible(true)
    }
  }

  // Функция для скрытия меню
  function handleHideMenu() {
    setMenuVisible(false)
  }

  // Добавить новое сообщение в текущий чат
  function addMessage(from, messageText, time, avatar_id = null) {
    const formattedText = messageText.replace(/\n/g, '<br/>')
    
    const newMessage = {
      id: currentMessages.length + 1,
      from,
      name: from === 'me' ? 'You' : from,
      text: formattedText,
      time,
      avatar_id
    }
    
    setChatMessages({
      ...chatMessages,
      [selectedChatId]: [newMessage, ...currentMessages]
    })
  }
  
  // Переключиться на другой чат
  function handleSelectChat(chatId) {
    setSelectedChatId(chatId)
  }

  // Добавить новый чат
  function addChat(message, name, numbers, src) {
    const displayNumbers = numbers > 99 ? '99+' : numbers
    
    const newChat = {
      id: chats.length + 1,
      name,
      message,
      numbers: displayNumbers,
      src
    }
    
    setChats([...chats, newChat])
  }

  // Отобразить/скрыть детали сообщения
  function toggleDetails() {
    // Это управляется в компоненте Menu через состояние
  }

  return (
    <>
      <div onClick={handleHideMenu}>
        <Box 
          messages={currentMessages} 
          chats={chats} 
          selectedChatId={selectedChatId}
          onMessageClick={handleMessageClick}
          onSelectChat={handleSelectChat}
        />
      </div>
      
      {menuVisible && (
        <Menu 
          id={selectedMessage} 
          date={new Date().toLocaleString()} 
          hidden={!menuVisible}
          style={{
            position: 'fixed',
            top: menuPos.y + 'px',
            left: menuPos.x + 'px',
            zIndex: 1000
          }}
        />
      )}
    </>
  )
}

export default App
