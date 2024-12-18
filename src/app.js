import express from 'express';
import dotenv from 'dotenv';

// plugin
import usersPlugin from './api/users/index.js';
import authenticationsPlugin from './api/authentications/index.js';

// service
import UserService from './services/postgres/UserServices.js';
import AuthenticationsService from './services/postgres/AuthenticationsService.js';

// validator
import UsersValidator from './validator/users/index.js';
import AuthenticationsValidator from './validator/authentications/index.js';

// utils
import EmailManager from './utils/EmailManager.js';

// token manager
import TokenManager from './tokenize/TokenManager.js';

// Exceptions
import ClientError from './exceptions/ClientError.js';

dotenv.config();

const app = express();
app.use(express.json());

// Dependency Injection
const userService = new UserService();
const emailManager = new EmailManager();
const authenticationsService = new AuthenticationsService();

usersPlugin({
  app, userService, emailManager, validator: UsersValidator,
});

authenticationsPlugin({
  app,
  authenticationsService,
  userService,
  tokenManager: TokenManager,
  validator: AuthenticationsValidator,
});

// Global Error Handling Middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Jika error merupakan instance ClientError
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Error lain (500 - Internal Server Error)
  console.error(err); // Log untuk debugging
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
});

// Middleware jika rute tidak ditemukan (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Rute tidak ditemukan',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
