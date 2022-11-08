const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: 1024,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: 1024,
  },
  biz: {
    type: Boolean,
    required: true,
  },
  cards: Array,
});

userSchema.methods.generateAuthToken = function () {
  const chip = jwt.sign({ _id: this._id, biz: this.biz }, config.get("jwtKey"));
  return chip;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    biz: Joi.boolean().required(),
  });
  return schema.validate(user);
}
function cardsVerification(value) {
  const schema = Joi.object({
    cards: Joi.array().min(1).required(),
  });
  return schema.validate(value);
}

module.exports = {
  User,
  validateUser,
  cardsVerification,
};
