const express = require("express");
const router = express.Router();
const { Card, validateCard, createBizNumber } = require("../models/cards");
const chipChacker = require("../middleware/auth");
const _ = require("lodash");

router.delete("/:id", chipChacker, async (req, res) => {
  let card = await Card.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    return res
      .status(404)
      .send("The relevant Card with the mentioned ID was not found!");
  }
  res.send(card);
});

router.put("/:id", chipChacker, async (req, res) => {
  const { err } = validateCard(req.body);
  if (err) return res.status(400).send(err.details[0].message);

  let card = await Card.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    req.body
  );
  if (!card)
    return res
      .status(404)
      .send("The relevant Card with the mentioned ID was not found!");
  res.send(card);
});

router.get("/", chipChacker, async (req, res) => {
  const allCards = await Card.find({ user_id: req.user._id });
  if (!allCards) {
    return res.status(404).send("There is no cards ");
  }
  res.send(allCards);
});

router.get("/:id", chipChacker, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card)
    return res
      .status(404)
      .send("The relevant Card with the mentioned ID was not found !");
  res.send(card);
});

router.post("/", chipChacker, async (req, res) => {
  const { error } = validateCard(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  let card = new Card({
    bizName: req.body.bizName,
    bizDescription: req.body.bizDescription,
    bizAddress: req.body.bizAddress,
    bizPhone: req.body.bizPhone,
    bizImage: req.body.bizImage ? req.body : "../logo1.jpg",
    bizNumber: await createBizNumber(Card),
    user_id: req.user._id,
  });

  post = await card.save();
  res.send(post);
});

module.exports = router;
