require('dotenv').config();

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const override = require('method-override');
const Http = require('http');
const api = require('./api');
const log = require('./logApi');
const logger = require('./lib/console');

const { PORT : port } = process.env;
const app = express();
const server = Http.createServer(app);

// middleware
app.use(cors());
app.use(override());
app.use(compression());
app.use(express.json());

app.get('/ping', (req, res) => {
  logger.green('[서버 정상 작동 중]');
  res.send('pong');
});

// server log
app.use('/log', log);

// api routers
app.use('/', api);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
