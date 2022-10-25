require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const { UserCreateError } = require('../errors/UserCreateError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        console.log(err);
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  return User.findOne({ email })
    .then((mail) => {
      if (mail) {
        throw new UserCreateError('Такой пользователь sуже существует!');
      }

      bcrypt.hash(password, 10, (err, hash) => {
        User.create({
          name, email, password: hash,
        })
          .then((user) => {
            res.status(200).send({
              _id: user._id,
              email: user.email,
              name: user.name,
            });
          });
      });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  User.findOne({ email })
    .then((data) => {
      if (data) {
        throw new UserCreateError('Почта уже занята!');
      }
      User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
        .then((user) => {
          if (!user) {
            throw new NotFoundError('Пользователь не найден');
          } else {
            res.status(200).send(user);
          }
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new NotFoundError('Переданы некорректные данные');
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверная почта или пароль.');
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверная почта или пароль!');
          }
          const { NODE_ENV, JWT_SECRET } = process.env;

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );

          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};
