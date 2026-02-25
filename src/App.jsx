import { useState, useEffect } from 'react'
import './App.css'
import Menu from './Components/messageMenu'
import Box from './Components/box'
import ChatService from './services/ChatService'

function App() {
  const [chatService] = useState(() => new ChatService())
  const [chats, setChats] = useState([])
  const [selectedChatId, setSelectedChatId] = useState(1)
  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const [selectedMessage, setSelectedMessage] = useState(null)

  // Загрузить данные при монтировании
  useEffect(() => {
    loadInitialData();
  }, []);

  // Загрузить всё при смене чата
  useEffect(() => {
    loadChatMessages(selectedChatId);
  }, [selectedChatId]);

  // Загрузить чаты при старте приложения
  async function loadInitialData() {
    try {
      setLoading(true);
      const chats = await chatService.fetchChats();
      setChats(chats);
      
      if (chats.length > 0) {
        setSelectedChatId(chats[0].id);
        const messages = await chatService.fetchMessages(chats[0].id);
        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      // Используем локальные данные
      setChats(chatService.getChats());
      setChatMessages(chatService.getMessages(selectedChatId));
    } finally {
      setLoading(false);
    }
  }

  // Загрузить сообщения конкретного чата
  async function loadChatMessages(chatId) {
    try {
      const messages = await chatService.fetchMessages(chatId);
      setChatMessages(messages);
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
      setChatMessages(chatService.getMessages(chatId));
    }
  }

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

  // Добавить новое сообщение в текущий чат через ChatService
  async function addMessage(from, messageText, time, avatar_id = null) {
    try {
      await chatService.sendMessage(selectedChatId, from, messageText, time, avatar_id);
      // Обновляем сообщения текущего чата
      setChatMessages([...chatService.getMessages(selectedChatId)]);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      chatService.addMessage(selectedChatId, from, messageText, time, avatar_id);
      setChatMessages([...chatService.getMessages(selectedChatId)]);
    }
  }
  
  // Переключиться на другой чат
  async function handleSelectChat(chatId) {
    setSelectedChatId(chatId);
  }

  // Добавить новый чат через ChatService
  async function addChat(message, name, numbers, src) {
    try {
      await chatService.createChat(name, message, numbers, src);
      setChats([...chatService.getChats()]);
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      chatService.addChat(name, message, numbers, src);
      setChats([...chatService.getChats()]);
    }
  }

  return (
    <>
      <div onClick={handleHideMenu}>
        {loading && <div style={{padding: '10px', textAlign: 'center', backgroundColor: '#f0f0f0'}}>Загрузка данных...</div>}
        
        <Box 
          messages={chatMessages} 
          chats={chats} 
          selectedChatId={selectedChatId}
          onMessageClick={handleMessageClick}
          onSelectChat={handleSelectChat}
        />
        
        <button 
          onClick={loadInitialData}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 999
          }}
        >
          🔄 Обновить
        </button>
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
