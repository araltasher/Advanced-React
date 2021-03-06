const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

//  Use express middleware to handle cookies
server.express.use(cookieParser());

//  Decode the JWT to get the userID
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    //  put userID on req for future access requests
    req.userId = userId;
  }
  next();
});

//  Create a middleware for populating the USER on each request
server.express.use(async (req, res, next) => {
  //  If not logged in skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    {
      where: { id: req.userId },
    },
    `{id, permissions, email, name}`
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  details => {
    console.log(
      `Server is now running on port http://localhost:${details.port}`
    );
  }
);
