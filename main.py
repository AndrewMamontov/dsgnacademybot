import os
from aiogram import Bot, Dispatcher, types
from aiogram.types import InputFile
from aiogram.utils import executor
from aiogram.contrib.middlewares.logging import LoggingMiddleware
import logging

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID"))

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)
dp.middleware.setup(LoggingMiddleware())
logging.basicConfig(level=logging.INFO)

# Вводное сообщение
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    await message.reply("👋 Привіт! Це бот DSGN Academy.\nНапиши нам будь-що або надішли фото — ми відповімо найближчим часом!")

# Пересылаем ВСЁ администратору (сообщения, фото, файлы и т.д.)
@dp.message_handler(content_types=types.ContentType.ANY)
async def forward_message(message: types.Message):
    user = message.from_user
    text = f"📩 Повідомлення від @{user.username or user.first_name} (ID: {user.id}):"

    try:
        # Перешлём само сообщение
        await message.forward(ADMIN_ID)
        # Отдельно подпишем его текстом
        await bot.send_message(ADMIN_ID, text)
    except Exception as e:
        logging.error(f"Помилка пересилки: {e}")

# Ответ пользователю, если нажал Reply на пересланное сообщение
@dp.message_handler(lambda message: message.reply_to_message and message.reply_to_message.forward_from)
async def reply_to_user(message: types.Message):
    target_id = message.reply_to_message.forward_from.id
    await bot.send_message(target_id, message.text)

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
