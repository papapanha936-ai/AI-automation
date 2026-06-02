const path = require('path');
const express = require('express');
const { testConnection } = require('./backend/services/googleSheetService');


const app = express();
const port = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, 'frontend');

app.use(express.json({ limit: '100kb' }));
app.use(express.static(frontendPath));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/sheets/test', async (req, res) => {
  const range = req.query.range || 'Sheet1!A1:D10';
  const result = await testConnection(range);

  if (!result.success) {
    return res.status(500).json(result);
  }

  res.json(result);
});

app.use((_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other process or set PORT to a different value.`);
  } else {
    console.error('Server failed to start:', err);
  }
  process.exit(1);
});