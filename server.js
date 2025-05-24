// server.js
import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve('dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
