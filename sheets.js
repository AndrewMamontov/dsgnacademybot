const { google } = require('googleapis');
const credentials = require('./service_account.json');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const appendUserToSheet = async (chatId, interests, paid = false) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const values = [[chatId, interests, paid ? '✅' : '', new Date().toLocaleString()]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'A:D',
    valueInputOption: 'RAW',
    requestBody: { values },
  });
};

module.exports = { appendUserToSheet };
