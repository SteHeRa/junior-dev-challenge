const express = require('express');
const router = require('./router');

const app = express();

const PORT = 3000;

app.use(express.static('../Front End'));

app.use('/', router)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server Listening 👂 on at http://localhost:${PORT}`);
});