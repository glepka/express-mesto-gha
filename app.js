const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND_ERR } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateLogin, validateRegistration } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegistration, createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: 'Страница не существует.' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Что-то пошло не так' } = err;
  res.status(statusCode).send({ message });

  next();
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
