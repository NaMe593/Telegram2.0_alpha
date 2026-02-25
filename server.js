import express from 'express';
import cors from 'cors';

const app = express();

// ✅ CORS конфигурация
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// 📡 Логирование всех запросов
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Временное хранилище данных
let chats = [
  { id: 1, name: 'John Doe', message: 'How are you?', numbers: 5, src: 'Resources/images/back.png' },
      { id: 2, name: 'Jo Doe', message: 'Howe you?', numbers: 100, src: 'Resources/images/back.png' }
];

let messages = {
  1: [
    { id: 1, from: 'friend', name: 'John', text: 'Hello!', time: '13:55', avatar_id: 1 },
    { id: 2, from: 'me', text: 'Hi there!', time: '13:56' }
  ],
  2: [
    { id: 1, from: 'friend', name: 'Jo', text: 'Hey mate!', time: '14:00', avatar_id: 1 },
    { id: 2, from: 'me', text: 'Hello!', time: '14:01' },
    { id: 3, from: 'friend', name: 'Jo', text: 'How are you doing?', time: '14:02', avatar_id: 1 }
  ],
};

// GET все чаты
app.get('/api/chats', (req, res) => {
  console.log('✅ Возвращаю ' + chats.length + ' чатов');
  res.json(chats);
});

// GET сообщения конкретного чата
app.get('/api/chats/:chatId/messages', (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const chatMessages = messages[chatId] || [];
  console.log('✅ Возвращаю ' + chatMessages.length + ' сообщений');
  res.json(chatMessages);
});

// POST новое сообщение в чат
app.post('/api/chats/:chatId/messages', (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const { from, text, time, avatar_id } = req.body;

  const textPreview = (typeof text === 'string' ? text : '').substring(0, 20);
  console.log('✅ Новое сообщение: ' + textPreview);

  if (!messages[chatId]) { messages[chatId] = []; }
  const newMessage = {
    id: (messages[chatId].length || 0) + 1,
    from,
    name: from === 'me' ? 'You' : from,
    text,
    time,
    avatar_id
  };
  messages[chatId].unshift(newMessage);
  res.status(201).json(newMessage);
});

// POST новый чат
app.post('/api/chats', (req, res) => {
  const { name, message, numbers, src } = req.body;

  console.log('✅ Новый чат: ' + (name || '<unnamed>'));
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const newChat = {
    id: (chats.length > 0 ? Math.max(...chats.map(c => c.id)) : 0) + 1,
    name,
    message,
    numbers: (typeof numbers === 'number' && numbers > 99) ? '99+' : numbers,
    src
  };
  chats.push(newChat);
  messages[newChat.id] = [];
  res.status(201).json(newChat);
});

// DELETE чат
app.delete('/api/chats/:chatId', (req, res) => {
  const chatId = parseInt(req.params.chatId);
  console.log('✅ Удаляю чат ' + chatId);
  chats = chats.filter(chat => chat.id !== chatId);
  delete messages[chatId];
  res.status(204).send();
});

// DELETE сообщение
app.delete('/api/chats/:chatId/messages/:messageId', (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const messageId = parseInt(req.params.messageId);

  console.log('✅ Удаляю сообщение ' + messageId);

  if (messages[chatId]) {
    messages[chatId] = messages[chatId].filter(msg => msg.id !== messageId);
  }

  res.status(204).send();
});

// Запуск сервера
const PORT = 3001;
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('🚀 СЕРВЕР ЗАПУЩЕН!');
  console.log('═══════════════════════════════════════');
  console.log('📍 URL: http://localhost:' + PORT);
  console.log('📍 API: http://localhost:' + PORT + '/api');
  console.log('');
  console.log('✅ Доступные endpoints:');
  console.log('   GET    /api/chats');
  console.log('   GET    /api/chats/:id/messages');
  console.log('   POST   /api/chats/:id/messages');
  console.log('   POST   /api/chats');
  console.log('   DELETE /api/chats/:id');
  console.log('   DELETE /api/chats/:id/messages/:id');
  console.log('');
  console.log('⏳ Ожидаю входящие запросы...');
  console.log('═══════════════════════════════════════');
  console.log('');
});

