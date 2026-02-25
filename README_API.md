# BurgerGram Chat Application

React приложение для обмена сообщениями с поддержкой REST API и fallback на локальное хранилище.

## 🎯 Основные возможности

✅ **Переключение между чатами** - Выберите чат из списка слева  
✅ **Отправка и получение сообщений** - Полидемо функционал обмена  
✅ **REST API** - Все данные могут загружаться с сервера  
✅ **Offline режим** - Работает даже без интернета  
✅ **Контекстное меню** - Клик правой кнопкой на сообщение  
✅ **Автоматическая подгонка** - Меню всегда видимо на экране  

## 🏗️ Архитектура

```
App.jsx (основной компонент)
├── ChatService (класс для работы с данными)
│   ├── API методы (fetch, sendMessage, createChat...)
│   └── Локальные методы (getChats, getMessages, addMessage...)
├── Box (основной макет)
│   ├── ChatList (список чатов)
│   ├── ChatView (просмотр сообщений)
│   └── MessageList (сообщения)
└── Menu (контекстное меню)
```

## 📦 Структура проекта

```
src/
├── App.jsx                 # Главный компонент
├── App.css                 # Стили
├── main.jsx                # Entry point
├── index.css               # Глобальные стили
├── Components/
│   ├── box.jsx            # Основной макет
│   └── messageMenu.jsx    # Контекстное меню
└── services/
    └── ChatService.js     # Сервис работы с данными

Корневые файлы:
├── server.js              # Пример Node.js сервера
├── API_DOCS.md           # Полная документация API
├── USAGE_EXAMPLES.js     # Примеры использования
├── QUICK_REFERENCE.md    # Быстрая шпаргалка
└── package.json          # Зависимости
```

## 🚀 Быстрый старт

### 1. Установка зависимостей React
```bash
npm install
```

### 2. Запуск сервера (опционально)
```bash
npm install express cors
node server.js
```

### 3. Запуск React приложения
```bash
npm run dev
```

Приложение откроется на `http://localhost:5173`

## 🔌 ChatService - Основной класс

### Инициализация
```javascript
import ChatService from './services/ChatService';

// С локальным сервером (по умолчанию)
const chatService = new ChatService();

// С кастомным URL
const chatService = new ChatService('http://api.example.com/api');
```

### Загрузка данных с сервера
```javascript
// Загрузить все чаты
const chats = await chatService.fetchChats();

// Загрузить сообщения чата
const messages = await chatService.fetchMessages(chatId);

// Отправить сообщение
await chatService.sendMessage(chatId, 'me', 'Hello!', '14:00', null);

// Создать чат
await chatService.createChat('John Doe', 'Hey!', 5, 'avatar.png');
```

### Локальная работа (без сервера)
```javascript
// Получить данные локально
const chats = chatService.getChats();
const messages = chatService.getMessages(chatId);

// Добавить локально
chatService.addMessage(chatId, 'friend', 'Hi!', '14:00', 1);
chatService.addChat('Jane', 'Hello', 3, 'image.png');
```

## 📡 REST API Endpoints

Если запущен сервер Node.js:

```
GET    /api/chats                      # Все чаты
GET    /api/chats/:chatId/messages    # Сообщения чата
POST   /api/chats/:chatId/messages    # Отправить сообщение
POST   /api/chats                     # Создать чат
DELETE /api/chats/:chatId             # Удалить чат
DELETE /api/chats/:chatId/messages/:id # Удалить сообщение
```

## 🛡️ Обработка ошибок

- **Сервер недоступен?** → Используются локальные данные ✅
- **Сетевая ошибка?** → Данные сохраняются локально ✅
- **Всё работает?** → Данные синхронизируются с сервером ✅

## 📋 API Документация

Полная документация в файле `API_DOCS.md`

Быстрая справка в файле `QUICK_REFERENCE.md`

Примеры кода в файле `USAGE_EXAMPLES.js`

## 🎨 Основные компоненты

### ChatService
Работает с данными о чатах и сообщениях. Может загружать с сервера или использовать локальное хранилище.

### Box
Основной макет приложения:
- Слева: список чатов
- Справа: просмотр выбранного чата

### Menu
Контекстное меню, появляется при клике на сообщение (правой кнопкой или специальным кликом).

## 🔄 Жизненный цикл приложения

1. App монтируется
2. `useEffect` загружает чаты через `fetchChats()`
3. Загружаются сообщения первого чата через `fetchMessages()`
4. При клике на другой чат загружаются его сообщения
5. При отправке сообщения оно отправляется через `sendMessage()`
6. Кнопка "Обновить" перезагружает все данные

## 📱 Интерфейс

- **Левая панель**: Список чатов
- **Правая панель**: Сообщения выбранного чата
- **Контекстное меню**: Появляется при клике на сообщение
- **Кнопка обновления**: Справа снизу

## 🔐 Безопасность

- Все запросы на сервер используют метод POST/DELETE
- Данные отправляются как JSON
- CORS поддерживается в примере сервера
- Валидация происходит на сервере (в примере базовая)

## 🚦 Статус разработки

- ✅ Основной функционал
- ✅ REST API интеграция
- ✅ Offline поддержка  
- ✅ Контекстное меню
- ⏳ Аутентификация (в разработке)
- ⏳ WebSocket для real-time (в разработке)

## 📞 Поддержка

Для вопросов обращайтесь к документации:
- `API_DOCS.md` - Полная API справка
- `QUICK_REFERENCE.md` - Быстрая шпаргалка
- `USAGE_EXAMPLES.js` - Примеры кода

## 📄 Лицензия

MIT
