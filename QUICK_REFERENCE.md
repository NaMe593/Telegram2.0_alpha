# Быстрая шпаргалка ChatService

## ⚡ Быстрый старт

### 1️⃣ Установить сервер
```bash
npm install express cors
node server.js
```

### 2️⃣ Импортировать в React
```javascript
import ChatService from './services/ChatService';

const chatService = new ChatService(); // http://localhost:3000/api
```

---

## 📡 API Методы (с сервером)

| Метод | Описание |
|-------|---------|
| `fetchChats()` | Загрузить все чаты |
| `fetchMessages(chatId)` | Загрузить сообщения чата |
| `sendMessage(chatId, from, text, time, avatarId)` | Отправить сообщение |
| `createChat(name, message, numbers, src)` | Создать чат |
| `deleteChat(chatId)` | Удалить чат |
| `deleteMessage(chatId, messageId)` | Удалить сообщение |

## 💾 Локальные методы (без сервера)

| Метод | Описание |
|-------|---------|
| `getChats()` | Получить чаты |
| `getMessages(chatId)` | Получить сообщения |
| `addMessage(chatId, from, text, time, avatarId)` | Добавить сообщение |
| `addChat(name, message, numbers, src)` | Добавить чат |
| `getChatById(chatId)` | Найти чат |

---

## 🔄 Примеры кода

### Загрузить чаты
```javascript
const chats = await chatService.fetchChats();
```

### Загрузить сообщения
```javascript
const messages = await chatService.fetchMessages(1);
```

### Отправить сообщение
```javascript
await chatService.sendMessage(1, 'me', 'Hello!', '14:00', null);
```

### Создать чат
```javascript
await chatService.createChat('John', 'Hey!', 5, 'image.png');
```

### Удалить
```javascript
await chatService.deleteChat(2);
await chatService.deleteMessage(1, 3);
```

---

## 📲 React Integration

```javascript
import { useState, useEffect } from 'react';
import ChatService from './services/ChatService';

function App() {
  const [service] = useState(() => new ChatService());
  const [chats, setChats] = useState([]);

  useEffect(() => {
    service.fetchChats().then(setChats);
  }, []);

  return <div>{chats.length} чатов</div>;
}
```

---

## 🛠️ Что происходит?

✅ **Если сервер работает:** Данные загружаются с сервера  
⚠️ **Если сервер недоступен:** Используются локальные данные  
🔄 **Все операции асинхронные:** Используйте async/await  

---

## 📁 Структура файлов

```
burgerGram/
├── src/
│   ├── services/
│   │   └── ChatService.js      ← Основной класс
│   └── App.jsx                  ← Использование
├── server.js                     ← Пример сервера
├── API_DOCS.md                   ← Полная документация
└── USAGE_EXAMPLES.js             ← Примеры кода
```

---

## 🚀 Команды

| Команда | Действие |
|---------|----------|
| `npm install express cors` | Установить зависимости |
| `node server.js` | Запустить сервер |
| `npm run dev` | Запустить React (dev режим) |

---

## 🐛 Частые ошибки

❌ **CORS Error?**  
✅ Убедитесь что сервер запущен на `http://localhost:3000`

❌ **Данные не обновляются?**  
✅ Используйте `fetchChats()` / `fetchMessages()` вместо `getChats()`

❌ **Async/await ошибки?**  
✅ Оберните вызов в `async function` или используйте `.then()`

---

## 💡 Советы

1. Всегда используйте `try/catch` для API вызовов
2. Используйте `loading` состояние для UI
3. Проверяйте консоль на ошибки
4. Сервис работает без интернета благодаря fallback

---

## 📞 API Endpoints

```
GET    /api/chats                          → Все чаты
GET    /api/chats/:id/messages             → Сообщения чата
POST   /api/chats/:id/messages             → Новое сообщение
POST   /api/chats                          → Новый чат
DELETE /api/chats/:id                      → Удалить чат
DELETE /api/chats/:id/messages/:msgId      → Удалить сообщение
```
