class ChatService {
  constructor(apiUrl = 'http://localhost:3001/api') {
    this.apiUrl = apiUrl;
    console.log('🔧 ChatService инициализирован');
    console.log(`📍 API URL: ${this.apiUrl}`);
    
    this.chats = [
      { id: 1, name: 'John Doe', message: 'How are you?', numbers: 5, src: 'Resources/images/back.png' },
      { id: 2, name: 'Jo Doe', message: 'Howe you?', numbers: 100, src: 'Resources/images/back.png' }
    ];

    this.messages = {
      1: [
        { id: 1, from: 'friend', name: 'John', text: 'Hello!', time: '13:55', avatar_id: 1 },
        { id: 2, from: 'me', text: 'Hi there!', time: '13:56' }
      ],
      2: [
        { id: 1, from: 'friend', name: 'Jo', text: 'Hey mate!', time: '14:00', avatar_id: 1 },
        { id: 2, from: 'me', text: 'Hello!', time: '14:01' },
        { id: 3, from: 'friend', name: 'Jo', text: 'How are you doing?', time: '14:02', avatar_id: 1 }
      ]
    };

    this.nextChatId = 3;
    this.nextMessageId = {};
    this.initMessageIds();
  }

  initMessageIds() {
    for (let chatId in this.messages) {
      const msgs = this.messages[chatId];
      this.nextMessageId[chatId] = msgs.length > 0 ? Math.max(...msgs.map(m => m.id)) + 1 : 1;
    }
  }

  // ========== API ЗАПРОСЫ ==========

  // Получить все чаты с сервера
  async fetchChats() {
    try {
      console.log('🔄 Загружаю чаты с сервера...');
      const response = await fetch(`${this.apiUrl}/chats`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Чаты загружены:', data.length);
        this.chats = data;
        return data;
      } else {
        console.log('⚠️ Сервер вернул ошибку, используются локальные данные');
        return this.chats;
      }
    } catch (error) {
      console.log('❌ Ошибка при получении чатов:', error.message);
      console.log('🔄 Используются локальные данные');
      return this.chats;
    }
  }

  // Получить сообщения для конкретного чата с сервера
  async fetchMessages(chatId) {
    try {
      console.log(`🔄 Загружаю сообщения чата #${chatId}...`);
      const response = await fetch(`${this.apiUrl}/chats/${chatId}/messages`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Сообщения загружены: ${data.length} шт.`);
        this.messages[chatId] = data;
        this.nextMessageId[chatId] = Math.max(...data.map(m => m.id)) + 1;
        return data;
      } else {
        console.log('⚠️ Сервер вернул ошибку, используются локальные данные');
        return this.getMessages(chatId);
      }
    } catch (error) {
      console.log('❌ Ошибка при получении сообщений:', error.message);
      console.log('🔄 Используются локальные данные');
      return this.getMessages(chatId);
    }
  }

  // Отправить новое сообщение на сервер
  async sendMessage(chatId, from, messageText, time, avatar_id = null) {
    const message = {
      from,
      text: messageText,
      time,
      avatar_id
    };

    try {
      console.log(`📤 Отправляю сообщение в чат #${chatId}...`);
      const response = await fetch(`${this.apiUrl}/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Сообщение отправлено');
        return this.addMessage(chatId, from, messageText, time, avatar_id);
      } else {
        console.log('⚠️ Ошибка сервера, сообщение добавлено локально');
        return this.addMessage(chatId, from, messageText, time, avatar_id);
      }
    } catch (error) {
      console.log('❌ Ошибка при отправке сообщения:', error.message);
      console.log('🔄 Сообщение добавлено локально');
      return this.addMessage(chatId, from, messageText, time, avatar_id);
    }
  }

  // Создать новый чат на сервере
  async createChat(name, message, numbers, src) {
    const chat = {
      name,
      message,
      numbers,
      src
    };

    try {
      console.log(`📤 Создаю новый чат "${name}"...`);
      const response = await fetch(`${this.apiUrl}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chat)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Чат создан');
        return this.addChat(name, message, numbers, src);
      } else {
        console.log('⚠️ Ошибка сервера, чат добавлен локально');
        return this.addChat(name, message, numbers, src);
      }
    } catch (error) {
      console.log('❌ Ошибка при создании чата:', error.message);
      console.log('🔄 Чат добавлен локально');
      return this.addChat(name, message, numbers, src);
    }
  }

  // Удалить чат на сервере
  async deleteChat(chatId) {
    try {
      const response = await fetch(`${this.apiUrl}/chats/${chatId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.chats = this.chats.filter(chat => chat.id !== chatId);
        delete this.messages[chatId];
        delete this.nextMessageId[chatId];
      }
    } catch (error) {
      console.log('Ошибка при удалении чата:', error);
    }
  }

  // Удалить сообщение на сервере
  async deleteMessage(chatId, messageId) {
    try {
      const response = await fetch(`${this.apiUrl}/chats/${chatId}/messages/${messageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (this.messages[chatId]) {
          this.messages[chatId] = this.messages[chatId].filter(msg => msg.id !== messageId);
        }
      }
    } catch (error) {
      console.log('Ошибка при удалении сообщения:', error);
    }
  }

  // ========== ЛОКАЛЬНЫЕ МЕТОДЫ ==========

  // Получить все чаты (локально)
  getChats() {
    return this.chats;
  }

  // Получить сообщения для конкретного чата (локально)
  getMessages(chatId) {
    return this.messages[chatId] || [];
  }

  // Добавить новый чат (локально)
  addChat(name, message, numbers, src) {
    const displayNumbers = numbers > 99 ? '99+' : numbers;
    
    const newChat = {
      id: this.nextChatId,
      name,
      message,
      numbers: displayNumbers,
      src
    };

    this.chats.push(newChat);
    this.messages[this.nextChatId] = [];
    this.nextMessageId[this.nextChatId] = 1;
    this.nextChatId++;

    return newChat;
  }

  // Добавить новое сообщение в чат (локально)
  addMessage(chatId, from, messageText, time, avatar_id = null) {
    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
      this.nextMessageId[chatId] = 1;
    }

    const formattedText = messageText.replace(/\n/g, '<br/>');

    const newMessage = {
      id: this.nextMessageId[chatId],
      from,
      name: from === 'me' ? 'You' : from,
      text: formattedText,
      time,
      avatar_id
    };

    this.messages[chatId].unshift(newMessage);
    this.nextMessageId[chatId]++;

    return newMessage;
  }

  // Удалить чат (локально)
  removeChat(chatId) {
    this.chats = this.chats.filter(chat => chat.id !== chatId);
    delete this.messages[chatId];
    delete this.nextMessageId[chatId];
  }

  // Удалить сообщение (локально)
  removeMessage(chatId, messageId) {
    if (this.messages[chatId]) {
      this.messages[chatId] = this.messages[chatId].filter(msg => msg.id !== messageId);
    }
  }

  // Получить чат по ID (локально)
  getChatById(chatId) {
    return this.chats.find(chat => chat.id === chatId);
  }

  // Обновить сообщение чата (локально)
  updateChatMessage(chatId, newMessage) {
    const chat = this.getChatById(chatId);
    if (chat) {
      chat.message = newMessage;
    }
  }
}

export default ChatService;
