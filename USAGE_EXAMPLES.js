// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ChatService

// ============ 1. БАЗОВАЯ ИНИЦИАЛИЗАЦИЯ ============

import ChatService from './services/ChatService';

// Создать сервис (по умолчанию подключается к http://localhost:3000/api)
const chatService = new ChatService();

// Или с кастомным URL
const chatServiceCustom = new ChatService('http://my-api.com/api');


// ============ 2. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ============

async function loadData() {
  // Загрузить все чаты
  const chats = await chatService.fetchChats();
  console.log('Чаты:', chats);
  
  // Загрузить сообщения конкретного чата
  const messages = await chatService.fetchMessages(1);
  console.log('Сообщения:', messages);
}


// ============ 3. ОТПРАВКА СООБЩЕНИЯ НА СЕРВЕР ============

async function sendMessageToServer() {
  const newMessage = await chatService.sendMessage(
    1,           // chatId
    'me',        // from
    'Hello!',    // messageText
    '14:30',     // time
    null         // avatar_id (опционально)
  );
  
  console.log('Сообщение отправлено:', newMessage);
}


// ============ 4. СОЗДАНИЕ НОВОГО ЧАТА НА СЕРВЕРЕ ============

async function createNewChat() {
  const newChat = await chatService.createChat(
    'Jane Smith',                      // name
    'Hi there!',                       // message
    1,                                 // numbers
    'Resources/images/back.png'        // src
  );
  
  console.log('Чат создан:', newChat);
}


// ============ 5. УДАЛЕНИЕ ЧАТА ============

async function removeChatFromServer() {
  await chatService.deleteChat(2);
  console.log('Чат удалён');
}


// ============ 6. УДАЛЕНИЕ СООБЩЕНИЯ ============

async function removeMessageFromServer() {
  await chatService.deleteMessage(1, 3);
  console.log('Сообщение удалено');
}


// ============ 7. ЛОКАЛЬНЫЕ ОПЕРАЦИИ (FALLBACK) ============

// Получить чаты локально (без сервера)
const localChats = chatService.getChats();

// Получить сообщения локально
const localMessages = chatService.getMessages(1);

// Добавить сообщение локально
chatService.addMessage(1, 'friend', 'Hey!', '14:00', 1);

// Добавить чат локально
chatService.addChat('John', 'How are you?', 5, 'image.png');

// Найти чат по ID
const chat = chatService.getChatById(1);

// Обновить текст сообщения чата
chatService.updateChatMessage(1, 'New message');


// ============ 8. ИНТЕГРАЦИЯ С REACT (ПРИМЕР) ============

import { useState, useEffect } from 'react';

function ChatExample() {
  const [chatService] = useState(() => new ChatService());
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузить данные при монтировании
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const chats = await chatService.fetchChats();
      setChats(chats);
      
      if (chats.length > 0) {
        const messages = await chatService.fetchMessages(chats[0].id);
        setMessages(messages);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(text) {
    if (chats.length === 0) return;
    
    await chatService.sendMessage(
      chats[0].id,
      'me',
      text,
      new Date().toLocaleTimeString(),
      null
    );
    
    // Перезагрузить сообщения
    const updated = await chatService.fetchMessages(chats[0].id);
    setMessages(updated);
  }

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Чаты: {chats.length}</h1>
      <h2>Сообщения: {messages.length}</h2>
      <button onClick={() => handleSendMessage('Test message')}>
        Отправить сообщение
      </button>
    </div>
  );
}


// ============ 9. ОБРАБОТКА ОШИБОК ============

async function handleErrors() {
  try {
    // Если сервер недоступен, вернёт локальные данные
    const chats = await chatService.fetchChats();
    console.log('Данные:', chats);
  } catch (error) {
    // ChatService НЕ выбросит ошибку, но выведет в консоль
    console.log('Сервис работает в fallback режиме');
  }
}


// ============ 10. POLLING - ОБНОВЛЕНИЕ КАЖДЫЕ N СЕКУНД ============

function startPolling(chatId, intervalMs = 5000) {
  const poll = async () => {
    const messages = await chatService.fetchMessages(chatId);
    console.log('Новые сообщения:', messages);
  };

  // Загрузить сразу
  poll();

  // Затем каждые N секунд
  return setInterval(poll, intervalMs);
}

// Использование:
// const pollingInterval = startPolling(1, 5000);
// clearInterval(pollingInterval); // Остановить polling


// ============ СВЕДЕНИЕ ВМЕСТЕ ============

async function completeExample() {
  // 1. Создать сервис
  const service = new ChatService('http://localhost:3000/api');

  // 2. Загрузить чаты
  const chats = await service.fetchChats();
  console.log('Загруженные чаты:', chats);

  // 3. Выбрать первый чат и загрузить его сообщения
  if (chats.length > 0) {
    const chatId = chats[0].id;
    const messages = await service.fetchMessages(chatId);
    console.log('Сообщения чата №' + chatId + ':', messages);

    // 4. Отправить новое сообщение
    await service.sendMessage(chatId, 'me', 'Hello!', '14:00');
    console.log('Сообщение отправлено');

    // 5. Загрузить обновлённые сообщения
    const updated = await service.fetchMessages(chatId);
    console.log('Обновлённые сообщения:', updated);
  }

  // 6. Создать новый чат
  const newChat = await service.createChat('Bob', 'Hi!', 1, 'avatar.png');
  console.log('Новый чат:', newChat);

  // 7. Удалить чат
  // await service.deleteChat(newChat.id);
}

// completeExample();
