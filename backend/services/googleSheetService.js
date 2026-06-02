const { getSheetValues, spreadsheetId } = require('../config/googleSheets');

const ALLOWED_RANGE = /^[\w\s!\-\:\$]{1,80}$/;

function sanitizeRange(range) {
  if (typeof range !== 'string') {
    throw new Error('Range must be a string');
  }
  if (!ALLOWED_RANGE.test(range)) {
    throw new Error('Range contains invalid characters');
  }
  return range;
}

async function testConnection(range = 'Sheet1!A1:D10') {
  try {
    const safeRange = sanitizeRange(range);
    const rows = await getSheetValues(safeRange);
    return {
      success: true,
      spreadsheetId,
      range: safeRange,
      rows,
    };
  } catch (error) {
    // Strip potentially internal info; return a short, safe message.
    const msg = (error && error.message) ? error.message : String(error);
    return {
      success: false,
      error: msg.length > 300 ? msg.slice(0, 300) + '...' : msg,
    };
  }
}

module.exports = {
  testConnection,
};