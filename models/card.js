const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (link) => isUrl(link),
        message: 'Ссылка так себе',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

module.exports = mongoose.model('card', cardSchema);
