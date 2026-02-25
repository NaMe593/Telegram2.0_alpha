# API Documentation

## Описание

ChatService теперь поддерживает работу с сервером через REST API. Сервис автоматически fallback на локальные данные, если сервер недоступен.

## Установка и запуск сервера

### 1. Установить зависимости:
```bash
npm install express cors
```

### 2. Запустить сервер:
```bash
node server.js
```

Сервер запустится на `http://localhost:3000`

## API Endpoints

### 1. Получить все чаты

**GET** `/api/chats`

**Ответ:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "message": "How are you?",
    "numbers": 5,
    "src": "Resources/images/back.png"
  }
]
```

---

### 2. Получить сообщения чата

**GET** `/api/chats/:chatId/messages`

**Ответ:**
```json
[
  {
    "id": 1,
    "from": "friend",
    "name": "John",
    "text": "Hello!",
    "time": "13:55",
    "avatar_id": 1
  }
]
```

---

### 3. Отправить новое сообщение

**POST** `/api/chats/:chatId/messages`

**Body:**
```json
{
  "from": "me",
  "text": "Hi there!",
  "time": "13:56",
  "avatar_id": 1
}
```

**Ответ (201):**
```json
{
  "id": 3,
  "from": "me",
  "name": "You",
  "text": "Hi there!",
  "time": "13:56",
  "avatar_id": 1
}
```

---

### 4. Создать новый чат

**POST** `/api/chats`

**Body:**
```json
{
  "name": "Jane Smith",
  "message": "Hello!",
  "numbers": 3,
  "src": "Resources/images/back.png"
}
```

**Ответ (201):**
```json
{
  "id": 3,
  "name": "Jane Smith",
  "message": "Hello!",
  "numbers": 3,
  "src": "Resources/images/back.png"
}
```

---

### 5. Удалить чат

**DELETE** `/api/chats/:chatId`

**Ответ (204):** No Content

---

### 6. Удалить сообщение

**DELETE** `/api/chats/:chatId/messages/:messageId`

**Ответ (204):** No Content

---

## Использование в коде

### Инициализация с кастомным URL:
```javascript
const chatService = new ChatService('http://my-server.com/api');
```

### Загрузить чаты:
```javascript
const chats = await chatService.fetchChats();
```

### Загрузить сообщения чата:
```javascript
const messages = await chatService.fetchMessages(chatId);
```

### Отправить сообщение:
```javascript
await chatService.sendMessage(chatId, 'me', 'Hello!', '14:00', null);
```

### Создать чат:
```javascript
await chatService.createChat('John Doe', 'Hey!', 5, 'image.png');
```

### Удалить чат:
```javascript
await chatService.deleteChat(chatId);
```

### Удалить сообщение:
```javascript
await chatService.deleteMessage(chatId, messageId);
```

## Fallback поведение

Если сервер недоступен:
- `fetchChats()` вернёт локальные чаты
- `fetchMessages()` вернёт локальные сообщения
- `sendMessage()` добавит сообщение локально
- `createChat()` добавит чат локально

Все операции работают без ошибок даже при отсутствии сервера!

## Ошибки

Все методы обрабатывают ошибки и выводят их в Console. Данные всегда обновляются либо с сервера, либо локально.
