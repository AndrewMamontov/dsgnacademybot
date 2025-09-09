require("dotenv").config();
const { GoogleSpreadsheet } = require("google-spreadsheet");
const TelegramBot = require("node-telegram-bot-api");

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

async function accessSheet() {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });
  await doc.loadInfo();
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name + (msg.from.last_name ? ' ' + msg.from.last_name : '');
  const username = msg.from.username || '';
  const date = new Date().toLocaleString();

  await accessSheet();
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({
    Date: date,
    Name: name,
    Username: username,
    ChatID: chatId,
  });

  bot.sendMessage(chatId, "Вітаємо в DSGN Academy 🎉\n\nТут будуть новини, оновлення, подарунки та круті ресурси для дизайнерів.\n\nРадий тебе бачити 🧡");
});
