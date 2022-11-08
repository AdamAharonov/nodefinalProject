const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Card } = require("../models/cards");

const { User, validateUser } = require("../models/users");
const chipChacker = require("../middleware/auth");
const _ = require("lodash");

const receivedCards = async (cardsArray) => {
  const cards = await Card.find({ bizNumber: { $in: cardsArray } });
  return cards;
};

router.get("/cards", chipChacker, async (req, res) => {
  if (!req.query.numbers) res.status(400).send("Missing numbers data");
  let data = {};
  data.cards = req.query.numbers.split(",");
  const cards = await receivedCards(data.cards);
  res.send(cards);
});

router.patch("/cards", chipChacker, async (req, res) => {
  const { err } = validateUser(req.body);
  if (err) return res.status(400).send(err.details[0].message);

  const cards = await receivedCards(req.body.cards);
  if (cards.length != req.body.cards.length)
    res.status(400).send("the cards specifies are incorrect !!! ");
  let user = await User.findById(req.user._id);
  user.cards = req.body.cards;
  user = await user.save();
  res.send(user);
});

router.get("/us", chipChacker, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { err } = validateUser(req.body);
  if (err) return res.status(400).send(err.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");
  user = new User(req.body);

  user = new User(
    _.pick(req.body, ["fullName", "email", "password", "biz", "cards"])
  );

  const salt = await bcrypt.genSalt(13);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.send(_.pick(user, ["_id", "fullName", "email"]));
});

module.exports = router;
