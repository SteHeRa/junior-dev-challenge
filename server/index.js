const express = require('express');
const router = require('./router');

const app = express();

const PORT = 3000;

app.use(express.static(`${__dirname}/../Front End`));

app.use('/', router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server Listening 👂 at http://localhost:${PORT}`);
});
