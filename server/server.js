const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let savedCode = '// Welcome to 404 IDE';

app.post('/api/save', (req, res) => {
  savedCode = req.body.code;
  res.json({ message: 'Code "saved"! Are you sure about that?' });
});

app.get('/api/load', (req, res) => {
  res.json({ code: savedCode });
});

app.get('/api/ping', (req, res) => res.send('pong'));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
