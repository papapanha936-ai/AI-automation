const path = require('path');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? path.resolve(__dirname, '../../', process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : path.resolve(__dirname, '../../credentials/google-service-account.json');

if (!spreadsheetId) {
  throw new Error('Missing GOOGLE_SHEETS_ID in .env or environment');
}

let auth;
try {
  auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
} catch (err) {
  throw new Error(
    `Failed to initialize Google Auth. Check that the service-account file exists and is valid JSON. Path: ${keyFile}. Underlying: ${err.message}`
  );
}

const sheets = google.sheets({ version: 'v4', auth });

async function getSheetValues(range = 'Sheet1!A1:D10') {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return result.data.values || [];
  } catch (err) {
    throw new Error(
      `Google Sheets request failed for range "${range}" on spreadsheet ${spreadsheetId}: ${err.message || err}`
    );
  }
}

module.exports = {
  getSheetValues,
  spreadsheetId,
};