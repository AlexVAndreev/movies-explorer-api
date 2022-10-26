const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Очень неправильная почта',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
);

module.exports = mongoose.model('User', userModel);
