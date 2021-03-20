const express = require('express');

const app = express();

const PORT = 8000;

app.get('/', (req, res) => {
  return res.send('hello there');
});

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT:${PORT}`);
});
