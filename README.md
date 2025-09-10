# Dsgn Academy Framer Bot

Telegram-бот для збору інтересів користувачів, прийому скринів підписки, надсилання подарунку, збереження всіх даних у Google Sheets.

## 🔧 Інструкція запуску через Railway

1. Зареєструйся на https://railway.app
2. Створи новий проект → Deploy from GitHub → або вручну завантаж файли з архіву
3. У Railway додай Environment Variables:
   - `BOT_TOKEN`
   - `ADMIN_ID`
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_APPLICATION_CREDENTIALS` → залиш як є: `./service_account.json`
4. Завантаж файл `service_account.json` у корінь проекту
5. Натисни "Deploy"
6. Готово!
