const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');

const server = createServer();
const db = require('./db');

server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }

  next();
})

server.express.use(async (req, res, next) => {
  const { userId } = req;

  if (!userId) {
    return next();
  }

  const user = await db.query.user(
    { where: { id: userId } },
    `{ id, permissions, name, email }`
  );

  req.user = user;
  next();
})

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }
}, options => {
  console.log(`Server is now running on http://localhost:${options.port}`);
});