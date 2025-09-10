require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { appendUserToSheet } = require('./sheets');
const fs = require('fs');
const path = require('path');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const adminId = process.env.ADMIN_ID;
const users = {};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'друг';

  users[chatId] = { step: 'interests', interests: [], paid: false };

  await bot.sendMessage(chatId, `👋 Привіт, ${name}!
Тут буде все найцікавіше з Dsgn Academy:
— подарунки
— оновлення
— корисні штуки для дизайнерів 🧡`);

  await bot.sendMessage(chatId, 'Що тебе цікавить найбільше? Обери кілька варіантів:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Framer', callback_data: 'Framer' }, { text: 'Figma', callback_data: 'Figma' }],
        [{ text: 'Spline', callback_data: 'Spline' }, { text: 'Webflow', callback_data: 'Webflow' }]
      ]
    }
  });
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const interest = query.data;

  if (!users[chatId].interests.includes(interest)) {
    users[chatId].interests.push(interest);
  }

  await bot.answerCallbackQuery(query.id, { text: `Додано: ${interest}` });
  await bot.sendMessage(chatId, `✅ Збережено інтерес: ${interest}`);
  await appendUserToSheet(chatId, users[chatId].interests.join(', '));
  await bot.sendMessage(chatId, `📸 Якщо ти оформив(ла) підписку, надішли скріншот сюди.`);
});

bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  if (!users[chatId] || users[chatId].paid) return;

  users[chatId].paid = true;
  await appendUserToSheet(chatId, users[chatId].interests.join(', '), true);

  const filePath = path.join(__dirname, 'gift_files', 'framer-pack.zip');
  await bot.sendMessage(chatId, `🎁 Дякуємо за підписку! Ось твій подарунок:`);
  await bot.sendDocument(chatId, filePath);
  bot.sendMessage(adminId, `✅ Користувач @${msg.from.username || msg.from.first_name} (${chatId}) надіслав скрін підписки.`);
});
