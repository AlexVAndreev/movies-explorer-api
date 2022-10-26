const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const validateEmail = require('../utils/validateMail');

const { getUserInfo, updateUserInfo } = require('../controllers/users');

router.get('/users/me', getUserInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((validateEmail)),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

module.exports = router;
