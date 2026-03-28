const express = require('express');
const app = express();

app.use(express.json());

// Only ONE route - no wildcards, no middleware chains
app.get('/', (req, res) => {
  res.json({ test: true, message: 'PM2 minimal test works!' });
});

// Simple 404 - NO path argument at all
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Minimal PM2 test server on port ${PORT}`);
});
