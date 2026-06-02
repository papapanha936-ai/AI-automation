const { testConnection } = require('../services/googleSheetService');

async function connectSheets(range = 'Sheet1!A1:D10') {
  return testConnection(range);
}

async function main() {
  const result = await connectSheets();

  if (result.success) {
    console.log('Google Sheets connection OK');
    console.log('Spreadsheet ID:', result.spreadsheetId);
    console.log('Rows:', JSON.stringify(result.rows, null, 2));
  } else {
    console.error('Google Sheets connection failed:');
    console.error(result.error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
}

module.exports = {
  connectSheets,
};
